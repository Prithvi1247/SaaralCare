// components/dashboard/RainfallStationCard.jsx
import { CloudRain, Radio, TrendingUp, AlertCircle } from "lucide-react";

export default function RainfallStationCard({ data = {} }) {
  const {
    stationId = "IMD_MUM_001",
    stationName = "Santacruz Observatory",
    distance = "2.3 km",
    lastReading = 22.4,
    threshold = 15,
    updatedAt = "2 min ago",
    trend = "rising", // "rising" | "falling" | "stable"
    alertActive = false,
  } = data;

  const exceedsThreshold = lastReading >= threshold;
  const rainLevel =
    lastReading >= 30 ? "Heavy" : lastReading >= 15 ? "Moderate" : lastReading >= 5 ? "Light" : "Trace";

  const rainColor =
    lastReading >= 30
      ? "text-red-400"
      : lastReading >= 15
      ? "text-amber-400"
      : lastReading >= 5
      ? "text-rain-400"
      : "text-slate-400";

  const trendIcon = trend === "rising" ? "↑" : trend === "falling" ? "↓" : "→";
  const trendColor =
    trend === "rising"
      ? "text-red-400"
      : trend === "falling"
      ? "text-emerald-400"
      : "text-slate-400";

  // Progress bar width (0–50mm scale)
  const barWidth = Math.min((lastReading / 50) * 100, 100);

  return (
    <div className="glass-card gradient-border rounded-2xl p-6 h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            Mapped Station
          </p>
          <h3 className="font-display text-lg font-semibold text-white leading-tight">
            {stationName}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {stationId} · {distance} away
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rain-500/15 flex items-center justify-center">
          <Radio className="w-5 h-5 text-rain-400" />
        </div>
      </div>

      {/* Alert banner */}
      {alertActive && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2.5 mb-5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-xs font-medium">
            Coverage activated — payout processing
          </p>
        </div>
      )}

      {/* Rainfall reading */}
      <div className="bg-navy-800/60 rounded-xl px-4 py-4 mb-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-slate-400 text-xs mb-1">Rainfall (last 3hr)</p>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-display text-4xl font-bold ${rainColor}`}>
                {lastReading}
              </span>
              <span className="text-slate-400 text-sm">mm</span>
              <span className={`text-sm font-medium ml-1 ${trendColor}`}>
                {trendIcon}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                exceedsThreshold
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-slate-500/15 text-slate-400"
              }`}
            >
              {rainLevel}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${barWidth}%`,
              background:
                lastReading >= 30
                  ? "#ef4444"
                  : lastReading >= 15
                  ? "#f59e0b"
                  : "#3a9fd4",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1.5">
          <span>0mm</span>
          <span className="text-slate-400">Threshold: {threshold}mm</span>
          <span>50mm+</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <CloudRain className="w-3.5 h-3.5" />
          Updated {updatedAt}
        </div>
        <div
          className={`flex items-center gap-1.5 font-medium ${
            exceedsThreshold ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {exceedsThreshold ? "Above threshold" : "Below threshold"}
        </div>
      </div>
    </div>
  );
}
