// components/landing/Explainability.jsx
import { CheckCircle2 } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const EXAMPLES = [
  {
    id: "tx_full_089",
    type: "PEAK_EVENT",
    zone: "Velachery ",
    time: "1:30 PM (Lunch Peak)",
    math: "35mm × 1hr × 1.5 = 52.5",
    threshold: "> 45 (Full)",
    amount: "₹800",
    status: "full",
    label: "✓ FULL PAYOUT (PEAK)",
  },
  {
    id: "tx_part_112",
    type: "NON_PEAK_EVENT",
    zone: "Mylapore ",
    time: "4:15 PM (Non-Peak)",
    math: "40mm × 1hr × 1.0 = 40.0",
    threshold: "> 35 (Partial)",
    amount: "₹400",
    status: "partial",
    label: "◐ PARTIAL PAYOUT",
  },
  {
    id: "tx_drop_404",
    type: "PEAK_MARGINAL",
    zone: "Tambaram ",
    time: "8:45 PM (Dinner Peak)",
    math: "8mm × 1hr × 1.5 = 12.0",
    threshold: "< 15 (No Payout)",
    amount: "₹0",
    status: "none",
    label: "✗ NOT TRIGGERED",
  },
];

const STATUS_STYLES = {
  full:    { top: "#34d399", badge: "rgba(52,211,153,0.12)",  badgeBorder: "rgba(52,211,153,0.3)",  badgeText: "#34d399" },
  partial: { top: "#fbbf24", badge: "rgba(251,191,36,0.12)",  badgeBorder: "rgba(251,191,36,0.3)",  badgeText: "#fbbf24" },
  none:    { top: "#64748b", badge: "rgba(100,116,139,0.08)", badgeBorder: "rgba(100,116,139,0.2)", badgeText: "#64748b" },
};

function LogCard({ ex }) {
  const s = STATUS_STYLES[ex.status];

  return (
    <div
      className="reveal relative rounded-2xl p-6 font-mono text-sm transition-all duration-300 overflow-hidden log-card-hover"
      style={{
        background: "rgba(6,11,20,0.9)",
        border: "1px solid rgba(22,40,64,0.9)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${s.top},transparent)` }}
      />

      {/* Scan line on hover (CSS only) */}
      <style>{`
        .log-card-hover:hover { border-color:rgba(56,189,248,0.2)!important; }
        .log-card-hover:hover .scan-line { opacity:1; }
        .scan-line { opacity:0; position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(56,189,248,0.25),transparent);animation:scan 3s linear infinite;transition:opacity 0.3s; }
        @keyframes scan{0%{top:0}100%{top:100%}}
      `}</style>
      <div className="scan-line" />

      <p className="text-rain-400 text-xs tracking-widest uppercase font-bold mb-5">
        // {ex.id} · {ex.type}
      </p>

      <div className="space-y-2.5 mb-5">
        {[
          { k: "zone:",       v: ex.zone,      vc: "text-white" },
          { k: "time:",       v: ex.time,      vc: ex.time.includes("Peak") && !ex.time.includes("Non") ? "text-amber-200 font-bold" : "text-slate-200" },
          { k: "formula:",    v: ex.math,      vc: "text-rain-100 font-bold" },
          { k: "threshold:",  v: ex.threshold, vc: "text-slate-200" },
          { k: "payout:",     v: ex.amount,    vc: ex.status === "full" ? "text-emerald-400 font-bold" : ex.status === "partial" ? "text-amber-400 font-bold" : "text-slate-500" },
        ].map((row) => (
          <div
            key={row.k}
            className="flex justify-between items-center pb-2"
            style={{ borderBottom: "1px solid rgba(22,40,64,0.6)" }}
          >
            <span className="text-slate-100 text-xs">{row.k}</span>
            <span className={`text-xs ${row.vc}`}>{row.v}</span>
          </div>
        ))}
      </div>

      <div
        className="px-3 py-2.5 rounded-lg text-center text-xs font-bold tracking-wide"
        style={{ background: s.badge, border: `1px solid ${s.badgeBorder}`, color: s.badgeText }}
      >
        {ex.label}
      </div>
    </div>
  );
}

export default function Explainability() {
  const ref = useScrollReveal();

  return (
    <section
      id="explain"
      ref={ref}
      className="py-24 px-4"
      style={{ background: "linear-gradient(180deg,#060b14 0%,#0a1220 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest uppercase text-rain-400 mb-3">
            // explainability_by_design
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Why You Got <span className="text-rain-400">Paid</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Every delivery worker sees the exact Open-Meteo calculation behind their payout.
            No black box. No claims adjusters. Just math.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {EXAMPLES.map((ex) => (
            <LogCard key={ex.id} ex={ex} />
          ))}
        </div>

        {/* Formula box */}
        <div
          className="reveal rounded-2xl p-7 flex gap-4 items-start"
          style={{ background: "rgba(10,18,32,0.8)", border: "1px solid rgba(56,189,248,0.15)" }}
        >
          <CheckCircle2 className="w-5 h-5 text-rain-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-white mb-3">The Logic — Peak Hour Disruption Math</h3>
            <p className="font-mono text-sm text-slate-100 leading-8">
              <strong className="text-white">Base Trigger</strong> = Intensity (mm/hr) × Duration (hr)<br />
              <strong className="text-amber-400">Peak Multiplier</strong> = Base × 1.5x <span className="text-slate-300">(Active 1-3 PM Lunch & 8-10 PM Dinner)</span><br />
              <span className="text-emerald-400">Full Payout (₹800)</span> = Peak Value &gt; 45mm OR Non-Peak &gt; 75mm<br />
              <span className="text-rain-400">Partial Payout (₹400)</span> = Peak Value &gt; 15mm OR Non-Peak &gt; 35mm
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}