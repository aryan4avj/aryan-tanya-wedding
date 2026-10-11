"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

// Everything including the loader and opening skips SSR - they're pure client animations
const InvitationLoader  = dynamic(() => import("@/components/sections/InvitationLoader"),  { ssr: false });
const InvitationOpening = dynamic(() => import("@/components/sections/InvitationOpening"), { ssr: false });

const DesktopNavigation = dynamic(() => import("@/components/sections/DesktopNavigation"), { ssr: false });
const MobileBottomNav   = dynamic(() => import("@/components/sections/MobileBottomNav"),   { ssr: false });
const HeroInvitation    = dynamic(() => import("@/components/sections/HeroInvitation"),    { ssr: false });
const WeddingCountdown  = dynamic(() => import("@/components/sections/WeddingCountdown"),  { ssr: false });
const FamilySection     = dynamic(() => import("@/components/sections/FamilySection"),      { ssr: false });
const EventTimeline     = dynamic(() => import("@/components/sections/EventTimeline"),     { ssr: false });
const JourneyTimeline   = dynamic(() => import("@/components/sections/JourneyTimeline"),   { ssr: false });
const VenueSection      = dynamic(() => import("@/components/sections/VenueSection"),      { ssr: false });
const RSVPForm          = dynamic(() => import("@/components/sections/RSVPForm"),          { ssr: false });
const FinalSection      = dynamic(() => import("@/components/sections/FinalSection"),      { ssr: false });
const FloatingPetals    = dynamic(() => import("@/components/ui/FloatingPetals"),          { ssr: false });
const ShareInvitation   = dynamic(() => import("@/components/sections/ShareInvitation"),   { ssr: false });
const ScrollIndicator   = dynamic(() => import("@/components/ui/ScrollIndicator"),         { ssr: false });

type AppState = "loading" | "opening" | "main";

export default function WeddingPage() {
  const [appState,  setAppState]  = useState<AppState>("loading");
  const [shareOpen, setShareOpen] = useState(false);
  // Prevent SSR from rendering anything - entire page is client-only
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLoadComplete = useCallback(() => setAppState("opening"), []);
  const handleOpenComplete = useCallback(() => setAppState("main"),    []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // On the server and first paint, render nothing to avoid hydration mismatches
  if (!mounted) return <div style={{ minHeight: "100dvh", background: "#FFF9F1" }} />;

  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: "#FFF9F1" }}>

      {/* Loading - shown first */}
      {appState === "loading" && (
        <InvitationLoader onComplete={handleLoadComplete} />
      )}

      {/* Opening - shown after load */}
      {appState === "opening" && (
        <InvitationOpening onOpen={handleOpenComplete} />
      )}

      {/* Main content - only after opening */}
      {appState === "main" && (
        <>
          <FloatingPetals />
          <ScrollIndicator />
          <DesktopNavigation />
          <MobileBottomNav />

          <main id="main-content" style={{ paddingBottom: "calc(76px + env(safe-area-inset-bottom, 0px))" }}>
            <HeroInvitation
              onViewEvents={() => scrollTo("events")}
              onRSVP={       () => scrollTo("rsvp")}
              onShare={      () => setShareOpen(true)}
              onCalendar={   () => scrollTo("events")}
            />
            <FamilySection />
            <WeddingCountdown
              onCalendar={() => scrollTo("events")}
              onShare={   () => setShareOpen(true)}
            />
            <EventTimeline />
            <JourneyTimeline />
            <VenueSection />
            <RSVPForm />
            <FinalSection />
          </main>

          {shareOpen && (
            <ShareInvitation variant="modal" onClose={() => setShareOpen(false)} />
          )}
        </>
      )}
    </div>
  );
}
