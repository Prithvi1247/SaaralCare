// components/dashboard/PremiumCard.jsx
import { CreditCard, TrendingDown, CheckCircle2 } from "lucide-react";

export default function PremiumCard({ data = {}, lang = "en", t = () => "" }) {
  const {
    weeklyPremium = 29,
    totalPaid = 377,
    totalReceived = 1920,
    weeksActive = 13,
    nextDeductionDate = "Dec 23, 2024",
    paymentMethod = "UPI Auto-debit",
    upiId = "rahul@ybl",
    savingsRatio = 5.1,
    recentPayments = [] 
  } = data;

  return (
    <div className="glass-card gradient-border rounded-2xl p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            {t("premiumPayments", lang)}
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            ₹{weeklyPremium}/week
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "totalPaid", value: `₹${totalPaid}`, color: "text-white" },
          { label: "totalReceivedValue", value: `₹${totalReceived}`, color: "text-emerald-400" },
          { label: "savingsRatio", value: `${savingsRatio}x`, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="bg-navy-800/60 rounded-xl px-3 py-3 text-center">
            <p className={`font-display text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{t(s.label, lang)}</p>
          </div>
        ))}
      </div>

      {/* Value callout */}
      <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3 mb-5">
        <TrendingDown className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-emerald-300 text-xs">
          {t("youReceived", lang)} <span className="font-semibold">₹{totalReceived - totalPaid}</span> {t("moreThanPaid", lang)}
        </p>
      </div>

      {/* Next deduction */}
      {/* <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-slate-400">{t("nextDeduction", lang)}</span>
        <div className="text-right">
          <p className="text-white font-medium">₹{weeklyPremium} on {nextDeductionDate}</p>
          <p className="text-slate-500 text-xs">{upiId}</p>
        </div>
      </div> */}

      {/* Recent payments */}
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">
          {t("recentPayments", lang)}
        </p>
        <div className="space-y-2">
          {recentPayments.map((p) => (
            <div
              key={p.date}
              className="flex items-center justify-between py-2 border-b border-navy-800 last:border-0"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300 text-sm">{p.date}</span>
              </div>
              <span className="text-white text-sm font-medium">₹{p.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
