// pages/dashboard.js — Worker dashboard
// NEW: Added plan lifecycle, insurance UI, and payout labeling.

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Shield, Bell, LogOut, RefreshCw, CloudRain, Map, CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";

import WorkerZoneCard       from "@/components/dashboard/WorkerZoneCard";
import RainfallStationCard  from "@/components/dashboard/RainfallStationCard";
import WeeklyCoverageCard   from "@/components/dashboard/WeeklyCoverageCard";
import PremiumCard          from "@/components/dashboard/PremiumCard";
import ClaimHistory         from "@/components/dashboard/ClaimHistory";
import { supabase }         from "@/lib/supabaseClient";

// Leaflet must load client-side only
const RainfallMap = dynamic(() => import("@/components/map/RainfallMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-navy-900 rounded-xl">
      <RefreshCw className="w-5 h-5 text-rain-400 animate-spin" />
    </div>
  ),
});

// ── Static fallbacks for data not yet in Supabase ─────────────────────────────
const STATIC_COVERAGE = {
  weekStart: "Dec 16", weekEnd: "Dec 22",
  coverageStatus: "active",
  daysWithRain: [1, 3],
  payouts: [{ day: 1, amount: 320, type: "full" }, { day: 3, amount: 480, type: "full" }],
  totalPayout: 800, maxPayout: 800, nextRenewal: "Dec 23",
};

const STATIC_PREMIUM = {
  weeklyPremium: 104, monthlyPremium: 451, dailyCoverage: 375, maxWeeklyPayout: 1125,
  totalPaid: 377, totalReceived: 1920,
  weeksActive: 13, nextDeductionDate: "Dec 23, 2024",
  upiId: "—", savingsRatio: 5.1,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a Supabase timestamp into "Month YYYY" */
function formatMonthYear(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", {
    month: "long", year: "numeric",
  });
}

/** NEW: Get plan status and dates */
function getPlanStatus(paymentDate) {
  if (!paymentDate) {
    return { status: "none", label: "No Active Coverage", daysUntilStart: null, startDate: null, endDate: null, color: "slate" };
  }

  const payment = new Date(paymentDate);
  const startDate = new Date(payment);
  startDate.setDate(startDate.getDate() + 7);
  
  const endDate = new Date(payment);
  endDate.setDate(endDate.getDate() + 14);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (today < startDate) {
    const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    return { 
      status: "activating", 
      label: `Activating (starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''})`,
      daysUntilStart: daysUntil,
      startDate,
      endDate,
      color: "amber"
    };
  }

  if (today >= startDate && today <= endDate) {
    return { 
      status: "active", 
      label: "Coverage Active",
      daysUntilStart: 0,
      startDate,
      endDate,
      color: "emerald"
    };
  }

  return { 
    status: "expired", 
    label: "Expired",
    daysUntilStart: null,
    startDate,
    endDate,
    color: "red"
  };
}

/** NEW: Format date range for display */
function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "—";
  const formatOpts = { month: "short", day: "numeric" };
  const start = startDate.toLocaleDateString("en-IN", formatOpts);
  const end = endDate.toLocaleDateString("en-IN", formatOpts);
  return `${start} – ${end}`;
}

// ── Page component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [workerData, setWorkerData] = useState(null);

  // NEW: Plan lifecycle state
  const [plan, setPlan] = useState(() => {
    if (typeof window === "undefined") return { paymentDate: null };
    const stored = sessionStorage.getItem("sc_plan");
    return stored ? JSON.parse(stored) : { paymentDate: null };
  });

  // NEW: Persist plan state
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sc_plan", JSON.stringify(plan));
    }
  }, [plan]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const phone = typeof window !== "undefined"
          ? sessionStorage.getItem("gs_worker_phone")
          : null;

        if (!phone) {
          window.location.href = "/login";
          return;
        }

        // ── 1. Fetch worker row ───────────────────────────────────────────
        const { data: worker, error: wErr } = await supabase
          .from("workers")
          .select("id, name, phone, platform, zone, latitude, longitude, station_id, avg_daily_income, created_at")
          .eq("phone", phone)
          .maybeSingle();

        if (wErr)    throw new Error(wErr.message);
        if (!worker) throw new Error("Worker record not found. Please complete onboarding.");

        // ── 2. Fetch matched station details ──────────────────────────────
        let stationRow = null;
        if (worker.station_id) {
          const { data: st, error: stErr } = await supabase
            .from("stations")
            .select("id, station_name, district, latitude, longitude")
            .eq("id", worker.station_id)
            .maybeSingle();

          if (stErr) throw new Error(stErr.message);
          stationRow = st;
        }

        // ── 3. Shape data for UI cards ────────────────────────────────────

        const workerCardData = {
          name:        worker.name,
          phone:       worker.phone,
          zone:        worker.zone,
          platform:    worker.platform,
          vehicle:     "scooter",
          status:      "active",
          memberSince: formatMonthYear(worker.created_at),
        };

        const stationCardData = {
          stationId:   stationRow?.id       ?? worker.station_id ?? "—",
          stationName: stationRow?.station_name ?? stationRow?.district ?? "Mapped Station",
          distance:    "—",
          lastReading: 0,
          threshold:   15,
          updatedAt:   "—",
          trend:       "stable",
          alertActive: false,
        };

        setWorkerData({
          worker:   workerCardData,
          station:  stationCardData,
          coverage: STATIC_COVERAGE,
          premium:  { ...STATIC_PREMIUM, upiId: `${worker.name?.split(" ")[0]?.toLowerCase()}@upi` },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      window.location.href = "/login";
    }
  }

  // NEW: Handle buy/renew plan
  function handleBuyPlan() {
    setPlan({ paymentDate: new Date().toISOString() });
  }

  // NEW: Get plan info
  const planStatus = getPlanStatus(plan.paymentDate);
  const statusColors = {
    active: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle2 },
    activating: { bg: "bg-amber-500/15", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300", icon: Clock },
    expired: { bg: "bg-red-500/15", border: "border-red-500/30", badge: "bg-red-500/20 text-red-300", icon: AlertCircle },
    none: { bg: "bg-slate-500/15", border: "border-slate-500/30", badge: "bg-slate-500/20 text-slate-300", icon: AlertCircle },
  };
  const colors = statusColors[planStatus.status];
  const StatusIcon = colors.icon;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Dashboard — SaaralCare AI</title>
      </Head>

      <div className="min-h-screen bg-navy-950">
        {/* Top navbar — unchanged */}
        <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rain-500 to-rain-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">
                Saaral<span className="text-rain-400">Care</span>
                <span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </Link>

            {planStatus.status === "active" && (
              <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-medium">
                  Coverage Active · {formatDateRange(planStatus.startDate, planStatus.endDate)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <DashboardSkeleton />
          ) : error ? (
            <ErrorState message={error} onLogout={handleLogout} />
          ) : (
            <>
              {/* Greeting */}
              <div className="mb-8 animate-fade-up opacity-0">
                <h1 className="font-display text-3xl font-bold text-white">
                  Good {getTimeOfDay()}, {workerData.worker.name.split(" ")[0]} 👋
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Your coverage status: <span className={planStatus.status === "active" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>{planStatus.label}</span>
                </p>
              </div>

              {/* Top row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="animate-fade-up opacity-0 delay-100">
                  <WorkerZoneCard data={workerData.worker} />
                </div>
                <div className="animate-fade-up opacity-0 delay-200">
                  <RainfallStationCard data={workerData.station} />
                </div>
                <div className="animate-fade-up opacity-0 delay-300">
                  <WeeklyCoverageCard data={workerData.coverage} />
                </div>
              </div>

              {/* NEW: Insurance Plan Card + Premium */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2 animate-fade-up opacity-0 delay-400">
                  <div className={`glass-card gradient-border rounded-2xl p-6 border ${colors.border}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className="w-5 h-5" style={{ color: planStatus.color === "emerald" ? "#34d399" : planStatus.color === "amber" ? "#fbbf24" : planStatus.color === "red" ? "#f87171" : "#cbd5e1" }} />
                          <h3 className="font-display text-xl font-bold text-white">Insurance Coverage</h3>
                        </div>
                        <p className={`text-sm ${colors.badge} px-2.5 py-1 rounded-full inline-block`}>{planStatus.label}</p>
                      </div>
                      <Calendar className="w-5 h-5 text-slate-500" />
                    </div>

                    {/* NEW: Plan details */}
                    <div className={`rounded-xl p-5 mb-6 ${colors.bg}`}>
                      {planStatus.status === "none" ? (
                        <p className="text-slate-400 text-sm">No active coverage. Get protected with a weekly plan.</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Coverage Period</p>
                              <p className="text-white font-semibold">{formatDateRange(planStatus.startDate, planStatus.endDate)}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Daily Benefit</p>
                              <p className="text-white font-semibold">₹{workerData.premium.dailyCoverage}</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-600/40">
                            <p className="text-slate-400 text-xs mb-1">Rain Trigger</p>
                            <p className="text-slate-300 text-sm">Full payout when rainfall index × days ≥ 50 | Partial payout when 30–49</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* NEW: Premium pricing */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-navy-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Weekly Premium</p>
                        <p className="font-display text-2xl font-bold text-rain-400">₹{workerData.premium.weeklyPremium}</p>
                      </div>
                      <div className="bg-navy-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Monthly (approx)</p>
                        <p className="font-display text-2xl font-bold text-rain-400">₹{workerData.premium.monthlyPremium}</p>
                      </div>
                    </div>

                    {/* NEW: Coverage info */}
                    <div className="bg-navy-800/30 rounded-lg p-4 mb-6 border border-navy-700">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3 font-medium">Your Coverage</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Per rainy day</span>
                          <span className="text-white font-semibold">₹{workerData.premium.dailyCoverage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Max weekly payout</span>
                          <span className="text-white font-semibold">₹{workerData.premium.maxWeeklyPayout}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-navy-700">
                          <span>Based on your zone risk & season</span>
                        </div>
                      </div>
                    </div>

                    {/* NEW: Action button */}
                    <button
                      onClick={handleBuyPlan}
                      disabled={planStatus.status === "activating"}
                      className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                        planStatus.status === "activating"
                          ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                          : planStatus.status === "active"
                          ? "bg-rain-500 hover:bg-rain-600 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {planStatus.status === "none" ? "Buy Plan" : planStatus.status === "activating" ? "Activating..." : "Renew Plan"}
                    </button>
                  </div>
                </div>

                {/* Original premium card repositioned */}
                <div className="animate-fade-up opacity-0 delay-500">
                  <PremiumCard data={workerData.premium} />
                </div>
              </div>

              {/* Map */}
              <div className="mb-5 animate-fade-up opacity-0 delay-600">
                <div className="glass-card gradient-border rounded-2xl overflow-hidden h-[380px]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-rain-400" />
                      <span className="text-white font-medium text-sm">
                        Rainfall Stations — Mumbai Region
                      </span>
                    </div>
                  </div>
                  <div className="h-[calc(100%-57px)]">
                    <RainfallMap workerStation={workerData.station.stationId} />
                  </div>
                </div>
              </div>

              {/* Claim history with NEW labels */}
              <div className="animate-fade-up opacity-0 delay-700">
                <ClaimHistory payouts={workerData.coverage.payouts} />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function ErrorState({ message, onLogout }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <h2 className="font-display text-xl font-bold text-white mb-2">
        Could not load dashboard
      </h2>
      <p className="text-slate-400 text-sm max-w-xs mb-6">{message}</p>
      <button onClick={onLogout} className="btn-primary">
        Back to Login
      </button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-64 bg-navy-800 rounded-lg" />
      <div className="h-4 w-48 bg-navy-800 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-56 bg-navy-800 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-96 bg-navy-800 rounded-2xl" />
        <div className="h-96 bg-navy-800 rounded-2xl" />
      </div>
      <div className="h-80 bg-navy-800 rounded-2xl" />
    </div>
  );
}
