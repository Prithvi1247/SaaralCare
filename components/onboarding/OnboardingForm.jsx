// components/onboarding/OnboardingForm.jsx
// Mount: reads gs_worker_phone → fetches platform_workers → prefills name, platform, zone.
// Zone field is read-only (authoritative value from platform).
// Submit: duplicate check → zones coords → nearest station → insert workers.

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { User, MapPin, CreditCard, ChevronRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// ── Haversine distance (km) ───────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Static UI constants (layout unchanged) ────────────────────────────────────
const PLATFORMS = [
  "Zomato", "Swiggy"
];

const STEPS = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Zone & Vehicle",   icon: MapPin },
  { id: 3, title: "KYC & Payout",     icon: CreditCard },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function OnboardingForm() {
  const router = useRouter();

  const [step, setStep]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError]         = useState("");
  const [done, setDone]           = useState(false);

  // Form fields shown to the user
  const [form, setForm] = useState({
    name:     "",
    platform: "",
    zone:     "",   // pre-filled from platform_workers.delivery_zone; read-only
  });

  // Extra fields needed at insert time, not shown as editable inputs
  const [meta, setMeta] = useState({
    phone:            "",
    avg_daily_income: 0,
  });

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // ── Mount: prefill from platform_workers ──────────────────────────────────
  useEffect(() => {
    async function loadProfile() {
      try {
        const phone =
          typeof window !== "undefined"
            ? sessionStorage.getItem("gs_worker_phone")
            : null;

        if (!phone) {
          router.replace("/login");
          return;
        }

        const { data, error: dbErr } = await supabase
          .from("platform_workers")
          .select("phone, name, platform, delivery_zone, avg_daily_income")
          .eq("phone", phone)
          .maybeSingle();

        if (dbErr) throw new Error(dbErr.message);
        if (!data)  throw new Error("Platform profile not found. Please log in again.");

        setForm({
          name:     data.name            ?? "",
          platform: data.platform        ?? "",
          zone:     data.delivery_zone   ?? "",
        });

        setMeta({
          phone:            data.phone,
          avg_daily_income: data.avg_daily_income ?? 0,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setInitLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ── Submit: duplicate → zone coords → nearest station → insert ───────────
  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const { phone, avg_daily_income } = meta;

      // 1. Duplicate check
      const { data: existing, error: existErr } = await supabase
        .from("workers")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (existErr) throw new Error(existErr.message);
      if (existing) {
        router.push("/dashboard");
        return;
      }

      // 2. Zone coordinates
      const { data: zoneRow, error: zoneErr } = await supabase
        .from("zones")
        .select("latitude, longitude")
        .eq("zone_name", form.zone)
        .maybeSingle();

      if (zoneErr)  throw new Error(zoneErr.message);
      if (!zoneRow) throw new Error(`Zone "${form.zone}" not found in database.`);

      const { latitude: zoneLat, longitude: zoneLng } = zoneRow;

      // 3. Nearest station via Haversine
      const { data: stations, error: stErr } = await supabase
        .from("stations")
        .select("id, station_name, latitude, longitude");

      if (stErr)             throw new Error(stErr.message);
      if (!stations?.length) throw new Error("No rainfall stations found in database.");

      let nearest = null;
      let minDist  = Infinity;
      for (const st of stations) {
        const d = haversineKm(zoneLat, zoneLng, st.latitude, st.longitude);
        if (d < minDist) { minDist = d; nearest = st; }
      }

      // 4. Insert worker
      const { error: insertErr } = await supabase.from("workers").insert({
        name:             form.name,
        phone:            phone,
        platform:         form.platform,
        zone:             form.zone,
        latitude:         zoneLat,
        longitude:        zoneLng,
        station_id:       nearest.id,
        avg_daily_income: avg_daily_income,
        created_at:       new Date().toISOString(),
      });

      if (insertErr) throw new Error(insertErr.message);

      sessionStorage.setItem("gs_worker_name", form.name);
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen (JSX unchanged) ───────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          Welcome to SaaralCare!
        </h3>
        <p className="text-slate-400">Setting up your dashboard…</p>
      </div>
    );
  }

  // Spinner while platform profile loads
  if (initLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw className="w-6 h-6 text-rain-400 animate-spin" />
      </div>
    );
  }

  // ── Form (all JSX layout/classes identical to previous version) ──────────
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  step > s.id
                    ? "bg-emerald-500 text-white"
                    : step === s.id
                    ? "bg-rain-500 text-white ring-4 ring-rain-500/20"
                    : "bg-navy-800 text-slate-500 border border-navy-600"
                }`}
              >
                {step > s.id ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium hidden sm:block ${
                  step === s.id ? "text-white" : "text-slate-500"
                }`}
              >
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 transition-colors ${
                  step > s.id ? "bg-emerald-500/50" : "bg-navy-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Personal Details ── */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-up opacity-0">
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            Tell us about yourself
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Rahul Kumar"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Platform you deliver for
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setField("platform", p)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    form.platform === p
                      ? "bg-rain-500/20 border-rain-500 text-rain-300"
                      : "bg-navy-800 border-navy-600 text-slate-400 hover:border-navy-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!form.name || !form.platform}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Step 2: Zone (read-only, pre-filled from platform) ── */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-up opacity-0">
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            Your delivery details
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Primary Delivery Zone
            </label>
            <input
              type="text"
              value={form.zone}
              readOnly
              className="input-field opacity-70 cursor-not-allowed"
            />
            <p className="text-slate-500 text-xs mt-1.5">
              Zone assigned by your delivery platform.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.zone}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirm + Submit ── */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-up opacity-0">
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            Confirm your details
          </h2>

          <div className="glass-card rounded-xl p-4 border border-rain-500/20">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">
              Coverage Summary
            </p>
            <div className="space-y-2">
              {[
                ["Name",              form.name],
                ["Platform",          form.platform],
                ["Zone",              form.zone],
                ["Weekly Premium",    "₹29"],
                ["Max Weekly Payout", "₹800"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-white font-medium capitalize">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Activate Coverage"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
