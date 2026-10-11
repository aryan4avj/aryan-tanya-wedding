"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function MusicControl() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after a brief delay once invitation is open
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(siteConfig.music.src);
      audio.loop = true;
      audio.volume = 0.35;
      audio.preload = "none";
      audioRef.current = audio;
    }

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) audioRef.current?.pause();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {
        // Autoplay blocked - user must interact again
      });
      setPlaying(true);
    }
  };

  if (!siteConfig.features.music) return null;

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play background music"}
      aria-pressed={playing}
      style={{
        position: "fixed",
        top: "1.25rem",
        right: "1.25rem",
        zIndex: 800,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(255,249,241,0.85)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(182,150,89,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(66,58,54,0.1)",
        transition: "opacity 0.4s ease, transform 0.2s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
      }}
    >
      {playing ? (
        <Music size={17} style={{ color: "var(--gold)" }} />
      ) : (
        <VolumeX size={17} style={{ color: "var(--secondary)" }} />
      )}
    </button>
  );
}
