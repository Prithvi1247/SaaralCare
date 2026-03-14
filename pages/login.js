// pages/login.js — Phone login page
import Head from "next/head";
import Link from "next/link";
import { Shield, CloudRain } from "lucide-react";
import PhoneLogin from "@/components/auth/PhoneLogin";

const RAIN_DROPS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${1.5 + Math.random() * 1.5}s`,
  opacity: 0.1 + Math.random() * 0.2,
}));

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign In — SaaralCare AI</title>
      </Head>

      <div className="min-h-screen bg-rain-gradient flex items-center justify-center px-4 relative overflow-hidden">
        {/* Rain backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {RAIN_DROPS.map((d) => (
            <div
              key={d.id}
              className="absolute w-px rounded-full bg-rain-400"
              style={{
                left: d.left,
                top: "-10px",
                height: "50px",
                opacity: d.opacity,
                animation: `rain ${d.duration} linear ${d.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-rain-600/10 blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rain-500 to-rain-700 flex items-center justify-center shadow-xl shadow-rain-500/30">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-xl">
                Saaral<span className="text-rain-400">Care</span>
                <span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in with your mobile number to access your coverage
            </p>
          </div>

          {/* Login card */}
          <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-navy-950/50">
            <PhoneLogin />
          </div>

          {/* Sign up prompt */}
          <p className="text-center text-slate-400 text-sm mt-6">
            New to SaaralCare?{" "}
            <Link href="/login" className="text-rain-400 hover:text-rain-300 transition-colors font-medium">
              Get protected in 2 minutes
            </Link>
          </p>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {["IRDAI Registered", "256-bit Encrypted", "Auto Payouts"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="w-1 h-1 rounded-full bg-rain-500/60" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
