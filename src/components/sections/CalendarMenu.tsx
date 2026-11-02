"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { X, ChevronRight, ChevronDown, Check, Download } from "lucide-react";
import type { WeddingEvent } from "@/data/events";
import { siteConfig } from "@/config/site";
import { useToast } from "@/components/ui/Toast";
import { ALL_EVENTS_ID, googleCalendarUrl, icsFileName, icsHref, outlookCalendarUrl } from "@/lib/calendar";
import { C, F } from "@/lib/styles";

/**
 * "Add to calendar" chooser - guests pick the calendar they actually use, like the sheet
 * other apps show. The option that suits the device is listed first and marked:
 *  - iPhone / iPad / Mac: Apple Calendar - opens our .ics, which Safari hands straight
 *    to the Calendar app ("Add to Calendar")
 *  - Android: Google Calendar - opens the Google Calendar event editor
 *  - everyone: Outlook.com, or a downloadable .ics for Samsung and other calendar apps
 * With several events, Apple/.ics add them all at once; Google/Outlook can only add one
 * event per link, so those options expand into a list of the celebrations.
 */

interface CalendarMenuProps {
  events: WeddingEvent[];
  onClose: () => void;
}

type Platform = "ios" | "android" | "mac" | "other";
type OptionKind = "apple" | "google" | "outlook" | "ics";

const ORDER: Record<Platform, OptionKind[]> = {
  ios:     ["apple", "google", "outlook"],
  android: ["google", "ics", "outlook"],
  mac:     ["apple", "google", "outlook"],
  other:   ["google", "outlook", "ics"],
};

// In-app browsers (Instagram, Facebook...) often can't hand files to the Calendar app
const IN_APP_BROWSER = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|LinkedInApp|WhatsApp|GSA\//i;

// Darker gold so small white-on-gold text stays readable (~5:1)
const GOLD_INK = "#8A6A2E";

function detectDevice() {
  const ua = navigator.userAgent;
  const iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  let platform: Platform = "other";
  let name = "";
  if (/iPhone|iPod/.test(ua)) { platform = "ios"; name = "iPhone"; }
  else if (/iPad/.test(ua) || iPadOS) { platform = "ios"; name = "iPad"; }
  else if (/Android/i.test(ua)) { platform = "android"; name = "Android"; }
  else if (/Macintosh|Mac OS X/.test(ua)) { platform = "mac"; name = "Mac"; }
  return { platform, name, inApp: IN_APP_BROWSER.test(ua) };
}

function optionText(kind: OptionKind, platform: Platform) {
  switch (kind) {
    case "apple":   return { label: "Apple Calendar", hint: "iPhone, iPad & Mac" };
    case "google":  return { label: "Google Calendar", hint: "Android & Gmail" };
    case "outlook": return { label: "Outlook", hint: "Outlook.com & Hotmail" };
    case "ics":     return {
      label: platform === "android" ? "Samsung & other calendars" : "Other calendar apps",
      hint: "Downloads a calendar file (.ics)",
    };
  }
}

const dayOf = (e: WeddingEvent) => Number(e.date.slice(8, 10));

export default function CalendarMenu({ events, onClose }: CalendarMenuProps) {
  const { showToast } = useToast();
  const [device] = useState(detectDevice);
  // The button that opened the sheet - focus goes back to it on close
  const [returnFocusTo] = useState(() => document.activeElement as HTMLElement | null);
  const [expanded, setExpanded] = useState<OptionKind | null>(null);
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const isAll = events.length > 1;
  const single = events[0];
  const fileId = isAll ? ALL_EVENTS_ID : single.id;
  const order = ORDER[device.platform];
  const badge = device.name ? `Best for ${device.name}` : "Recommended";

  const close = useEffectEvent(() => onClose());

  // Focus the recommended option, trap Tab inside the sheet, Escape closes, lock page scroll
  useEffect(() => {
    const sheet = sheetRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheet?.querySelector<HTMLElement>("[data-recommended]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab" || !sheet) return;
      const focusable = [...sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (returnFocusTo?.isConnected) returnFocusTo.focus();
    };
  }, [returnFocusTo]);

  // Let the link do its job (open tab / Calendar sheet / download) before the sheet unmounts
  const closeSoon = () => window.setTimeout(onClose, 250);

  const markOpened = (key: string) => setOpened((prev) => new Set(prev).add(key));

  const linkFor = (kind: "google" | "outlook", e: WeddingEvent) =>
    kind === "google" ? googleCalendarUrl(e) : outlookCalendarUrl(e);

  const renderOption = (kind: OptionKind, index: number) => {
    const { label, hint } = optionText(kind, device.platform);
    const recommended = index === 0;
    const body = (
      <>
        <OptionIcon kind={kind} day={dayOf(single)} />
        <span className="cal-text">
          <span className="cal-label">{label}</span>
          <span className="cal-hint">{hint}</span>
        </span>
        {recommended && <span className="cal-badge">{badge}</span>}
      </>
    );
    const common = {
      className: "cal-option",
      "data-recommended": recommended ? "" : undefined,
    };

    // Apple + .ics: one file holds every event, so this works for "add all" too
    if (kind === "apple" || kind === "ics") {
      return (
        <li key={kind}>
          <a
            {...common}
            href={icsHref(fileId)}
            {...(kind === "ics" ? { download: icsFileName(fileId) } : {})}
            onClick={() => {
              if (kind === "ics") showToast("Calendar file downloaded - open it to add the dates", 4000);
              closeSoon();
            }}
          >
            {body}
            <ChevronRight size={16} color={C.muted} aria-hidden="true" />
          </a>
        </li>
      );
    }

    // Google / Outlook, single event: straight to the add-event page
    if (!isAll) {
      return (
        <li key={kind}>
          <a {...common} href={linkFor(kind, single)} target="_blank" rel="noopener noreferrer" onClick={closeSoon}>
            {body}
            <ChevronRight size={16} color={C.muted} aria-hidden="true" />
          </a>
        </li>
      );
    }

    // Google / Outlook, several events: one link per celebration
    const listId = `${titleId}-${kind}`;
    const isOpen = expanded === kind;
    return (
      <li key={kind}>
        <button
          {...common}
          type="button"
          aria-expanded={isOpen}
          aria-controls={listId}
          onClick={() => setExpanded(isOpen ? null : kind)}
        >
          {body}
          <ChevronDown size={16} color={C.muted} aria-hidden="true" style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }} />
        </button>
        {isOpen && (
          <div id={listId}>
            <p className="cal-sub-note">{label} adds one celebration at a time - tap each one:</p>
            <ul className="cal-sub">
              {events.map((e) => {
                const key = `${kind}:${e.id}`;
                const done = opened.has(key);
                return (
                  <li key={e.id}>
                    <a href={linkFor(kind, e)} target="_blank" rel="noopener noreferrer" onClick={() => markOpened(key)} data-done={done ? "" : undefined}>
                      <span className="cal-text">
                        <span className="cal-label cal-label--sm">{e.name}</span>
                        <span className="cal-hint">{e.dateDisplay.replace(/ \d{4}$/, "")} · {e.timeDisplay}</span>
                      </span>
                      {done
                        ? <Check size={16} color={GOLD_INK} aria-label="Opened" />
                        : <ChevronRight size={16} color={C.muted} aria-hidden="true" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="cal-backdrop" onClick={onClose}>
      <style>{CSS}</style>
      <div
        ref={sheetRef}
        className="cal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cal-handle" aria-hidden="true" />

        <div className="cal-head">
          <div>
            <p className="cal-eyebrow">Save the date</p>
            <h3 id={titleId} className="cal-title">Add to your calendar</h3>
            <p className="cal-event">{isAll ? `All ${events.length} celebrations` : single.name}</p>
            <p className="cal-when">
              {isAll ? siteConfig.weddingDates.display : `${single.dateDisplay} · ${single.timeDisplay}`}
            </p>
          </div>
          <button type="button" className="cal-close" onClick={onClose} aria-label="Close">
            <X size={16} color={C.charcoal} />
          </button>
        </div>

        <ul className="cal-options">{order.map(renderOption)}</ul>

        {device.inApp && (
          <p className="cal-note">
            Opened this inside WhatsApp, Instagram or Facebook? If your calendar doesn&apos;t open,
            tap the <strong>⋯</strong> menu and choose <strong>Open in {device.platform === "ios" ? "Safari" : "browser"}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Small calendar marks (kept generic - no brand assets needed) ──────────────
function OptionIcon({ kind, day }: { kind: OptionKind; day: number }) {
  const tile = { x: 1, y: 1, width: 34, height: 34, rx: 8 };
  if (kind === "apple") {
    return (
      <svg className="cal-icon" viewBox="0 0 36 36" aria-hidden="true">
        <rect {...tile} fill="#fff" stroke="rgba(66,58,54,0.16)" />
        <path d="M1 9a8 8 0 0 1 8-8h18a8 8 0 0 1 8 8v2H1z" fill="#EF4135" />
        <text x="18" y="28.5" textAnchor="middle" fontFamily="-apple-system, 'Helvetica Neue', Arial, sans-serif" fontSize="15" fontWeight="600" fill="#1D1D1F">{day}</text>
      </svg>
    );
  }
  if (kind === "google") {
    return (
      <svg className="cal-icon" viewBox="0 0 36 36" aria-hidden="true">
        <rect {...tile} fill="#fff" stroke="rgba(66,58,54,0.16)" />
        <path d="M8 8h20v6H8z" fill="#4285F4" />
        <path d="M8 14h4v14H8z" fill="#34A853" />
        <path d="M24 14h4v8h-4z" fill="#FBBC04" />
        <path d="M24 22h4v6h-4z" fill="#EA4335" />
        <text x="18" y="25.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9.5" fontWeight="700" fill="#4285F4">31</text>
      </svg>
    );
  }
  if (kind === "outlook") {
    return (
      <svg className="cal-icon" viewBox="0 0 36 36" aria-hidden="true">
        <rect {...tile} fill="#0F6CBD" />
        <ellipse cx="18" cy="18" rx="6.5" ry="7.5" fill="none" stroke="#fff" strokeWidth="3.2" />
      </svg>
    );
  }
  return (
    <span className="cal-icon cal-icon--ics" aria-hidden="true">
      <Download size={17} color={GOLD_INK} />
    </span>
  );
}

const CSS = `
  .cal-backdrop {
    position: fixed; inset: 0; z-index: 8500;
    display: flex; align-items: flex-end; justify-content: center;
    background: rgba(30,24,20,0.6);
    animation: calFade 0.25s ease both;
  }
  .cal-sheet {
    width: 100%; max-width: 440px;
    max-height: min(90dvh, 680px); overflow-y: auto; overscroll-behavior: contain;
    background: ${C.ivory};
    border-radius: 22px 22px 0 0;
    padding: 10px 16px calc(env(safe-area-inset-bottom, 0px) + 18px);
    box-shadow: 0 -8px 40px rgba(30,24,20,0.25);
    animation: calUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .cal-handle { width: 40px; height: 4px; border-radius: 2px; background: rgba(182,150,89,0.35); margin: 0 auto 12px; }
  .cal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; padding: 0 2px; }
  .cal-eyebrow { font-family: ${F.script}; font-size: 15px; color: ${C.dustyRose}; margin: 0 0 2px; line-height: 1.2; }
  .cal-title { font-family: ${F.display}; font-size: 21px; font-weight: 400; color: ${C.charcoal}; margin: 0 0 6px; line-height: 1.2; }
  .cal-event { font-family: ${F.body}; font-size: 14px; font-weight: 600; color: ${C.charcoal}; margin: 0; line-height: 1.35; }
  .cal-when { font-family: ${F.body}; font-size: 12.5px; color: ${C.secondary}; margin: 2px 0 0; line-height: 1.4; }
  .cal-close {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(182,150,89,0.12); border: none; cursor: pointer;
  }

  .cal-options, .cal-sub { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .cal-option {
    display: flex; align-items: center; gap: 12px;
    width: 100%; min-height: 62px; padding: 10px 12px;
    border-radius: 14px; border: 1px solid rgba(182,150,89,0.22);
    background: rgba(255,255,255,0.78);
    color: ${C.charcoal}; text-decoration: none; text-align: left;
    font: inherit; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
  }
  .cal-option:hover { border-color: rgba(182,150,89,0.5); background: #fff; }
  .cal-option:active { transform: scale(0.99); }
  .cal-option[data-recommended] {
    border: 1.5px solid rgba(182,150,89,0.65);
    background: rgba(244,235,221,0.7);
    box-shadow: 0 3px 14px rgba(182,150,89,0.16);
  }
  .cal-icon { width: 36px; height: 36px; flex-shrink: 0; display: block; }
  .cal-icon--ics { display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(182,150,89,0.14); }
  .cal-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .cal-label { font-family: ${F.body}; font-size: 15px; font-weight: 600; line-height: 1.25; }
  .cal-label--sm { font-size: 14px; }
  .cal-hint { font-family: ${F.body}; font-size: 12.5px; color: ${C.secondary}; line-height: 1.35; }
  .cal-badge {
    flex-shrink: 0; padding: 4px 9px; border-radius: 999px;
    font-family: ${F.body}; font-size: 11px; font-weight: 700; letter-spacing: 0.01em;
    color: #fff; background: ${GOLD_INK}; white-space: nowrap;
  }

  .cal-sub-note { font-family: ${F.body}; font-size: 12.5px; color: ${C.secondary}; margin: 8px 4px 6px; }
  .cal-sub a {
    display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 8px 12px;
    border-radius: 12px; border: 1px dashed rgba(182,150,89,0.4); background: rgba(255,255,255,0.6);
    color: ${C.charcoal}; text-decoration: none;
  }
  .cal-sub a[data-done] { border-style: solid; background: rgba(244,235,221,0.55); }

  .cal-note {
    font-family: ${F.body}; font-size: 12.5px; line-height: 1.5; color: ${C.secondary};
    margin: 12px 2px 0; padding: 10px 12px; border-radius: 12px;
    background: rgba(213,154,145,0.08); border: 1px solid rgba(213,154,145,0.22);
  }

  @media (min-width: 768px) {
    .cal-backdrop { align-items: center; padding: 24px; }
    .cal-sheet { border-radius: 22px; padding: 20px 20px 22px; box-shadow: 0 12px 48px rgba(30,24,20,0.3); }
    .cal-handle { display: none; }
  }

  @keyframes calFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes calUp   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
`;
