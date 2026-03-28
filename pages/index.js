// pages/index.js — Landing page
import Head from "next/head";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>SaaralCare AI — Rain Shouldn't Drain Your Income</title>
       
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
        <meta
          name="description"
          content="Parametric income protection for delivery workers. Automatic payouts when heavy rain cuts your earnings."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar transparent />
      <main>
        <Hero />
        <Features />
        <HowItWorks />

        {/* Testimonials */}
        <section className="py-24 px-4 bg-navy-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-rain-400 text-sm font-medium tracking-widest uppercase mb-3">
                Real Stories
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
                Delivery workers love
                <br />
                <span className="italic text-slate-300">SaaralCare</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Arjun S.",
                  zone: "Andheri, Mumbai",
                  platform: "Zomato",
                  quote:
                    "During the July floods I got ₹800 in my account by 4pm. I didn't even have to call anyone. It just happened.",
                  emoji: "🛵",
                },
                {
                  name: "Priya M.",
                  zone: "Bandra, Mumbai",
                  platform: "Blinkit",
                  quote:
                    "₹29 a week is less than a cup of chai. But when it rains heavy I know I'm not losing a full day's income.",
                  emoji: "🚲",
                },
                {
                  name: "Ravi K.",
                  zone: "Thane",
                  platform: "Swiggy",
                  quote:
                    "Signing up took 2 minutes on my phone. Third week in, I got my first payout. These people are serious.",
                  emoji: "🏍️",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="glass-card gradient-border rounded-2xl p-6 flex flex-col"
                >
                  <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-navy-700">
                    <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                      {t.emoji}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-slate-400 text-xs">
                        {t.platform} · {t.zone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
