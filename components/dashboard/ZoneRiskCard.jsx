// components/dashboard/ZoneRiskCard.jsx
// NEW: Zone Risk Card to show user's zone risk and nearby zones

import { AlertCircle, TrendingUp } from "lucide-react";

function getRiskBadge(label) {
  if (!label) return { icon: "❓", color: "text-slate-400", bg: "bg-slate-500/15" };
  const l = label.toLowerCase();
  if (l.includes("high")) return { icon: "🔴", color: "text-red-400", bg: "bg-red-500/15" };
  if (l.includes("moderate")) return { icon: "🟠", color: "text-amber-400", bg: "bg-amber-500/15" };
  if (l.includes("low")) return { icon: "🟢", color: "text-emerald-400", bg: "bg-emerald-500/15" };
  return { icon: "❓", color: "text-slate-400", bg: "bg-slate-500/15" };
}

function getRiskBarColor(score) {
  if (score >= 0.7) return "bg-red-500";
  if (score >= 0.4) return "bg-amber-500";
  return "bg-emerald-500";
}

export default function ZoneRiskCard({ userZone = "—", riskLevel = "—", riskScore = 0, nearbyZones = [], lang = "en", t = () => "" }) {
  const userBadge = getRiskBadge(riskLevel);
  
  return (
    <div className="glass-card gradient-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            Zone Analysis
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            Your Zone Risk
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-slate-500" />
      </div>

      {/* Your Zone - Primary */}
      <div className={`rounded-xl p-4 mb-5 ${userBadge.bg} border border-slate-700/30`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{userBadge.icon}</span>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide">Your Zone</p>
              <p className="text-white font-semibold text-sm">{userZone}</p>
            </div>
          </div>
          <span className={`text-xs font-bold ${userBadge.color}`}>
            {riskLevel}
          </span>
        </div>

        {/* Risk Score Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Risk Score</span>
            <span className="text-white font-semibold">{(riskScore || 0).toFixed(2)}</span>
          </div>
          <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${getRiskBarColor(riskScore)} rounded-full transition-all`}
              style={{ width: `${Math.min((riskScore || 0) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Nearby Zones */}
      {nearbyZones && nearbyZones.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">
            Nearby Zones
          </p>
          <div className="space-y-2">
            {nearbyZones.slice(0, 3).map((zone, i) => {
              const badge = getRiskBadge(zone.riskLevel);
              return (
                <div key={i} className="flex items-center justify-between text-sm py-2 px-2 rounded-lg hover:bg-navy-800/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{badge.icon}</span>
                    <span className="text-slate-300">{zone.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${badge.color}`}>
                    {zone.riskLevel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-navy-700/50 flex items-start gap-2 text-xs text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
        <span>
          Your premium is based on this zone's rainfall risk and seasonal patterns.
        </span>
      </div>
    </div>
  );
}
