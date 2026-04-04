// components/dashboard/ClaimHistory.jsx
import { CloudRain, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";

const STATUS_CONFIG = {
  paid: {
    icon: CheckCircle2,
    label: "Paid",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  processing: {
    icon: Clock,
    label: "Processing",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  rejected: {
    icon: XCircle,
    label: "Not Triggered",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
  },
};

const getPayoutLabel = (type, lang, t) => {
  if (type === "full") return lang === "hi" ? "पूर्ण भुगतान" : lang === "ta" ? "முழு பணம்" : "Full Payout";
  if (type === "partial") return lang === "hi" ? "आंशिक भुगतान" : lang === "ta" ? "பகுதி பணம்" : "Partial Payout";
  return type;
};

// TASK 1: Accepts real claims from dashboard; no MOCK_CLAIMS default
export default function ClaimHistory({ claims = [], lang = "en", t = () => "" }) {
  const totalPaid = claims
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="glass-card gradient-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            {t("payoutHistory", lang)}
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            ₹{totalPaid.toLocaleString()} {t("totalReceived", lang)}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <FileText className="w-3.5 h-3.5" />
          {claims.length} {t("events", lang)}
        </div>
      </div>

      {/* Empty state */}
      {claims.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-6">
          {lang === "hi" ? "कोई भुगतान इतिहास नहीं" : lang === "ta" ? "பணம் வரலாறு இல்லை" : "No payout history yet"}
        </p>
      )}

      {/* Claims list */}
      <div className="space-y-3">
        {claims.map((claim) => {
          const cfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.rejected;
          const Icon = cfg.icon;

          let statusLabel = cfg.label;
          if (claim.status === "paid") {
            statusLabel = getPayoutLabel(claim.type, lang, t);
          } else if (claim.status === "processing") {
            statusLabel = t("processing", lang);
          } else if (claim.status === "rejected") {
            statusLabel = t("notTriggered", lang);
          }

          return (
            <div
              key={claim.id}
              className={`flex items-start gap-4 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}
            >
              <div className="flex-shrink-0 mt-1">
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-medium text-sm ${cfg.color}`}>
                    {statusLabel}
                  </p>
                  <span className="text-white font-semibold">
                    {claim.status === "paid" ? `+₹${claim.amount}` : "—"}
                  </span>
                </div>
                {/* Show rainfall if available, otherwise fall back to station label */}
                <div className="flex items-center gap-1.5 mt-1">
                  <CloudRain className="w-3 h-3 text-rain-400" />
                  <span className="text-slate-400 text-xs">
                    {claim.rainfall > 0
                      ? `${claim.rainfall}mm at ${claim.station}`
                      : claim.station}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{claim.date}</p>
                {claim.paidAt && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t("paid", lang)} {claim.paidAt}
                  </p>
                )}
                {claim.status === "processing" && (
                  <p className="text-amber-400 text-xs mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {t("processingUpTo4Hours", lang)}
                  </p>
                )}
                {claim.status === "rejected" && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t("rainfallBelowThreshold", lang)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}