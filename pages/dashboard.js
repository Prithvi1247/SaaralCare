// pages/dashboard.js — Worker dashboard with lifecycle support & refined UI logic
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { 
  Shield, Bell, LogOut, RefreshCw, CloudRain, 
  CheckCircle2, AlertCircle, Clock, Calendar, Globe 
} from "lucide-react";

import WorkerZoneCard       from "@/components/dashboard/WorkerZoneCard";
import RainfallStationCard  from "@/components/dashboard/RainfallStationCard";
import WeeklyCoverageCard   from "@/components/dashboard/WeeklyCoverageCard";
import PremiumCard          from "@/components/dashboard/PremiumCard";
import ClaimHistory         from "@/components/dashboard/ClaimHistory";
import { supabase }         from "@/lib/supabaseClient";

// ── Translation Dictionary ───────────────────────────────────────────────────
const T = {
  en: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    coverageStatus: "Your coverage status",
    weeklyPremium: "Weekly Premium",
    monthlyPremium: "Monthly (approx)",
    coveragePerDay: "Per rainy day",
    maxWeeklyPayout: "Max weekly payout",
    basedOnZone: "Based on your zone risk & season",
    insuranceCoverage: "Insurance Coverage",
    noPlan: "No Active Coverage",
    noActiveCoverage: "No active coverage. Get protected with a weekly plan.",
    coveragePeriod: "Coverage Period",
    dailyBenefit: "Daily Benefit",
    rainTrigger: "Rain Trigger",
    fullPayoutWhen: "Full payout when rainfall index × days ≥ 50",
    partialPayoutWhen: "Partial payout when 30–49",
    yourCoverage: "Your Coverage",
    buyPlan: "Buy Plan",
    payoutHistory: "Payout History",
    rainfallStations: "Rainfall Stations — Mumbai Region",
    mappedStation: "Mapped Station",
    lastReading: "Rainfall (last 3hr)",
    threshold: "Threshold",
    payoutTriggers: "Payout Triggers",
    updated: "Updated",
    logout: "Logout",
  },
  hi: {
    goodMorning: "सुप्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    coverageStatus: "आपकी कवरेज स्थिति",
    weeklyPremium: "साप्ताहिक प्रीमियम",
    monthlyPremium: "मासिक (अनुमानित)",
    coveragePerDay: "प्रति बारिश दिन",
    maxWeeklyPayout: "साप्ताहिक अधिकतम भुगतान",
    insuranceCoverage: "बीमा कवरेज",
    noActiveCoverage: "कोई सक्रिय कवरेज नहीं। साप्ताहिक योजना के साथ सुरक्षित रहें।",
    buyPlan: "योजना खरीदें",
    mappedStation: "मानचित्र स्टेशन",
    lastReading: "बारिश (पिछले 3 घंटे)",
    threshold: "सीमा",
    payoutTriggers: "भुगतान ट्रिगर",
    updated: "अपडेट किया गया",
    logout: "लॉगआउट",
    fullPayoutWhen: "पूर्ण भुगतान जब सूचकांक ≥ 50",
    partialPayoutWhen: "आंशिक भुगतान जब 30–49",
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const t = (key, lang) => T[lang]?.[key] || key;

function formatMonthYear(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "—";
  const opts = { month: "short", day: "numeric" };
  return `${startDate.toLocaleDateString("en-IN", opts)} – ${endDate.toLocaleDateString("en-IN", opts)}`;
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function getPlanTimeDetails(activePlan) {
  if (!activePlan?.activation_day || !activePlan?.deactivation_day) return null;
  const now = new Date();
  const start = new Date(activePlan.activation_day);
  const end = new Date(activePlan.deactivation_day);

  const msToStart = start - now;
  const hoursToStart = Math.max(0, Math.floor(msToStart / (1000 * 60 * 60)));
  const daysToStart = Math.floor(hoursToStart / 24);

  const msToEnd = end - now;
  const daysRemaining = Math.max(0, Math.ceil(msToEnd / (1000 * 60 * 60 * 24)));

  return {
    start, end, daysRemaining,
    activationCountdown: daysToStart > 0 ? `${daysToStart} days` : `${hoursToStart} hours`,
  };
}

// ── Page Component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workerData, setWorkerData] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [lang, setLang] = useState(() => (typeof window === "undefined" ? "en" : sessionStorage.getItem("sc_lang") || "en"));

  useEffect(() => {
    async function loadDashboard() {
      try {
        const phone = typeof window !== "undefined" ? sessionStorage.getItem("gs_worker_phone") : null;
        if (!phone) { window.location.href = "/login"; return; }

        const { data: worker, error: wErr } = await supabase
          .from("workers")
          .select("id, name, phone, platform, zone, station_id, created_at, plan_status")
          .eq("phone", phone)
          .maybeSingle();

        if (wErr || !worker) throw new Error("Worker record not found.");

        const { data: policyData } = await supabase.from("policy_calculation").select("*").eq("worker_id", worker.id).single();
        const { data: payments } = await supabase.from("premium_payments").select("*").eq("worker_id", worker.id);
        const { data: payouts } = await supabase.from("coverage_payout").select("*").eq("worker_id", worker.id);

        const { data: activePlan } = await supabase
          .from("active_plans")
          .select("activation_day, deactivation_day, creation_time")
          .eq("worker_id", worker.id)
          .order("creation_time", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (policyData) setPolicy(policyData);

        const totalPaid = payments?.reduce((sum, p) => sum + (p.premium_amount || 0), 0) || 0;
        const totalReceived = payouts?.reduce((sum, p) => sum + (p.payout_amount || 0), 0) || 0;

        setWorkerData({
          worker: { ...worker, plan_status: worker.plan_status, vehicle: "scooter", memberSince: formatMonthYear(worker.created_at) },
          activePlan: activePlan,
          station: { 
            stationName: "Santacruz Observatory", 
            stationId: worker.station_id || "STN-MUM", 
            distance: "2.4 km", 
            lastReading: 0, 
            threshold: 15, 
            updatedAt: "Just now", 
            trend: "stable" 
          },
          coverage: { payouts: payouts || [], totalPayout: totalReceived },
          premium: {
            weeklyPremium: policyData?.premium_weekly ?? 0,
            dailyCoverage: policyData?.coverage_per_day ?? 0,
            totalPaid, totalReceived,
            savingsRatio: totalPaid > 0 ? (totalReceived / totalPaid).toFixed(1) : 0,
            recentPayments: payments || []
          }
        });
      } catch (err) { setError(err.message); } finally { setLoading(false); }
    }
    loadDashboard();
  }, []);

  async function handleBuyPlan() {
    try {
      if (!policy) return alert("Policy data missing");
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: policy.premium_weekly }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        order_id: order.id,
        handler: async (response) => {
          const verify = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, worker_id: workerData.worker.id, amount: policy.premium_weekly }),
          });
          const data = await verify.json();
          if (data.success) { alert("Payment Successful!"); window.location.reload(); }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) { alert("Payment failed"); }
  }

  // ── Compute Visual States ──────────────────────────────────────────────────
  const timeDetails = getPlanTimeDetails(workerData?.activePlan);
  const status = (workerData?.worker?.plan_status === "active" || workerData?.worker?.plan_status === "activating") 
                 ? workerData.worker.plan_status : "none";

  const planStatus = {
    status,
    label: status === "active" ? "Coverage Active" : status === "activating" ? "Activating..." : "No Active Coverage",
    timeLeft: status === "activating" ? timeDetails?.activationCountdown : `${timeDetails?.daysRemaining} days left`,
    startDate: timeDetails?.start,
    endDate: timeDetails?.end,
  };

  const statusColors = {
    active:     { bg: "bg-emerald-500/10", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle2 },
    activating: { bg: "bg-amber-500/10",   border: "border-amber-500/30",   badge: "bg-amber-500/20 text-amber-300",   icon: Clock },
    none:       { bg: "bg-slate-500/15",   border: "border-slate-500/30",   badge: "bg-slate-500/20 text-slate-300",   icon: AlertCircle },
  };

  const colors = statusColors[status] || statusColors.none;
  const StatusIcon = colors.icon;

  if (loading) return <div className="min-h-screen bg-navy-950 p-8"><DashboardSkeleton /></div>;

  return (
    <>
      <Head>
        <title>Dashboard — SaaralCare AI</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>

      <div className="min-h-screen bg-navy-950">
        <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rain-500 to-rain-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">SaaralCare AI</span>
            </Link>
            <div className="flex items-center gap-4">
               <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                 <Globe className="w-3 h-3" /> {lang === "en" ? "हिन्दी" : "English"}
               </button>
               <button onClick={() => { sessionStorage.clear(); window.location.href = "/login"; }} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
                 <LogOut className="w-4 h-4" /> {t("logout", lang)}
               </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white">
              {t("good" + getTimeOfDay().charAt(0).toUpperCase() + getTimeOfDay().slice(1), lang)}, {workerData.worker.name.split(" ")[0]} 👋
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
             <WorkerZoneCard data={workerData.worker} lang={lang} t={t} />
             {/* INTEGRATED: RainfallStationCard */}
             <RainfallStationCard data={workerData.station} lang={lang} t={t} />
             <WeeklyCoverageCard data={workerData.coverage} lang={lang} t={t} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ── INSURANCE COVERAGE CARD (MODIFIED) ────────────────────────── */}
            <div className="lg:col-span-2">
              <div className={`glass-card rounded-2xl p-6 border transition-all duration-300 ${colors.border} ${colors.bg}`}>
                
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon 
                        className={`w-5 h-5 ${status === "activating" ? "animate-pulse" : ""}`}
                        style={{ color: status === "active" ? "#34d399" : status === "activating" ? "#fbbf24" : "#94a3b8" }} 
                      />
                      <h3 className="font-display text-xl font-bold text-white">{t("insuranceCoverage", lang)}</h3>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                      {planStatus.label}
                    </span>
                  </div>
                  <Calendar className={`w-5 h-5 ${status === "active" ? "text-emerald-400" : "text-slate-600"}`} />
                </div>

                {/* State-specific details */}
                {status === "none" && (
                  <div className="rounded-xl bg-navy-800/60 border border-navy-700 p-5 mb-6">
                    <p className="text-slate-400 text-sm">{t("noActiveCoverage", lang)}</p>
                  </div>
                )}

                {status === "activating" && (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-5 mb-6">
                    <p className="text-amber-300 text-xs uppercase tracking-wide font-semibold mb-1">Activation Pending</p>
                    <p className="text-white text-lg font-bold">Starts in <span className="text-amber-300">{planStatus.timeLeft}</span></p>
                    {planStatus.startDate && (
                      <p className="text-slate-400 text-xs mt-1">Effective from {planStatus.startDate.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    )}
                  </div>
                )}

                {status === "active" && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-5 mb-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{t("coveragePeriod", lang)}</p>
                        <p className="text-white font-semibold text-sm">{formatDateRange(planStatus.startDate, planStatus.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Time Remaining</p>
                        <p className="text-emerald-300 font-bold text-sm">{planStatus.timeLeft}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-emerald-500/20 text-xs">
                      <p className="text-slate-500">{t("rainTrigger", lang)}</p>
                      <p className="text-slate-300 mt-0.5">{t("fullPayoutWhen", lang)} | {t("partialPayoutWhen", lang)}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-navy-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-xs uppercase mb-1">{t("weeklyPremium", lang)}</p>
                    <p className="font-display text-2xl font-bold text-rain-400">₹{workerData.premium.weeklyPremium}</p>
                  </div>
                  <div className="bg-navy-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-xs uppercase mb-1">{t("coveragePerDay", lang)}</p>
                    <p className="font-display text-2xl font-bold text-rain-400">₹{workerData.premium.dailyCoverage}</p>
                  </div>
                </div>

                <button
                  onClick={handleBuyPlan}
                  disabled={status !== "none"}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                    status === "none" ? "bg-emerald-500 hover:bg-emerald-600 text-white" :
                    status === "active" ? "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 cursor-not-allowed" :
                    "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  }`}
                >
                  {status === "none" ? t("buyPlan", lang) : status === "active" ? "✓ Coverage Active" : "⟳ Activating..."}
                </button>
              </div>
            </div>
            {/* PREMIUM CARD */}
            <PremiumCard data={workerData.premium} lang={lang} t={t} />
          </div>

          <div className="mt-8">
            <ClaimHistory payouts={workerData.coverage.payouts} lang={lang} t={t} />
          </div>
        </main>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return <div className="space-y-6 animate-pulse"><div className="h-10 w-48 bg-navy-800 rounded"></div><div className="grid grid-cols-3 gap-6"><div className="h-48 bg-navy-800 rounded-xl"></div><div className="h-48 bg-navy-800 rounded-xl"></div><div className="h-48 bg-navy-800 rounded-xl"></div></div></div>;
}