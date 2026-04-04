import { Radio, AlertCircle, MapPin } from "lucide-react";

export default function RainfallStationCard({ data = {}, lang = "en", t = () => "" }) {
  const {
    deliveryZone = "—", // If this shows "—", the worker.zone in Supabase is empty
    yesterdayRainfall = 0,
    stationId = "—",
    stationName = "Mapped Station",
    distance = "—",
    threshold = 15,
    updatedAt = "—",
    alertActive = false,
  } = data;

  // Dynamic styling based on yesterday's rainfall severity
  const rainColor = yesterdayRainfall >= 30 ? "text-red-400" : yesterdayRainfall >= 15 ? "text-amber-400" : "text-[#5fa8d3]";
  const rainLevel = yesterdayRainfall >= 30 ? "Heavy" : yesterdayRainfall >= 15 ? "Moderate" : "Light";
  const badgeBg = yesterdayRainfall >= 30 ? "bg-red-500/15 text-red-400" : yesterdayRainfall >= 15 ? "bg-amber-500/15 text-amber-400" : "bg-slate-800/80 text-slate-300";
  
  const barWidth = Math.min((yesterdayRainfall / 50) * 100, 100);

  return (
    <div className="bg-[#12182b] border border-[#1e293b] shadow-lg rounded-2xl p-6 h-full flex flex-col">
      
      {/* ── Top Section: Delivery Zone & Station ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
              Delivery Zone
            </p>
            <h3 className="font-display text-xl font-bold text-white leading-tight">
              {deliveryZone}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1e293b]/50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#5fa8d3]" />
          </div>
        </div>
        
        <div className="pt-4 border-t border-[#1e293b]/60">
          <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
            {t("mappedStation", lang)}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-[15px] font-semibold text-slate-200 leading-tight">
              {stationName}
            </h3>
            <Radio className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-slate-500 text-xs">
            {stationId} {distance !== "—" && `· ${distance} away`}
          </p>
        </div>
      </div>

      {/* ── Alert Banner ── */}
      {alertActive && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5 mb-5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-xs font-medium">
            Coverage activated — payout processing
          </p>
        </div>
      )}

      {/* ── Main Data Box (Yesterday's Rainfall) ── */}
      <div className="bg-[#0f1423] rounded-xl px-5 py-5 mb-4 border border-[#1e293b]/80">
        <p className="text-slate-400 text-xs mb-3">Yesterday's Rainfall</p>
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-5xl font-bold ${rainColor} font-serif tracking-tight`}>
              {yesterdayRainfall}
            </span>
            <span className="text-slate-400 text-sm font-medium">mm</span>
          </div>
          <span className={`text-xs font-medium px-3.5 py-1.5 rounded-full ${badgeBg}`}>
            {rainLevel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${barWidth}%`,
              background: yesterdayRainfall >= 30 ? "#ef4444" : yesterdayRainfall >= 15 ? "#f59e0b" : "#5fa8d3",
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>0mm</span>
          <span className="text-slate-400">{t("threshold", lang)}: {threshold}mm</span>
          <span>50mm+</span>
        </div>
      </div>

      {/* ── Timestamp ── */}
      <div className="mt-auto">
        <p className="text-slate-500 text-xs">{t("updated", lang)} {updatedAt}</p>
      </div>
    </div>
  );
}