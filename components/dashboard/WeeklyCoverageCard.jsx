// WeeklyCoverageCard.jsx (updated)
// Clickable day cells open DayDetailModal showing INPUT → CALC → OUTPUT
import { useState, useMemo } from "react";
import { ShieldCheck, CalendarDays } from "lucide-react";
import DayDetailModal from "./DayDetailModal";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Build an array of 7 ISO date strings for Mon..Sun of the current week
function buildWeekDates(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export default function WeeklyCoverageCard({
  data = {},
  lang = "en",
  t = () => "",
  stationId,
  workerId,
  zoneId,
}) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Compute current week's Monday
  const { monday, weekDates } = useMemo(() => {
    const today = new Date();
    const dow = today.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(today);
    mon.setDate(today.getDate() + diff);
    mon.setHours(0, 0, 0, 0);
    return { monday: mon, weekDates: buildWeekDates(mon) };
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const defaultStart = monday.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const defaultEnd = sunday.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const nextMon = new Date(sunday); nextMon.setDate(sunday.getDate() + 1);
  const defaultRenewal = nextMon.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const {
    weekStart = defaultStart,
    weekEnd = defaultEnd,
    daysWithRain = [],
    payouts = [],
    totalPayout = 0,
    maxPayout = 1125,
    nextRenewal = defaultRenewal,
  } = data;

  const payoutByDay = Object.fromEntries(payouts.map((p) => [p.day, p.amount]));
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const progressPct = maxPayout > 0 ? Math.min((totalPayout / maxPayout) * 100, 100) : 0;

  return (
    <>
      <div className="glass-card gradient-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
              {t("weeklyCoverage", lang)}
            </p>
            <h3 className="font-display text-lg font-semibold text-white">
              {weekStart} – {weekEnd}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium">{t("covered", lang)}</span>
          </div>
        </div>

        {/* Hint label */}
        <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-3 text-center">
          Tap a day for details
        </p>

        {/* Day cells — each is clickable */}
        <div className="grid grid-cols-7 gap-1.5 mb-6">
          {DAYS.map((day, i) => {
            const isRainDay = daysWithRain.includes(i);
            const payout = payoutByDay[i];
            const isToday = i === todayIdx;
            const isFuture = i > todayIdx;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                disabled={isFuture}
                className={`flex flex-col items-center gap-1.5 group rounded-xl p-1 transition-all duration-150 outline-none
                  focus-visible:ring-2 focus-visible:ring-[#5fa8d3]
                  ${isFuture ? "opacity-35 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}
                `}
              >
                <span className={`text-xs font-medium transition-colors
                  ${isToday ? "text-[#5fa8d3]" : "text-slate-500"}
                  ${!isFuture ? "group-hover:text-slate-300" : ""}
                `}>
                  {day}
                </span>
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all
                    ${isRainDay
                      ? "bg-amber-500/20 border border-amber-500/40 group-hover:border-amber-400/70 group-hover:bg-amber-500/30"
                      : isToday
                      ? "bg-[#5fa8d3]/15 border border-[#5fa8d3]/30 group-hover:border-[#5fa8d3]/60"
                      : "bg-navy-800 border border-navy-700 group-hover:border-slate-600"
                    }
                    ${!isFuture ? "ring-0 group-hover:ring-1 group-hover:ring-white/10" : ""}
                  `}
                >
                  {isRainDay ? (
                    <span className="text-base">🌧️</span>
                  ) : isToday ? (
                    <span className="w-2 h-2 rounded-full bg-[#5fa8d3]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-navy-600" />
                  )}
                </div>
                {payout && (
                  <span className="text-amber-400 text-xs font-medium">₹{payout}</span>
                )}
              </button>
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
            {t("renewsOn", lang)} {nextRenewal}
          </div>
          <span className="text-slate-400">
            {daysWithRain.length}{" "}
            {daysWithRain.length === 1
              ? t("rainDaysThisWeek", lang)
              : t("rainDaysThisWeekPlural", lang)}
          </span>
        </div>
      </div>

      {/* Modal rendered outside the card flow */}
      <DayDetailModal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        dayIndex={selectedDay}
        weekDates={weekDates}
        stationId={stationId}
        workerId={workerId}
        zoneId={zoneId}
      />
    </>
  );
}