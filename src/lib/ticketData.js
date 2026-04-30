function displayAttendanceMode(mode) {
  const normalized = String(mode ?? "").trim().toLowerCase();
  if (normalized === "online") return "Online";
  if (normalized === "offline") return "Offline";
  return normalized ? String(mode).trim() : "Offline";
}

export function mapAdminRowToTicketData(row) {
  const usd = Number(row.total_fee_usd);
  const inr = Number(row.total_fee_inr);
  return {
    registrationId: row.registration_id,
    fullName: row.full_name || "",
    email: row.email || "",
    affiliation: row.affiliation || "",
    designation: row.designation || "",
    country: row.country || "",
    participantType: row.participant_type || "Participant",
    paperId: row.paper_id || "",
    paperTitle: row.paper_title || "",
    numAuthors: row.num_authors != null && row.num_authors !== "" ? String(row.num_authors) : "",
    attendWorkshop: row.attend_workshop || "",
    attendanceMode: displayAttendanceMode(row.attendance_mode),
    modeOfPayment: row.mode_of_payment || "",
    transactionId: row.transaction_id || "",
    totalFeeUSD: Number.isFinite(usd) ? usd : 0,
    totalFeeINR: Number.isFinite(inr) ? inr : 0,
  };
}

export function mapRegistrationResultToTicketData(data) {
  return {
    registrationId: data.registrationId || "",
    fullName: data.fullName || "",
    email: data.email || "",
    affiliation: data.affiliation || "",
    designation: data.designation || "",
    country: data.country || "",
    participantType: data.participantType || "Participant",
    paperId: data.paperId || "",
    paperTitle: data.paperTitle || "",
    numAuthors: data.numAuthors != null && data.numAuthors !== "" ? String(data.numAuthors) : "",
    attendWorkshop: data.attendWorkshop || "",
    attendanceMode: displayAttendanceMode(data.attendanceMode),
    modeOfPayment: data.modeOfPayment || "",
    transactionId: data.transactionId || "",
    totalFeeUSD: Number(data.totalFeeUSD ?? data.totalFeeUsd ?? 0) || 0,
    totalFeeINR: Number(data.totalFeeINR ?? data.totalFeeInr ?? 0) || 0,
  };
}
