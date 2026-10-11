"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { C, F } from "@/lib/styles";

const FAMILIES = [
  {
    label: "Groom's Family",
    accent: "#b07060",
    bg: "rgba(213,154,145,0.05)",
    border: "rgba(213,154,145,0.18)",
    rows: [
      ["Grandparents", "Smt. Shashi & Late Sh. Ashok K. Jain"],
      ["Parents",      "Smt. Sweta & Sh. Vikas Jain"],
      ["Sister",       "Aaradhya (Archie)"],
    ],
  },
  {
    label: "Bride's Family",
    accent: "#6e8a62",
    bg: "rgba(168,182,157,0.05)",
    border: "rgba(168,182,157,0.2)",
    rows: [
      ["Grandparents", "Late Smt. Kamla & Late Sh. Ram B. Gupta"],
      ["Parents",      "Smt. Parul & Sh. Jai Prakash Gupta"],
      ["Brothers",     "Yathartha & Shiven"],
    ],
  },
];

export default function FamilySection() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section aria-label="Our families" style={{ background: C.ivory, padding: "clamp(1.75rem, 5vw, 2.75rem) clamp(1.25rem, 5vw, 2rem)" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Tiny heading */}
        <p style={{ fontFamily: F.script, fontSize: 14, color: C.dustyRose, textAlign: "center", marginBottom: 10 }}>
          With the blessings of our families
        </p>

        {/* Two cards side by side */}
        <div style={{ display: "flex", gap: 8 }}>
          {FAMILIES.map(fam => (
            <div key={fam.label} style={{
              flex: 1,
              background: fam.bg,
              border: `1px solid ${fam.border}`,
              borderRadius: 12,
              padding: "10px 11px",
              minWidth: 0,
            }}>
              {/* Side label */}
              <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase" as const, color: fam.accent, marginBottom: 8 }}>
                {fam.label}
              </p>

              {/* Rows */}
              {fam.rows.map(([role, names]) => (
                <div key={role} style={{ marginBottom: 6 }}>
                  <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, color: fam.accent, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 1 }}>
                    {role}
                  </p>
                  <p style={{ fontFamily: F.display, fontSize: 13, fontWeight: 400, color: C.charcoal, lineHeight: 1.35, margin: 0 }}>
                    {names}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
