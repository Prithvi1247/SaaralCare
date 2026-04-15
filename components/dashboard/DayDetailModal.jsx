import { useEffect, useState, useCallback } from "react";
import { X, CloudRain, Droplets, Clock, Zap, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import TriggerCard from "@/components/dashboard/TriggerCard";
import RainGraph from "@/components/dashboard/RainGraph";
import { fetchDayDetail } from "@/lib/DayDetailService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIER_CFG = {
  FULL:    { label: "Full Payout",    icon: CheckCircle2, iconColor: "text-emerald-400", badge: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" },
  PARTIAL: { label: "Partial Payout", icon: AlertCircle,  iconColor: "text-amber-400",   badge: "bg-amber-500/15 border-amber-500/40 text-amber-300"       },
  NONE:    { label: "No Payout",      icon: MinusCircle,  iconColor: "text-slate-500",   badge: "bg-slate-700/30 border-slate-600/40 text-slate-400"        },
};

function formatDate(isoDate) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function MetricPill({ icon: Icon, value, unit, label, color }) {
  return (
    <div className="flex flex-col items-center bg-[#0d1424] border border-slate-800 rounded-2xl px-4 py-4 flex-1">
      <Icon className={`w-5 h-5 mb-2 ${color}`} />
      <span className={`font-mono font-black text-2xl leading-none ${color}`}>{value}</span>
      <span className="text-slate-500 text-[10px] mt-1">{unit}</span>
      <span className="text-slate-500 text-[10px] uppercase tracking-wider mt-1 font-semibold">{label}</span>
    </div>
  );
}

function PayoutDetail({ payout, tier }) {
  const cfg = TIER_CFG[tier] || TIER_CFG.NONE;
  const Icon = cfg.icon;

  if (!payout) {
    return (
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 flex items-center gap-3">
        <MinusCircle className="w-5 h-5 text-slate-600 shrink-0" />
        <span className="text-slate-400 text-sm">No payout triggered for this day.</span>
      </div>
    );
  }

  const paidAt = payout.payout_time
    ? new Date(payout.payout_time).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  const statusCls = {
    completed:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    processing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    failed:     "bg-red-500/15 text-red-300 border-red-500/30",
  }[payout.payment_status] || "bg-amber-500/15 text-amber-300 border-amber-500/30";

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Payout Details</span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${statusCls}`}>
          {payout.payment_status || "processing"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-slate-800/50">
          <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
        </div>
        <div>
          <p className="text-white font-black text-3xl font-mono">
            ₹{(payout.payout_amount || 0).toLocaleString("en-IN")}
          </p>
          {paidAt && <p className="text-slate-500 text-xs mt-1">{paidAt}</p>}
        </div>
      </div>
    </div>
  );
}

function RiskBar({ risk }) {
  if (!risk) return null;
  const score = risk.risk_score ?? 0;
  const pct = Math.min(score * 100, 100);
  const barColor = score >= 0.7 ? "from-red-500 to-red-400" : score >= 0.4 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400";

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Zone Risk Score</span>
        <span className="text-white font-mono font-bold">{score.toFixed(2)} <span className="text-slate-500 text-xs">/ 1.00</span></span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
        <div className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] font-bold uppercase text-slate-600">
        <span className={score < 0.4 ? "text-emerald-400" : ""}>Low</span>
        <span className={score >= 0.4 && score < 0.7 ? "text-amber-400" : ""}>Moderate</span>
        <span className={score >= 0.7 ? "text-red-400" : ""}>High</span>
      </div>
      {(risk.prob_low != null || risk.prob_moderate != null || risk.prob_high != null) && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/50">
          {[
            { k: "prob_low",      l: "Low",      c: "text-emerald-400" },
            { k: "prob_moderate", l: "Moderate",  c: "text-amber-400"   },
            { k: "prob_high",     l: "High",      c: "text-red-400"     },
          ].map(({ k, l, c }) => (
            <div key={k} className="text-center">
              <div className={`font-mono font-bold text-sm ${c}`}>{((risk[k] ?? 0) * 100).toFixed(0)}%</div>
              <div className="text-slate-600 text-[10px] uppercase">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-800/40 border border-slate-700/30 flex items-center justify-center mb-5">
        <CloudRain className="w-9 h-9 text-slate-600" />
      </div>
      <p className="text-white font-bold text-lg mb-2">No Rainfall Recorded</p>
      <p className="text-slate-500 text-sm max-w-[220px] leading-relaxed">
        No rainfall readings were logged for this day at your station.
      </p>
    </div>
  );
}

export default function DayDetailModal({ isOpen, onClose, dayIndex, weekDates = [], stationId, workerId, zoneId }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const selectedDate = weekDates[dayIndex] ?? null;

  const load = useCallback(async () => {
    if (!selectedDate || !stationId || !workerId) return;
    setLoading(true);
    setErr("");
    setDetail(null);
    try {
      const data = await fetchDayDetail({ date: selectedDate, stationId, workerId, zoneId });
      setDetail(data);
    } catch (e) {
      setErr(e.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, stationId, workerId, zoneId]);

  useEffect(() => { if (isOpen) load(); }, [isOpen, load]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tier = detail?.payoutTier ?? "NONE";
  const cfg = TIER_CFG[tier];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] border border-b-0 sm:border-b border-slate-800 shadow-2xl flex flex-col"
        style={{ backgroundColor: "#070c18", scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-7 pt-7 pb-5 border-b border-slate-800/60 flex items-start justify-between"
          style={{ backgroundColor: "#070c18" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[#5fa8d3] text-[10px] font-black uppercase tracking-[0.2em]">
                {dayIndex !== null ? DAYS[dayIndex] : ""}
              </span>
              {detail && (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${cfg.badge}`}>
                  {cfg.label}
                </span>
              )}
            </div>
            <h2 className="text-white font-black text-xl leading-tight">
              {selectedDate ? formatDate(selectedDate) : "Day Detail"}
            </h2>
            {detail?.zone && (
              <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5fa8d3] inline-block" />
                {detail.zone.zone_name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/50 flex items-center justify-center transition-all active:scale-90 shrink-0 ml-4"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pt-6 pb-10 space-y-5 flex-1">

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-9 h-9 rounded-full border-2 border-[#5fa8d3] border-t-transparent animate-spin" />
              <p className="text-slate-500 text-sm font-medium">Loading rainfall data…</p>
            </div>
          )}

          {!loading && err && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 text-red-400 text-sm text-center">
              {err}
            </div>
          )}

          {/* Empty state: ONLY when events.length === 0 */}
          {!loading && !err && detail && !detail.hasData && <EmptyState />}

          {/* Full UI: shown for ANY day that has DB rows, even if all values are 0 */}
          {!loading && !err && detail && detail.hasData && (
            <>
              <div className="flex gap-3">
                <MetricPill icon={Droplets} value={detail.avgIntensity.toFixed(1)} unit="mm/hr" label="Intensity" color="text-[#5fa8d3]" />
                <MetricPill icon={Clock}    value={detail.totalDuration.toFixed(1)} unit="hrs"   label="Duration"  color="text-purple-400" />
                <MetricPill icon={Zap}      value={detail.trigger.toFixed(1)}       unit="score" label="Trigger"   color={cfg.iconColor} />
              </div>

              <TriggerCard
                intensity={detail.avgIntensity.toFixed(2)}
                duration={detail.totalDuration.toFixed(2)}
                trigger={detail.trigger.toFixed(2)}
                tier={detail.payoutTier}
              />

              {detail.chartData.length > 0 && (
                <div className="bg-[#0d1424] border border-slate-800 rounded-[24px] p-5">
                  <RainGraph chartData={detail.chartData} peakMm={detail.peakMm} />
                </div>
              )}

              <PayoutDetail payout={detail.payout} tier={detail.payoutTier} />

              <RiskBar risk={detail.risk} />

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1.5 font-bold">Total Rainfall</p>
                  <p className="text-white font-mono font-black text-2xl">
                    {detail.totalRainfall.toFixed(1)}<span className="text-slate-500 text-xs font-normal ml-1">mm</span>
                  </p>
                </div>
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1.5 font-bold">Readings</p>
                  <p className="text-white font-mono font-black text-2xl">
                    {detail.events.length}<span className="text-slate-500 text-xs font-normal ml-1">events</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}