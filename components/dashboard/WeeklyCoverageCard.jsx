// components/dashboard/WeeklyCoverageCard.jsx
import { useState, useEffect } from "react";
import { ShieldCheck, CalendarDays, X, CloudRain, Info, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function WeeklyCoverageCard({ data = {}, lang = "en", t = (k) => k }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

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

  const handleDayClick = async (date) => {
    const dateKey = getDateKey(date);
    setSelectedDay(date);
    setLoadingModal(true);
    setModalData(null);

    try {
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
    <div className="glass-card gradient-border rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-2">
            {t("weeklyCoverage", lang)}
          </p>
          <h3 className="font-display text-2xl font-bold text-white">
            {weekDates[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {today.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-tight">{t("covered", lang)}</span>
        </div>
      </div>

      {/* Day indicators */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {weekDates.map((date, i) => {
          const dateKey = getDateKey(date);
          const payout = payoutByDate[dateKey];
          const isRainDay = !!payout;
          const isToday = i === 6;
          const isSelected = selectedDay && getDateKey(selectedDay) === dateKey;
          const dayLabel = date.toLocaleDateString("en-IN", { weekday: "short" });

          return (
            <div key={dateKey} className="flex flex-col items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-tighter ${isToday ? "text-rain-400" : "text-slate-400"}`}>
                {dayLabel}
              </span>
              <button
                onClick={() => handleDayClick(date)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg ${
                  isSelected
                    ? "ring-2 ring-rain-400 ring-offset-2 ring-offset-[#090b14] scale-105 bg-rain-500/30 border-rain-400/50"
                    : isRainDay
                    ? "bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30"
                    : isToday
                    ? "bg-rain-500/15 border border-rain-500/30 hover:bg-rain-500/25"
                    : "bg-navy-800 border border-navy-700 hover:bg-navy-700/50"
                }`}
              >
                {isRainDay ? (
                  <span className="text-xl">🌧️</span>
                ) : isToday ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-rain-400 shadow-[0_0_8px_rgba(95,168,211,0.6)]" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-navy-600" />
                )}
              </button>
              <div className="h-4 flex items-center justify-center">
                {payout && (
                  <span className="text-amber-400 text-xs font-bold">
                    ₹{payout.payout_amount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payout progress */}
      <div className="bg-navy-900/40 rounded-2xl p-5 border border-slate-800/50">
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{t("weekPayout", lang)}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-lg font-medium">₹</span>
              <span className="text-3xl font-bold text-white">{totalPayout}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-xs font-medium block mb-1">Limit</span>
            <span className="text-slate-300 text-sm font-bold">₹{maxPayout}</span>
          </div>
        </div>
        <div className="h-2.5 bg-navy-800 rounded-full overflow-hidden border border-navy-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 text-sm">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <CalendarDays className="w-4 h-4 text-slate-500" />
          {t("renewsOn", lang)} <span className="text-white">{nextRenewal || "Next Monday"}</span>
        </div>
        <div className="bg-navy-800/50 px-3 py-1 rounded-lg border border-navy-700/50 text-slate-300 font-bold">
          {payouts.length} {payouts.length === 1 ? t("rainDaysThisWeek", lang) : t("rainDaysThisWeekPlural", lang)}
        </div>
      </div>

      {selectedDay && (
        <DayDetailModal 
          date={selectedDay} 
          data={modalData} 
          loading={loadingModal} 
          lang={lang}
          t={t}
          onClose={() => setSelectedDay(null)} 
        />
      )}
    </div>
  );
}

function DayDetailModal({ date, data, loading, lang, t, onClose }) {
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
  
  // Risk Classification
  let status = "NO PAYOUT";
  let statusColor = "text-slate-400";
  let statusBg = "bg-slate-500/10 border-slate-500/20";
  let statusIcon = <AlertCircle className="w-8 h-8 text-slate-400" />;

  if (trigger >= 50) {
    status = "FULL PAYOUT";
    statusColor = "text-emerald-400";
    statusBg = "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
    statusIcon = <CheckCircle2 className="w-8 h-8 text-emerald-400" />;
  } else if (trigger >= 30) {
    status = "PARTIAL PAYOUT";
    statusColor = "text-amber-400";
    statusBg = "bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]";
    statusIcon = <CheckCircle2 className="w-8 h-8 text-amber-400" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090b14]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f1423] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-800/50">
          <div>
            <h3 className="text-white text-2xl font-bold font-display">{formattedDate}</h3>
            <p className="text-slate-400 text-sm mt-1 font-medium">Rainfall Detail & Payout Analysis</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-navy-800 rounded-2xl transition-all duration-200 active:scale-90">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-rain-400 animate-spin mb-6" />
              <p className="text-slate-300 text-lg font-bold animate-pulse">Fetching rainfall data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-navy-900/40 rounded-2xl p-5 border border-slate-800/50 text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Intensity</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{rainfall}</span>
                    <span className="text-sm text-slate-400 font-medium">mm/hr</span>
                  </div>
                </div>
                <div className="bg-navy-900/40 rounded-2xl p-5 border border-slate-800/50 text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Duration</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{duration}</span>
                    <span className="text-sm text-slate-400 font-medium">hrs</span>
                  </div>
                </div>
                <div className="bg-navy-900/40 rounded-2xl p-5 border border-slate-800/50 text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Trigger</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-amber-400">{trigger}</span>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className={`rounded-2xl p-6 border-2 ${statusBg} transition-all duration-500`}>
                <div className="flex items-center gap-5">
                  <div className="shrink-0 p-3 bg-navy-950/50 rounded-2xl">
                    {statusIcon}
                  </div>
                  <div>
                    <p className={`text-2xl font-black tracking-tight ${statusColor}`}>
                      {status}
                    </p>
                    <p className="text-white text-sm font-medium mt-1 opacity-90">
                      {status !== "NO PAYOUT" 
                        ? `Benefit of ₹${payout} credited to your account.` 
                        : "Rainfall intensity was below the parametric threshold."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transparency Panel */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rain-500/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-rain-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{t("howThisPayoutIsCalculated", lang)}</h4>
                </div>
                
                <div className="bg-navy-900/30 rounded-2xl p-6 border border-slate-800/50 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">1. Data Source</p>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        Rainfall data is fetched from OpenMeteo API and processed using multi-point averaging across nearby coordinates.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">2. Calculation</p>
                      <div className="bg-navy-950/80 rounded-xl p-3 flex items-center justify-center gap-4 border border-slate-800">
                        <div className="text-center">
                          <p className="text-sm text-white font-bold">{rainfall} mm/hr</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Intensity</p>
                        </div>
                        <span className="text-slate-600 font-bold">×</span>
                        <div className="text-center">
                          <p className="text-sm text-white font-bold">{duration} hrs</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Duration</p>
                        </div>
                        <span className="text-slate-600 font-bold">=</span>
                        <div className="text-center">
                          <p className="text-sm text-amber-400 font-bold">{trigger}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Trigger</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">3. Payout Rules</p>
                    <div className="overflow-hidden rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-navy-800/50 text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider">Trigger Value</th>
                            <th className="px-4 py-3 font-bold uppercase tracking-wider">Payout Level</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300 divide-y divide-slate-800">
                          <tr className={trigger >= 50 ? "bg-emerald-500/10" : ""}>
                            <td className="px-4 py-3 font-medium">≥ 50</td>
                            <td className="px-4 py-3 font-bold text-emerald-400">FULL (50% Daily Income)</td>
                          </tr>
                          <tr className={trigger >= 30 && trigger < 50 ? "bg-amber-500/10" : ""}>
                            <td className="px-4 py-3 font-medium">30 – 49</td>
                            <td className="px-4 py-3 font-bold text-amber-400">PARTIAL</td>
                          </tr>
                          <tr className={trigger < 30 ? "bg-red-500/10" : ""}>
                            <td className="px-4 py-3 font-medium">&lt; 30</td>
                            <td className="px-4 py-3 font-bold text-slate-500">NO PAYOUT</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <p className="text-[11px] font-bold uppercase tracking-tight">Real-time Weather API</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <p className="text-[11px] font-bold uppercase tracking-tight">Multi-point Averaging</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <p className="text-[11px] font-bold uppercase tracking-tight">Fully Automated Payout</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 md:p-8 bg-navy-900/30 border-t border-slate-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-navy-800 hover:bg-navy-700 text-white text-base font-bold rounded-2xl transition-all duration-200 active:scale-95 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
