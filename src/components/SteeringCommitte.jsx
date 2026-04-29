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

function groupSteeringFromCsv(csvText) {
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

  const members = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]);
    const committeeType = String(cells[idx.committeeType] ?? "").trim().toLowerCase();
    const subCommittee = String(cells[idx.subCommittee] ?? "").trim().toLowerCase();

    const isSteeringCommitteeType = committeeType === "steering committee";
    const isSteeringSubCommittee = subCommittee === "steering committee";
    const isOrganizingSteering =
      committeeType === "organizing committee" && isSteeringSubCommittee;
    if (!isSteeringCommitteeType && !isOrganizingSteering) continue;

    const name = String(cells[idx.name] ?? "").trim();
    const role = String(cells[idx.role] ?? "").trim();
    const organization = String(cells[idx.organization] ?? "").trim();
    const country = String(cells[idx.country] ?? "").trim();
    if (!name && !role && !organization && !country) continue;

    members.push({
      name,
      designation: role,
      affiliation: organization,
      country,
    });
  }

  return members.length > 0 ? { "Steering Committee Members": members } : {};
}

function SteeringCommittee() {
  const [committee, setCommittee] = useState({});
  const { selectedYear } = useYear();

  useEffect(() => {
    let cancelled = false;

    if (selectedYear === 2026) {
      const grouped = groupSteeringFromCsv(committeeCsv2026);
      setCommittee(grouped);
      return () => {
        cancelled = true;
      };
    }

    // Check if we have hardcoded data for this year first
    const yearData = conferenceData[selectedYear];
    if (yearData?.committee?.steeringCommittee) {
      const members = yearData.committee.steeringCommittee;
      const grouped = { "Steering Committee Members": members };
      setCommittee(grouped);
      return;
    }

    (async () => {
      try {
        const filtered = await fetchCommitteeByType("steering committee");
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
      title="Steering Committee"
      subtitle={`Leadership and guidance for the ${selectedYear} International Conference on Applied Artificial Intelligence`}
    >
      <div className="space-y-8">
        {Object.entries(committee).map(([section, members], idx) => (
          <div key={idx} className="bg-white rounded shadow-sm p-6">
            {section && section.trim() !== "" && section !== "null" && (
              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
                {section}
              </h3>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member, i) => (
                <div key={i} className="border border-gray-200 rounded p-4 hover:shadow-md transition">
                  <h4 className="font-bold text-gray-800 text-base">{member.name}</h4>
                  {member.designation && (
                    <p className="text-sm text-gray-600 mt-1">{member.designation}</p>
                  )}
                  {member.affiliation && (
                    <p className="text-sm text-blue-600 mt-1">
                      {member.affiliation}
                      {member.country && `, ${member.country}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default SteeringCommittee;
