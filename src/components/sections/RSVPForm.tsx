"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { submitRSVP } from "@/lib/rsvp";
import { weddingEvents } from "@/data/events";
import { C, F, styles } from "@/lib/styles";
import type { RSVPData } from "@/types/rsvp";

const step1Schema = z.object({
  name:       z.string().min(2, "Please enter your full name"),
  mobile:     z.string().min(8, "Please enter a valid mobile number").regex(/^[\d\s+\-()]+$/, "Mobile number looks invalid"),
  email:      z.string().email("Please enter a valid email").optional().or(z.literal("")),
  guestCount: z.number().int().min(1, "At least 1 guest").max(20, "Maximum 20"),
});
type Step1 = z.infer<typeof step1Schema>;

const inputStyle: React.CSSProperties = {
  width: "100%", minHeight: 44, padding: "0 0.875rem",
  borderRadius: 10, border: "1.5px solid rgba(182,150,89,0.3)",
  background: "rgba(255,255,255,0.7)", fontFamily: F.body,
  fontSize: "0.9rem", color: C.charcoal, outline: "none",
  transition: "border-color 0.2s", boxSizing: "border-box" as const,
};

function Field({ label, error, children, required, id }: { label: string; error?: string; children: React.ReactNode; required?: boolean; id: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor={id} style={{ fontFamily: F.body, fontSize: "0.8rem", fontWeight: 600, color: C.charcoal, display: "block", marginBottom: 4 }}>
        {label}{required && <span style={{ color: C.terracotta }} aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p role="alert" style={{ fontFamily: F.body, fontSize: "0.72rem", color: C.terracotta, marginTop: 3 }}>{error}</p>}
    </div>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }} aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ width: i + 1 === step ? 28 : 10, height: 10, borderRadius: 5, background: i + 1 <= step ? C.gold : "rgba(182,150,89,0.2)", transition: "all 0.3s" }} />
      ))}
    </div>
  );
}

function Success() {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(168,182,157,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <CheckCircle size={30} color={C.sage} />
      </div>
      <h3 style={{ fontFamily: F.display, fontSize: "clamp(1.6rem, 6vw, 2rem)", fontWeight: 400, color: C.charcoal, marginBottom: 8 }}>Thank you!</h3>
      <p style={{ fontFamily: F.script, fontSize: "1.1rem", color: "#b07060", marginBottom: 16 }}>We can't wait to celebrate with you.</p>
      <p style={{ fontFamily: F.display, fontSize: "1.4rem", fontWeight: 400, color: C.charcoal, marginBottom: 24 }}>Aryan &amp; Tanya</p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, maxWidth: 280, margin: "0 auto" }}>
        <button onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })} style={styles.btnPrimary}>View Celebrations</button>
      </div>
    </div>
  );
}

const LABELS: Record<string, string> = { attending: "Attending", "not-attending": "Not attending", maybe: "Not sure yet" };

export default function RSVPForm() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [step, setStep]         = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedStep1, setSavedStep1] = useState<Partial<Step1>>({});
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(weddingEvents.map(e => [e.id, "attending"]))
  );
  const [message, setMessage] = useState("");

  const { register, handleSubmit, formState: { errors }, control } = useForm<Step1>({
    resolver: zodResolver(step1Schema) as import("react-hook-form").Resolver<Step1>,
    defaultValues: { guestCount: 1, ...savedStep1 },
  });

  const onStep1 = handleSubmit(data => {
    setSavedStep1(data);
    setStep(2);
    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  });

  const handleFinalSubmit = async () => {
    const full: RSVPData = {
      name: savedStep1.name!, mobile: savedStep1.mobile!, email: savedStep1.email,
      guestCount: savedStep1.guestCount!,
      attendance: attendance as Record<string, "attending" | "not-attending" | "maybe">,
      dietaryRequirements: "", accommodationRequired: false,
      transportRequired: false, childrenCount: 0, message,
    };
    setSubmitting(true); setSubmitError("");
    try { await submitRSVP(full); setSubmitted(true); }
    catch { setSubmitError("Something went wrong. Please try again or WhatsApp us."); }
    finally { setSubmitting(false); }
  };

  const cardBg: React.CSSProperties = {
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(12px)",
    borderRadius: 18,
    border: "1px solid rgba(182,150,89,0.2)",
    boxShadow: "0 4px 28px rgba(66,58,54,0.07)",
    padding: "clamp(1rem, 4vw, 1.5rem)",
  };

  return (
    <section id="rsvp" aria-labelledby="rsvp-heading" style={{
      background: C.champagne,
      backgroundImage: "radial-gradient(circle, rgba(213,154,145,0.06) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      padding: "clamp(1.75rem, 5vw, 2.75rem) clamp(1.25rem, 5vw, 2rem)",
    }}>
      <div ref={sectionRef} className="reveal" style={{ maxWidth: 520, margin: "0 auto" }}>
        <SectionHeading eyebrow="You're Invited" title="RSVP" />

        <div style={cardBg}>
          {submitted ? <Success /> : (
            <>
              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={onStep1} noValidate>
                  <h3 style={{ fontFamily: F.display, fontSize: "1.3rem", fontWeight: 400, color: C.charcoal, marginBottom: 20 }}>Your Details</h3>
                  <Field label="Full Name" error={errors.name?.message} required id="rsvp-name">
                    <input id="rsvp-name" {...register("name")} type="text" autoComplete="name" placeholder="Your full name" style={{ ...inputStyle, borderColor: errors.name ? C.terracotta : "rgba(182,150,89,0.3)" }} />
                  </Field>
                  <Field label="Mobile Number" error={errors.mobile?.message} required id="rsvp-mobile">
                    <input id="rsvp-mobile" {...register("mobile")} type="tel" autoComplete="tel" placeholder="+91 xxxxx xxxxx" style={{ ...inputStyle, borderColor: errors.mobile ? C.terracotta : "rgba(182,150,89,0.3)" }} />
                  </Field>
                  <Field label="Email (optional)" error={errors.email?.message} id="rsvp-email">
                    <input id="rsvp-email" {...register("email")} type="email" autoComplete="email" placeholder="your@email.com" style={inputStyle} />
                  </Field>
                  <Field label="Number of Guests (including yourself)" error={errors.guestCount?.message} required id="rsvp-guests">
                    <Controller name="guestCount" control={control} render={({ field }) => (
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button type="button" onClick={() => field.onChange(Math.max(1, field.value - 1))} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(182,150,89,0.12)", border: "1px solid rgba(182,150,89,0.25)", fontFamily: F.body, fontSize: "1.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Decrease">−</button>
                        <span style={{ fontFamily: F.display, fontSize: "1.6rem", color: C.charcoal, minWidth: "2ch", textAlign: "center" }}>{field.value}</span>
                        <button type="button" onClick={() => field.onChange(Math.min(20, field.value + 1))} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(182,150,89,0.12)", border: "1px solid rgba(182,150,89,0.25)", fontFamily: F.body, fontSize: "1.25rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Increase">+</button>
                      </div>
                    )} />
                  </Field>
                  <button type="submit" style={{ ...styles.btnPrimary, width: "100%", marginTop: 4 }}>
                    Next <ChevronRight size={15} />
                  </button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: F.display, fontSize: "1.3rem", fontWeight: 400, color: C.charcoal, marginBottom: 6 }}>Which celebrations will you join?</h3>
                  <p style={{ fontFamily: F.body, fontSize: "0.85rem", color: C.secondary, marginBottom: 20 }}>Select your attendance for each ceremony.</p>
                  {weddingEvents.map(event => (
                    <div key={event.id} style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 14, background: "rgba(182,150,89,0.05)", border: "1px solid rgba(182,150,89,0.15)" }}>
                      <p style={{ fontFamily: F.body, fontSize: "0.875rem", fontWeight: 600, color: C.charcoal, marginBottom: 4 }}>{event.name}</p>
                      <p style={{ fontFamily: F.body, fontSize: "0.75rem", color: C.secondary, marginBottom: 10 }}>{event.dateDisplay} · {event.timeDisplay}</p>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }} role="group" aria-label={`Attendance for ${event.name}`}>
                        {(["attending", "not-attending", "maybe"] as const).map(val => (
                          <button key={val} type="button" onClick={() => setAttendance(p => ({ ...p, [event.id]: val }))} aria-pressed={attendance[event.id] === val}
                            style={{ minHeight: 36, padding: "0 12px", borderRadius: 9999, fontFamily: F.body, fontSize: "0.78rem", fontWeight: attendance[event.id] === val ? 600 : 400, background: attendance[event.id] === val ? C.charcoal : "rgba(182,150,89,0.08)", color: attendance[event.id] === val ? C.ivory : C.secondary, border: attendance[event.id] === val ? "none" : "1px solid rgba(182,150,89,0.2)", cursor: "pointer", transition: "all 0.2s" }}>
                            {LABELS[val]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button onClick={() => setStep(1)} style={{ ...styles.btnOutline, gap: 5 }}><ChevronLeft size={14} /> Back</button>
                    <button onClick={() => setStep(3)} style={{ ...styles.btnPrimary, flex: 1, gap: 5 }}>Next <ChevronRight size={14} /></button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: F.display, fontSize: "1.2rem", fontWeight: 400, color: C.charcoal, marginBottom: 14 }}>Almost done!</h3>

                  <Field label="A message for Aryan & Tanya (optional)" id="rsvp-message">
                    <textarea id="rsvp-message" value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="We'd love to hear from you…" style={{ ...inputStyle, minHeight: 80, resize: "vertical" as const }} />
                  </Field>

                  {/* Summary */}
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(168,182,157,0.1)", border: "1px solid rgba(168,182,157,0.25)", marginBottom: 14 }}>
                    <p style={{ fontFamily: F.body, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 5 }}>Your RSVP Summary</p>
                    <p style={{ fontFamily: F.body, fontSize: "0.85rem", color: C.charcoal }}>
                      <strong>{savedStep1.name}</strong> · {savedStep1.guestCount} guest{(savedStep1.guestCount ?? 1) > 1 ? "s" : ""}
                    </p>
                    <p style={{ fontFamily: F.body, fontSize: "0.78rem", color: C.secondary, marginTop: 2 }}>
                      {Object.entries(attendance).filter(([,v]) => v === "attending").map(([k]) => weddingEvents.find(e => e.id === k)?.name).filter(Boolean).join(", ") || "No events selected as attending"}
                    </p>
                  </div>

                  {submitError && <p role="alert" style={{ fontFamily: F.body, fontSize: "0.82rem", color: C.terracotta, marginBottom: 10 }}>{submitError}</p>}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(2)} style={{ ...styles.btnOutline, gap: 5 }}><ChevronLeft size={14} /> Back</button>
                    <button onClick={handleFinalSubmit} disabled={submitting} style={{ ...styles.btnGold, flex: 1, gap: 8 }} aria-busy={submitting}>
                      {submitting ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : "Confirm RSVP"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
