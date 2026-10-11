// ─── RSVP backend abstraction ─────────────────────────────────────────────────
// Google Apps Script redirects POST requests (302) which causes CORS issues.
// Solution: submit via a hidden iframe form POST which follows redirects natively.

import type { RSVPData } from "@/types/rsvp";

const RSVP_MODE = process.env.NEXT_PUBLIC_RSVP_MODE ?? "mock";

export async function submitRSVP(data: RSVPData): Promise<{ success: boolean; message: string }> {
  if (RSVP_MODE === "mock") {
    console.group("[RSVP Mock] Submission received");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Guest:", data.name, "|", data.mobile);
    console.log("Events:", data.attendance);
    console.log("Message:", data.message);
    console.groupEnd();

    await new Promise((r) => setTimeout(r, 900));
    return { success: true, message: "mock" };
  }

  const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT;
  if (!endpoint) {
    throw new Error("RSVP endpoint not configured");
  }

  const payload = {
    ...data,
    submittedAt: new Date().toISOString(),
    source: "wedding-website",
  };

  // Strategy: Use a hidden form + iframe to POST data.
  // This avoids CORS entirely because form submissions follow redirects natively.
  return new Promise((resolve, reject) => {
    try {
      const iframeName = "rsvp_frame_" + Date.now();

      // Create hidden iframe
      const iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Create hidden form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = endpoint;
      form.target = iframeName;
      form.style.display = "none";

      // Add payload as a hidden input
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "data";
      input.value = JSON.stringify(payload);
      form.appendChild(input);

      document.body.appendChild(form);

      // Listen for iframe load (means form submitted successfully)
      let resolved = false;
      iframe.onload = () => {
        if (!resolved) {
          resolved = true;
          // Clean up after a short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
          }, 1000);
          resolve({ success: true, message: "live" });
        }
      };

      // Timeout fallback — assume success after 5 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
          } catch {}
          // Form was submitted, we just can't confirm — assume success
          resolve({ success: true, message: "live-timeout" });
        }
      }, 5000);

      // Submit the form
      form.submit();

    } catch (err) {
      reject(new Error("Could not submit RSVP. Please try again."));
    }
  });
}
