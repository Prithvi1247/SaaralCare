import { supabase } from "@/lib/supabaseClient";

const cache = {};

export async function fetchDayDetail({ date, stationId, workerId, zoneId }) {
  const key = `${date}_${stationId}_${workerId}`;
  if (cache[key]) return cache[key];

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const [rainfallRes, payoutRes, riskRes, zoneRes] = await Promise.all([
    supabase
      .from("rainfall_history")
      .select("rainfall_mm, rainfall_duration_hrs, time_recorded")
      .eq("station_id", stationId)
      .gte("time_recorded", dayStart.toISOString())
      .lte("time_recorded", dayEnd.toISOString())
      .order("time_recorded", { ascending: true }),

    supabase
      .from("coverage_payout")
      .select("payout_amount, payout_time, payment_status")
      .eq("worker_id", workerId)
      .gte("payout_time", dayStart.toISOString())
      .lte("payout_time", dayEnd.toISOString())
      .maybeSingle(),

    supabase
      .from("risk_score")
      .select("risk_score, prob_low, prob_moderate, prob_high")
      .eq("worker_id", workerId)
      .maybeSingle(),

    zoneId
      ? supabase.from("zones").select("id, zone_name").eq("id", zoneId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const events = rainfallRes.data || [];
  console.log("Fetched events:", events);

  const payout = payoutRes.data || null;
  const risk = riskRes.data || null;
  const zone = zoneRes.data || null;

  const totalRainfall = parseFloat(events.reduce((s, e) => s + (e.rainfall_mm || 0), 0).toFixed(2));
  const totalDuration = parseFloat(events.reduce((s, e) => s + (e.rainfall_duration_hrs || 0), 0).toFixed(2));
  const avgIntensity = totalDuration > 0 ? parseFloat((totalRainfall / totalDuration).toFixed(2)) : 0;
  const trigger = parseFloat((avgIntensity * totalDuration).toFixed(2));

  let payoutTier = "NONE";
  if (trigger >= 50) payoutTier = "FULL";
  else if (trigger >= 30) payoutTier = "PARTIAL";

  // Build hourly buckets using time_recorded
  const hourlyMap = {};
  events.forEach((e) => {
    const hour = new Date(e.time_recorded).getHours();
    const label = `${String(hour).padStart(2, "0")}:00`;
    hourlyMap[label] = (hourlyMap[label] || 0) + (e.rainfall_mm || 0);
  });
  const chartData = Object.entries(hourlyMap).map(([hour, mm]) => ({ hour, mm }));
  const peakMm = chartData.length > 0 ? Math.max(...chartData.map((d) => d.mm)) : 0;

  // hasData = rows exist, regardless of rainfall values
  const hasData = events.length > 0;

  const result = {
    date, zone, events, chartData, peakMm,
    totalRainfall, totalDuration, avgIntensity, trigger,
    payoutTier, payout, risk,
    hasData,
  };

  cache[key] = result;
  return result;
}