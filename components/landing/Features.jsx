// components/landing/Features.jsx
import { CloudRain, Zap, MapPin, Shield, CreditCard, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: CloudRain,
    color: "text-rain-400",
    bg: "bg-rain-400/10",
    title: "Peak-Hour Weighted Triggers",
    description:
      "Rainfall during lunch (1–3 PM) and dinner (8–10 PM) rush hours hits 1.5× harder on income. Our engine knows that — and pays accordingly. Industry first.",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "UPI Credit in Under 4 Hours",
    description:
      "The moment a qualifying event is confirmed by Open-Meteo, your UPI account is credited automatically. No claim form. No adjuster. No waiting room.",
  },
  {
    icon: MapPin,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Hyper-Local Zone Accuracy",
    description:
      "Each Chennai zone is measured using a 4-point spatial average — 1 km North, South, East and West of your zone center. Not one station. Four. Averaged.",
  },
  {
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Fraud-Proof by Architecture",
    description:
      "No GPS. No manual claims. No location switching. Fixed worker–zone–station mapping eliminates every fraud entry point before it can be exploited.",
  },
  {
    icon: CreditCard,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    title: "₹29/week. Cancel Anytime.",
    description:
      "Less than a cup of chai a day. Weekly auto-debit. No lock-in. Cancel anytime. Coverage activates 7 days after payment to prevent forecast abuse.",
  },
  {
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "Tamil · Hindi · English",
    description:
      "Full multilingual support across the entire platform. Every delivery partner in Chennai can onboard, check status, and receive notifications in their language.",
  },
];

export default function Features() {
  return (
    <section id="coverage" className="py-24 px-4 bg-navy-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rain-400 text-sm font-medium tracking-widest uppercase mb-3">
            Why SaaralCare AI
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Built for the realities of
            <br />
            <span className="text-rain-400 italic">Chennai's rain seasons</span>
          </h2>
        </div>

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