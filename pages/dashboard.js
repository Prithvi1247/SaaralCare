// pages/dashboard.js — Worker dashboard
// Fetches real worker data from Supabase `workers` + `stations` tables.
// All UI/JSX is unchanged; only the data-loading logic is replaced.

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Shield, Bell, LogOut, RefreshCw, CloudRain, Map } from "lucide-react";

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
// Coverage and premium data remain as placeholders until those tables exist.
const STATIC_COVERAGE = {
  weekStart: "Dec 16", weekEnd: "Dec 22",
  coverageStatus: "active",
  daysWithRain: [1, 3],
  payouts: [{ day: 1, amount: 320 }, { day: 3, amount: 480 }],
  totalPayout: 800, maxPayout: 800, nextRenewal: "Dec 23",
};

const STATIC_PREMIUM = {
  weeklyPremium: 29, totalPaid: 377, totalReceived: 1920,
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

// ── Page component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [workerData, setWorkerData] = useState(null);

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

        // WorkerZoneCard expects: name, phone, zone, platform, vehicle, status, memberSince
        const workerCardData = {
          name:        worker.name,
          phone:       worker.phone,
          zone:        worker.zone,
          platform:    worker.platform,
          vehicle:     "scooter",            // not stored in workers; UI placeholder
          status:      "active",
          memberSince: formatMonthYear(worker.created_at),
        };

        // RainfallStationCard expects: stationId, stationName, distance, lastReading,
        //   threshold, updatedAt, trend, alertActive
        const stationCardData = {
          stationId:   stationRow?.id       ?? worker.station_id ?? "—",
          stationName: stationRow?.station_name ?? stationRow?.district ?? "Mapped Station",
          distance:    "—",                 // computed from lat/lng — future enhancement
          lastReading: 0,                   // real-time readings not in schema yet
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

            {workerData?.station?.alertActive && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 text-xs font-medium">
                  Payout processing — heavy rain detected
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
                  Your coverage is{" "}
                  <span className="text-emerald-400 font-medium">active</span>{" "}
                  · Zone: {workerData.worker.zone}
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

              {/* Map + Premium */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2 animate-fade-up opacity-0 delay-400">
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

                <div className="animate-fade-up opacity-0 delay-500">
                  <PremiumCard data={workerData.premium} />
                </div>
              </div>

              {/* Claim history */}
              <div className="animate-fade-up opacity-0 delay-600">
                <ClaimHistory />
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
        <RefreshCw className="w-6 h-6 text-red-400" />
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

// ── Skeleton loader (unchanged) ───────────────────────────────────────────────
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
