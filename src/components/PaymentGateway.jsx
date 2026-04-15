import { invokeEdge } from "../lib/supabaseFunctions";

/** POST form redirect used by Qfix and similar gateways */
export function postToPaymentGateway(url, paymentData) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  Object.keys(paymentData).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = paymentData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

/**
 * Creates an order and submits to the payment portal (full page navigation).
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

  postToPaymentGateway(result.paymentUrl, result.paymentData);
}
