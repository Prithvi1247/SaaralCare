// components/landing/HowItWorks.jsx
import Link from "next/link";
import { Smartphone, MapPin, CloudRain, Banknote, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Smartphone,
    title: "Register with your phone",
    description:
      "Enter your mobile number and verify with OTP. Tell us your delivery zone and vehicle type.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "We map your zone",
    description:
      "Our AI maps your delivery zone to the nearest IMD certified rainfall measurement station.",
  },
  {
    number: "03",
    icon: CloudRain,
    title: "Rain triggers coverage",
    description:
      "When rainfall at your station exceeds the threshold (e.g. 15mm in 3 hours), your coverage activates.",
  },
  {
    number: "04",
    icon: Banknote,
    title: "Auto payout to your UPI",
    description:
      "₹300–₹800 is credited to your UPI ID automatically. No claim needed. No waiting.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-navy-900 relative overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(58,159,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(58,159,212,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            From sign-up to payout
            <br />
            <span className="italic text-slate-300">in minutes</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-rain-600/40 to-transparent z-10 -translate-y-1/2" style={{ width: "calc(100% - 3rem)" }} />
              )}

              <div className="glass-card rounded-2xl p-6 h-full">
                {/* Step number */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-4xl font-bold text-navy-700 select-none">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rain-500/15 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-rain-400" />
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="glass-card gradient-border rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-1.5">
              Ready to get covered?
            </h3>
            <p className="text-slate-400 text-sm">
              Join 12,400+ delivery workers already protected by SaaralCare AI.
            </p>
          </div>
          <Link href="/login" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            Start for ₹29/week
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
