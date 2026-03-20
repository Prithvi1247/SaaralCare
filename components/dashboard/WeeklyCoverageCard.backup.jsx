// components/dashboard/WeeklyCoverageCard.jsx
import { ShieldCheck, CalendarDays } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyCoverageCard({ data = {} }) {
  const {
    weekStart = "Dec 16",
    weekEnd = "Dec 22",
    coverageStatus = "active",
    daysWithRain = [1, 3], // 0-indexed days that had qualifying rain
    payouts = [
      { day: 1, amount: 320 },
      { day: 3, amount: 480 },
    ],
    totalPayout = 800,
    maxPayout = 800,
    nextRenewal = "Dec 23",
  } = data;

  const payoutByDay = Object.fromEntries(payouts.map((p) => [p.day, p.amount]));

  return (
    <div className="glass-card gradient-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            Weekly Coverage
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            {weekStart} – {weekEnd}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">Covered</span>
        </div>
      </div>

      {/* Day indicators */}
      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {DAYS.map((day, i) => {
          const isRainDay = daysWithRain.includes(i);
          const payout = payoutByDay[i];
          const isToday = i === new Date().getDay() - 1;

          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className={`text-xs font-medium ${isToday ? "text-rain-400" : "text-slate-500"}`}>
                {day}
              </span>
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
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
              </div>
              {payout && (
                <span className="text-amber-400 text-xs font-medium">
                  ₹{payout}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Payout progress */}
      <div className="bg-navy-800/60 rounded-xl px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-xs">Week Payout</span>
          <span className="text-white text-sm font-semibold">
            ₹{totalPayout}{" "}
            <span className="text-slate-500 font-normal">/ ₹{maxPayout}</span>
          </span>
        </div>
        <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
            style={{ width: `${(totalPayout / maxPayout) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <CalendarDays className="w-3.5 h-3.5" />
          Renews {nextRenewal}
        </div>
        <span className="text-slate-400">{daysWithRain.length} rain day{daysWithRain.length !== 1 ? "s" : ""} this week</span>
      </div>
    </div>
  );
}
