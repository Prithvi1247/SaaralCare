// components/landing/BasisRisk.jsx
import { TrendingUp } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const SCENARIOS = [
  {
    title: "Heavy rain at your location, light at our grid point",
    sub: "Spatial mismatch → no trigger fired (false negative). We disclose this upfront.",
  },
  {
    title: "Light rain at your location, heavy at our grid point",
    sub: "Grid picks up nearby rain → partial payout may fire (false positive). Acts as a buffer.",
  },
];

const MITIGATIONS = [
  {
    title: "✓ 4-Point Spatial Averaging",
    desc: "Each zone uses N/S/E/W 1 km grid points from Open-Meteo — averaged hourly. One bad station reading cannot skew your trigger.",
  },
  {
    title: "✓ Partial Payout Tier",
    desc: "Thresholds at 15 mm (peak) and 35 mm (non-peak) capture marginal rain events, significantly reducing false negatives.",
  },
  {
    title: "✓ Nearest Zone Assignment",
    desc: "Workers are always mapped to their home delivery zone. Maximum drift enforced. No cross-zone assignment.",
  },
  {
    title: "✓ Honest Onboarding",
    desc: "Every delivery partner sees their mapped zone, assigned grid point, and basis risk percentage before they pay ₹1.",
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
        <p className="text-slate-300 text-sm leading-relaxed max-w-lg mb-12">
          We don't hide limitations. We acknowledge them, quantify them, and show exactly how we mitigate them.
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
              <p className="text-slate-200 text-sm">spatial mismatch risk — grid point vs. your exact location</p>
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
                    <p className="text-slate-200 text-xs leading-relaxed">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 p-4 rounded-xl text-sm text-slate-300 leading-relaxed"
              style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}
            >
              We tell every worker this before they enroll — because trust is the product.
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
                <p className="text-slate-300 text-xs leading-relaxed">{m.desc}</p>
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
            <p className="text-sm text-slate-300 leading-relaxed">
              Parametric insurance lives and dies on worker trust. We don't pretend basis risk doesn't exist —
              we quantify it at ~13%, mitigate it with spatial averaging, and disclose it at onboarding.
              That transparency is what makes delivery partners actually believe the payout will come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}