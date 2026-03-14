// components/layout/Footer.jsx
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rain-500 to-rain-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-white text-lg">
                Saaral<span className="text-rain-400">Care</span>
                <span className="text-amber-400 ml-0.5">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Parametric income protection for delivery workers — automated
              payouts triggered by rainfall, no paperwork needed.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["How It Works", "Coverage Details", "Pricing", "FAQ"].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Blog", "Careers", "Contact"].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2024 SaaralCare AI. IRDAI Registered Intermediary.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Grievance"].map((l) => (
              <Link key={l} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
