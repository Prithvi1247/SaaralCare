// DayDetailModal.jsx
// Full-screen modal: Rainfall → Calculation → Decision for a single day
import { useEffect, useState, useCallback } from "react";
import { X, CloudRain, Droplets, Clock, Zap, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import TriggerCard from "./TriggerCard";
import RainGraph from "./RainGraph";
import { fetchDayDetail } from "@/lib/DayDetailService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Format ISO date string to display label
function formatDisplayDate(isoDate, lang = "en") {
  if (!isoDate) return "";
  const locale = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  return new Date(isoDate).toLocaleDateString(locale, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// Tier config helpers
const getTierConfig = (t, lang) => ({
  FULL:    { label: t("full_payout", lang),    icon: CheckCircle2,  iconColor: "text-emerald-400", badgeBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" },
  PARTIAL: { label: t("partial_payout", lang), icon: AlertCircle,   iconColor: "text-amber-400",   badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300"       },
  NONE:    { label: t("no_payout", lang),      icon: MinusCircle,   iconColor: "text-slate-500",   badgeBg: "bg-slate-700/30 border-slate-600/40 text-slate-400"        },
});

// Single metric pill used in the summary row
function MetricPill({ icon: Icon, value, unit, label, color = "text-white" }) {
  return (
    <div className="flex flex-col items-center bg-[#0d1424] border border-slate-800 rounded-2xl px-4 py-4 flex-1 min-w-[80px] transition-transform hover:scale-105">
      <Icon className={`w-5 h-5 mb-2 ${color}`} />
      <span className={`font-mono font-bold text-2xl leading-none ${color}`}>{value}</span>
      <span className="text-slate-500 text-[10px] mt-1">{unit}</span>
      <span className="text-slate-400 text-[10px] uppercase tracking-wider mt-1.5 font-semibold">{label}</span>
    </div>
  );
}

// Risk score bar
function RiskBar({ risk, t, lang }) {
  if (!risk) return null;
  const score = risk.risk_score ?? 0;
  const pct = Math.min(score * 100, 100);
  const color = score >= 0.7 ? "from-red-500 to-red-400" : score >= 0.4 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400";

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t("zone_risk_score", lang)}</span>
        <span className="text-white font-mono font-bold text-sm">{score.toFixed(2)} <span className="text-slate-500 font-normal text-xs">/ 1.00</span></span>
      </div>
      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
        <span className={score < 0.4 ? "text-emerald-400" : ""}>{t("low", lang)}</span>
        <span className={score >= 0.4 && score < 0.7 ? "text-amber-400" : ""}>{t("moderate", lang)}</span>
        <span className={score >= 0.7 ? "text-red-400" : ""}>{t("high", lang)}</span>
      </div>
      {(risk.prob_low != null || risk.prob_moderate != null || risk.prob_high != null) && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/50">
          {[
            { k: "prob_low",      l: t("low", lang),      c: "text-emerald-400" },
            { k: "prob_moderate", l: t("moderate", lang),  c: "text-amber-400"   },
            { k: "prob_high",     l: t("high", lang),      c: "text-red-400"     },
          ].map(({ k, l, c }) => (
            <div key={k} className="text-center">
              <div className={`font-mono font-bold text-sm ${c}`}>
                {((risk[k] ?? 0) * 100).toFixed(0)}%
              </div>
              <div className="text-slate-600 text-[10px] uppercase font-medium">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Payout detail block
function PayoutDetail({ payout, tier, t, lang }) {
  const tierCfg = getTierConfig(t, lang)[tier] || getTierConfig(t, lang).NONE;
  const Icon = tierCfg.icon;

  if (!payout) {
    return (
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
        <MinusCircle className="w-6 h-6 text-slate-600 shrink-0" />
        <span className="text-slate-400 text-sm font-medium">{t("no_payout_triggered", lang)}</span>
      </div>
    );
  }

  const locale = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const paidAt = payout.payout_time
    ? new Date(payout.payout_time).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  const statusColors = {
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    processing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    failed:     "bg-red-500/15 text-red-300 border-red-500/30",
  };
  const statusStyle = statusColors[payout.payment_status] || statusColors.processing;

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{t("payout_details", lang)}</span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${statusStyle}`}>
          {t(payout.payment_status || "processing", lang)}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-slate-800/50 ${tierCfg.iconColor}`}>
          <Icon className="w-8 h-8 shrink-0" />
        </div>
        <div>
          <p className="text-white font-black text-3xl font-mono">
            ₹{(payout.payout_amount || 0).toLocaleString("en-IN")}
          </p>
          {paidAt && <p className="text-slate-500 text-xs mt-1 font-medium">{paidAt}</p>}
        </div>
      </div>
    </div>
  );
}

// Empty state for no rainfall
function EmptyState({ t, lang }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-800/40 flex items-center justify-center mb-6 border border-slate-700/30">
        <CloudRain className="w-10 h-10 text-slate-600" />
      </div>
      <p className="text-white font-bold text-xl mb-2">{t("no_rainfall_recorded", lang)}</p>
      <p className="text-slate-500 text-sm max-w-[240px] leading-relaxed">{t("no_rainfall_desc", lang)}</p>
    </div>
  );
}

export default function DayDetailModal({ isOpen, onClose, dayIndex, weekDates = [], stationId, workerId, zoneId, lang = "en", t = (k) => k }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Derive the ISO date string for the selected day
  const selectedDate = weekDates[dayIndex] ?? null;

  const loadDetail = useCallback(async () => {
    if (!selectedDate || !stationId || !workerId) return;
    setLoading(true);
    setErr("");
    try {
      const data = await fetchDayDetail({ date: selectedDate, stationId, workerId, zoneId });
      setDetail(data);
    } catch (e) {
      setErr(e.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, stationId, workerId, zoneId]);

  useEffect(() => {
    if (isOpen && selectedDate) loadDetail();
  }, [isOpen, selectedDate, loadDetail]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tierCfg = detail ? (getTierConfig(t, lang)[detail.payoutTier] || getTierConfig(t, lang).NONE) : null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 transition-all duration-300"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Container */}
      <div
        className="relative w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto sm:rounded-[32px] border-t sm:border border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200"
        style={{ backgroundColor: "#070b14", scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
      >
        {/* Sticky header */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between px-6 sm:px-8 pt-8 pb-6 border-b border-slate-800/60"
          style={{ backgroundColor: "#070b14" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#5fa8d3] text-[10px] font-bold uppercase tracking-[0.2em]">
                {dayIndex !== null ? DAYS[dayIndex] : ""}
              </span>
              {detail && tierCfg && (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${tierCfg.badgeBg}`}>
                  {tierCfg.label}
                </span>
              )}
            </div>
            <h2 className="text-white font-black text-2xl leading-tight tracking-tight">
              {selectedDate ? formatDisplayDate(selectedDate, lang) : "Day Detail"}
            </h2>
            {detail?.zone && (
              <p className="text-slate-500 text-xs mt-1.5 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rain-500"></span>
                {detail.zone.zone_name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800/50 hover:bg-slate-700 flex items-center justify-center transition-all shrink-0 ml-4 active:scale-90 border border-slate-700/50"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 pb-10 space-y-6 pt-6">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#5fa8d3] border-t-transparent animate-spin" />
              <p className="text-slate-500 text-sm font-medium tracking-wide">{t("loading_rainfall", lang)}</p>
            </div>
          )}

          {/* Error */}
          {!loading && err && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 text-red-400 text-sm text-center font-medium">
              {err}
            </div>
          )}

          {/* No data */}
          {!loading && !err && detail && !detail.hasData && <EmptyState t={t} lang={lang} />}

          {/* Main content */}
          {!loading && !err && detail && detail.hasData && (
            <>
              {/* Explanation Section */}
              <div className="bg-rain-500/5 border border-rain-500/20 rounded-2xl p-4">
                <p className="text-rain-200 text-xs leading-relaxed font-medium">
                  {t("rainfall_explanation", lang)}
                </p>
              </div>

              {/* Core metrics row */}
              <div className="flex gap-3 sm:gap-4">
                <MetricPill icon={Droplets} value={detail.avgIntensity.toFixed(1)} unit="mm/hr"  label={t("intensity", lang)} color="text-[#5fa8d3]" />
                <MetricPill icon={Clock}    value={detail.totalDuration.toFixed(1)} unit="hrs"    label={t("duration", lang)}  color="text-purple-400" />
                <MetricPill icon={Zap}      value={detail.trigger.toFixed(1)}       unit="score"  label={t("trigger", lang)}   color={tierCfg?.iconColor ?? "text-white"} />
              </div>

              {/* Trigger calculation card (hero element) */}
              <TriggerCard
                intensity={detail.avgIntensity.toFixed(2)}
                duration={detail.totalDuration.toFixed(2)}
                trigger={detail.trigger.toFixed(2)}
                tier={detail.payoutTier}
                lang={lang}
                t={t}
              />

              {/* Hourly rain graph */}
              <div className="bg-[#0d1424] border border-slate-800 rounded-[24px] p-6">
                <RainGraph chartData={detail.chartData} peakMm={detail.peakMm} lang={lang} t={t} />
              </div>

              {/* Payout details */}
              <PayoutDetail payout={detail.payout} tier={detail.payoutTier} t={t} lang={lang} />

              {/* Risk score */}
              <RiskBar risk={detail.risk} t={t} lang={lang} />

              {/* Raw totals footer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{t("total_rainfall", lang)}</p>
                  <p className="text-white font-mono font-black text-2xl">{detail.totalRainfall.toFixed(1)} <span className="text-slate-500 text-xs font-normal">mm</span></p>
                </div>
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 font-bold">{t("events_recorded", lang)}</p>
                  <p className="text-white font-mono font-black text-2xl">{detail.events.length} <span className="text-slate-500 text-xs font-normal">{t("readings", lang)}</span></p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
