// components/landing/Hero.jsx
import { useEffect, useRef, useState } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

function RainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = Array.from({ length: 120 }, () => createDrop());

    function createDrop() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -200,
        speed: 2 + Math.random() * 3,
        length: 30 + Math.random() * 40,
        opacity: 0.5 + Math.random() * 0.4,
        width: 0.5 + Math.random() * 0.5,
      };
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(56,189,248,${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.stroke();
        drop.y += drop.speed;
        if (drop.y > canvas.height) Object.assign(drop, createDrop());
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-100"
    />
  );
}

function FloatingClouds() {
  return (
    <>
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "400px", height: "300px", top: "10%", left: "5%",
          background: "rgba(56,189,248,0.08)",
          animation: "float-cloud 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "300px", height: "200px", top: "30%", right: "10%",
          background: "rgba(251,191,36,0.08)",
          animation: "float-cloud 24s ease-in-out 4s infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "250px", height: "180px", bottom: "20%", left: "40%",
          background: "rgba(52,211,153,0.08)",
          animation: "float-cloud 20s ease-in-out 8s infinite",
        }}
      />
    </>
  );
}

const FLOW_STEPS = [
  {
    icon: "🌧️",
    label: "Rain Detected",
    sub: "Open-Meteo · Velachery Station · 5-point avg",
    color: "#38bdf8", // The light blue from "Rain"
    status: "LIVE",
  },
  {
    icon: "⏰",
    label: "Peak Hour Check",
    sub: "Lunch Rush 1–3 PM · 1.5× multiplier applied",
    color: "#fbbf24", // The yellow from "Income."
    status: "ACTIVE",
  },
  {
    icon: "⚡",
    label: "Trigger Fired",
    sub: "Weighted Score ≥ 45 · Full payout unlocked",
    color: "#4ade80", // The bright green from "Lunch Hour."
    status: "SENT",
  },
  {
    icon: "💸",
    label: "UPI Transfer Done",
    sub: "₹800 credited · Zero claim needed · Audit logged",
    color: "#a78bfa", // Soft purple for completion
    status: "DONE",
  },
];

function FlowDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {FLOW_STEPS.map((step, i) => (
        <div key={i}>
          <div
            className={`glass-card rounded-xl p-5 flex items-center gap-4 transition-all duration-300 cursor-default ${
              i <= activeStep ? "border-rain-900 shadow-xl shadow-rain-400/40" : "border-grey-900/70"
            }`}
            style={{ borderLeft: `13px solid ${i <= activeStep ? step.color : "transparent"}` }}
          >
            <div className="text-2xl flex-shrink-0">{step.icon}</div>
            <div className="flex-1">
              <div className="font-display font-bold text-white text-sm">{step.label}</div>
              <div className="text-xs text-slate-200 mt-1">{step.sub}</div>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
              style={{
                background: `rgba(${parseInt(step.color.slice(1, 3), 16)}, ${parseInt(step.color.slice(3, 5), 16)}, ${parseInt(step.color.slice(5, 7), 16)}, 0.15)`,
                color: step.color,
                border: `1px solid ${step.color}40`,
              }}
            >
              {step.status}
            </div>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className="flex items-center justify-center px-4 py-1">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rain-500/20 to-transparent" />
              <ChevronRight className="w-4 h-4 text-slate-600 mx-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className="relative min-h-screen pt-32 pb-24 flex items-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 60% 20%, rgba(14,165,233,0.08) 0%, transparent 60%), 
                     radial-gradient(ellipse 60% 50% at 20% 80%, rgba(251,191,36,0.04) 0%, transparent 50%),
                     #050d1a`,
      }}
    >
      <RainCanvas />
      <FloatingClouds />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-rain-500/10 border border-rain-500/30 rounded-full px-4 py-2 w-fit animate-fade-up">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-rain-400 font-bold tracking-wider">
                PEAK-HOUR AWARE · ZERO CLAIM · INSTANT UPI · CHENNAI FIRST
              </span>
            </div>

            <h1
              className="font-display text-5xl md:text-6xl font-bold leading-tight animate-fade-up opacity-0"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <span className="text-rain-400">Rain Shouldn't</span> Cost<br />
              You a Day's<br />
              <span className="italic text-amber-400">Income.</span>
            </h1>

            
          <div className="text-rain-400 font-semibold">Rain hits. UPI gets credited. Zero paperwork.</div>
            <div
              className="flex flex-wrap gap-4 animate-fade-up opacity-0"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              
              
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-rain-500 to-rain-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-rain-500/50 transition-all flex items-center gap-2 group"
              >
                View Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
             
            </div>
            <div>
              <span className="text-white text-3xl font-display sm:text-4xl font-extrabold">The Only Insurance That Understands </span>
              <span className="text-green-400 text-3xl font-display italic sm:text-4xl font-extrabold">Lunch Hour.</span>
            </div>
            <p
              className="text-lg text-slate-300 leading-relaxed max-w-md animate-fade-up opacity-0"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              India's first peak-hour aware parametric rainfall insurance — built
              exclusively for Swiggy & Zomato delivery partners in Chennai.
              <br />
              
            </p>
            <div
              className="grid grid-cols-2 gap-5 pt-1 animate-fade-up opacity-0"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              {[
                { val: "12,400+", lbl: "Delivery Partners Protected" },
                { val: "< 24 hrs", lbl: "Avg. UPI Payout Time" },
                { val: "28 Zones", lbl: "Chennai Zones Covered" },
                { val: "75.5%", lbl: "Target Loss Ratio" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-white">{stat.val}</div>
                  <div className="text-xs text-slate-100 mt-1">{stat.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div
            className="animate-fade-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <FlowDiagram />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  );
}