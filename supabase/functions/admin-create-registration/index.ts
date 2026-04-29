import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { verifyAdminSessionToken } from "../_shared/adminToken.ts";
import { corsJson, handleOptions } from "../_shared/cors.ts";

function trimOrNull(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function parseNumberOrNull(v: unknown): number | null {
  if (v === undefined || v === null || String(v).trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ success: false, msg: "Method not allowed" }, 405);

  const secret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";
  if (!secret) return corsJson({ success: false, msg: "Server misconfigured" }, 500);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return corsJson({ success: false, msg: "Server configuration error" }, 500);
  }

  try {
    const b = await req.json();
    const v = await verifyAdminSessionToken(String(b.token ?? ""), secret);
    if (!v.valid) return corsJson({ success: false, msg: "Unauthorized" }, 401);

    const fullName = String(b.full_name ?? "").trim();
    const affiliation = String(b.affiliation ?? "").trim();
    const email = String(b.email ?? "").trim().toLowerCase();

    if (!fullName) return corsJson({ success: false, msg: "Full name is required" }, 400);
    if (!affiliation) return corsJson({ success: false, msg: "Affiliation is required" }, 400);
    if (!email || !email.includes("@")) {
      return corsJson({ success: false, msg: "Valid email is required" }, 400);
    }

    const totalFeeUsd = parseNumberOrNull(b.total_fee_usd);
    const totalFeeInr = parseNumberOrNull(b.total_fee_inr);
    if (b.total_fee_usd !== undefined && b.total_fee_usd !== null && String(b.total_fee_usd).trim() !== "" && totalFeeUsd === null) {
      return corsJson({ success: false, msg: "Invalid total_fee_usd" }, 400);
    }
    if (b.total_fee_inr !== undefined && b.total_fee_inr !== null && String(b.total_fee_inr).trim() !== "" && totalFeeInr === null) {
      return corsJson({ success: false, msg: "Invalid total_fee_inr" }, 400);
    }

    let numAuthors: number | null = null;
    if (b.num_authors !== undefined && b.num_authors !== null && String(b.num_authors).trim() !== "") {
      const n = parseInt(String(b.num_authors), 10);
      if (!Number.isFinite(n)) return corsJson({ success: false, msg: "Invalid num_authors" }, 400);
      numAuthors = n;
    }

    const dateOfPayment = trimOrNull(b.date_of_payment);
    if (dateOfPayment && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfPayment)) {
      return corsJson({ success: false, msg: "Invalid date_of_payment (use YYYY-MM-DD)" }, 400);
    }

    const paymentVerified =
      b.payment_verified === true ||
      b.payment_verified === "true" ||
      b.payment_verified === 1 ||
      b.payment_verified === "1";

    const registrationId =
      `2AI-2026-MANUAL-${Date.now().toString(36).toUpperCase()}-${
        Math.random().toString(36).substring(2, 6).toUpperCase()
      }`;

    const row = {
      registration_id: registrationId,
      full_name: fullName,
      email,
      affiliation,
      designation: trimOrNull(b.designation),
      country: trimOrNull(b.country),
      contact_number: trimOrNull(b.contact_number),
      participant_type: trimOrNull(b.participant_type),
      paper_id: trimOrNull(b.paper_id),
      paper_title: trimOrNull(b.paper_title),
      num_authors: numAuthors,
      sub_category: trimOrNull(b.sub_category),
      region: trimOrNull(b.region),
      attendance_mode: trimOrNull(b.attendance_mode) ?? "Offline",
      attend_workshop: trimOrNull(b.attend_workshop),
      total_fee_usd: totalFeeUsd,
      total_fee_inr: totalFeeInr,
      mode_of_payment: trimOrNull(b.mode_of_payment),
      transaction_id: trimOrNull(b.transaction_id),
      date_of_payment: dateOfPayment,
      payment_verified: paymentVerified,
      declaration: true,
      qr_code: null,
    };

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase
      .from("registrations")
      .insert(row)
      .select(
        [
          "registration_id",
          "full_name",
          "email",
          "affiliation",
          "designation",
          "country",
          "contact_number",
          "participant_type",
          "paper_id",
          "paper_title",
          "num_authors",
          "sub_category",
          "region",
          "attendance_mode",
          "total_fee_usd",
          "total_fee_inr",
          "payment_verified",
          "transaction_id",
          "mode_of_payment",
          "attend_workshop",
          "date_of_payment",
          "created_at",
        ].join(","),
      )
      .maybeSingle();

    if (error) {
      console.error(error);
      return corsJson({ success: false, msg: error.message }, 500);
    }
    if (!data) return corsJson({ success: false, msg: "Failed to create registration" }, 500);

    return corsJson({ success: true, registration: data });
  } catch (e) {
    console.error(e);
    return corsJson({ success: false, msg: "Failed to create registration" }, 500);
  }
});
