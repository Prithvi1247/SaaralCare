import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // IMPORTANT
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      worker_id,
      amount,
    } = req.body;

    // 🔐 STEP 1: VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // ✅ STEP 2: INSERT INTO DB
    console.log("Inserting payment record:", {
      worker_id,
      premium_amount: amount,
      transaction_time: new Date().toISOString(),
    });

    const insertData = {
      worker_id: worker_id,
      premium_amount: amount,
      transaction_time: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("premium_payments").insert([insertData]);

    if (error) {
      console.error("❌ Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        status: error.status,
        code: error.code,
      });
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error.details,
      });
    }

    console.log("✅ Payment record inserted successfully:", data);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
