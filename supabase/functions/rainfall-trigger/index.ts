import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async (req) => {

  const { station_id, rainfall_mm } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // rainfall threshold
  if (rainfall_mm < 30) {
    return new Response(
      JSON.stringify({ message: "Rainfall below trigger threshold" }),
      { headers: { "Content-Type": "application/json" } }
    )
  }

  // find workers mapped to this station
  const { data: workers } = await supabase
    .from("workers")
    .select("id")
    .eq("station_id", station_id)

  if (!workers || workers.length === 0) {
    return new Response(
      JSON.stringify({ message: "No workers in this station zone" }),
      { headers: { "Content-Type": "application/json" } }
    )
  }

  // create claims for each worker
  const claims = workers.map((worker) => ({
    worker_id: worker.id,
    station_id: station_id,
    rainfall_mm: rainfall_mm,
    payout_amount: 480,
    status: "processing"
  }))

  await supabase.from("claims").insert(claims)

  return new Response(
    JSON.stringify({ message: "Claims generated", count: claims.length }),
    { headers: { "Content-Type": "application/json" } }
  )
})