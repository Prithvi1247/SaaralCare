import { useRouter } from "next/router";
import { ShieldCheck, CalendarDays, CloudRain, ArrowRight } from "lucide-react";

export default function WeeklyCoverageCard({ data = {}, lang = "en", t = (k) => k }) {
  const router = useRouter();
  const today = new Date();
  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    weekDates.push(d);
  }

  const { payouts = [], totalPayout = 0, maxPayout = 1125, nextRenewal = "" } = data;
  const getDateKey = (date) => date.toISOString().split("T")[0];
  const payoutByDate = Object.fromEntries(payouts.map((p) => [getDateKey(new Date(p.payout_time)), p]));
  const progressPct = maxPayout > 0 ? Math.min((totalPayout / maxPayout) * 100, 100) : 0;
  const locale = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-IN";

  return (
    <div className="glass-card gradient-border rounded-2xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-2">
            {t("weeklyCoverage", lang)}
          </p>
          <h3 className="font-display text-2xl font-bold text-white">
            {weekDates[0].toLocaleDateString(locale, { day: "numeric", month: "short" })} –{" "}
            {today.toLocaleDateString(locale, { day: "numeric", month: "short" })}
          </h3>
          <p className="text-slate-500 text-xs mt-2 font-medium">{t("tap_day_instruction", lang)}</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-tight">{t("covered", lang)}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-8">
        {weekDates.map((date, i) => {
          const dateKey = getDateKey(date);
          const isRainDay = !!payoutByDate[dateKey];
          const isToday = i === 6;
          const dayLabel = date.toLocaleDateString(locale, { weekday: "short" });

          return (
            <div key={dateKey} className="flex flex-col items-center gap-2">
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tighter ${isToday ? "text-rain-400" : "text-slate-400"}`}>
                {dayLabel}
              </span>
              <button
                onClick={() => router.push(`/rainfall-details?date=${dateKey}`)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg relative group ${
                  isRainDay
                    ? "bg-rain-500/20 border border-rain-500/30 hover:bg-rain-500/30"
                    : "bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60"
                }`}
              >
                {isRainDay ? (
                  <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 text-rain-400" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-rain-400/50" : "bg-slate-600"}`} />
                )}
                {isRainDay && (
                  <div className="absolute inset-0 rounded-xl bg-rain-400/10 blur-md -z-10 group-hover:bg-rain-400/20 transition-colors" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-3">
            <div>
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

        <button
          onClick={() => router.push("/rainfall-details")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rain-500/30 bg-rain-500/10 hover:bg-rain-500/20 text-rain-400 text-sm font-bold transition-all"
        >
          View Rainfall Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}