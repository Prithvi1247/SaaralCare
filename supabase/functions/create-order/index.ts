import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return new Response(
        JSON.stringify({ error: "Amount required" }),
        { status: 400 }
      );
    }

    const key_id = Deno.env.get("RAZORPAY_KEY_ID");
    const key_secret = Deno.env.get("RAZORPAY_KEY_SECRET");

    const auth = btoa(`${key_id}:${key_secret}`);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // ₹ → paise
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});