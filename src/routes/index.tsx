import { createFileRoute } from "@tanstack/react-router";
import bgParchment from "@/assets/bg-parchment.png";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { config } from "@/config";
import { LangProvider } from "@/components/wedding/shared";
import { IntroGate } from "@/components/wedding/IntroGate";
import { Hero } from "@/components/wedding/Hero";
import { Welcome } from "@/components/wedding/Welcome";
import { ScratchReveal } from "@/components/wedding/ScratchReveal";
import { Countdown } from "@/components/wedding/Countdown";
import { Timeline } from "@/components/wedding/Timeline";
import { Venue } from "@/components/wedding/Details";
import { Closing } from "@/components/wedding/Closing";
import { WhatsAppCta } from "@/components/wedding/WhatsAppCta";
import { FloatingUi } from "@/components/wedding/FloatingUi";

import { getAbsoluteUrl } from "@/lib/utils";

const title = `${config.couple.bride.name} & ${config.couple.groom.name} — Wedding Invitation`;
const description = `Join us on ${config.wedding.dateLabel} at ${config.venue.name}, ${config.venue.city}. Open your invitation, save the date and send your wishes.`;
const ogImage = getAbsoluteUrl("/og-image.jpg");
const ogImageAlt = `${config.couple.bride.name} & ${config.couple.groom.name} Wedding Invitation`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: ogImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasMusic = Boolean(config.media.music);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.scrollTo(0, { immediate: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  function handleOpened() {
    setOpened(true);
    if (hasMusic && audioRef.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.muted = false;
      void audioRef.current.play().catch(() => undefined);
      setMuted(false);
    }
  }

  return (
    <LangProvider>
      <main className="phone-shell min-h-screen">
        <IntroGate opened={opened} onOpened={handleOpened} />
        <Hero opened={opened} />

        {/* Parchment background for all sections below Hero */}
        <div style={{ position: "relative" }}>
          {/* Background layer at 40% opacity */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${bgParchment})`,
              backgroundRepeat: "repeat-y",
              backgroundSize: "100% auto",
              backgroundPosition: "top center",
              opacity: 0.3,
              pointerEvents: "none",
            }}
          />
          {/* Content layer — fully opaque */}
          <div style={{ position: "relative" }}>
            <Welcome />
            <ScratchReveal />
            <Countdown />
            <Timeline />
            <Venue />
            <Closing />
            <WhatsAppCta />
          </div>
        </div>

        {hasMusic ? (
          <audio ref={audioRef} src={config.media.music} loop muted={muted} preload="auto" />
        ) : null}

        <FloatingUi
          hasMusic={hasMusic}
          muted={muted}
          onToggleMute={() => {
            const a = audioRef.current;
            if (!a) return;
            a.muted = !a.muted;
            if (!a.muted) void a.play().catch(() => undefined);
            setMuted(a.muted);
          }}
        />
      </main>
    </LangProvider>
  );
}
