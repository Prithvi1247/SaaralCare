// components/landing/Testimonials.jsx
import useScrollReveal from "@/hooks/useScrollReveal";

const TESTIMONIALS = [
  {
    name: "Arjun S.",
    zone: "Tambaram",
    platform: "Zomato",
    emoji: "🛵",
    quote:
      "During the July floods I got ₹800 in my account by 4pm. I didn't even have to call anyone. It just happened.",
  },
  {
    name: "Priya M.",
    zone: "Mylapore",
    platform: "Swiggy",
    emoji: "🚲",
    quote:
      "₹29 a week is less than a cup of chai. But when it rains heavy I know I'm not losing a full day's income.",
  },
  {
    name: "Ravi K.",
    zone: "Anna Nagar",
    platform: "Swiggy",
    emoji: "🏍️",
    quote:
      "Signing up took 2 minutes on my phone. Third week in, I got my first payout. These people are serious.",
  },
];

export default function Testimonials() {
  const ref = useScrollReveal();

  return (
    <section id="testimonials" ref={ref} className="py-24 px-4 bg-navy-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono text-xs tracking-widest uppercase text-rain-400 mb-3">
            // real_stories
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Delivery Workers Love<br />
            <span className="italic text-slate-300">SaaralCare</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="reveal flex flex-col rounded-2xl p-7 transition-all duration-300"
              style={{
                background: "rgba(10,18,32,0.85)",
                border: "1px solid rgba(22,40,64,0.9)",
                transitionDelay: `${i * 80}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(22,40,64,0.9)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p className="text-slate-300 text-sm leading-relaxed italic flex-1 mb-6">
                "{t.quote}"
              </p>
              <div
                className="flex items-center gap-3 pt-5"
                style={{ borderTop: "1px solid rgba(22,40,64,0.8)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "rgba(22,40,64,0.9)" }}
                >
                  {t.emoji}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t.platform} · {t.zone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}