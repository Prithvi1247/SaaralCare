// RainGraph.jsx
// Hourly rainfall bar chart using Recharts. Highlights peak rainfall bar.
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1424] border border-slate-700 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold">{payload[0].value.toFixed(1)} <span className="text-slate-400 font-normal">mm</span></p>
    </div>
  );
};

export default function RainGraph({ chartData = [], peakMm = 0 }) {
  if (!chartData.length) return null;

  const avg = chartData.reduce((s, d) => s + d.mm, 0) / chartData.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-300 text-xs font-semibold uppercase tracking-widest">
          Hourly Rainfall
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#5fa8d3] inline-block opacity-60" />
            Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
            Peak
          </span>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              unit=" mm"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            {avg > 0 && (
              <ReferenceLine
                y={avg}
                stroke="#475569"
                strokeDasharray="4 4"
                label={{ value: "avg", fill: "#475569", fontSize: 9, position: "insideTopRight" }}
              />
            )}
            <Bar dataKey="mm" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.mm === peakMm && peakMm > 0 ? "#fbbf24" : "#3b82f6"}
                  fillOpacity={entry.mm === peakMm && peakMm > 0 ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {peakMm > 0 && (
        <p className="text-xs text-amber-400/80 mt-2 text-center">
          ⚡ Peak: {peakMm.toFixed(1)} mm — highlighted in amber
        </p>
      )}
    </div>
  );
}