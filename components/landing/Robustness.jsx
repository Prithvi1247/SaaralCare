// components/landing/Robustness.jsx
import { Shield } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const FAILURES = [
  {
    icon: "☁️",
    title: "Weather API Down",
    mitigation: "Fallback to backup API + 6-hour cached data window. Zero data gap.",
  },
  {
    icon: "💳",
    title: "Payment Gateway Fails",
    mitigation: "Retry queue + manual review buffer within 2hr SLA. Payout never lost.",
  },
  {
    icon: "📍",
    title: "Station Data Missing",
    mitigation: "Nearest-neighbor lookup from 3 adjacent stations. Automatic alert fired.",
  },
  {
    icon: "🗄️",
    title: "Database Connection Lost",
    mitigation: "Connection pool + read replicas across 2 regions. Sub-second failover.",
  },
];

export default function Robustness() {
  const ref = useScrollReveal();

  return (
    <section id="robustness" ref={ref} className="py-24 px-4 bg-navy-950">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase text-emerald-400 mb-2">
          // system_resilience
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
          If Systems Fail,<br />
          <span className="text-emerald-400">Payouts Don't</span>
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mb-12">
          Multi-layer redundancy ensures zero payout loss, even in extreme conditions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {FAILURES.map((f, i) => (
            <div
              key={i}
              className="reveal flex gap-5 items-start rounded-2xl p-6 transition-all duration-300"
              style={{
                background: "rgba(10,18,32,0.8)",
                border: "1px solid rgba(22,40,64,0.9)",
                transitionDelay: `${i * 70}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(52,211,153,0.25)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(22,40,64,0.9)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span className="text-3xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <h4 className="font-display font-bold text-white text-base mb-1.5">{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">→ </span>
                  {f.mitigation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div
          className="reveal flex gap-4 items-start rounded-2xl p-6"
          style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)" }}
        >
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-white mb-2">Built for Trust</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Workers trust the system because it doesn't fail them. In parametric insurance, the
              system's reliability IS the brand. Every redundancy is designed with one goal:{" "}
              <strong className="text-white">never lose a payout.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}