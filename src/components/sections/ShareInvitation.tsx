"use client";

import { useToast } from "@/components/ui/Toast";
import { siteConfig } from "@/config/site";
import { Share2, MessageCircle, Link2 } from "lucide-react";

interface ShareInvitationProps {
  variant?: "modal" | "inline";
  onClose?: () => void;
}

export default function ShareInvitation({ variant = "inline", onClose }: ShareInvitationProps) {
  const { showToast } = useToast();
  const url  = siteConfig.social.url;
  const text = siteConfig.social.whatsappText + url;

  const handleNativeShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: siteConfig.social.title,
          text:  siteConfig.social.description,
          url,
        });
      } catch {
        // User cancelled - ignore
      }
    } else {
      copyLink();
    }
    onClose?.();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Invitation link copied!");
    } catch {
      showToast("Could not copy - please copy from the address bar");
    }
    onClose?.();
  };

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleNativeShare}
          className="btn-outline btn-sm flex items-center gap-1.5"
          aria-label="Share invitation"
        >
          <Share2 size={14} />
          Share
        </button>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline btn-sm flex items-center gap-1.5"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
        <button
          onClick={copyLink}
          className="btn-outline btn-sm flex items-center gap-1.5"
          aria-label="Copy invitation link"
        >
          <Link2 size={14} />
          Copy Link
        </button>
      </div>
    );
  }

  // Modal variant - rendered inside a bottom sheet
  return (
    <div
      className="fixed inset-0 z-[7000] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Share invitation"
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(30,24,20,0.6)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full sm:w-auto sm:min-w-[320px] rounded-t-2xl sm:rounded-2xl p-6"
        style={{ background: "var(--ivory)", maxWidth: 400, zIndex: 1 }}
      >
        <h3
          style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 400, color: "var(--charcoal)", marginBottom: "1rem" }}
        >
          Share the Invitation
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleNativeShare}
            className="btn-primary flex items-center gap-2"
          >
            <Share2 size={15} />
            Share Invitation
          </button>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center gap-2"
          >
            <MessageCircle size={15} />
            Share on WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="btn-outline flex items-center gap-2"
          >
            <Link2 size={15} />
            Copy Invitation Link
          </button>
        </div>
      </div>
    </div>
  );
}

