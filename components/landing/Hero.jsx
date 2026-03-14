// components/landing/Hero.jsx
import Link from "next/link";
import { CloudRain, ArrowRight, Zap } from "lucide-react";

const RAIN_DROPS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${1.2 + Math.random() * 1.5}s`,
  opacity: 0.15 + Math.random() * 0.35,
}));

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-rain-gradient">
      {/* Animated rain backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {RAIN_DROPS.map((d) => (
          <div
            key={d.id}
            className="absolute w-px rounded-full bg-rain-400"
            style={{
              left: d.left,
              top: "-10px",
              height: "60px",
              opacity: d.opacity,
              animation: `rain ${d.duration} linear ${d.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-rain-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-rain-600/20 border border-rain-500/30 rounded-full px-4 py-1.5 mb-8 animate-fade-up opacity-0 delay-100">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-rain-300 text-xs font-medium tracking-wide uppercase">
              Parametric Insurance · Auto Payouts
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-up opacity-0 delay-200">
            Rain shouldn't
            <br />
            <span className="text-rain-400 italic">drain</span> your
            <br />
            income.
          </h1>

          {/* Subhead */}
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-fade-up opacity-0 delay-300">
            SaaralCare AI automatically pays delivery workers when heavy rain
            cuts their earnings — no claims, no paperwork, just a transfer to
            your account.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 delay-400">
            <Link href="/login" className="btn-primary flex items-center justify-center gap-2 text-base">
              Protect My Income
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2 text-base">
              <CloudRain className="w-4 h-4 text-rain-400" />
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap gap-8 animate-fade-up opacity-0 delay-500">
            {[
              { label: "Workers Protected", value: "12,400+" },
              { label: "Avg. Payout Time", value: "< 4 hrs" },
              { label: "Cities Active", value: "8" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  );
}
