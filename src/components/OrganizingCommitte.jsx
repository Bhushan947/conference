// Edited by Milad Ajaz 
// https://m4milaad.github.io/ 

import { useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import { fetchCommitteeByType } from "../lib/committeeData";
import { useYear } from "../context/yearContext";
import conferenceData from "../content/conferenceData";
import committeeCsv2026 from "../../2AI-2026-Committee.csv?raw";

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function groupOrganizingFromCsv(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return {};

  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = {
    committeeType: headers.indexOf("committee_type"),
    subCommittee: headers.indexOf("sub_committe"),
    name: headers.indexOf("name"),
    role: headers.indexOf("role"),
    organization: headers.indexOf("organization"),
    country: headers.indexOf("country"),
  };

  const grouped = {};
  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]);
    const committeeType = String(cells[idx.committeeType] ?? "").trim().toLowerCase();
    if (committeeType !== "organizing committee") continue;

    const section = String(cells[idx.subCommittee] ?? "").trim();
    const name = String(cells[idx.name] ?? "").trim();
    const role = String(cells[idx.role] ?? "").trim();
    const organization = String(cells[idx.organization] ?? "").trim();
    const country = String(cells[idx.country] ?? "").trim();

    if (!section) continue;
    if (!grouped[section]) grouped[section] = [];

    // Keep section headers visible, but avoid rendering empty placeholder cards.
    if (!name && !role && !organization && !country) continue;

    grouped[section].push({
      sub_committe: section,
      name,
      designation: role,
      affiliation: organization || country,
      country,
    });
  }

  return grouped;
}

function OrganizingCommittee() {
  const [committee, setCommittee] = useState({});
  const { selectedYear } = useYear();

  useEffect(() => {
    let cancelled = false;

    if (selectedYear === 2026) {
      const grouped = groupOrganizingFromCsv(committeeCsv2026);
      setCommittee(grouped);
      return () => {
        cancelled = true;
      };
    }

    // Check if we have hardcoded data for this year first
    const yearData = conferenceData[selectedYear];
    if (yearData?.committee?.organizingCommittee) {
      setCommittee(yearData.committee.organizingCommittee);
      return;
    }

    (async () => {
      try {
        const filtered = await fetchCommitteeByType("organizing committee");
        if (cancelled) return;
        const grouped = {};
        filtered.forEach((member) => {
          if (!grouped[member.sub_committe]) grouped[member.sub_committe] = [];
          grouped[member.sub_committe].push(member);
        });
        setCommittee(grouped);
      } catch (err) {
        console.error("Error loading committee:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedYear]);

  return (
    <PageLayout 
      title="Organizing Committee"
      subtitle={`The team managing logistics and operations for the ${selectedYear} International Conference on Applied Artificial Intelligence`}
    >
      <div className="space-y-8">
        {Object.entries(committee).map(([section, members], idx) => (
          <div key={idx} className="bg-white rounded shadow-sm p-6">
            {section && section.trim() !== "" && section !== "null" && (
              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-4">
                {section}
              </h3>
            )}
            
            {String(section).trim().toUpperCase() === "THEME CHAIRS" ? (
              <div className="space-y-5">
                {Object.entries(
                  members.reduce((acc, member) => {
                    const topic = String(member.designation || "Theme").trim() || "Theme";
                    if (!acc[topic]) acc[topic] = [];
                    acc[topic].push(member);
                    return acc;
                  }, {}),
                ).map(([topic, topicMembers]) => (
                  <div
                    key={topic}
                    className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <h4 className="font-bold text-amber-700 text-base mb-2">{topic}</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {topicMembers.map((member, i) => (
                        <li key={`${topic}-${i}`} className="text-sm text-gray-800">
                          <span className="font-semibold">{member.name}</span>
                          {member.affiliation ? `, ${member.affiliation}` : ""}
                          {member.country ? ` (${member.country})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <h4 className="font-bold text-gray-800 text-base">{member.name}</h4>
                    {member.designation && (
                      <p className="text-sm text-blue-700 mt-1">{member.designation}</p>
                    )}
                    {member.affiliation && (
                      <p className="text-sm text-gray-600 mt-1">{member.affiliation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default OrganizingCommittee;
