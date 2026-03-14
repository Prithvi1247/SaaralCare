// components/layout/Navbar.jsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Shield, Menu, X } from "lucide-react";

export default function Navbar({ transparent = false }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#coverage", label: "Coverage" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-navy-950/90 backdrop-blur-md border-b border-navy-800"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rain-500 to-rain-700 flex items-center justify-center shadow-lg shadow-rain-500/30 group-hover:shadow-rain-500/50 transition-shadow">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-white text-lg tracking-tight">
              Saaral<span className="text-rain-400">Care</span>
              <span className="text-amber-400 ml-0.5">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">
              Sign In
            </Link>
            <Link href="/login" className="btn-primary text-sm py-2 px-4">
              Get Protected
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-navy-800 px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-slate-300 hover:text-white text-sm font-medium py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
            <Link href="/login" className="btn-secondary text-sm text-center">
              Sign In
            </Link>
            <Link href="/login" className="btn-primary text-sm text-center">
              Get Protected
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
