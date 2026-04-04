// pages/dashboard.js — Worker dashboard with language support
// FIXED: data keys, status normalization, and post-payment state synchronization

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

// ── Translation dictionary ───────────────────────────────────────────────────
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
const t = (key, lang) => T[lang]?.[key] || key;

function formatMonthYear(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "—";
  const formatOpts = { month: "short", day: "numeric" };
  return `${startDate.toLocaleDateString("en-IN", formatOpts)} – ${endDate.toLocaleDateString("en-IN", formatOpts)}`;
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

// ── Page component ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workerData, setWorkerData] = useState(null);
  const [policy, setPolicy] = useState(null);

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return sessionStorage.getItem("sc_lang") || "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sc_lang", lang);
    }
  }, [lang]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const phone = typeof window !== "undefined" ? sessionStorage.getItem("gs_worker_phone") : null;
        if (!phone) {
          window.location.href = "/login";
          return;
        }

        const { data: worker, error: wErr } = await supabase
          .from("workers")
          .select("id, name, phone, platform, zone, latitude, longitude, station_id, avg_daily_income, created_at, plan_status")
          .eq("phone", phone)
          .maybeSingle();

        if (wErr) throw new Error(wErr.message);
        if (!worker) throw new Error("Worker record not found.");

        const { data: policyData } = await supabase
          .from("policy_calculation")
          .select("*")
          .eq("worker_id", worker.id)
          .single();

        if (policyData) setPolicy(policyData);

        const { data: payments } = await supabase.from("premium_payments").select("*").eq("worker_id", worker.id);
        const { data: payouts } = await supabase.from("coverage_payout").select("*").eq("worker_id", worker.id);

        const formattedPayouts = payouts
          ?.sort((a, b) => new Date(b.payout_time) - new Date(a.payout_time))
          .map((p) => ({
            amount: p.payout_amount,
            type: p.payout_amount >= 400 ? "full" : "partial",
          })) || [];

        const totalPaid = payments?.reduce((sum, p) => sum + (p.premium_amount || 0), 0) || 0;
        const totalReceivedDynamic = payouts?.reduce((sum, p) => sum + (p.payout_amount || 0), 0) || 0;
        const savingsRatio = totalPaid > 0 ? (totalReceivedDynamic / totalPaid).toFixed(1) : 0;

        const recentPayments = payments
          ?.sort((a, b) => new Date(b.transaction_time) - new Date(a.transaction_time))
          .map((p) => ({
            date: new Date(p.transaction_time).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            amount: p.premium_amount,
            status: "paid",
          })) || [];

        // FIX 1: Corrected key name to 'plan_status' to match derivation
        const workerCardData = {
          id: worker.id,
          name: worker.name,
          phone: worker.phone,
          zone: worker.zone,
          platform: worker.platform,
          vehicle: "scooter",
          plan_status: worker.plan_status, // Single source of truth
          memberSince: formatMonthYear(worker.created_at),
        };

        let stationRow = null;
        if (worker.station_id) {
          const { data: st } = await supabase.from("stations").select("*").eq("id", worker.station_id).maybeSingle();
          stationRow = st;
        }

        setWorkerData({
          worker: workerCardData,
          station: {
            stationId: stationRow?.id ?? worker.station_id ?? "—",
            stationName: stationRow?.station_name ?? stationRow?.district ?? "Mapped Station",
            distance: "—",
            lastReading: 0,
            threshold: 15,
            updatedAt: "—",
            trend: "stable",
            alertActive: false,
          },
          coverage: {
            ...STATIC_COVERAGE,
            payouts: formattedPayouts,
            totalPayout: totalReceivedDynamic,
            maxPayout: totalReceivedDynamic,
          },
          premium: {
            weeklyPremium: policyData?.premium_weekly ?? 0,
            monthlyPremium: policyData ? policyData.premium_weekly * 4 : 0,
            dailyCoverage: policyData?.coverage_per_day ?? 0,
            maxWeeklyPayout: policyData?.coverage_cap ?? (policyData?.coverage_per_day * 3 || 0),
            totalPaid: totalPaid,
            totalReceived: totalReceivedDynamic,
            weeksActive: payments?.length || 0,
            nextDeductionDate: STATIC_PREMIUM.nextDeductionDate,
            upiId: `${worker.name?.split(" ")[0]?.toLowerCase()}@upi`,
            savingsRatio: savingsRatio,
            recentPayments: recentPayments,
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  async function handleBuyPlan() {
    try {
      if (!policy) return alert("Policy not loaded");
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: policy.premium_weekly }),
      });
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "SaaralCare AI",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              worker_id: workerData.worker.id,
              amount: policy.premium_weekly,
            }),
          });
          const data = await verifyRes.json();

          if (data.success) {
            alert("Payment Successful!");
            // FIX 3: Re-fetch and sync state immediately
            const phone = sessionStorage.getItem("gs_worker_phone");
            if (phone) {
              const { data: updatedWorker } = await supabase
                .from("workers")
                .select("plan_status")
                .eq("phone", phone)
                .maybeSingle();

              if (updatedWorker) {
                setWorkerData(prev => ({
                  ...prev,
                  worker: { ...prev.worker, plan_status: updatedWorker.plan_status }
                }));
              }
            }
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed");
    }
  }

  function handleLogout() {
    sessionStorage.clear();
    window.location.href = "/login";
  }

  // FIX 2: Single source of truth logic
  const rawStatus = workerData?.worker?.plan_status;
  const status = (rawStatus === "active" || rawStatus === "activating") ? rawStatus : "none";

  const planStatus = {
    status,
    label: status === "active" ? "Coverage Active" : status === "activating" ? "Activating..." : "No Active Coverage",
    color: status === "active" ? "emerald" : status === "activating" ? "amber" : "slate",
  };

  const statusColors = {
    active: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle2 },
    activating: { bg: "bg-amber-500/15", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300", icon: Clock },
    none: { bg: "bg-slate-500/15", border: "border-slate-500/30", badge: "bg-slate-500/20 text-slate-300", icon: AlertCircle },
  };

  const colors = statusColors[planStatus.status] || statusColors.none;
  const StatusIcon = colors.icon;

  if (loading) return <div className="min-h-screen bg-navy-950 p-8"><DashboardSkeleton /></div>;
  if (error) return <div className="min-h-screen bg-navy-950 p-8"><ErrorState message={error} onLogout={handleLogout} /></div>;

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
              <span className="font-display font-semibold text-white text-lg">
                Saaral<span className="text-rain-400">Care</span><span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs">
                <Globe className="w-4 h-4" />
                <span>{lang === "en" ? "हिन्दी" : "English"}</span>
              </button>
              <button className="relative w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
              </button>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("logout", lang)}</span>
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
            <RainfallStationCard data={workerData.station} lang={lang} t={t} />
            <WeeklyCoverageCard data={workerData.coverage} lang={lang} t={t} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2">
              <div className={`glass-card rounded-2xl p-6 border ${colors.border} ${colors.bg}`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className="w-5 h-5" style={{ color: planStatus.color === "emerald" ? "#34d399" : "#fbbf24" }} />
                      <h3 className="font-display text-xl font-bold text-white">{t("insuranceCoverage", lang)}</h3>
                    </div>
                    <p className={`text-sm ${colors.badge} px-2.5 py-1 rounded-full inline-block`}>{planStatus.label}</p>
                  </div>
                </div>

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
                  disabled={planStatus.status === "activating"}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    planStatus.status === "activating" ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  {planStatus.status === "none" ? t("buyPlan", lang) : planStatus.status === "activating" ? t("activating", lang) : t("renewPlan", lang)}
                </button>
              </div>
            </div>
            <PremiumCard data={workerData.premium} lang={lang} t={t} />
          </div>

          <ClaimHistory payouts={workerData.coverage.payouts} lang={lang} t={t} />
        </main>
      </div>
    </>
  );
}

function ErrorState({ message, onLogout }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Error</h2>
      <p className="text-slate-400 mb-6">{message}</p>
      <button onClick={onLogout} className="bg-rain-500 text-white px-6 py-2 rounded-lg">Back to Login</button>
    </div>
  );
}

function DashboardSkeleton() {
  return <div className="space-y-6 animate-pulse"><div className="h-10 w-48 bg-navy-800 rounded"></div><div className="grid grid-cols-3 gap-6"><div className="h-48 bg-navy-800 rounded-xl"></div><div className="h-48 bg-navy-800 rounded-xl"></div><div className="h-48 bg-navy-800 rounded-xl"></div></div></div>;
}