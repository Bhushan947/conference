import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.10.0";
import { verifyAdminSessionToken } from "../_shared/adminToken.ts";
import { corsJson, handleOptions } from "../_shared/cors.ts";

function parsePort(value: string | undefined, fallback: number): number {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) ? n : fallback;
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
    const { token, registration_id, pdf_base64 } = await req.json();
    const v = await verifyAdminSessionToken(String(token ?? ""), secret);
    if (!v.valid) return corsJson({ success: false, msg: "Unauthorized" }, 401);

    const registrationId = String(registration_id ?? "").trim();
    if (!registrationId) return corsJson({ success: false, msg: "registration_id is required" }, 400);
    const pdfBase64 = String(pdf_base64 ?? "").trim();
    if (!pdfBase64) return corsJson({ success: false, msg: "pdf_base64 is required" }, 400);

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase
      .from("registrations")
      .select(
        [
          "registration_id",
          "full_name",
          "email",
        ].join(","),
      )
      .eq("registration_id", registrationId)
      .maybeSingle();

    if (error) return corsJson({ success: false, msg: error.message }, 500);
    if (!data) return corsJson({ success: false, msg: "Registration not found" }, 404);
    if (!data.email) return corsJson({ success: false, msg: "Registration email is missing" }, 400);
    const smtpHost = (Deno.env.get("SMTP_HOST") ?? "").trim();
    const smtpPort = parsePort(Deno.env.get("SMTP_PORT"), 465);
    const smtpSecure = (Deno.env.get("SMTP_SECURE") ?? "true").trim().toLowerCase() !== "false";
    const smtpUser = (Deno.env.get("SMTP_USER") ?? "").trim();
    const smtpPass = Deno.env.get("SMTP_PASS") ?? "";
    const smtpFrom = (Deno.env.get("SMTP_FROM") ?? "").trim();
    const smtpToOverride = (Deno.env.get("SMTP_TO_OVERRIDE") ?? "").trim();

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      return corsJson({ success: false, msg: "SMTP secrets are not configured" }, 500);
    }

    const subject =
      "Your Registration Ticket - 2026 INTERNATIONAL CONFERENCE ON APPLIED ARTIFICIAL INTELLIGENCE (2AI)";
    const textBody = [
      `Dear ${data.full_name ?? "Participant"},`,
      "",
      "Greetings from the Organizing Committee.",
      "",
      "Thank you for registering for the 2026 INTERNATIONAL CONFERENCE ON APPLIED ARTIFICIAL INTELLIGENCE (2AI).",
      "Please find your official registration ticket attached as a PDF.",
      "",
      `Registration ID: ${data.registration_id}`,
      "Conference Dates: 18-19 June 2026",
      "Pre-Conference Workshop (optional): 17 June 2026",
      "Venue: Central University of Kashmir (CUK), Ganderbal, J&K, India",
      "",
      "Please carry either a printed copy or a digital copy of this ticket at the venue for verification.",
      "",
      "If you notice any issue in your details, please reply to this email so we can assist you.",
      "",
      "Regards,",
      "Organizing Committee",
      "2026 INTERNATIONAL CONFERENCE ON APPLIED ARTIFICIAL INTELLIGENCE (2AI)",
      "Email: aaiconferences@gmail.com",
    ].join("\n");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: smtpToOverride || data.email,
      subject,
      text: textBody,
      attachments: [
        {
          filename: `2AI-2026-Ticket-${data.registration_id}.pdf`,
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });

    return corsJson({ success: true, msg: `Email sent to ${smtpToOverride || data.email}` });
  } catch (e) {
    console.error(e);
    return corsJson({ success: false, msg: "Failed to send email" }, 500);
  }
});
