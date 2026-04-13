// components/dashboard/ZoneRiskCard.jsx
import { useState, useEffect } from "react";
import { AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function getRiskLevel(score) {
  if (score >= 0.67) return "HIGH";
  if (score >= 0.34) return "MODERATE";
  return "LOW";
}

function getRiskStyles(level) {
  switch (level) {
    case "HIGH":
      return { icon: "🔴", color: "text-red-400", bg: "bg-red-500/15", bar: "bg-red-500" };
    case "MODERATE":
      return { icon: "🟠", color: "text-amber-400", bg: "bg-amber-500/15", bar: "bg-amber-500" };
    case "LOW":
      return { icon: "🟢", color: "text-emerald-400", bg: "bg-emerald-500/15", bar: "bg-emerald-500" };
    default:
      return { icon: "❓", color: "text-slate-400", bg: "bg-slate-500/15", bar: "bg-slate-500" };
  }
}

export default function ZoneRiskCard({ userZone = "—", stationId = null, lang = "en", t = (k) => k }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    async function fetchRisk() {
      if (!stationId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("risk_score")
          .select("risk_score, prob_low, prob_moderate, prob_high")
          .eq("station", stationId) // Assuming 'station' column stores the station_id/name
          .maybeSingle();

        if (fetchError) throw fetchError;
        setRiskData(data);
      } catch (err) {
        console.error("Error fetching risk score:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRisk();
  }, [stationId]);

  if (loading) {
    return (
      <div className="glass-card gradient-border rounded-2xl p-6 flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  const score = riskData?.risk_score ?? 0;
  const level = getRiskLevel(score);
  const styles = getRiskStyles(level);
  const probLow = Math.round((riskData?.prob_low ?? 0) * 100);
  const probMod = Math.round((riskData?.prob_moderate ?? 0) * 100);
  const probHigh = Math.round((riskData?.prob_high ?? 0) * 100);

  return (
    <div className="glass-card gradient-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            {t("zoneAnalysis", lang)}
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            {t("yourZoneRisk", lang)}
          </h3>
        </div>
        <TrendingUp className="w-4 h-4 text-slate-500" />
      </div>

      <div className={`rounded-xl p-4 mb-5 ${styles.bg} border border-slate-700/30`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{styles.icon}</span>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide">{t("yourZone", lang)}</p>
              <p className="text-white font-semibold text-sm">{userZone}</p>
            </div>
          </div>
          <span className={`text-xs font-bold ${styles.color}`}>
            {level}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t("riskScore", lang)}</span>
            <span className="text-white font-semibold">{score.toFixed(2)}</span>
          </div>
          <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${styles.bar} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(score * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">
          Probability Breakdown
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-navy-800/40 rounded-lg p-2 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase">Low</p>
            <p className="text-sm font-semibold text-emerald-400">{probLow}%</p>
          </div>
          <div className="bg-navy-800/40 rounded-lg p-2 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase">Mod</p>
            <p className="text-sm font-semibold text-amber-400">{probMod}%</p>
          </div>
          <div className="bg-navy-800/40 rounded-lg p-2 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase">High</p>
            <p className="text-sm font-semibold text-red-400">{probHigh}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-navy-700/50 flex items-start gap-2 text-xs text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
        <span>
          {t("premiumBasis", lang)}
        </span>
      </div>
    </div>
  );
}
