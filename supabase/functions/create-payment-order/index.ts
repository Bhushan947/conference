import { corsJson, handleOptions } from "../_shared/cors.ts";
import { sha256Hex } from "../_shared/crypto.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  try {
    const QFIX_MERCHANT_ID = Deno.env.get("QFIX_MERCHANT_ID") ?? "";
    const QFIX_SECRET_KEY = Deno.env.get("QFIX_SECRET_KEY") ?? "";
    const QFIX_PAYMENT_URL = Deno.env.get("QFIX_PAYMENT_URL") ?? "https://payment.qfix.com/pay";
    const FRONTEND_URL = (Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173").replace(/\/+$/, "");
    const PAYMENT_CALLBACK_URL = Deno.env.get("PAYMENT_CALLBACK_URL") ?? "";

    if (!QFIX_MERCHANT_ID || !QFIX_SECRET_KEY) {
      return corsJson({ error: "Payment gateway not configured" }, 500);
    }

    const { amount, currency, registrationData } = await req.json();
    if (!registrationData?.fullName || !registrationData?.email) {
      return corsJson({ error: "Invalid registration data" }, 400);
    }

    const orderId = `2AI-ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const paymentData: Record<string, string> = {
      merchantId: QFIX_MERCHANT_ID,
      orderId,
      amount: String(amount),
      currency: currency || "INR",
      customerName: String(registrationData.fullName),
      customerEmail: String(registrationData.email),
      customerPhone: String(registrationData.contactNumber ?? ""),
      returnUrl: `${FRONTEND_URL}/payment-callback`,
      callbackUrl: PAYMENT_CALLBACK_URL || `${FRONTEND_URL}/payment-callback`,
    };

    const signatureString =
      `${paymentData.merchantId}|${paymentData.orderId}|${paymentData.amount}|${paymentData.currency}|${QFIX_SECRET_KEY}`;
    paymentData.signature = await sha256Hex(signatureString);

    return corsJson({
      success: true,
      orderId,
      paymentUrl: QFIX_PAYMENT_URL,
      paymentData,
    });
  } catch (e) {
    console.error(e);
    return corsJson({ error: "Failed to create payment order" }, 500);
  }
});
