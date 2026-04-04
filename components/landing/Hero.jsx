import { useEffect, useRef, useState } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";

function RainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let drops = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createDrop() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -200,
        speed: 2 + Math.random() * 3,
        length: 30 + Math.random() * 40,
        opacity: 0.1 + Math.random() * 0.2,
        width: 0.5 + Math.random() * 0.5,
      };
    }

    for (let i = 0; i < 60; i++) {
      drops.push({ ...createDrop(), y: Math.random() * canvas.height });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((drop, i) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length);
        ctx.strokeStyle = `rgba(56, 189, 248, ${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.stroke();
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.2;
        if (drop.y > canvas.height + 100) {
          drops[i] = createDrop();
        }
      });
      requestAnimationFrame(animate);
    }
    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
}

function FloatingClouds() {
  return (
    <>
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "400px",
          height: "300px",
          top: "10%",
          left: "5%",
          background: "rgba(56,189,248,0.04)",
          animation: "float-cloud 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "300px",
          height: "200px",
          top: "30%",
          right: "10%",
          background: "rgba(251,191,36,0.04)",
          animation: "float-cloud 24s ease-in-out 4s infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "250px",
          height: "180px",
          bottom: "20%",
          left: "40%",
          background: "rgba(52,211,153,0.04)",
          animation: "float-cloud 20s ease-in-out 8s infinite",
        }}
      />
    </>
  );
}

const FLOW_STEPS = [
  { icon: "🌧️", label: "Rain Detected", sub: "Station: Velachery · Index: 54", color: "#38bdf8", status: "LIVE" },
  { icon: "⚡", label: "Trigger Fired", sub: "Rain Index ≥ 50 · Full payout", color: "#fbbf24", status: "ACTIVE" },
  { icon: "💸", label: "Instant Coverage Payout", sub: "UPI transfer · No claim needed", color: "#34d399", status: "SENT" },
  { icon: "✅", label: "Done", sub: "Worker notified · Audit logged", color: "#a78bfa", status: "DONE" },
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
              i <= activeStep
                ? "border-rain-500/30 shadow-lg shadow-rain-500/20"
                : "border-navy-700/50"
            }`}
            style={{
              borderLeft: `3px solid ${i <= activeStep ? step.color : "transparent"}`,
            }}
          >
            <div className="text-2xl flex-shrink-0">{step.icon}</div>
            <div className="flex-1">
              <div className="font-display font-bold text-white text-sm">
                {step.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{step.sub}</div>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
              style={{
                background: `rgba(${parseInt(step.color.slice(1,3), 16)}, ${parseInt(step.color.slice(3,5), 16)}, ${parseInt(step.color.slice(5,7), 16)}, 0.15)`,
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
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
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
          {/* Left: Text & Stats */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-rain-500/10 border border-rain-500/30 rounded-full px-4 py-2 w-fit animate-fade-up">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-rain-400 font-bold tracking-wider">
                PARAMETRIC INSURANCE · AUTO PAYOUTS · ZERO TOUCH
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <span className="text-rain-400">Zero-Touch</span> Rainfall<br />
              Insurance for<br />
              <span className="italic text-amber-400">Gig Workers</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-400 leading-relaxed max-w-md animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              No claims. No verification. No waiting.
              <br />
              Rain triggers payout automatically.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <button className="px-8 py-4 bg-gradient-to-r from-rain-500 to-rain-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-rain-500/50 transition-all flex items-center gap-2 group">
                View Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-rain-500/30 text-rain-400 rounded-xl font-semibold hover:bg-rain-500/10 transition-all">
                How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8 animate-fade-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              {[
                { val: "12,400+", lbl: "Workers Protected" },
                { val: "<4 hrs", lbl: "Avg. Payout Time" },
                { val: "8", lbl: "Cities Active" },
                { val: "75.5%", lbl: "Loss Ratio" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-white">
                    {stat.val}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{stat.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Flow Diagram */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <FlowDiagram />
          </div>
        </div>
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  );
}
