// ─── RSVP backend abstraction ─────────────────────────────────────────────────
// Swap out the submitRSVP implementation to connect to your chosen backend.
// Options: Supabase, Firebase, Airtable (server fn), Google Sheets (API), custom.
//
// In development / when no backend is configured, data is logged to the console.
// Set NEXT_PUBLIC_RSVP_MODE=live in .env.local to enable live submission.

import type { RSVPData } from "@/types/rsvp";

const RSVP_MODE = process.env.NEXT_PUBLIC_RSVP_MODE ?? "mock";

export async function submitRSVP(data: RSVPData): Promise<{ success: boolean; message: string }> {
  if (RSVP_MODE === "mock") {
    // ── Development mode ─────────────────────────────────────────────────────
    console.group("[RSVP Mock] Submission received");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Guest:", data.name, "|", data.mobile);
    console.log("Events:", data.attendance);
    console.log("Dietary:", data.dietaryRequirements);
    console.log("Additional info:", data);
    console.groupEnd();

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    return { success: true, message: "mock" };
  }

  // ── Live mode ───────────────────────────────────────────────────────────────
  const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT;
  if (!endpoint) {
    throw new Error("RSVP endpoint not configured. Set NEXT_PUBLIC_RSVP_ENDPOINT in .env.local");
  }

  const payload = {
    ...data,
    submittedAt: new Date().toISOString(),
    source: "wedding-website",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`RSVP submission failed: ${response.status} ${text}`);
  }

  return { success: true, message: "live" };
}
