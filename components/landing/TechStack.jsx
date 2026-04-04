// components/landing/TechStack.jsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";

const TECH = [
  { icon: "🐘", name: "Supabase",      desc: "PostgreSQL + Auth"    },
  { icon: "🌧️", name: "OpenWeather",   desc: "Rainfall data API"    },
  { icon: "💳", name: "Razorpay",      desc: "UPI payments"         },
  { icon: "⚛️", name: "React Native",  desc: "Mobile app"           },
  { icon: "▲",  name: "Next.js",       desc: "Web platform"         },
  { icon: "🦕", name: "Deno Edge",     desc: "Serverless functions" },
];

export default function TechStack() {
  const ref = useScrollReveal();

  return (
    <section id="tech" ref={ref} className="py-24 px-4 bg-navy-900">
      <div className="max-w-7xl mx-auto">
        {/* Stack */}
        <div className="text-center mb-14">
          <p className="font-mono text-xs tracking-widest uppercase text-rain-400 mb-2">
            // production_grade_infrastructure
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Built With <span className="text-rain-400">Best-in-Class</span> Tools
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {TECH.map((t, i) => (
            <div
              key={i}
              className="reveal rounded-2xl p-5 text-center transition-all duration-300 cursor-default"
              style={{
                background: "rgba(10,18,32,0.85)",
                border: "1px solid rgba(22,40,64,0.9)",
                transitionDelay: `${i * 60}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(22,40,64,0.9)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <p className="font-display font-bold text-white text-sm">{t.name}</p>
              <p className="text-slate-500 text-xs mt-1">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div
          className="reveal relative rounded-2xl p-10 sm:p-14 text-center overflow-hidden"
          style={{ border: "1px solid rgba(56,189,248,0.18)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Transform<br />Gig Worker Protection?
            </h2>
            <p className="text-slate-400 text-base mb-8 leading-relaxed">
              Zero friction. Full transparency. Actual impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-base"
              >
                Start for ₹29/week
              </Link>
            </div>

            <p className="mt-8 text-xs text-slate-600 tracking-wide">
              ✓ 100% Automated · ✓ Zero Fraud · ✓ Audit-Ready · ✓ IRDAI Registered
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}