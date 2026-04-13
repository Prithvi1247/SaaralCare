// DayDetailModal.jsx
// Full-screen modal: Rainfall → Calculation → Decision for a single day
import { useEffect, useState, useCallback } from "react";
import { X, CloudRain, Droplets, Clock, Zap, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import TriggerCard from "./TriggerCard";
import RainGraph from "./RainGraph";
import { fetchDayDetail } from "@/lib/DayDetailService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Format ISO date string to display label
function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// Tier config helpers
const TIER_CONFIG = {
  FULL:    { label: "Full Payout",    icon: CheckCircle2,  iconColor: "text-emerald-400", badgeBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" },
  PARTIAL: { label: "Partial Payout", icon: AlertCircle,   iconColor: "text-amber-400",   badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300"       },
  NONE:    { label: "No Payout",      icon: MinusCircle,   iconColor: "text-slate-500",   badgeBg: "bg-slate-700/30 border-slate-600/40 text-slate-400"        },
};

// Single metric pill used in the summary row
function MetricPill({ icon: Icon, value, unit, label, color = "text-white" }) {
  return (
    <div className="flex flex-col items-center bg-[#0d1424] border border-slate-800 rounded-2xl px-4 py-3 flex-1 min-w-[80px]">
      <Icon className={`w-4 h-4 mb-1.5 ${color}`} />
      <span className={`font-mono font-bold text-xl leading-none ${color}`}>{value}</span>
      <span className="text-slate-500 text-[10px] mt-0.5">{unit}</span>
      <span className="text-slate-600 text-[10px] uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

// Risk score bar
function RiskBar({ risk }) {
  if (!risk) return null;
  const score = risk.risk_score ?? 0;
  const pct = Math.min(score * 100, 100);
  const label = score >= 0.7 ? "High" : score >= 0.4 ? "Moderate" : "Low";
  const color = score >= 0.7 ? "from-red-500 to-red-400" : score >= 0.4 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400";

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Zone Risk Score</span>
        <span className="text-white font-mono font-bold text-sm">{score.toFixed(2)} <span className="text-slate-500 font-normal text-xs">/ 1.00</span></span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600">
        <span className={score < 0.4 ? "text-emerald-400 font-semibold" : ""}>Low</span>
        <span className={score >= 0.4 && score < 0.7 ? "text-amber-400 font-semibold" : ""}>Moderate</span>
        <span className={score >= 0.7 ? "text-red-400 font-semibold" : ""}>High</span>
      </div>
      {(risk.prob_low != null || risk.prob_moderate != null || risk.prob_high != null) && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { k: "prob_low",      l: "Low",      c: "text-emerald-400" },
            { k: "prob_moderate", l: "Moderate",  c: "text-amber-400"   },
            { k: "prob_high",     l: "High",      c: "text-red-400"     },
          ].map(({ k, l, c }) => (
            <div key={k} className="text-center">
              <div className={`font-mono font-bold text-sm ${c}`}>
                {((risk[k] ?? 0) * 100).toFixed(0)}%
              </div>
              <div className="text-slate-600 text-[10px]">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Payout detail block
function PayoutDetail({ payout, tier }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.NONE;
  const Icon = cfg.icon;

  if (!payout) {
    return (
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <MinusCircle className="w-5 h-5 text-slate-600 shrink-0" />
        <span className="text-slate-500 text-sm">No payout triggered for this day.</span>
      </div>
    );
  }

  const paidAt = payout.payout_time
    ? new Date(payout.payout_time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  const statusColors = {
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    processing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    failed:     "bg-red-500/15 text-red-300 border-red-500/30",
  };
  const statusStyle = statusColors[payout.payment_status] || statusColors.processing;

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Payout Details</span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusStyle}`}>
          {payout.payment_status || "processing"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 shrink-0 ${cfg.iconColor}`} />
        <div>
          <p className="text-white font-bold text-2xl font-mono">
            ₹{(payout.payout_amount || 0).toLocaleString("en-IN")}
          </p>
          {paidAt && <p className="text-slate-500 text-xs mt-0.5">{paidAt}</p>}
        </div>
      </div>
    </div>
  );
}

// Empty state for no rainfall
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-4">
        <CloudRain className="w-7 h-7 text-slate-600" />
      </div>
      <p className="text-slate-300 font-semibold text-base mb-1">No Rainfall Recorded</p>
      <p className="text-slate-600 text-sm">No rainfall events were logged for this day at your station.</p>
    </div>
  );
}

export default function DayDetailModal({ isOpen, onClose, dayIndex, weekDates = [], stationId, workerId, zoneId }) {
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

  const tierCfg = detail ? (TIER_CONFIG[detail.payoutTier] || TIER_CONFIG.NONE) : null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 shadow-2xl"
        style={{ backgroundColor: "#0a0f1e", scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
      >
        {/* Sticky header */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-800/60"
          style={{ backgroundColor: "#0a0f1e" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#5fa8d3] text-xs font-semibold uppercase tracking-widest">
                {dayIndex !== null ? DAYS[dayIndex] : ""}
              </span>
              {detail && tierCfg && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${tierCfg.badgeBg}`}>
                  {tierCfg.label}
                </span>
              )}
            </div>
            <h2 className="text-white font-bold text-lg leading-tight">
              {selectedDate ? formatDisplayDate(selectedDate) : "Day Detail"}
            </h2>
            {detail?.zone && (
              <p className="text-slate-500 text-xs mt-0.5">📍 {detail.zone.zone_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0 ml-4 mt-1"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4 pt-4">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#5fa8d3] border-t-transparent animate-spin" />
              <p className="text-slate-500 text-sm">Loading rainfall data…</p>
            </div>
          )}

          {/* Error */}
          {!loading && err && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm text-center">
              {err}
            </div>
          )}

          {/* No data */}
          {!loading && !err && detail && !detail.hasData && <EmptyState />}

          {/* Main content */}
          {!loading && !err && detail && detail.hasData && (
            <>
              {/* Core metrics row */}
              <div className="flex gap-3">
                <MetricPill icon={Droplets} value={detail.avgIntensity.toFixed(1)} unit="mm/hr"  label="Intensity" color="text-[#5fa8d3]" />
                <MetricPill icon={Clock}    value={detail.totalDuration.toFixed(1)} unit="hrs"    label="Duration"  color="text-purple-400" />
                <MetricPill icon={Zap}      value={detail.trigger.toFixed(1)}       unit="score"  label="Trigger"   color={tierCfg?.iconColor ?? "text-white"} />
              </div>

              {/* One-liner summary */}
              <div className="text-center text-slate-400 text-sm py-1">
                <span className="text-[#5fa8d3] font-mono font-semibold">{detail.avgIntensity.toFixed(1)} mm/hr</span>
                {" · "}
                <span className="text-purple-400 font-mono font-semibold">{detail.totalDuration.toFixed(1)} hrs</span>
                {" · Trigger "}
                <span className={`font-mono font-bold ${tierCfg?.iconColor ?? "text-white"}`}>{detail.trigger.toFixed(1)}</span>
                {" → "}
                <span className={`font-semibold ${tierCfg?.iconColor ?? "text-white"}`}>{tierCfg?.label}</span>
              </div>

              {/* Trigger calculation card (hero element) */}
              <TriggerCard
                intensity={detail.avgIntensity.toFixed(2)}
                duration={detail.totalDuration.toFixed(2)}
                trigger={detail.trigger.toFixed(2)}
                tier={detail.payoutTier}
              />

              {/* Hourly rain graph */}
              <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4">
                <RainGraph chartData={detail.chartData} peakMm={detail.peakMm} />
              </div>

              {/* Payout details */}
              <PayoutDetail payout={detail.payout} tier={detail.payoutTier} />

              {/* Risk score */}
              <RiskBar risk={detail.risk} />

              {/* Raw totals footer */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-3 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Total Rainfall</p>
                  <p className="text-white font-mono font-bold text-lg">{detail.totalRainfall.toFixed(1)} <span className="text-slate-500 text-xs font-normal">mm</span></p>
                </div>
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-3 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Events Recorded</p>
                  <p className="text-white font-mono font-bold text-lg">{detail.events.length} <span className="text-slate-500 text-xs font-normal">readings</span></p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}