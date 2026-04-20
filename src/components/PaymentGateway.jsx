import { invokeEdge } from "../lib/supabaseFunctions";

/**
 * Creates an ICICI Eazypay checkout URL and redirects the browser (full-page GET).
 */
export async function startGatewayCheckout({ amount, currency, registrationData }) {
  const result = await invokeEdge("create-payment-order", {
    amount,
    currency,
    registrationData,
  });
  if (!result?.success) {
    throw new Error(result?.error || "Failed to create payment order");
  }

  if (result.orderId) {
    sessionStorage.setItem("pendingPaymentOrderId", result.orderId);
  }

  if (result.paymentUrl) {
    window.location.assign(result.paymentUrl);
    return;
  }

  throw new Error("Payment URL missing from server response");
}
