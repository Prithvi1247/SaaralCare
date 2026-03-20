// components/dashboard/ClaimHistory.jsx
// NEW: Added payout type labels (Full/Partial)
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

// NEW: Payout type mapping
const getPayoutLabel = (type) => {
  if (type === "full") return "Full Payout";
  if (type === "partial") return "Partial Payout";
  return "Payout";
};

const MOCK_CLAIMS = [
  {
    id: "CLM-2024-047",
    date: "Dec 18, 2024",
    rainfall: 34.2,
    station: "Santacruz Observatory",
    amount: 480,
    status: "paid",
    type: "full",
    paidAt: "Dec 18, 2024 · 3:42 PM",
  },
  {
    id: "CLM-2024-038",
    date: "Dec 11, 2024",
    rainfall: 19.8,
    station: "Santacruz Observatory",
    amount: 320,
    status: "paid",
    type: "full",
    paidAt: "Dec 11, 2024 · 5:17 PM",
  },
  {
    id: "CLM-2024-031",
    date: "Dec 4, 2024",
    rainfall: 41.0,
    station: "Santacruz Observatory",
    amount: 480,
    status: "processing",
    type: "full",
    paidAt: null,
  },
  {
    id: "CLM-2024-022",
    date: "Nov 20, 2024",
    rainfall: 9.3,
    station: "Santacruz Observatory",
    amount: 0,
    status: "rejected",
    type: null,
    paidAt: null,
  },
];

export default function ClaimHistory({ claims = MOCK_CLAIMS, payouts = [] }) {
  // NEW: Support payouts prop from dashboard
  const displayPayouts = payouts && payouts.length > 0
    ? payouts.map((p, i) => ({
        id: `CLM-${i}`,
        date: "Recent",
        rainfall: 25 + i * 5,
        station: "Mapped Station",
        amount: p.amount,
        status: "paid",
        type: p.type || "full",
        paidAt: "Today",
      }))
    : claims;

  const totalPaid = displayPayouts
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="glass-card gradient-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">
            Payout History
          </p>
          <h3 className="font-display text-lg font-semibold text-white">
            ₹{totalPaid.toLocaleString()} total received
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <FileText className="w-3.5 h-3.5" />
          {displayPayouts.length} events
        </div>
      </div>

      {/* Claims list */}
      <div className="space-y-3">
        {displayPayouts.map((claim) => {
          const cfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.rejected;
          const Icon = cfg.icon;

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
                    {/* NEW: Show payout type */}
                    {claim.status === "paid" ? getPayoutLabel(claim.type) : cfg.label}
                  </p>
                  <span className="text-white font-semibold">
                    {claim.status === "paid" ? `+₹${claim.amount}` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <CloudRain className="w-3 h-3 text-rain-400" />
                  <span className="text-slate-400 text-xs">
                    {claim.rainfall}mm at {claim.station}
                  </span>
                </div>
                {claim.paidAt && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    Paid {claim.paidAt}
                  </p>
                )}
                {claim.status === "processing" && (
                  <p className="text-amber-400 text-xs mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Processing — up to 4 hours
                  </p>
                )}
                {claim.status === "rejected" && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    Rainfall below trigger threshold
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
