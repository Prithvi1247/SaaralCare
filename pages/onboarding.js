// pages/onboarding.js — Worker onboarding page
import Head from "next/head";
import Link from "next/link";
import { Shield, CloudRain } from "lucide-react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <>
      <Head>
        <title>Get Started — SaaralCare AI</title>
      </Head>

      <div className="min-h-screen bg-navy-950 flex flex-col">
        {/* Header */}
        <header className="border-b border-navy-800 px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rain-500 to-rain-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">
                Saaral<span className="text-rain-400">Care</span>
                <span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm">Step 2 of 2 — Setup</p>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-start justify-center px-4 py-12">
          <div className="w-full max-w-xl">
            {/* Headline */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rain-500/15 mb-5">
                <CloudRain className="w-7 h-7 text-rain-400" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                Let's get you covered
              </h1>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Just a few details and you'll be protected against rain-related
                income loss. Takes under 2 minutes.
              </p>
            </div>

            {/* Coverage preview strip */}
            <div className="flex items-center justify-center gap-8 mb-10">
              {[
                { label: "Weekly Premium", value: "₹29" },
                { label: "Max Payout", value: "₹800/wk" },
                { label: "Claim Process", value: "Automatic" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-xl font-bold text-rain-400">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Form card */}
            <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-navy-950/50">
              <OnboardingForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
