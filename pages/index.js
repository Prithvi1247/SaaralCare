import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorEffect from "@/components/layout/Cursoreffect";
import Hero from "@/components/landing/Hero";
import Coresystem from "@/components/landing/Coresystem";
import Explainability from "@/components/landing/Explainability";
import Robustness from "@/components/landing/Robustness";
import Stressscenario from "@/components/landing/Stressscenario";
import BasisRisk from "@/components/landing/BasisRisk";
import TechStack from "@/components/landing/TechStack";
import Testimonials from "@/components/landing/Testimonials";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>SaaralCare AI — Zero-Touch Rainfall Insurance for Gig Workers</title>
        <meta name="description" content="Parametric income protection for delivery workers. Automated payouts triggered by rainfall. Zero claims, no verification, no waiting." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-navy-950 overflow-x-hidden">
        <CursorEffect />
        <Navbar transparent={!scrolled} />

        {/* ========== HERO ========== */}
        <Hero />

        {/* ========== CORE SYSTEM ========== */}
        <Coresystem />

        {/* ========== EXPLAINABILITY ========== */}
        <Explainability />

        {/* ========== ROBUSTNESS ========== */}
        <Robustness />

        {/* ========== STRESS SCENARIO ========== */}
        <Stressscenario />

        {/* ========== BASIS RISK ========== */}
        <BasisRisk />

        {/* ========== TECH STACK ========== */}
        <TechStack />

        {/* ========== TESTIMONIALS ========== */}
        <Testimonials />

        {/* ========== FOOTER CTA ========== */}
        <section className="py-20 bg-navy-950 border-t border-navy-800 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
              We don't process <span className="text-rain-400">claims</span>
            </h2>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-8">
              We process <span className="text-rain-400">events</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Parametric income protection for delivery workers — automated payouts triggered by rainfall, zero paperwork required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-rain-500 to-rain-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-rain-500/50 transition-all duration-200">
                Get Protected in 2 Minutes →
              </Link>
              <Link href="/dashboard" className="inline-block px-8 py-4 border border-rain-500/30 text-rain-400 rounded-2xl font-semibold hover:bg-rain-500/10 transition-all duration-200">
                View Dashboard
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style jsx global>{`
        /* Scroll reveal animations */
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Core animations */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(56, 189, 248, 0); }
        }

        @keyframes float-cloud {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(30px) translateY(-10px); }
          66% { transform: translateX(-20px) translateY(8px); }
        }

        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .cursor-blink {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: var(--rain-400);
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 1.2s step-end infinite;
        }
      `}</style>
    </>
  );
}
