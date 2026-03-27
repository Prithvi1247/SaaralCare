// pages/dashboard.js — Worker dashboard with language support
// NEW: Added plan lifecycle, insurance UI, payout labeling, and i18n support

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Shield, Bell, LogOut, RefreshCw, CloudRain, CheckCircle2, AlertCircle, Clock, Calendar, Globe } from "lucide-react";

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

// NEW: Translation dictionary
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
    renewPlan: "Renew Plan",
    activating: "Activating...",
    payoutHistory: "Payout History",
    rainfallStations: "Rainfall Stations — Mumbai Region",
    workerProfile: "Worker Profile",
    deliveryZone: "Delivery Zone",
    vehicle: "Vehicle",
    platform: "Platform",
    memberSince: "Member Since",
    totalReceived: "total received",
    events: "events",
    paid: "Paid",
    processing: "Processing",
    notTriggered: "Not Triggered",
    processingUpTo4Hours: "Processing — up to 4 hours",
    rainfallBelowThreshold: "Rainfall below trigger threshold",
    premiumPayments: "Premium & Payments",
    totalPaid: "Total Paid",
    totalReceivedValue: "Total Received",
    savingsRatio: "Savings Ratio",
    youReceived: "You've received",
    moreThanPaid: "more than you paid in premiums.",
    nextDeduction: "Next deduction",
    recentPayments: "Recent Payments",
    mappedStation: "Mapped Station",
    lastReading: "Rainfall (last 3hr)",
    threshold: "Threshold",
    payoutTriggers: "Payout Triggers",
    updated: "Updated",
    weeklyCoverage: "Weekly Coverage",
    covered: "Covered",
    weekPayout: "Week Payout",
    renewsOn: "Renews",
    rainDaysThisWeek: "rain day",
    rainDaysThisWeekPlural: "rain days this week",
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
    basedOnZone: "आपके क्षेत्र जोखिम और मौसम पर आधारित",
    insuranceCoverage: "बीमा कवरेज",
    noPlan: "कोई सक्रिय कवरेज नहीं",
    noActiveCoverage: "कोई सक्रिय कवरेज नहीं। साप्ताहिक योजना के साथ सुरक्षित रहें।",
    coveragePeriod: "कवरेज अवधि",
    dailyBenefit: "दैनिक लाभ",
    rainTrigger: "बारिश ट्रिगर",
    fullPayoutWhen: "पूर्ण भुगतान जब बारिश सूचकांक × दिन ≥ 50",
    partialPayoutWhen: "आंशिक भुगतान जब 30–49",
    yourCoverage: "आपकी कवरेज",
    buyPlan: "योजना खरीदें",
    renewPlan: "नवीनीकरण करें",
    activating: "सक्रिय हो रहा है...",
    payoutHistory: "भुगतान इतिहास",
    rainfallStations: "बारिश स्टेशन — मुंबई क्षेत्र",
    workerProfile: "कार्यकर्ता प्रोफाइल",
    deliveryZone: "डिलीवरी क्षेत्र",
    vehicle: "वाहन",
    platform: "मंच",
    memberSince: "सदस्य बनाया",
    totalReceived: "कुल प्राप्त",
    events: "घटनाएं",
    paid: "भुगतान किया गया",
    processing: "प्रसंस्करण",
    notTriggered: "ट्रिगर नहीं हुआ",
    processingUpTo4Hours: "प्रसंस्करण — 4 घंटे तक",
    rainfallBelowThreshold: "बारिश सीमा से नीचे",
    premiumPayments: "प्रीमियम और भुगतान",
    totalPaid: "कुल भुगतान",
    totalReceivedValue: "कुल प्राप्त",
    savingsRatio: "बचत अनुपात",
    youReceived: "आपको प्राप्त हुआ",
    moreThanPaid: "जो आपने प्रीमियम में भुगतान किया उससे अधिक।",
    nextDeduction: "अगली कटौती",
    recentPayments: "हाल ही के भुगतान",
    mappedStation: "मानचित्र स्टेशन",
    lastReading: "बारिश (पिछले 3 घंटे)",
    threshold: "सीमा",
    payoutTriggers: "भुगतान ट्रिगर",
    updated: "अपडेट किया गया",
    weeklyCoverage: "साप्ताहिक कवरेज",
    covered: "संरक्षित",
    weekPayout: "सप्ताह भुगतान",
    renewsOn: "नवीनीकरण",
    rainDaysThisWeek: "बारिश दिन",
    rainDaysThisWeekPlural: "बारिश दिन इस सप्ताह",
    logout: "लॉगआउट",
  }
};

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

/** NEW: Translation helper */
const t = (key, lang) => T[lang]?.[key] || key;

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
  const [policy, setPolicy] = useState(null);

  // NEW: Language state
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return sessionStorage.getItem("sc_lang") || "en";
  });

  // NEW: Plan lifecycle state
  const [plan, setPlan] = useState(() => {
    if (typeof window === "undefined") return { paymentDate: null };
    const stored = sessionStorage.getItem("sc_plan");
    return stored ? JSON.parse(stored) : { paymentDate: null };
  });

  // NEW: Persist language
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sc_lang", lang);
    }
  }, [lang]);

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

        const { data: worker, error: wErr } = await supabase
          .from("workers")
          .select("id, name, phone, platform, zone, latitude, longitude, station_id, avg_daily_income, created_at")
          .eq("phone", phone)
          .maybeSingle();

        if (wErr)    throw new Error(wErr.message);
        if (!worker) throw new Error("Worker record not found. Please complete onboarding.");
        // 🔥 Fetch policy data from Supabase
        const { data: policyData, error: policyError } = await supabase
          .from("policy_calculation")
          .select("*")
          .limit(1)
          .single();

        if (!policyError) {
          setPolicy(policyData);
}

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
          premium: policyData
          ? {
            weeklyPremium: policyData.premium_weekly,
            monthlyPremium: Math.round(policyData.premium_weekly * 4.33),
            dailyCoverage: policyData.coverage_per_day,
            maxWeeklyPayout: policyData.coverage_cap ?? policyData.coverage_per_day * 3,
            totalPaid: STATIC_PREMIUM.totalPaid,
            totalReceived: STATIC_PREMIUM.totalReceived,
            weeksActive: STATIC_PREMIUM.weeksActive,
            nextDeductionDate: STATIC_PREMIUM.nextDeductionDate,
            upiId: `${worker.name?.split(" ")[0]?.toLowerCase()}@upi`,
            savingsRatio: STATIC_PREMIUM.savingsRatio,
          }
          : { ...STATIC_PREMIUM, upiId: `${worker.name?.split(" ")[0]?.toLowerCase()}@upi` },
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

  function handleBuyPlan() {
    setPlan({ paymentDate: new Date().toISOString() });
  }

  const planStatus = getPlanStatus(plan.paymentDate);
  const statusColors = {
    active: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle2 },
    activating: { bg: "bg-amber-500/15", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300", icon: Clock },
    expired: { bg: "bg-red-500/15", border: "border-red-500/30", badge: "bg-red-500/20 text-red-300", icon: AlertCircle },
    none: { bg: "bg-slate-500/15", border: "border-slate-500/30", badge: "bg-slate-500/20 text-slate-300", icon: AlertCircle },
  };
  const colors = statusColors[planStatus.status];
  const StatusIcon = colors.icon;

  return (
    <>
      <Head>
        <title>Dashboard — SaaralCare AI</title>
      </Head>

      <div className="min-h-screen bg-navy-950">
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
                  {t("insuranceCoverage", lang)} · {formatDateRange(planStatus.startDate, planStatus.endDate)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* NEW: Language toggle */}
              <button
                onClick={() => setLang(lang === "en" ? "hi" : "en")}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors"
                title="Toggle language"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>

              <button className="relative w-9 h-9 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("logout", lang)}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <DashboardSkeleton />
          ) : error ? (
            <ErrorState message={error} onLogout={handleLogout} />
          ) : (
            <>
              <div className="mb-8 animate-fade-up opacity-0">
                <h1 className="font-display text-3xl font-bold text-white">
                  {t("good" + getTimeOfDay().charAt(0).toUpperCase() + getTimeOfDay().slice(1), lang)}, {workerData.worker.name.split(" ")[0]} 👋
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {t("coverageStatus", lang)}: <span className={`font-medium ${planStatus.status === "active" ? "text-emerald-400" : "text-amber-400"}`}></span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div className="animate-fade-up opacity-0 delay-100">
                  <WorkerZoneCard data={workerData.worker} lang={lang} t={t} />
                </div>
                <div className="animate-fade-up opacity-0 delay-200">
                  <RainfallStationCard data={workerData.station} lang={lang} t={t} />
                </div>
                <div className="animate-fade-up opacity-0 delay-300">
                  <WeeklyCoverageCard data={workerData.coverage} lang={lang} t={t} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2 animate-fade-up opacity-0 delay-400">
                  <div className={`glass-card gradient-border rounded-2xl p-6 border ${colors.border}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className="w-5 h-5" style={{ color: planStatus.color === "emerald" ? "#34d399" : planStatus.color === "amber" ? "#fbbf24" : planStatus.color === "red" ? "#f87171" : "#cbd5e1" }} />
                          <h3 className="font-display text-xl font-bold text-white">{t("insuranceCoverage", lang)}</h3>
                        </div>
                        <p className={`text-sm ${colors.badge} px-2.5 py-1 rounded-full inline-block`}>{planStatus.label}</p>
                      </div>
                      <Calendar className="w-5 h-5 text-slate-500" />
                    </div>

                    <div className={`rounded-xl p-5 mb-6 ${colors.bg}`}>
                      {planStatus.status === "none" ? (
                        <p className="text-slate-400 text-sm">{t("noActiveCoverage", lang)}</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{t("coveragePeriod", lang)}</p>
                              <p className="text-white font-semibold">{formatDateRange(planStatus.startDate, planStatus.endDate)}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{t("dailyBenefit", lang)}</p>
                              <p className="text-white font-semibold">₹{workerData.premium.dailyCoverage}</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-600/40">
                            <p className="text-slate-400 text-xs mb-1">{t("rainTrigger", lang)}</p>
                            <p className="text-slate-300 text-sm">{t("fullPayoutWhen", lang)} | {t("partialPayoutWhen", lang)}</p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-navy-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{t("weeklyPremium", lang)}</p>
                        <p className="font-display text-2xl font-bold text-rain-400">₹{workerData.premium.weeklyPremium}</p>
                      </div>
                      <div className="bg-navy-800/50 rounded-lg p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{t("monthlyPremium", lang)}</p>
                        <p className="font-display text-2xl font-bold text-rain-400">₹{workerData.premium.monthlyPremium}</p>
                      </div>
                    </div>

                    <div className="bg-navy-800/30 rounded-lg p-4 mb-6 border border-navy-700">
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-3 font-medium">{t("yourCoverage", lang)}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t("coveragePerDay", lang)}</span>
                          <span className="text-white font-semibold">₹{workerData.premium.dailyCoverage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t("maxWeeklyPayout", lang)}</span>
                          <span className="text-white font-semibold">₹{workerData.premium.maxWeeklyPayout}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-navy-700">
                          <span>{t("basedOnZone", lang)}</span>
                        </div>
                      </div>
                    </div>

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
                      {planStatus.status === "none" ? t("buyPlan", lang) : planStatus.status === "activating" ? t("activating", lang) : t("renewPlan", lang)}
                    </button>
                  </div>
                </div>

                <div className="animate-fade-up opacity-0 delay-500">
                  <PremiumCard data={workerData.premium} lang={lang} t={t} />
                </div>
              </div>

              <div className="mb-5 animate-fade-up opacity-0 delay-600">
                <div className="glass-card gradient-border rounded-2xl overflow-hidden h-[380px]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-rain-400" />
                      <span className="text-white font-medium text-sm">
                        {t("rainfallStations", lang)}
                      </span>
                    </div>
                  </div>
                  <div className="h-[calc(100%-57px)]">
                    <RainfallMap workerStation={workerData.station.stationId} />
                  </div>
                </div>
              </div>

              <div className="animate-fade-up opacity-0 delay-700">
                <ClaimHistory payouts={workerData.coverage.payouts} lang={lang} t={t} />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

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
