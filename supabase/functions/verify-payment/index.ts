import { corsHeaders, corsJson, handleOptions } from "../_shared/cors.ts";
import { sha256Hex } from "../_shared/crypto.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  try {
    const QFIX_SECRET_KEY = Deno.env.get("QFIX_SECRET_KEY") ?? "";
    if (!QFIX_SECRET_KEY) {
      return corsJson({ error: "Payment gateway not configured" }, 500);
    }

    const { orderId, transactionId, signature } = await req.json();
    if (!orderId || !transactionId || !signature) {
      return corsJson({ success: false, verified: false, error: "Missing fields" }, 400);
    }

    const signatureString = `${orderId}|${transactionId}|${QFIX_SECRET_KEY}`;
    const expectedSignature = await sha256Hex(signatureString);

    if (signature === expectedSignature) {
      return corsJson({ success: true, verified: true });
    }
    return corsJson({ success: false, verified: false, error: "Invalid signature" });
  } catch (e) {
    console.error(e);
    return corsJson({ error: "Payment verification failed" }, 500);
  }
});
