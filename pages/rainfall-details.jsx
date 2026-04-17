import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ArrowLeft, CloudRain, Sun, Droplets } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Logic: Total is now (Peak * 1.5) + NonPeak
function getPayoutStatus(peak, nonPeak) {
  const adj = peak * 1.5;
  const total = adj + nonPeak;
  if (adj >= 45 || nonPeak >= 75 || total > 95) return "full";
  if (adj >= 15 || nonPeak > 35 || total >= 40) return "partial";
  return "none";
}

function getPayoutReason(peak, nonPeak) {
  const adj = +(peak * 1.5).toFixed(1);
  const total = +(adj + nonPeak).toFixed(1);
  
  if (adj >= 45) return `Adjusted peak crossed 45mm threshold (${adj}mm)`;
  if (nonPeak >= 75) return `Non-peak rainfall crossed 75mm threshold`;
  if (total > 95) return `Total rainfall (Adj. Peak + Non-Peak) crossed 95mm threshold`;
  
  if (adj >= 15) return `Adjusted peak crossed 15mm partial threshold (${adj}mm)`;
  if (nonPeak > 35) return `Non-peak crossed 35mm partial threshold`;
  if (total >= 40) return `Total rainfall (Adj. Peak + Non-Peak) crossed 40mm partial threshold`;
  
  return "No trigger thresholds met";
}

function RainAnimation() {
  return (
    <div className="relative w-16 h-16 mx-auto">
      <CloudRain className="w-10 h-10 text-rain-400 absolute top-0 left-3" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute w-0.5 bg-rain-400/60 rounded-full"
          style={{ left: `${15 + i * 12}%`, top: "55%", height: "6px",
            animation: `rainDrop 0.8s ${i * 0.15}s infinite` }} />
      ))}
    </div>
  );
}

function CountUp({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const targetNum = parseFloat(target);
    const step = targetNum / 60;
    const t = setInterval(() => {
      v += step;
      if (v >= targetNum) { 
        setVal(targetNum); 
        clearInterval(t); 
      }
      else setVal(v);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  
  return <>{typeof val === "number" ? val.toFixed(1) : val}</>;
}

const STATUS = {
  full: { label: "🔴 Full Payout", bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400" },
  partial: { label: "🟡 Partial Payout", bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
  none: { label: "⚪ No Payout", bg: "bg-slate-700/40", border: "border-slate-600/40", text: "text-slate-400" },
};

function DayCard({ day, isVisible, isHighlighted }) {
  const { date, peak, nonPeak, isToday } = day;
  const adjPeak = +(peak * 1.5).toFixed(1);
  const totalRainfall = +(adjPeak + nonPeak).toFixed(1);
  const status = getPayoutStatus(peak, nonPeak);
  const reason = getPayoutReason(peak, nonPeak);
  const sc = STATUS[status];
  const d = new Date(date + "T00:00:00");

  return (
    <div className={`h-screen w-full flex-shrink-0 flex items-center justify-center px-4 transition-all duration-700 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`} style={{ scrollSnapAlign: "start" }}>
      <div className={`w-full max-w-sm rounded-3xl border p-6 space-y-5 ${
        isHighlighted ? "border-rain-400/60 shadow-[0_0_40px_rgba(56,189,248,0.2)] bg-[#0d1829]" : "border-slate-700/40 bg-[#0d1525]/90"
      }`}>
        <div className="text-center space-y-1">
          <p className="text-rain-400 text-xs font-bold uppercase tracking-widest">
            {isToday ? "TODAY" : d.toLocaleDateString("en-IN", { weekday: "long" })}
          </p>
          <h2 className="text-white text-xl font-bold">{d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</h2>
        </div>

        <div className="flex justify-center py-2">
          {totalRainfall > 0 ? <RainAnimation /> : <Sun className="w-10 h-10 text-amber-400/70" />}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Peak Hours", value: peak, color: "text-amber-400" },
            { label: "Non-Peak", value: nonPeak, color: "text-sky-400" },
            { label: "Total Rainfall", value: totalRainfall, color: "text-emerald-400" },
            { label: "Adjusted Peak", value: adjPeak, color: "text-purple-400", note: "×1.5 for logic" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/30 text-center">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-black font-mono ${s.color}`}>
                {isVisible ? <CountUp target={+s.value} /> : "0.0"}
                <span className="text-xs font-normal ml-0.5">mm</span>
              </p>
              {s.note && <p className="text-slate-600 text-[9px] mt-0.5">{s.note}</p>}
            </div>
          ))}
        </div>

        <div className={`rounded-2xl p-4 border text-center space-y-2 ${sc.bg} ${sc.border}`}>
          <p className={`text-lg font-black ${sc.text}`}>{sc.label}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{reason}</p>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/20">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Thresholds</p>
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px]"><span className="text-slate-300 font-bold mr-2">Full:</span>Adj.peak ≥45 | Non-peak ≥75 | Total &gt;95</p>
            <p className="text-slate-400 text-[10px]"><span className="text-slate-300 font-bold mr-2">Partial:</span>Adj.peak ≥15 | Non-peak &gt;35 | Total ≥40</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RainfallDetailsPage() {
  const router = useRouter();
  const { date: targetDate } = router.query;
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const [activeIdx, setActiveIdx] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    async function load() {
      const phone = sessionStorage.getItem("gs_worker_phone");
      if (!phone) { router.push("/login"); return; }
      const { data: worker } = await supabase.from("workers").select("zone").eq("phone", phone).maybeSingle();
      if (!worker?.zone) { setLoading(false); return; }
      const zone = worker.zone;

      const { data: history } = await supabase
        .from("rainfall_history")
        .select("rainfall_peak_mm,rainfall_non_peak_mm,time_recorded")
        .eq("zone_name", zone)
        .order("time_recorded", { ascending: false })
        .limit(6);

      const [peakR, nonPeakR] = await Promise.all([
        supabase.from("rainfall_events_peak").select("rainfall_mm").eq("zone_name", zone).order("time_recorded", { ascending: false }).limit(1).then(r => r.data?.[0]),
        supabase.from("rainfall_events_NON_peak").select("rainfall_mm").eq("zone_name", zone).order("time_recorded", { ascending: false }).limit(1).then(r => r.data?.[0]),
      ]);

      const todayStr = new Date().toISOString().split("T")[0];
      const todayCard = { date: todayStr, peak: peakR?.rainfall_mm ?? 0, nonPeak: nonPeakR?.rainfall_mm ?? 0, isToday: true };
      
      // Removed .filter() to verify if items were being silently hidden
      const hist = (history || [])
        .map(r => ({ 
          date: String(r.time_recorded).split("T")[0], 
          peak: r.rainfall_peak_mm ?? 0, 
          nonPeak: r.rainfall_non_peak_mm ?? 0, 
          isToday: false 
        }))
        .filter(r => r.date !== todayStr);

      // --- LOGGING ---
      console.log(`Zone: ${zone}`);
      console.log(`Today Card: 1`);
      console.log(`Historical Cards: ${hist.length}`);
      console.log(`Total Render Count: ${hist.length + 1}`);

      setDays([todayCard, ...hist]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (days.length === 0) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const i = Number(e.target.dataset.idx);
        if (e.isIntersecting) {
          setVisible(p => ({ ...p, [i]: true }));
          setActiveIdx(i);
        }
      });
    }, { threshold: 0.6 });

    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [days]);

  if (loading) return (
    <div className="min-h-screen bg-[#090b14] flex items-center justify-center">
      <div className="animate-pulse text-rain-400 font-bold">Loading Report...</div>
    </div>
  );

  return (
    <>
      <Head><title>Rainfall Details — SaaralCare</title></Head>
      <style>{`
        html, body { 
          margin: 0; 
          padding: 0;
          height: 100%; 
          background: #090b14;
          overflow: hidden; 
        }

        .snap-scroll {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          display: flex;
          flex-direction: column;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .snap-scroll::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        @keyframes rainDrop {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(10px); }
        }
      `}</style>

      <div className="fixed top-0 inset-x-0 z-50 bg-[#090b14]/90 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-sm mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-white text-sm font-bold">Rainfall Report</h1>
            <p className="text-slate-500 text-[10px]">Scroll down for history</p>
          </div>
        </div>
      </div>

      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {days.map((_, i) => (
          <button 
            key={i} 
            onClick={() => cardRefs.current[i]?.scrollIntoView({ behavior: "smooth" })}
            className={`rounded-full transition-all duration-300 ${activeIdx === i ? "w-2 h-5 bg-rain-400" : "w-2 h-2 bg-slate-600 hover:bg-slate-400"}`} 
          />
        ))}
      </div>

      <div className="snap-scroll">
        {days.map((day, i) => (
          <div 
            key={`${day.date}-${i}`} 
            data-idx={i} 
            ref={el => cardRefs.current[i] = el}
            className="w-full flex-shrink-0"
          >
            <DayCard day={day} isVisible={!!visible[i]} isHighlighted={targetDate === day.date} />
          </div>
        ))}
      </div>
    </>
  );
}