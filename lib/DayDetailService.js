// dayDetailService.js
// Fetches and computes all data needed for the DayDetailModal
import { supabase } from "@/lib/supabaseClient";

const cache = {};

function makeCacheKey(date, stationId, workerId) {
  return `${date}_${stationId}_${workerId}`;
}

export async function fetchDayDetail({ date, stationId, workerId, zoneId }) {
  const key = makeCacheKey(date, stationId, workerId);
  if (cache[key]) return cache[key];

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const [rainfallRes, payoutRes, riskRes, zoneRes] = await Promise.all([
    supabase
      .from("rainfall_events")
      .select("rainfall_mm, rainfall_duration_hrs, recorded_at, station_id")
      .eq("station_id", stationId)
      .gte("recorded_at", dayStart.toISOString())
      .lte("recorded_at", dayEnd.toISOString())
      .order("recorded_at", { ascending: true }),

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
  const payout = payoutRes.data || null;
  const risk = riskRes.data || null;
  const zone = zoneRes.data || null;

  // Compute aggregates
  const totalRainfall = events.reduce((s, e) => s + (e.rainfall_mm || 0), 0);
  const totalDuration = events.reduce((s, e) => s + (e.rainfall_duration_hrs || 0), 0);
  const avgIntensity = totalDuration > 0 ? totalRainfall / totalDuration : 0;
  const trigger = parseFloat((avgIntensity * totalDuration).toFixed(2));

  let payoutTier = "NONE";
  if (trigger >= 50) payoutTier = "FULL";
  else if (trigger >= 30) payoutTier = "PARTIAL";

  // Build hourly buckets for the chart (group events by hour)
  const hourlyMap = {};
  events.forEach((e) => {
    const hour = new Date(e.recorded_at).getHours();
    const label = `${String(hour).padStart(2, "0")}:00`;
    hourlyMap[label] = (hourlyMap[label] || 0) + (e.rainfall_mm || 0);
  });

  const chartData = Object.entries(hourlyMap).map(([hour, mm]) => ({ hour, mm }));
  const peakMm = Math.max(...chartData.map((d) => d.mm), 0);

  const result = {
    date,
    zone,
    events,
    chartData,
    peakMm,
    totalRainfall: parseFloat(totalRainfall.toFixed(2)),
    totalDuration: parseFloat(totalDuration.toFixed(2)),
    avgIntensity: parseFloat(avgIntensity.toFixed(2)),
    trigger,
    payoutTier,
    payout,
    risk,
    hasData: events.length > 0,
  };

  cache[key] = result;
  return result;
}