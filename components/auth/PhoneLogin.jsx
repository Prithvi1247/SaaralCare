// components/auth/PhoneLogin.jsx
// Flow:
//   1. Query platform_workers — if missing → "Worker not registered on platform."
//   2. Query workers          — if exists  → /dashboard
//                             — if missing → store phone, → /onboarding

import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const STEPS = { PHONE: "phone", SUCCESS: "success" };

export default function PhoneLogin() {
  const router          = useRouter();
  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (phone.length < 10) return setError("Enter a valid 10-digit mobile number.");

    setError("");
    setLoading(true);

    try {
      const normalised = `${phone}`;

      // ── Step 1: platform verification ─────────────────────────────────
      const { data: platformWorker, error: pwErr } = await supabase
        .from("platform_workers")
        .select("phone, name")
        .eq("phone", normalised)
        .maybeSingle();

      if (pwErr) throw new Error(pwErr.message);

      if (!platformWorker) {
        setError("Worker not registered on platform.");
        return;
      }

      // ── Step 2: check if onboarding is already complete ───────────────
      const { data: existingWorker, error: wErr } = await supabase
        .from("workers")
        .select("id")
        .eq("phone", normalised)
        .maybeSingle();

      if (wErr) throw new Error(wErr.message);

      // Always persist the phone so downstream pages can read it
      sessionStorage.setItem("gs_worker_phone", normalised);
      sessionStorage.setItem("gs_worker_name",  platformWorker.name ?? "");

      setStep(STEPS.SUCCESS);
      setTimeout(
        () => router.push(existingWorker ? "/dashboard" : "/onboarding"),
        1000
      );
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen (UI unchanged) ─────────────────────────────────────────
  if (step === STEPS.SUCCESS) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-1">
          Verified!
        </h3>
        <p className="text-slate-400 text-sm">Redirecting you…</p>
      </div>
    );
  }

  // ── Phone entry form (UI unchanged) ───────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up opacity-0">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Mobile Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 bg-navy-700 border border-r-0 border-navy-600 rounded-l-xl text-slate-300 text-sm font-medium">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => {
                setError("");
                setPhone(e.target.value.replace(/\D/g, ""));
              }}
              className="input-field rounded-l-none"
              autoFocus
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-slate-500 text-xs text-center">
          By continuing you agree to our{" "}
          <a href="#" className="text-rain-400 hover:underline">Terms</a> &{" "}
          <a href="#" className="text-rain-400 hover:underline">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
}
