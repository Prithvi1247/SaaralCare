// components/landing/HowItWorks.jsx
import Link from "next/link";
import { Smartphone, MapPin, CloudRain, Banknote, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Smartphone,
    title: "Register in Tamil, Hindi or English",
    description:
      "Enter your mobile number, verify with OTP, and tell us your Chennai delivery zone. Entire onboarding in under 2 minutes — in the language you're comfortable with.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "We map your Chennai zone",
    description:
      "Your zone is pinned to the nearest Open-Meteo measurement grid. Rainfall is averaged across 4 spatial points for maximum accuracy — not a single distant station.",
  },
  {
    number: "03",
    icon: CloudRain,
    title: "Engine checks rain + peak hours",
    description:
      "Every hour, our parametric engine evaluates rainfall intensity, duration, and whether it overlaps your peak earning window. Peak-hour rain triggers a 1.5× weighted score.",
  },
  {
    number: "04",
    icon: Banknote,
    title: "UPI credited. Nothing to do.",
    description:
      "₹300–₹800 lands in your UPI within 4 hours. No claim. No call center. No waiting. You get a notification in your language and an audit trail is logged automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-navy-900 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(58,159,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(58,159,212,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            From sign-up to first payout
            <br />
            <span className="italic text-slate-300">in one rainy afternoon</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-rain-600/40 to-transparent z-10 -translate-y-1/2"
                  style={{ width: "calc(100% - 3rem)" }}
                />
              )}
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-4xl font-bold text-navy-700 select-none">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rain-500/15 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-rain-400" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card gradient-border rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-1.5">
              Ready to ride through the rain?
            </h3>
            <p className="text-slate-400 text-sm">
              Join 12,400+ Swiggy & Zomato partners already protected across Chennai.
            </p>
          </div>
          <Link href="/login" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            Start for ₹49/week
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}