// TriggerCard.jsx
// Shows the core payout formula: Intensity × Duration = Trigger → Tier
export default function TriggerCard({ intensity, duration, trigger, tier }) {
  const tierConfig = {
    FULL:    { label: "FULL PAYOUT",    bg: "bg-emerald-500/15", border: "border-emerald-500/40", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
    PARTIAL: { label: "PARTIAL PAYOUT", bg: "bg-amber-500/15",   border: "border-amber-500/40",   text: "text-amber-400",   glow: "shadow-amber-500/20"   },
    NONE:    { label: "NO PAYOUT",      bg: "bg-slate-700/30",   border: "border-slate-600/40",   text: "text-slate-400",   glow: ""                      },
  };
  const cfg = tierConfig[tier] || tierConfig.NONE;

  const fillPct = Math.min((trigger / 50) * 100, 100);
  const barColor = tier === "FULL" ? "from-emerald-500 to-emerald-400"
                 : tier === "PARTIAL" ? "from-amber-500 to-amber-400"
                 : "from-slate-600 to-slate-500";

  return (
    <div
      className={`rounded-2xl p-5 border ${cfg.bg} ${cfg.border} ${cfg.glow} shadow-lg`}
      style={{ boxShadow: tier !== "NONE" ? undefined : undefined }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-300 text-xs font-semibold uppercase tracking-widest">
          Trigger Formula
        </span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.border} border ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>

      {/* Formula row */}
      <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
        <FormulaCell label="Intensity" value={`${intensity}`} unit="mm/hr" color="text-[#5fa8d3]" />
        <Op>×</Op>
        <FormulaCell label="Duration"  value={`${duration}`}  unit="hrs"   color="text-purple-400"  />
        <Op>=</Op>
        <FormulaCell label="Trigger"   value={`${trigger}`}   unit=""      color={cfg.text} large />
      </div>

      {/* Progress bar toward threshold */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>0</span>
          <span className="text-slate-400">Threshold</span>
          <span className="font-semibold text-slate-300">50</span>
        </div>
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${fillPct}%` }}
          />
          {/* Threshold line at 100% */}
          <div className="absolute right-0 top-0 h-full w-px bg-slate-500 opacity-60" />
        </div>
      </div>

      {/* Rule summary */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <RuleChip range="≥ 50" label="Full"    active={tier === "FULL"}    color="emerald" />
        <RuleChip range="30–49" label="Partial" active={tier === "PARTIAL"} color="amber"   />
        <RuleChip range="< 30"  label="None"    active={tier === "NONE"}    color="slate"   />
      </div>
    </div>
  );
}

function FormulaCell({ label, value, unit, color, large }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">{label}</span>
      <span className={`font-mono font-black ${large ? "text-4xl" : "text-2xl"} ${color} leading-none`}>
        {value}
      </span>
      {unit && <span className="text-slate-500 text-[10px] mt-0.5">{unit}</span>}
    </div>
  );
}

function Op({ children }) {
  return (
    <span className="text-slate-500 text-2xl font-thin select-none mt-3">{children}</span>
  );
}

function RuleChip({ range, label, active, color }) {
  const colors = {
    emerald: active ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-slate-800/60 border-slate-700/40 text-slate-500",
    amber:   active ? "bg-amber-500/20 border-amber-500/50 text-amber-300"       : "bg-slate-800/60 border-slate-700/40 text-slate-500",
    slate:   active ? "bg-slate-600/40 border-slate-500/50 text-slate-300"       : "bg-slate-800/60 border-slate-700/40 text-slate-500",
  };
  return (
    <div className={`rounded-lg border px-2 py-1.5 text-xs transition-all ${colors[color]}`}>
      <div className="font-mono font-semibold">{range}</div>
      <div className="text-[10px] opacity-80">{label}</div>
    </div>
  );
}