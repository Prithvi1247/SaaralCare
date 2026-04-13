// components/dashboard/WeeklyCoverageCard.jsx
import { useState } from "react";
import { ShieldCheck, CalendarDays, X, CloudRain, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function WeeklyCoverageCard({ data = {}, lang = "en", t = () => "" }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // PART 1: FIX WEEKLY COVERAGE DATE LOGIC
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

  // Helper to get date string key for mapping
  const getDateKey = (date) => date.toISOString().split("T")[0];
  
  // Map payouts to date keys
  const payoutByDate = Object.fromEntries(
    payouts.map((p) => [getDateKey(new Date(p.payout_time)), p])
  );

  const progressPct = maxPayout > 0 ? Math.min((totalPayout / maxPayout) * 100, 100) : 0;

  const handleDayClick = async (date) => {
    const dateKey = getDateKey(date);
    setSelectedDay(date);
    setLoadingModal(true);
    setModalData(null);

    try {
      // PART 3: USE CORRECT DATA SOURCE - Fetch from rainfall_history
      const { data: rainfall, error } = await supabase
        .from("rainfall_history")
        .select("*")
        .eq("recorded_at", dateKey)
        .maybeSingle();

      if (error) throw error;

      const payout = payoutByDate[dateKey];
      
      setModalData({
        rainfall: rainfall || { rainfall_mm: 0, rainfall_duration: 0 },
        payout: payout || null
      });
    } catch (err) {
      console.error("Error fetching day details:", err);
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <div className="glass-card gradient-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            {t("weeklyCoverage", lang)}
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            {weekDates[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {today.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">{t("covered", lang)}</span>
        </div>
      </div>

      {/* Day indicators */}
      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {weekDates.map((date, i) => {
          const dateKey = getDateKey(date);
          const payout = payoutByDate[dateKey];
          const isRainDay = !!payout;
          const isToday = i === 6;
          const dayLabel = date.toLocaleDateString("en-IN", { weekday: "short" });

          return (
            <div key={dateKey} className="flex flex-col items-center gap-1.5">
              <span className={`text-[10px] font-medium ${isToday ? "text-rain-400" : "text-slate-500"}`}>
                {dayLabel}
              </span>
              <button
                onClick={() => handleDayClick(date)}
                className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                  isRainDay
                    ? "bg-amber-500/20 border border-amber-500/40"
                    : isToday
                    ? "bg-rain-500/15 border border-rain-500/30"
                    : "bg-navy-800 border border-navy-700"
                }`}
              >
                {isRainDay ? (
                  <span className="text-base">🌧️</span>
                ) : isToday ? (
                  <span className="w-2 h-2 rounded-full bg-rain-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-navy-600" />
                )}
              </button>
              {payout && (
                <span className="text-amber-400 text-[10px] font-medium">
                  ₹{payout.payout_amount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Payout progress */}
      <div className="bg-navy-800/60 rounded-xl px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-xs">{t("weekPayout", lang)}</span>
          <span className="text-white text-sm font-semibold">
            ₹{totalPayout}{" "}
            <span className="text-slate-500 font-normal">/ ₹{maxPayout}</span>
          </span>
        </div>
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <CalendarDays className="w-3.5 h-3.5" />
          {t("renewsOn", lang)} {nextRenewal || "Next Monday"}
        </div>
        <span className="text-slate-400">
          {payouts.length} {payouts.length === 1 ? t("rainDaysThisWeek", lang) : t("rainDaysThisWeekPlural", lang)}
        </span>
      </div>

      {/* PART 2: DayDetailModal implementation */}
      {selectedDay && (
        <DayDetailModal 
          date={selectedDay} 
          data={modalData} 
          loading={loadingModal} 
          onClose={() => setSelectedDay(null)} 
        />
      )}
    </div>
  );
}

function DayDetailModal({ date, data, loading, onClose }) {
  if (!date) return null;

  const formattedDate = date.toLocaleDateString("en-IN", { 
    weekday: "long", 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });

  const rainfall = data?.rainfall?.rainfall_mm || 0;
  const duration = data?.rainfall?.rainfall_duration || 0;
  const trigger = Math.round(rainfall * duration);
  const payout = data?.payout?.payout_amount || 0;
  const isTriggered = trigger >= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-[#0f1423] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e293b]">
          <div>
            <h3 className="text-white font-semibold">{formattedDate}</h3>
            <p className="text-slate-400 text-xs mt-0.5">Rainfall Detail & Payout Analysis</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-navy-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-rain-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Fetching rainfall data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* PART 5: IMPROVE VISIBILITY (Rainfall stats) */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-navy-800/40 rounded-xl p-3 border border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Intensity</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">{rainfall}</span>
                    <span className="text-[10px] text-slate-400">mm/hr</span>
                  </div>
                </div>
                <div className="bg-navy-800/40 rounded-xl p-3 border border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Duration</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">{duration}</span>
                    <span className="text-[10px] text-slate-400">hrs</span>
                  </div>
                </div>
                <div className="bg-navy-800/40 rounded-xl p-3 border border-slate-700/30">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Trigger</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-amber-400">{trigger}</span>
                  </div>
                </div>
              </div>

              {/* Payout Decision */}
              <div className={`rounded-xl p-4 border ${isTriggered ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-500/10 border-slate-500/20"}`}>
                <div className="flex items-center gap-3">
                  {isTriggered ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-slate-400" />
                  )}
                  <div>
                    <p className={`text-sm font-bold ${isTriggered ? "text-emerald-400" : "text-slate-300"}`}>
                      {isTriggered ? (trigger >= 50 ? "FULL PAYOUT APPLIED" : "PARTIAL PAYOUT APPLIED") : "NO PAYOUT TRIGGERED"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isTriggered ? `Benefit of ₹${payout} credited to your account.` : "Rainfall intensity was below the parametric threshold."}
                    </p>
                  </div>
                </div>
              </div>

              {/* PART 4: ADD FULL TRANSPARENCY PANEL */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-rain-400" />
                  <h4 className="text-sm font-semibold text-white">How this payout is calculated</h4>
                </div>
                
                <div className="bg-navy-900/50 rounded-xl p-4 border border-navy-800 space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">1. Data Source</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Rainfall data is fetched from OpenMeteo API and processed using multi-point averaging across nearby coordinates.
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">2. Calculation</p>
                    <div className="bg-navy-950 rounded-lg p-2 flex items-center justify-center gap-3">
                      <div className="text-center">
                        <p className="text-xs text-white font-bold">{rainfall} mm/hr</p>
                        <p className="text-[8px] text-slate-500">Intensity</p>
                      </div>
                      <span className="text-slate-600">×</span>
                      <div className="text-center">
                        <p className="text-xs text-white font-bold">{duration} hrs</p>
                        <p className="text-[8px] text-slate-500">Duration</p>
                      </div>
                      <span className="text-slate-600">=</span>
                      <div className="text-center">
                        <p className="text-xs text-amber-400 font-bold">{trigger}</p>
                        <p className="text-[8px] text-slate-500">Trigger Value</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">3. Payout Rules</p>
                    <div className="overflow-hidden rounded-lg border border-navy-800">
                      <table className="w-full text-left text-[10px]">
                        <thead className="bg-navy-800/50 text-slate-400">
                          <tr>
                            <th className="px-3 py-2 font-medium">Trigger Value</th>
                            <th className="px-3 py-2 font-medium">Payout Level</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300 divide-y divide-navy-800">
                          <tr className={trigger >= 50 ? "bg-emerald-500/5" : ""}>
                            <td className="px-3 py-2">≥ 50</td>
                            <td className="px-3 py-2 font-medium text-emerald-400">FULL (50% Daily Income)</td>
                          </tr>
                          <tr className={trigger >= 30 && trigger < 50 ? "bg-amber-500/5" : ""}>
                            <td className="px-3 py-2">30 – 49</td>
                            <td className="px-3 py-2 font-medium text-amber-400">PARTIAL</td>
                          </tr>
                          <tr className={trigger < 30 ? "bg-red-500/5" : ""}>
                            <td className="px-3 py-2">&lt; 30</td>
                            <td className="px-3 py-2">NO PAYOUT</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-navy-800">
                    <p className="text-xs text-white font-medium">
                      Final Result: <span className={isTriggered ? "text-emerald-400" : "text-slate-400"}>
                        Trigger = {trigger} → {isTriggered ? (trigger >= 50 ? "FULL" : "PARTIAL") : "NO"} payout applied
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* PART 6: ADD SMALL CONTEXT TEXTS */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  Data updated in real-time from weather API
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  Multi-point averaging reduces location bias
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  Fully automated, no claims required
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-navy-900/30 border-t border-[#1e293b] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
