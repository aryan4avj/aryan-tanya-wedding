// ─── RSVP backend abstraction ─────────────────────────────────────────────────
// Google Apps Script returns a redirect (302) which causes CORS issues with
// regular fetch. We use two strategies:
// 1. Try fetch with redirect: "follow" first
// 2. If that fails, use mode: "no-cors" which sends the data but returns opaque response
// The data still reaches the Google Sheet in both cases.

import type { RSVPData } from "@/types/rsvp";

const RSVP_MODE = process.env.NEXT_PUBLIC_RSVP_MODE ?? "mock";

export async function submitRSVP(data: RSVPData): Promise<{ success: boolean; message: string }> {
  if (RSVP_MODE === "mock") {
    console.group("[RSVP Mock] Submission received");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Guest:", data.name, "|", data.mobile);
    console.log("Events:", data.attendance);
    console.log("Additional info:", data);
    console.groupEnd();

    await new Promise((r) => setTimeout(r, 900));
    return { success: true, message: "mock" };
  }

  // ── Live mode ───────────────────────────────────────────────────────────────
  const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT;
  if (!endpoint) {
    throw new Error("RSVP endpoint not configured");
  }

  const payload = {
    ...data,
    submittedAt: new Date().toISOString(),
    source: "wedding-website",
  };

  try {
    // Strategy 1: Normal fetch with redirect follow
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // text/plain avoids CORS preflight
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    // Google Apps Script may return 200 or redirect to a result page
    // Any non-error status means the data was received
    if (response.ok || response.type === "opaque" || response.status === 0) {
      return { success: true, message: "live" };
    }

    // If we got a readable error, throw it
    if (!response.ok && response.status >= 400) {
      const text = await response.text().catch(() => "");
      throw new Error(`RSVP failed: ${response.status} ${text}`);
    }

    // Otherwise assume success — Apps Script received the data
    return { success: true, message: "live" };

  } catch (err: unknown) {
    // Strategy 2: If CORS blocks the redirect, try no-cors
    // The data still reaches the server, we just can't read the response
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
      // no-cors always returns opaque response — assume success
      return { success: true, message: "live-no-cors" };
    } catch {
      // Both strategies failed — likely network issue
      throw new Error("Could not reach the server. Please check your connection and try again.");
    }
  }
}
