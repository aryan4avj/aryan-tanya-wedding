"use client";

import { useToast } from "@/components/ui/Toast";
import { siteConfig } from "@/config/site";
import { Share2, MessageCircle, Link2, X } from "lucide-react";
import { C, F, styles } from "@/lib/styles";

interface ShareInvitationProps {
  variant?: "modal" | "inline";
  onClose?: () => void;
}

export default function ShareInvitation({ variant = "inline", onClose }: ShareInvitationProps) {
  const { showToast } = useToast();
  const url  = typeof window !== "undefined" ? window.location.origin : siteConfig.social.url;
  const text = siteConfig.social.whatsappText + url;

  const handleNativeShare = async () => {
    // Use Web Share API on mobile — shows the native share sheet
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: siteConfig.social.title,
          text:  siteConfig.social.description,
          url,
        });
        onClose?.();
        return;
      } catch {
        // User cancelled or not supported — fall through to WhatsApp
      }
    }
    // Fallback: open WhatsApp share
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    onClose?.();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied!");
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Link copied!");
    }
    onClose?.();
  };

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  // Modal variant
  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share invitation"
      style={{
        position: "fixed", inset: 0, zIndex: 7000,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        background: "rgba(30,24,20,0.6)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 400,
          background: C.ivory,
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 20px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 400, color: C.charcoal, margin: 0 }}>
            Share Invitation
          </h3>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: "50%", background: "rgba(182,150,89,0.1)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={14} color={C.charcoal} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Native share — works on iOS Safari, Android Chrome */}
          <button
            onClick={handleNativeShare}
            style={{ ...styles.btnPrimary, width: "100%", gap: 8 }}
          >
            <Share2 size={16} /> Share
          </button>

          {/* WhatsApp direct */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.btnOutline, width: "100%", gap: 8, textDecoration: "none" }}
          >
            <MessageCircle size={16} /> WhatsApp
          </a>

          {/* Copy link */}
          <button
            onClick={copyLink}
            style={{ ...styles.btnOutline, width: "100%", gap: 8 }}
          >
            <Link2 size={16} /> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
