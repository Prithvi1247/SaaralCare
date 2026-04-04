// components/landing/BasisRisk.jsx
import { TrendingUp } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const SCENARIOS = [
  {
    title: "Heavy rain at your location",
    sub: "Light rain at assigned station = No payout (false negative)",
  },
  {
    title: "Light rain at your location",
    sub: "Heavy rain at assigned station = You get paid (false positive)",
  },
];

const MITIGATIONS = [
  {
    title: "✓ Nearest Station Mapping",
    desc: "Zone-to-station lookup ensures closest proximity. Maximum 5 km radius enforced.",
  },
  {
    title: "✓ Partial Payout Tier",
    desc: "The 30–49 range captures marginal rain events, reducing false negatives significantly.",
  },
  {
    title: "✓ Transparent Pricing",
    desc: "Premium reflects zone risk + basis risk. Full cost breakdown shown before sign-up.",
  },
  {
    title: "✓ Honest Onboarding",
    desc: "Every worker sees their mapped station and the basis risk percentage before enrolling.",
  },
];

export default function BasisRisk() {
  const ref = useScrollReveal();

  return (
    <section id="basis" ref={ref} className="py-24 px-4 bg-navy-950">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-amber-400 mb-2">
          // honest_by_default
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Transparent About<br />
          <span className="text-amber-400">Basis Risk</span>
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mb-12">
          We don't hide limitations. We acknowledge them, quantify them, and show how we mitigate them.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* The Reality */}
          <div
            className="reveal rounded-2xl p-8"
            style={{ background: "rgba(10,18,32,0.85)", border: "1px solid rgba(251,191,36,0.15)" }}
          >
            <h3 className="font-display font-bold text-white text-xl mb-4">The Reality</h3>

            <div className="mb-6">
              <p
                className="font-display font-extrabold leading-none mb-2"
                style={{ fontSize: "3.5rem", color: "#fbbf24" }}
              >
                ~13%
              </p>
              <p className="text-slate-500 text-sm">mismatch risk due to station-to-zone distance</p>
            </div>

            <div className="space-y-0">
              {SCENARIOS.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start py-4"
                  style={{ borderBottom: i < SCENARIOS.length - 1 ? "1px solid rgba(22,40,64,0.6)" : "none" }}
                >
                  <span className="text-amber-400 font-bold mt-0.5 flex-shrink-0">→</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 p-4 rounded-xl text-sm text-slate-400 leading-relaxed"
              style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}
            >
              We're honest about this because workers deserve to know exactly what they're buying.
            </div>
          </div>

          {/* How We Reduce It */}
          <div className="flex flex-col gap-3">
            {MITIGATIONS.map((m, i) => (
              <div
                key={i}
                className="reveal rounded-2xl p-5 transition-all duration-300"
                style={{
                  background: "rgba(52,211,153,0.05)",
                  border: "1px solid rgba(52,211,153,0.18)",
                  transitionDelay: `${i * 70}ms`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(52,211,153,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(52,211,153,0.18)")}
              >
                <h4 className="font-display font-bold text-emerald-400 text-sm mb-1.5">{m.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why honesty matters */}
        <div
          className="reveal mt-6 rounded-2xl p-6 flex gap-4 items-start"
          style={{ background: "rgba(10,18,32,0.7)", border: "1px solid rgba(22,40,64,0.8)" }}
        >
          <TrendingUp className="w-5 h-5 text-rain-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-white mb-1.5">Why We're Honest About This</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              We don't hide basis risk — we acknowledge it, quantify it (~13%), and show exactly how we
              mitigate it. This builds more trust than pretending the limitation doesn't exist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}