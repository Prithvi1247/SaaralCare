// components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";

export default function Navbar({ transparent = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle background change on scroll for better visibility
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#/landing/how-it-works", label: "How It Works" },
    { href: "/#coverage", label: "Coverage" }, // Ensure BasisRisk.jsx or Features.jsx has id="coverage"
    { href: "/#faq", label: "FAQ" },         // Ensure your FAQ component has id="faq"
  ];

  const closeMenu = () => setOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent && !scrolled && !open
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
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-navy-900 border-t border-navy-800`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-slate-300 hover:text-white text-base font-medium"
              onClick={closeMenu}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-navy-800 flex flex-col gap-3">
            <Link 
              href="/login" 
              className="w-full py-3 text-center rounded-xl bg-navy-800 text-white font-medium border border-navy-700"
              onClick={closeMenu}
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="w-full py-3 text-center rounded-xl bg-rain-600 text-white font-medium hover:bg-rain-500 transition-colors shadow-lg shadow-rain-900/20"
              onClick={closeMenu}
            >
              Get Protected
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}