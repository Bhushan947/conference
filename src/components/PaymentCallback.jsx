import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, Shield } from "lucide-react";
import { invokeEdge } from "../lib/supabaseFunctions";
import { clearRegistrationDraft } from "../lib/registrationStorage";
import Navbar from "./Navbar";

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Confirming your transaction with the payment provider.");

  const orderRef =
    searchParams.get("orderId") ?? sessionStorage.getItem("pendingPaymentOrderId") ?? "";

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const query = Object.fromEntries(searchParams.entries());
    const expectedOrderId = sessionStorage.getItem("pendingPaymentOrderId") ?? "";

    const responseCode = searchParams.get("Response_Code") ?? searchParams.get("Response Code");
    const isIciciReturn =
      responseCode != null ||
      searchParams.get("Interchange_Value") != null ||
      searchParams.get("Interchange Value") != null;

    if (!isIciciReturn) {
      setStatus("error");
      setMessage(
        "The payment gateway did not return a complete response. If money was debited, contact the help desk with your bank reference.",
      );
      return;
    }

    try {
      const result = await invokeEdge("verify-payment", {
        query,
        expectedOrderId,
      });

      if (result.verified && result.gateway === "icici-eazypay") {
        setStatus("success");
        setMessage("Recording your registration and issuing your ticket.");

        const registrationData = JSON.parse(sessionStorage.getItem("pendingRegistration"));

        if (registrationData) {
          const txn = result.transactionId || expectedOrderId || "";
          await completeRegistration(registrationData, txn);
        } else {
          setStatus("error");
          setMessage("Your session did not include registration details. Please contact support with your order reference.");
        }
      } else {
        setStatus("error");
        setMessage(
          result?.error ||
            "We could not confirm this payment. You can try again from registration or contact support.",
        );
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setMessage("Verification could not be completed. Check your connection and try again, or contact support.");
    }
  };

  const completeRegistration = async (registrationData, transactionId) => {
    try {
      setMessage("Finalizing your conference registration.");

      const payload = { ...registrationData };
      delete payload.paymentProof;
      payload.transactionId = transactionId;
      payload.paymentVerified = true;
      payload.modeOfPayment = "ICICI Eazypay";
      payload.dateOfPayment = new Date().toISOString().split("T")[0];

      const result = await invokeEdge("register", payload);

      if (result.success) {
        sessionStorage.removeItem("pendingRegistration");
        sessionStorage.removeItem("pendingPaymentOrderId");
        clearRegistrationDraft();

        const merged = {
          ...registrationData,
          registrationId: result.registrationId,
          qrCode: result.qrCode,
          transactionId: transactionId,
          totalFeeUSD: registrationData.totalFeeUsd ?? registrationData.totalFeeUSD,
          totalFeeINR: registrationData.totalFeeInr ?? registrationData.totalFeeINR,
        };
        sessionStorage.setItem("registrationResult", JSON.stringify(merged));
        sessionStorage.setItem("openTicketAfterSuccess", "1");

        setMessage("Redirecting to your confirmation.");

        setTimeout(() => {
          navigate("/registration-success");
        }, 900);
      } else {
        setStatus("error");
        setMessage("Payment was received but registration could not be saved. Please contact the help desk.");
      }
    } catch (error) {
      console.error("Registration completion error:", error);
      setStatus("error");
      setMessage("Payment was received but registration could not be saved. Please contact the help desk.");
    }
  };

  const accent =
    status === "success" ? "bg-[#16a34a]" : status === "error" ? "bg-red-600" : "bg-[#1a56db]";

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Navbar />

      <main className="flex-1 flex flex-col px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              Registration · Payment return
            </p>
            <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
              {status === "verifying" && "Processing payment"}
              {status === "success" && "Payment received"}
              {status === "error" && "Payment status"}
            </h1>
          </div>

          <div className="bg-white rounded border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className={`h-0.5 ${accent}`} aria-hidden />

            <div className="px-5 sm:px-6 py-6 sm:py-8">
              {orderRef && (
                <div className="mb-6 pb-5 border-b border-gray-100">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Order reference
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-gray-800 break-all leading-snug">{orderRef}</p>
                </div>
              )}

              {status === "verifying" && (
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1a56db]/8">
                      <Loader2 className="h-6 w-6 text-[#1a56db] animate-spin" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
                      <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                        This usually takes a few seconds. Keep this tab open until you are redirected.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircle2 className="h-6 w-6 text-[#16a34a]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">Transaction confirmed</p>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{message}</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <XCircle className="h-6 w-6 text-red-600" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">Something went wrong</p>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{message}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link
                      to="/registration"
                      className="inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-[#1a56db] rounded-md hover:bg-[#154bb3] transition-colors"
                    >
                      Back to registration
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Contact help desk
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>Payments are processed securely through our payment partner.</span>
          </div>
        </div>
      </main>

    </div>
  );
}

export default PaymentCallback;
