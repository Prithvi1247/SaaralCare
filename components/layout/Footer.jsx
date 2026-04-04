// components/layout/Footer.jsx
import Link from "next/link";
import { Shield } from "lucide-react";

const PRODUCT_LINKS = ["How It Works", "Coverage Details", "Pricing", "FAQ"];
const COMPANY_LINKS = ["About Us", "Blog", "Careers", "Contact"];
const LEGAL_LINKS   = ["Privacy Policy", "Terms of Service", "Grievance"];

export default function Footer() {
  return (
    <footer
      className="px-4 pt-16 pb-8"
      style={{ background: "#060b14", borderTop: "1px solid rgba(22,40,64,0.8)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Tagline ── */}
        <div
          className="text-center pb-12 mb-12"
          style={{ borderBottom: "1px solid rgba(22,40,64,0.8)" }}
        >
          <p
            className="font-display font-extrabold text-white leading-tight"
            style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)" }}
          >
            We don't process{" "}
            <span className="text-rain-400">claims</span>.<br />
            We process{" "}
            <span className="text-rain-400">events</span>.
          </p>
        </div>

        {/* ── Links grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                  boxShadow: "0 0 16px rgba(14,165,233,0.35)",
                }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                Saaral<span className="text-rain-400">Care</span>
                <span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              Parametric income protection for delivery workers — automated
              payouts triggered by rainfall, zero paperwork required.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "IRDAI Registered", color: "#38bdf8", bg: "rgba(56,189,248,0.07)", border: "rgba(56,189,248,0.2)" },
                { label: "100% Automated",   color: "#34d399", bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.2)" },
                { label: "Zero Fraud",       color: "#fbbf24", bg: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.2)" },
              ].map((b) => (
                <span
                  key={b.label}
                  className="font-mono text-xs px-2.5 py-1 rounded-lg border"
                  style={{ color: b.color, background: b.bg, borderColor: b.border }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(22,40,64,0.8)" }}
        >
          <p className="text-slate-600 text-xs">
            © 2024 SaaralCare AI. IRDAI Registered Intermediary.
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l}
                href="#"
                className="text-slate-600 hover:text-slate-400 text-xs transition-colors duration-200"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}