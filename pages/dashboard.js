// pages/dashboard.js — Worker dashboard with language support
// FIXED: Added yesterday's rainfall fetch and mapped deliveryZone to the station card

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
    coverageActive: "Coverage Active",
    noActiveCoverage: "No active coverage. Get protected with a weekly plan.",
    coveragePeriod: "Coverage Period",
    dailyBenefit: "Daily Benefit",
    rainTrigger: "Rain Trigger",
    fullPayoutWhen: "Full payout when rainfall index × days ≥ 50",
    partialPayoutWhen: "Partial payout when 30–49",
    yourCoverage: "Your Coverage",
    buyPlan: "Buy Plan",
    renewPlan: "Renew Plan",
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
    startDate: "Start Date",
    endDate: "End Date",
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
    insuranceCoverage: "बीमा सुरक्षा",
    noPlan: "कोई योजना नहीं",
    coverageActive: "कवरेज सक्रिय है",
    noActiveCoverage: "अभी कोई कवरेज नहीं है। साप्ताहिक योजना लेकर सुरक्षित रहें।",
    coveragePeriod: "कवरेज अवधि",
    dailyBenefit: "दैनिक लाभ",
    rainTrigger: "बारिश ट्रिगर",
    fullPayoutWhen: "पूरा भुगतान जब बारिश सूचकांक × दिन ≥ 50",
    partialPayoutWhen: "आंशिक भुगतान जब 30–49",
    yourCoverage: "आपकी सुरक्षा",
    buyPlan: "योजना खरीदें",
    renewPlan: "नवीनीकरण करें",
    payoutHistory: "भुगतान इतिहास",
    rainfallStations: "वर्षा केंद्र — मुंबई क्षेत्र",
    workerProfile: "कार्यकर्ता प्रोफाइल",
    deliveryZone: "डिलीवरी क्षेत्र",
    vehicle: "वाहन",
    platform: "प्लेटफॉर्म",
    memberSince: "सदस्यता तिथि",
    totalReceived: "कुल प्राप्त",
    events: "घटनाएं",
    paid: "भुगतान हुआ",
    processing: "प्रक्रिया में",
    notTriggered: "ट्रिगर नहीं हुआ",
    processingUpTo4Hours: "प्रक्रिया में — 4 घंटे तक",
    rainfallBelowThreshold: "बारिश सीमा से कम रही",
    premiumPayments: "प्रीमियम और भुगतान",
    totalPaid: "कुल भुगतान",
    totalReceivedValue: "कुल प्राप्त",
    savingsRatio: "बचत अनुपात",
    youReceived: "आपको मिला",
    moreThanPaid: "जितना आपने प्रीमियम में दिया उससे ज़्यादा।",
    nextDeduction: "अगली कटौती",
    recentPayments: "हाल के भुगतान",
    mappedStation: "नज़दीकी स्टेशन",
    lastReading: "बारिश (पिछले 3 घंटे)",
    threshold: "सीमा",
    payoutTriggers: "भुगतान ट्रिगर",
    updated: "अपडेट हुआ",
    weeklyCoverage: "साप्ताहिक कवरेज",
    covered: "सुरक्षित",
    weekPayout: "इस सप्ताह भुगतान",
    renewsOn: "नवीनीकरण",
    rainDaysThisWeek: "बारिश का दिन",
    rainDaysThisWeekPlural: "बारिश के दिन इस सप्ताह",
    logout: "लॉगआउट",
    startDate: "शुरुआत तिथि",
    endDate: "समाप्ति तिथि",
  },
  // TASK 3: Tamil translations added
  ta: {
    goodMorning: "காலை வணக்கம்",
    goodAfternoon: "மதிய வணக்கம்",
    goodEvening: "மாலை வணக்கம்",
    coverageStatus: "உங்கள் காப்பீடு நிலை",
    weeklyPremium: "வாராந்திர பிரீமியம்",
    monthlyPremium: "மாதாந்திர (தோராயமாக)",
    coveragePerDay: "மழை நாளுக்கு",
    maxWeeklyPayout: "அதிகபட்ச வாராந்திர தொகை",
    basedOnZone: "உங்கள் மண்டல அபாயம் மற்றும் பருவகாலம் அடிப்படையில்",
    insuranceCoverage: "காப்பீட்டு பாதுகாப்பு",
    noPlan: "செயலில் திட்டம் இல்லை",
    coverageActive: "பாதுகாப்பு செயலில் உள்ளது",
    noActiveCoverage: "செயலில் காப்பீடு இல்லை. வாராந்திர திட்டத்துடன் பாதுகாப்பு பெறுங்கள்.",
    coveragePeriod: "காப்பீட்டு காலம்",
    dailyBenefit: "தினசரி நன்மை",
    rainTrigger: "மழை தூண்டுதல்",
    fullPayoutWhen: "மழை குறியீடு × நாட்கள் ≥ 50 ஆகும்போது முழு பணம்",
    partialPayoutWhen: "30–49 ஆகும்போது பகுதி பணம்",
    yourCoverage: "உங்கள் பாதுகாப்பு",
    buyPlan: "திட்டம் வாங்கவும்",
    renewPlan: "புதுப்பிக்கவும்",
    payoutHistory: "பணம் வரலாறு",
    rainfallStations: "மழை நிலையங்கள் — மும்பை பகுதி",
    workerProfile: "பணியாளர் சுயவிவரம்",
    deliveryZone: "டெலிவரி மண்டலம்",
    vehicle: "வாகனம்",
    platform: "தளம்",
    memberSince: "உறுப்பினர் தேதி",
    totalReceived: "மொத்தம் பெற்றது",
    events: "நிகழ்வுகள்",
    paid: "செலுத்தப்பட்டது",
    processing: "செயலாக்கத்தில்",
    notTriggered: "தூண்டப்படவில்லை",
    processingUpTo4Hours: "செயலாக்கத்தில் — 4 மணி நேரம் வரை",
    rainfallBelowThreshold: "மழை வரம்புக்கு கீழே",
    premiumPayments: "பிரீமியம் மற்றும் கொடுப்பனவுகள்",
    totalPaid: "மொத்தம் செலுத்தியது",
    totalReceivedValue: "மொத்தம் பெற்றது",
    savingsRatio: "சேமிப்பு விகிதம்",
    youReceived: "நீங்கள் பெற்றது",
    moreThanPaid: "பிரீமியமாக செலுத்தியதை விட அதிகம்.",
    nextDeduction: "அடுத்த கழிவு",
    recentPayments: "சமீபத்திய கொடுப்பனவுகள்",
    mappedStation: "வரைபட நிலையம்",
    lastReading: "மழை (கடந்த 3 மணி)",
    threshold: "வரம்பு",
    payoutTriggers: "பணம் தூண்டுதல்கள்",
    updated: "புதுப்பிக்கப்பட்டது",
    weeklyCoverage: "வாராந்திர காப்பீடு",
    covered: "பாதுகாக்கப்பட்டது",
    weekPayout: "வார கொடுப்பனவு",
    renewsOn: "புதுப்பிக்கப்படும்",
    rainDaysThisWeek: "மழை நாள்",
    rainDaysThisWeekPlural: "இந்த வாரம் மழை நாட்கள்",
    logout: "வெளியேறு",
    startDate: "தொடக்க தேதி",
    endDate: "முடிவு தேதி",
  }
};

// ── Static fallbacks for data not yet in Supabase ─────────────────────────────
const STATIC_PREMIUM = {
  weeklyPremium: 67, monthlyPremium: 268, dailyCoverage: 375, maxWeeklyPayout: 1125,
  totalPaid: 377, totalReceived: 1920,
  weeksActive: 13, nextDeductionDate: "Dec 23, 2024",
  upiId: "—", savingsRatio: 5.1,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const t = (key, lang) => T[lang]?.[key] || T["en"]?.[key] || key;

function formatMonthYear(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

// TASK 4: Compute Mon–Sun range for current week
function getCurrentWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun,1=Mon,...6=Sat
  const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

        // ── TASK 2: Real premium payments — latest 5, ordered desc ───────────
        const { data: payments } = await supabase
          .from("premium_payments")
          .select("*")
          .eq("worker_id", worker.id)
          .order("transaction_time", { ascending: false })
          .limit(5);

        // ── TASK 1: Real payout history — latest 5, ordered desc ──────────────
        const { data: payouts } = await supabase
          .from("coverage_payout")
          .select("*")
          .eq("worker_id", worker.id)
          .order("payout_time", { ascending: false })
          .limit(5);

        // ── TASK 4: This week's payouts for WeeklyCoverageCard ────────────────
        const { monday, sunday } = getCurrentWeekRange();
        const { data: weekPayouts } = await supabase
          .from("coverage_payout")
          .select("*")
          .eq("worker_id", worker.id)
          .gte("payout_time", monday.toISOString())
          .lte("payout_time", sunday.toISOString());

        // ── Fetch yesterday's rainfall ────────────────────────────────────────
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

        const { data: yesterdayEvents } = await supabase
          .from("rainfall_events")
          .select("rainfall_mm")
          .eq("station_id", worker.station_id)
          .gte("recorded_at", yesterdayStart)
          .lte("recorded_at", yesterdayEnd);

        const yesterdayTotalRain = yesterdayEvents?.reduce((sum, e) => sum + (e.rainfall_mm || 0), 0) || 0;

        // ── TASK 4: Build weekly coverage data ────────────────────────────────
        // Convert JS getDay() (0=Sun..6=Sat) to Mon=0..Sun=6
        const toWeekIdx = (d) => { const dow = new Date(d).getDay(); return dow === 0 ? 6 : dow - 1; };

        const uniqueRainDays = [...new Set((weekPayouts || []).map(p => toWeekIdx(p.payout_time)))];

        const weekPayoutsByDay = (weekPayouts || []).reduce((acc, p) => {
          const idx = toWeekIdx(p.payout_time);
          acc[idx] = (acc[idx] || 0) + (p.payout_amount || 0);
          return acc;
        }, {});

        const weekPayoutsForCard = Object.entries(weekPayoutsByDay).map(([day, amount]) => ({
          day: Number(day),
          amount,
          type: amount >= 400 ? "full" : "partial",
        }));

        const weeklyTotalPayout = (weekPayouts || []).reduce((sum, p) => sum + (p.payout_amount || 0), 0);
        const maxWeeklyPayout = policyData?.coverage_cap ?? (policyData?.coverage_per_day * 3 || STATIC_PREMIUM.maxWeeklyPayout);

        const nextRenewalDate = new Date(sunday);
        nextRenewalDate.setDate(sunday.getDate() + 1);

        // ── Coverage dates ────────────────────────────────────────────────────
        let paymentStartDate = new Date();
        paymentStartDate.setDate(paymentStartDate.getDate() + 7);
        let paymentEndDate = new Date(paymentStartDate);
        paymentEndDate.setDate(paymentStartDate.getDate() + 7);
        let daysUntilActive = 7;

        const { data: activePlan } = await supabase
          .from("active_plans")
          .select("*")
          .eq("worker_id", worker.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (activePlan?.start_date && activePlan?.end_date) {
          paymentStartDate = new Date(activePlan.start_date);
          paymentEndDate = new Date(activePlan.end_date);
          const diff = paymentStartDate - new Date();
          daysUntilActive = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        } else if (payments && payments.length > 0) {
          // payments already sorted desc, so [0] is latest
          const txDate = new Date(payments[0].transaction_time);
          paymentStartDate = new Date(txDate);
          paymentStartDate.setDate(paymentStartDate.getDate() + 7);
          paymentEndDate = new Date(paymentStartDate);
          paymentEndDate.setDate(paymentStartDate.getDate() + 7);
          const diff = paymentStartDate - new Date();
          daysUntilActive = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        }

        const displayStartDate = paymentStartDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        const displayEndDate = paymentEndDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

        // ── TASK 1: Map real payouts → ClaimHistory format ────────────────────
        const formattedPayouts = (payouts || []).map((p) => {
          const payoutDate = new Date(p.payout_time);
          const status = p.payment_status === "processing"
            ? "processing"
            : p.payment_status === "failed" || p.payment_status === "rejected"
            ? "rejected"
            : "paid";
          return {
            id: `CLM-${String(p.id ?? "").slice(-6).toUpperCase() || Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            date: payoutDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            rainfall: 0,        // not stored in coverage_payout; shown as Rain event
            station: "Rain event",
            amount: p.payout_amount || 0,
            status,
            type: (p.payout_amount || 0) >= 400 ? "full" : "partial",
            paidAt: status === "paid"
              ? payoutDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
                " · " + payoutDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
              : null,
          };
        });

        // ── TASK 2: Map real payments → PremiumCard format ────────────────────
        const recentPayments = (payments || []).map((p) => ({
          date: new Date(p.transaction_time).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          amount: p.premium_amount,
          status: "paid",
        }));

        const totalPaid = (payments || []).reduce((sum, p) => sum + (p.premium_amount || 0), 0);
        const totalReceivedDynamic = (payouts || []).reduce((sum, p) => sum + (p.payout_amount || 0), 0);
        const savingsRatio = totalPaid > 0 ? (totalReceivedDynamic / totalPaid).toFixed(1) : 0;

        // ── Station row ───────────────────────────────────────────────────────
        let stationRow = null;
        if (worker.station_id) {
          const { data: st } = await supabase.from("stations").select("*").eq("id", worker.station_id).maybeSingle();
          stationRow = st;
        }

        const workerCardData = {
          id: worker.id,
          name: worker.name,
          phone: worker.phone,
          zone: worker.zone,
          platform: worker.platform,
          vehicle: "scooter",
          plan_status: worker.plan_status,
          memberSince: formatMonthYear(worker.created_at),
        };

        setWorkerData({
          worker: workerCardData,
          station: {
            deliveryZone: worker.zone || "—",
            yesterdayRainfall: yesterdayTotalRain,
            stationId: stationRow?.id ?? worker.station_id ?? "—",
            stationName: stationRow?.station_name ?? stationRow?.district ?? "Mapped Station",
            distance: "—",
            threshold: 15,
            updatedAt: "Just now",
            alertActive: false,
          },
          // TASK 4: dynamic week coverage from real data
          coverage: {
            weekStart: formatShortDate(monday),
            weekEnd: formatShortDate(sunday),
            coverageStatus: worker.plan_status === "active" ? "active" : "inactive",
            daysWithRain: uniqueRainDays,
            payouts: weekPayoutsForCard,
            totalPayout: weeklyTotalPayout,
            maxPayout: maxWeeklyPayout,
            nextRenewal: formatShortDate(nextRenewalDate),
          },
          // TASK 1: real payout history for ClaimHistory
          allPayouts: formattedPayouts,
          premium: {
            weeklyPremium: policyData?.premium_weekly ?? STATIC_PREMIUM.weeklyPremium,
            monthlyPremium: policyData ? policyData.premium_weekly * 4 : STATIC_PREMIUM.monthlyPremium,
            dailyCoverage: policyData?.coverage_per_day ?? STATIC_PREMIUM.dailyCoverage,
            maxWeeklyPayout,
            totalPaid,
            totalReceived: totalReceivedDynamic,
            weeksActive: (payments || []).length,
            nextDeductionDate: STATIC_PREMIUM.nextDeductionDate,
            upiId: `${worker.name?.split(" ")[0]?.toLowerCase()}@upi`,
            savingsRatio,
            recentPayments,   // TASK 2: real recent payments
            startDate: displayStartDate,
            endDate: displayEndDate,
            daysLeft: daysUntilActive,
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

  const rawStatus = workerData?.worker?.plan_status;
  const status = (rawStatus === "active" || rawStatus === "activating") ? rawStatus : "none";
  const daysLeft = workerData?.premium?.daysLeft ?? 7;

  // TASK 3: activatingLabel per language
  const activatingLabel =
    lang === "hi" ? `${daysLeft} दिनों में सक्रिय होगा...` :
    lang === "ta" ? `${daysLeft} நாட்களில் செயல்படும்...` :
    `Activating in ${daysLeft} days...`;

  const planStatus = {
    status,
    label: status === "active" ? t("coverageActive", lang) : status === "activating" ? activatingLabel : t("noPlan", lang),
    color: status === "active" ? "emerald" : status === "activating" ? "amber" : "slate",
  };

  const statusColors = {
    active: { bg: "bg-[#1e293b]", border: "border-emerald-500/30", badge: "bg-slate-800/80 text-slate-300", icon: CheckCircle2 },
    activating: { bg: "bg-[#1e293b]", border: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-500", icon: Clock },
    none: { bg: "bg-[#0f1423]", border: "border-slate-800/80", badge: "bg-slate-800/80 text-slate-300", icon: AlertCircle },
  };

  const colors = statusColors[planStatus.status] || statusColors.none;
  const StatusIcon = colors.icon;

  if (loading) return <div className="min-h-screen bg-[#090b14] p-8"><DashboardSkeleton /></div>;
  if (error) return <div className="min-h-screen bg-[#090b14] p-8"><ErrorState message={error} onLogout={handleLogout} /></div>;

  // TASK 3: cycle en → hi → ta → en
  function cycleLang() {
    setLang(prev => prev === "en" ? "hi" : prev === "hi" ? "ta" : "en");
  }
  const langLabel = lang === "en" ? "हिन्दी" : lang === "hi" ? "தமிழ்" : "English";

  return (
    <>
      <Head>
        <title>Dashboard — SaaralCare AI</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>

      <div className="min-h-screen bg-[#090b14]">
        <header className="sticky top-0 z-40 bg-[#090b14]/90 backdrop-blur-md border-b border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5fa8d3] to-blue-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">
                Saaral<span className="text-[#5fa8d3]">Care</span><span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* TASK 3: Three-way language toggle */}
              <button onClick={cycleLang} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs">
                <Globe className="w-4 h-4" />
                <span>{langLabel}</span>
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-5 md:space-y-6">

          {/* Greeting */}
          <div className="mb-2">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              {t("good" + getTimeOfDay().charAt(0).toUpperCase() + getTimeOfDay().slice(1), lang)}, {workerData.worker.name.split(" ")[0]} 👋
            </h1>
          </div>

          {/* ROW 1: Insurance Coverage (UNTOUCHED) + Premium Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col h-full">
              <div className={`rounded-2xl p-6 border ${colors.border} ${colors.bg} shadow-lg h-full flex flex-col justify-between`}>

                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <StatusIcon className="w-5 h-5 text-slate-300" style={{ color: planStatus.color === "emerald" ? "#34d399" : planStatus.color === "amber" ? "#fbbf24" : "#94a3b8" }} />
                        <h3 className="font-display text-xl font-bold text-white font-serif">{t("insuranceCoverage", lang)}</h3>
                      </div>
                      <p className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${colors.badge}`}>
                        {planStatus.label}
                      </p>
                    </div>
                    <div className="p-2">
                      <Calendar className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>

                  {planStatus.status === "none" && (
                    <div className="bg-[#12182b] border border-[#1e293b] rounded-xl p-4 mb-5 flex items-center">
                      <p className="text-slate-400 text-sm">{t("noActiveCoverage", lang)}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#12182b] rounded-xl p-4 border border-[#1e293b]/50 hover:border-[#1e293b] transition-colors">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{t("weeklyPremium", lang)}</p>
                      <p className="font-display text-3xl font-bold text-[#5fa8d3] font-serif">₹{workerData.premium.weeklyPremium}</p>
                    </div>
                    <div className="bg-[#12182b] rounded-xl p-4 border border-[#1e293b]/50 hover:border-[#1e293b] transition-colors">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{t("coveragePerDay", lang)}</p>
                      <p className="font-display text-3xl font-bold text-[#5fa8d3] font-serif">₹{workerData.premium.dailyCoverage}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#12182b] rounded-xl p-4 border border-[#1e293b]/50 hover:border-[#1e293b] transition-colors">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{t("startDate", lang)}</p>
                      <p className="text-white text-sm font-medium">{workerData.premium.startDate}</p>
                    </div>
                    <div className="bg-[#12182b] rounded-xl p-4 border border-[#1e293b]/50 hover:border-[#1e293b] transition-colors">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{t("endDate", lang)}</p>
                      <p className="text-white text-sm font-medium">{workerData.premium.endDate}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBuyPlan}
                  disabled={planStatus.status === "activating"}
                  className={`w-full mt-auto py-3.5 rounded-xl font-semibold text-[15px] tracking-wide transition-all duration-200 shadow-sm ${
                    planStatus.status === "activating"
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-[#2dbd77] hover:bg-[#25a566] text-white hover:shadow-md active:scale-[0.99]"
                  }`}
                >
                  {planStatus.status === "none" ? t("buyPlan", lang) : planStatus.status === "activating" ? activatingLabel : t("renewPlan", lang)}
                </button>
              </div>
            </div>
            <div className="flex flex-col h-full">
              <PremiumCard data={workerData.premium} lang={lang} t={t} />
            </div>
          </div>

          {/* ROW 2: Weekly Coverage, Live Weather, Worker Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <WeeklyCoverageCard data={workerData.coverage} lang={lang} t={t} />
            <RainfallStationCard data={workerData.station} lang={lang} t={t} />
            <WorkerZoneCard data={workerData.worker} lang={lang} t={t} />
          </div>

          {/* ROW 3: Payout History — now real Supabase data */}
          <ClaimHistory claims={workerData.allPayouts} lang={lang} t={t} />

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
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-navy-800 rounded"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-navy-800 rounded-xl"></div>
        <div className="h-80 bg-navy-800 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-navy-800 rounded-xl"></div>
        <div className="h-48 bg-navy-800 rounded-xl"></div>
        <div className="h-48 bg-navy-800 rounded-xl"></div>
      </div>
    </div>
  );
}