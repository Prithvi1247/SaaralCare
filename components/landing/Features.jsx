// components/landing/Features.jsx
import { CloudRain, Zap, MapPin, Shield, CreditCard, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: CloudRain,
    color: "text-rain-400",
    bg: "bg-rain-400/10",
    title: "Rainfall-Triggered Payouts",
    description:
      "Linked to certified IMD weather stations. When rainfall exceeds your threshold, a payout is automatically initiated.",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Instant Transfers",
    description:
      "Funds reach your UPI ID within 4 hours of a qualifying rain event. No claim form, no adjuster visit.",
  },
  {
    icon: MapPin,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Zone-Based Coverage",
    description:
      "Your delivery zone is mapped to the nearest rainfall station. Coverage is hyper-local and accurate.",
  },
  {
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "IRDAI Registered",
    description:
      "Backed by a licensed insurer. Your policy is fully compliant and your money is protected by law.",
  },
  {
    icon: CreditCard,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    title: "₹29/week Premium",
    description:
      "Affordable weekly premiums deducted automatically. Cancel anytime with no penalties.",
  },
  {
    icon: Clock,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "2-Minute Onboarding",
    description:
      "Just your phone number and delivery zone. No medical exams, no lengthy forms.",
  },
];

export default function Features() {
  return (
    <section id="coverage" className="py-24 px-4 bg-navy-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-rain-400 text-sm font-medium tracking-widest uppercase mb-3">
            Why SaaralCare
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Protection built for
            <br />
            <span className="text-rain-400 italic">gig workers</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass-card gradient-border rounded-2xl p-6 hover:border-rain-500/30 transition-all duration-300 group"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2.5">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
