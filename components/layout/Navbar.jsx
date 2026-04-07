// components/layout/Navbar.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#core", label: "System" },
    { href: "#explain", label: "Explainability" },
    { href: "#robustness", label: "Robustness" },
    { href: "#basis", label: "Transparency" },
  ];

  const closeMenu = () => setOpen(false);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 h-16 px-8 flex items-center justify-between transition-all duration-300
        ${scrolled 
          ? "bg-[#060b14]/90 backdrop-blur-[16px] border-b border-[#162840]/80" 
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo - Exact match to original */}
        <Link href="/" className="nav-logo flex items-center gap-3 group">
          <div className="logo-icon w-[34px] h-[34px] bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-[10px] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all group-hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]">
            🛡️
          </div>
          <span className="font-bold text-white text-[1.1rem] tracking-tight font-display">
            Saaral<span className="text-[#0ea5e9]">Care</span>
            <span className="text-[#fbbf24]">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex nav-links items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[#94a3b8] hover:text-white text-[0.85rem] font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex nav-cta items-center gap-3">
          <Link
            href="/login"
            className="btn-secondary px-5 py-[9px] text-[0.85rem] font-semibold rounded-[10px] border border-[#38bdf8]/20 bg-[#162840]/60 text-[#cbd5e1] hover:border-[#38bdf8]/50 hover:bg-[#162840]/90 hover:text-white transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/get-protected"
            className="btn-primary px-5 py-[9px] text-[0.85rem] font-semibold rounded-[10px] bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)] hover:-translate-y-[1px] transition-all"
          >
            Get Protected
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#94a3b8] hover:text-white p-2 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bg-[#0a1220] border-t border-[#162840]/80 transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-[#cbd5e1] hover:text-white text-base font-medium py-1 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-6 border-t border-[#162840] flex flex-col gap-4">
            <Link
              href="/login"
              onClick={closeMenu}
              className="btn-secondary w-full py-3 text-center rounded-[10px] text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/get-protected"
              onClick={closeMenu}
              className="btn-primary w-full py-3 text-center rounded-[10px] text-sm font-semibold"
            >
              Get Protected
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}