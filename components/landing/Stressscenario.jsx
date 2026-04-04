// components/landing/StressScenario.jsx
import { AlertTriangle } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const SCENARIOS = [
  {
    event: "10-day continuous rain",
    impact: "Payout spike expected",
    mitigation: "Per-worker payout caps limit total exposure",
  },
  {
    event: "1,000 simultaneous events",
    impact: "System load surge",
    mitigation: "Async queue + auto-scaling absorbs spike",
  },
  {
    event: "Regional flooding (Mumbai)",
    impact: "Zone claims surge",
    mitigation: "Per-zone limits + reinsurance layer activated",
  },
];

const PILLARS = [
  { icon: "🔐", name: "Payout Caps",      desc: "Per-worker exposure limits"       },
  { icon: "💰", name: "Pricing Buffer",   desc: "25% margin above expected loss"   },
  { icon: "🏦", name: "Reinsurance",      desc: "Catastrophe risk offloaded"        },
  { icon: "⏸️", name: "Auto-Halt",        desc: "Stops if loss ratio > 85%"         },
];

export default function StressScenario() {
  const ref = useScrollReveal();

  return (
    <section
      id="stress"
      ref={ref}
      className="py-24 px-4"
      style={{
        background:
          "linear-gradient(135deg,rgba(120,53,15,0.1) 0%,rgba(6,11,20,0) 50%),#0a1220",
        borderTop: "1px solid rgba(251,191,36,0.1)",
        borderBottom: "1px solid rgba(251,191,36,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="reveal rounded-2xl p-8 sm:p-10"
          style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.18)" }}
        >
          {/* Header */}
          <div className="flex gap-4 items-start mb-8">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-mono text-xs tracking-widest uppercase text-amber-400 mb-1">
                // stress_testing
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Designed for <span className="text-amber-400">Extreme Conditions</span>
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed max-w-xl">
                The system is architected to handle worst-case scenarios without breaking or losing payouts.
              </p>
            </div>
          </div>

          {/* Scenario rows */}
          <div className="flex flex-col gap-3 mb-8">
            {SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="reveal grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-center rounded-xl p-4 sm:p-5 transition-all duration-300"
                style={{
                  background: "rgba(6,11,20,0.6)",
                  border: "1px solid rgba(22,40,64,0.8)",
                  transitionDelay: `${i * 80}ms`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.22)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(22,40,64,0.8)")}
              >
                <div>
                  <p className="font-display font-bold text-white text-sm">{s.event}</p>
                  <p className="text-amber-400 text-xs mt-1">{s.impact}</p>
                </div>
                <span className="text-slate-600 text-xl hidden md:block">→</span>
                <p className="text-emerald-400 text-sm md:text-right">{s.mitigation}</p>
              </div>
            ))}
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="reveal rounded-xl p-4 text-center"
                style={{
                  background: "rgba(6,11,20,0.6)",
                  border: "1px solid rgba(251,191,36,0.12)",
                }}
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <p className="font-mono text-xs text-amber-400 uppercase tracking-wide font-bold">{p.name}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}