// components/landing/CoreSystem.jsx
import useScrollReveal from "@/hooks/useScrollReveal";

const CARDS = [
  {
    icon: "⏰",
    color: "#38bdf8",
    title: "Peak-Hour Intelligence",
    desc: "Lunch rush (1–3 PM) and dinner peak (8–10 PM) are mapped per zone using restaurant data across 32 Chennai zones. Rain during these windows gets a 1.5× weight. No other insurer does this.",
    tags: ["1.5× Peak Multiplier", "Zone-Specific"],
    tagColor: "blue",
    code: "1.5 × intensity(mm/hr) × duration(hr)",
  },
  {
    icon: "🔒",
    color: "#fbbf24",
    title: "Fraud-Proof by Design",
    desc: "No GPS. No manual claims. Fixed worker–zone–station mapping. Workers cannot switch zones, spoof location, or cherry-pick high-rainfall areas. Attack surface: zero.",
    tags: ["No GPS", "Fixed Zones", "No Claims"],
    tagColor: "amber",
  },
  {
    icon: "📊",
    color: "#34d399",
    title: "Financial Discipline",
    desc: "Dual Poisson risk model. Auto-halt if loss ratio exceeds 85%. 25% pricing buffer. Reinsurance layer for catastrophic NE monsoon events.",
    tags: ["Auto Stop >85%", "Reinsurance", "Poisson Model"],
    tagColor: "emerald",
    metric: { label: "TARGET LOSS RATIO", value: "75.5%", color: "#34d399" },
  },
  {
    icon: "🤖",
    color: "#a78bfa",
    title: "ML Risk Classifier",
    desc: "Trained on 161,593 rainfall records across 145 weather stations in 36 Tamil Nadu districts (2022–2025). Classifies each zone as Low / Moderate / High risk. Powers dynamic premium pricing.",
    tags: ["95% Accuracy", "Isotonic Calibration"],
    tagColor: "purple",
    metric: { label: "TRAINING RECORDS", value: "161,593", color: "#a78bfa" },
  },
  {
    icon: "🤖",
    color: "#38bdf8",
    title: "Zero-Touch System",
    desc: "No claims. No adjusters. No phone calls. The parametric engine runs 24/7 and fires UPI payouts the moment a qualifying rainfall event is confirmed via Open-Meteo.",
    tags: ["Fully Automated", "No Human Review"],
    tagColor: "blue",
    metric: { label: "HUMAN INTERVENTION", value: "0%", color: "#34d399" },
  },
  {
    icon: "🌐",
    color: "#22d3ee",
    title: "Multipoint Zone Accuracy",
    desc: "Open-Meteo API returns hourly rainfall for each zone's center + 1 km N/S/E/W. We average all 4 points to eliminate station-level noise and give every worker a fair, accurate trigger.",
    tags: ["4-Point Spatial Avg", "Open-Meteo API"],
    tagColor: "cyan",
  },
];

const TAG_STYLES = {
  blue:    { color: "#38bdf8", bg: "rgba(56,189,248,0.08)",   border: "rgba(56,189,248,0.22)"  },
  amber:   { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.22)"  },
  emerald: { color: "#34d399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.22)"  },
  purple:  { color: "#a78bfa", bg: "rgba(167,139,250,0.08)",  border: "rgba(167,139,250,0.22)" },
  pink:    { color: "#f472b6", bg: "rgba(244,114,182,0.08)",  border: "rgba(244,114,182,0.22)" },
  cyan:    { color: "#22d3ee", bg: "rgba(34,211,238,0.08)",   border: "rgba(34,211,238,0.22)"  },
};

function Card({ card, index }) {
  const ts = TAG_STYLES[card.tagColor];

  return (
    <div
      className="reveal group relative rounded-2xl p-7 transition-all duration-300 cursor-default"
      style={{
        background: "rgba(10,18,32,0.85)",
        border: "1px solid rgba(22,40,64,0.9)",
        transitionDelay: `${index * 60}ms`,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--gx", `${x}%`);
        e.currentTarget.style.setProperty("--gy", `${y}%`);
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(56,189,248,0.05) 0%, transparent 60%)" }}
      />
      <style>{`
        .group:hover { border-color:rgba(56,189,248,0.22)!important; transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.35); }
      `}</style>

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 relative transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${card.color}18` }}
      />
      <div className="absolute" style={{ top: "28px", left: "28px", fontSize: "22px" }}>{card.icon}</div>

      <h3 className="font-display font-bold text-white text-lg mb-2">{card.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>

      {card.tags && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {card.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-mono px-2.5 py-1 rounded-lg border"
              style={{ color: ts.color, background: ts.bg, borderColor: ts.border }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {card.metric && (
        <div
          className="flex justify-between items-center mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(22,40,64,0.8)" }}
        >
          <span className="text-xs text-slate-600 font-mono">{card.metric.label}</span>
          <span className="font-mono text-lg font-bold" style={{ color: card.metric.color }}>
            {card.metric.value}
          </span>
        </div>
      )}

      {card.code && (
        <div
          className="mt-4 px-3 py-2.5 rounded-lg font-mono text-xs text-slate-400 flex items-center gap-1"
          style={{ background: "rgba(6,11,20,0.8)" }}
        >
          {card.code}
          <span
            className="inline-block w-1.5 h-3.5 ml-0.5 align-middle"
            style={{ background: "#38bdf8", animation: "blink-cur 1.2s step-end infinite" }}
          />
          <style>{`@keyframes blink-cur{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        </div>
      )}
    </div>
  );
}

export default function CoreSystem() {
  const ref = useScrollReveal();

  return (
    <section id="core" ref={ref} className="py-24 px-4 bg-navy-900">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-rain-400 mb-2">
          // core_architecture
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
          System Built to<br />
          <span className="text-rain-400">Never Miss a Payout</span>
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mb-14">
          Every design decision is deliberate. Every number is defensible. Every rupee is automated.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative">
          {CARDS.map((card, i) => (
            <Card key={card.title + i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}