// components/dashboard/ZoneRiskCard.jsx
import { useState, useEffect } from "react";
import { AlertCircle, TrendingUp, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function getRiskLevel(score) {
  if (score > 0.66) return "HIGH";
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
  const [stationData, setStationData] = useState(null);

  useEffect(() => {
    async function fetchStationRisk() {
      if (!stationId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        // Step 2: Fetch risk from stations table
        const { data, error: fetchError } = await supabase
          .from("stations")
          .select("station_risk, station_name")
          .eq("id", stationId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        
        // Step 3: Handle Errors - If station not found, show unavailable
        if (!data) {
          setError("Risk data unavailable");
        } else {
          setStationData(data);
        }
      } catch (err) {
        console.error("Error fetching station risk:", err);
        setError("Risk data unavailable");
      } finally {
        setLoading(false);
      }
    }
    fetchStationRisk();
  }, [stationId]);

  if (loading) {
    return (
      <div className="glass-card gradient-border rounded-2xl p-6 flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  // Handle Error state (Step 3)
  if (error || !stationData) {
    return (
      <div className="glass-card gradient-border rounded-2xl p-6 flex flex-col items-center justify-center h-48 text-center">
        <AlertCircle className="w-8 h-8 text-slate-500 mb-2" />
        <p className="text-slate-400 text-sm font-medium">{error || "Risk data unavailable"}</p>
        <p className="text-slate-500 text-xs mt-1">Zone: {userZone}</p>
      </div>
    );
  }

  const score = stationData.station_risk;
  const level = getRiskLevel(score);
  const styles = getRiskStyles(level);

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
              <p className="text-slate-400 text-[10px] uppercase tracking-wide leading-none mb-1">{t("yourZone", lang)}</p>
              <p className="text-white font-semibold text-sm leading-tight">{userZone}</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-black/20 ${styles.color}`}>
            {level}
          </span>
        </div>

        {/* Station Name Display (Step 4) */}
        <div className="flex items-center gap-1.5 mb-4 text-slate-400">
          <MapPin className="w-3 h-3" />
          <span className="text-[11px] font-medium truncate">
            {stationData.station_name || "Mapped Station"}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t("riskScore", lang)}</span>
            <span className="text-white font-semibold">{(score || 0).toFixed(2)}</span>
          </div>
          <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${styles.bar} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min((score || 0) * 100, 100)}%` }}
            />
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
