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

const MOCK_CLAIMS = [
  {
    id: "CLM-2024-047",
    date: "Dec 18, 2024",
    rainfall: 34.2,
    station: "Santacruz Observatory",
    amount: 480,
    status: "paid",
    paidAt: "Dec 18, 2024 · 3:42 PM",
  },
  {
    id: "CLM-2024-038",
    date: "Dec 11, 2024",
    rainfall: 19.8,
    station: "Santacruz Observatory",
    amount: 320,
    status: "paid",
    paidAt: "Dec 11, 2024 · 5:17 PM",
  },
  {
    id: "CLM-2024-031",
    date: "Dec 4, 2024",
    rainfall: 41.0,
    station: "Santacruz Observatory",
    amount: 480,
    status: "processing",
    paidAt: null,
  },
  {
    id: "CLM-2024-022",
    date: "Nov 20, 2024",
    rainfall: 9.3,
    station: "Santacruz Observatory",
    amount: 0,
    status: "rejected",
    paidAt: null,
  },
];

export default function ClaimHistory({ claims = MOCK_CLAIMS }) {
  const totalPaid = claims
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
          {claims.length} events
        </div>
      </div>

      {/* Claims list */}
      <div className="space-y-3">
        {claims.map((claim) => {
          const cfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.rejected;
          const StatusIcon = cfg.icon;

          return (
            <div
              key={claim.id}
              className={`rounded-xl border ${cfg.bg} ${cfg.border} p-4 transition-all hover:brightness-110`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-sm font-medium">{claim.date}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color} font-medium`}
                      >
                        {cfg.label}
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
                        Rainfall below {claim.rainfall}mm threshold
                      </p>
                    )}
                    <p className="text-slate-600 text-xs mt-1">{claim.id}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  {claim.amount > 0 ? (
                    <span className={`font-display text-lg font-bold ${cfg.color}`}>
                      ₹{claim.amount}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {claims.length === 0 && (
        <div className="text-center py-10">
          <CloudRain className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No payout events yet.</p>
          <p className="text-slate-500 text-xs mt-1">Payouts trigger automatically when it rains.</p>
        </div>
      )}
    </div>
  );
}
