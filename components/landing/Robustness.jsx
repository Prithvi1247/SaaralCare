// components/landing/Robustness.jsx
import { Shield } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const FAILURES = [
  {
    icon: "☁️",
    title: "Open-Meteo API Unavailable",
    mitigation: "6-hour rolling cache + secondary grid fallback. Trigger evaluation pauses, never drops. Data gap = zero.",
  },
  {
    icon: "💳",
    title: "UPI / Razorpay Gateway Fails",
    mitigation: "Retry queue with exponential backoff. Manual review buffer within 2-hour SLA. No payout is ever lost — it queues.",
  },
  {
    icon: "📍",
    title: "Zone Grid Data Missing",
    mitigation: "Nearest-neighbor spatial interpolation from 3 adjacent grid points fires automatically. Alert raised to ops.",
  },
  {
    icon: "🗄️",
    title: "Supabase / DB Connection Lost",
    mitigation: "Connection pooling + read replicas across 2 regions. Sub-second failover. Worker state is never corrupted.",
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
        <p className="text-slate-100 text-sm leading-relaxed max-w-lg mb-12">
          Multi-layer redundancy ensures zero payout loss — even when Chennai's NE monsoon brings everything down at once.
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
                <p className="text-sm text-slate-200 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">→ </span>
                  {f.mitigation}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal flex gap-4 items-start rounded-2xl p-6"
          style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)" }}
        >
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-white mb-2">Built for Trust</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              A delivery partner sitting in the rain at 2 PM doesn't care about uptime SLAs. They care about
              one thing: does the money come? Our entire redundancy architecture exists to answer that with
              a permanent <strong className="text-white">yes.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}