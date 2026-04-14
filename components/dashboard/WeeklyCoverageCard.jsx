import { useState, useEffect } from "react";
import { ShieldCheck, CalendarDays, X, CloudRain, Info, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import DayDetailModal from "./DayDetailModal";

export default function WeeklyCoverageCard({ data = {}, lang = "en", t = (k) => k, workerId, stationId, zoneId }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show last 7 days ending TODAY
  const today = new Date();
  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    weekDates.push(d);
  }

  const {
    coverageStatus = "active",
    payouts = [],
    totalPayout = 0,
    maxPayout = 1125,
    nextRenewal = "",
  } = data;

  const getDateKey = (date) => date.toISOString().split("T")[0];
  
  const payoutByDate = Object.fromEntries(
    payouts.map((p) => [getDateKey(new Date(p.payout_time)), p])
  );

  const progressPct = maxPayout > 0 ? Math.min((totalPayout / maxPayout) * 100, 100) : 0;

  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
    setIsModalOpen(true);
  };

  const locale = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-IN";

  return (
    <div className="glass-card gradient-border rounded-2xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-2">
            {t("weeklyCoverage", lang)}
          </p>
          <h3 className="font-display text-2xl font-bold text-white">
            {weekDates[0].toLocaleDateString(locale, { day: "numeric", month: "short" })} – {today.toLocaleDateString(locale, { day: "numeric", month: "short" })}
          </h3>
          <p className="text-slate-500 text-xs mt-2 font-medium">
            {t("tap_day_instruction", lang)}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-tight">{t("covered", lang)}</span>
        </div>
      </div>

      {/* Day indicators */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-8">
        {weekDates.map((date, i) => {
          const dateKey = getDateKey(date);
          const payout = payoutByDate[dateKey];
          const isRainDay = !!payout;
          const isToday = i === 6;
          const isSelected = selectedDayIndex === i;
          const dayLabel = date.toLocaleDateString(locale, { weekday: "short" });

          return (
            <div key={dateKey} className="flex flex-col items-center gap-2">
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tighter ${isToday ? "text-rain-400" : "text-slate-400"}`}>
                {dayLabel}
              </span>
              <button
                onClick={() => handleDayClick(i)}
                title={t("view_details_instruction", lang)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg relative group ${
                  isSelected
                    ? "ring-2 ring-rain-400 ring-offset-2 ring-offset-[#090b14] scale-105 bg-rain-500/30 border-rain-400/50"
                    : isRainDay
                    ? "bg-rain-500/20 border border-rain-500/30 hover:bg-rain-500/30"
                    : "bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60"
                }`}
              >
                {isRainDay ? (
                  <CloudRain className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? "text-rain-300" : "text-rain-400"}`} />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-rain-400/50" : "bg-slate-600"}`} />
                )}
                
                {/* Glow effect for selected or rain day */}
                {(isSelected || isRainDay) && (
                  <div className="absolute inset-0 rounded-xl bg-rain-400/10 blur-md -z-10 group-hover:bg-rain-400/20 transition-colors" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress & Stats */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-3">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{t("weekPayout", lang)}</span>
              <span className="text-white text-3xl font-black font-mono">₹{totalPayout.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Limit</span>
              <span className="text-slate-300 text-sm font-bold font-mono">₹{maxPayout.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-rain-600 via-rain-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400">
            <CalendarDays className="w-4 h-4" />
            <span className="text-xs font-medium">
              {t("renewsOn", lang)} <span className="text-white font-bold">{nextRenewal || "Next Monday"}</span>
            </span>
          </div>
          <div className="bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/30">
            <span className="text-rain-400 text-xs font-bold">
              {payouts.length} {payouts.length === 1 ? t("rainDaysThisWeek", lang) : t("rainDaysThisWeekPlural", lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      <DayDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayIndex={selectedDayIndex}
        weekDates={weekDates}
        stationId={stationId}
        workerId={workerId}
        zoneId={zoneId}
        lang={lang}
        t={t}
      />
    </div>
  );
}
