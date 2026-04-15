/** Qfix server-to-server webhook (optional; returnUrl flow may be enough) */
import { corsJson, handleOptions } from "../_shared/cors.ts";
import { sha256Hex } from "../_shared/crypto.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  try {
    const QFIX_SECRET_KEY = Deno.env.get("QFIX_SECRET_KEY") ?? "";
    const body = await req.json();
    const { orderId, status, transactionId, signature } = body;

    if (!orderId || !transactionId || !signature) {
      return corsJson({ error: "Invalid payload" }, 400);
    }

    const signatureString = `${orderId}|${status}|${transactionId}|${QFIX_SECRET_KEY}`;
    const expectedSignature = await sha256Hex(signatureString);

    if (signature !== expectedSignature) {
      return corsJson({ error: "Invalid signature" }, 400);
    }

    return corsJson({
      success: true,
      orderId,
      status,
      transactionId,
    });
  } catch (e) {
    console.error(e);
    return corsJson({ error: "Payment callback failed" }, 500);
  }
});
