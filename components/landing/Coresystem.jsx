// components/landing/CoreSystem.jsx
import useScrollReveal from "@/hooks/useScrollReveal";

const CARDS = [
  {
    icon: "🤖",
    color: "#38bdf8",
    title: "Zero-Touch System",
    desc: "No claims. No adjusters. No phone calls. The engine runs 24/7 and fires payouts the moment a qualifying event is detected.",
    tags: ["Fully Automated", "No Human Review"],
    tagColor: "blue",
    metric: { label: "HUMAN INTERVENTION", value: "0%", color: "#34d399" },
  },
  {
    icon: "🔒",
    color: "#fbbf24",
    title: "Ungameable Design",
    desc: "Station-based triggers only. Fixed zone mapping. No GPS dependency. Payouts are purely data-driven — workers cannot manipulate the system.",
    tags: ["Station-Based", "Fixed Zones", "No GPS"],
    tagColor: "amber",
  },
  {
    icon: "📊",
    color: "#34d399",
    title: "Financial Discipline",
    desc: "Auto-halt triggers if loss ratio exceeds 85%. Pricing buffer built in. Reinsurance layer for catastrophic events.",
    tags: ["Auto Stop >85%", "Reinsurance"],
    tagColor: "emerald",
    metric: { label: "CURRENT LOSS RATIO", value: "75.5%", color: "#34d399" },
  },
  {
    icon: "⚙️",
    color: "#a78bfa",
    title: "Deterministic Engine",
    desc: "Same input → same output → always. Every payout calculation is auditable, reproducible, and court-defensible.",
    tags: ["Reproducible", "Audit-Ready"],
    tagColor: "purple",
    code: "f(station, date) → payout",
  },
  {
    icon: "👤",
    color: "#f472b6",
    title: "Per-Worker Isolation",
    desc: "Each worker's plan is independently managed. One worker's status never affects another's coverage or payout amount.",
    tags: ["Isolated Plans", "No Pooling Risk"],
    tagColor: "pink",
  },
  {
    icon: "🛡️",
    color: "#22d3ee",
    title: "Underwriting Layer",
    desc: "Verified gig workers only. Work history required. Prevents adverse selection. Every enrollment is checked against platform data.",
    tags: ["KYC Verified", "Work History"],
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
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(56,189,248,0.05) 0%, transparent 60%)" }}
      />

      <style>{`
        .group:hover { border-color:rgba(56,189,248,0.22)!important; transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.35); }
      `}</style>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 relative transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${card.color}18` }}
      />
      <div className="absolute" style={{ top: "28px", left: "28px", fontSize: "22px" }}>{card.icon}</div>

      <h3 className="font-display font-bold text-white text-lg mb-2">{card.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>

      {/* Tags */}
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

      {/* Metric */}
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

      {/* Code snippet */}
      {card.code && (
        <div
          className="mt-4 px-3 py-2.5 rounded-lg font-mono text-xs text-slate-500 flex items-center gap-1"
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
          <span className="text-rain-400">Never Break</span>
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mb-14">
          Every design decision is deliberate. Every number is defensible.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative">
          {CARDS.map((card, i) => (
            <Card key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}