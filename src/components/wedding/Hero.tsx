import { config } from "@/config";
import { Divider, GoldHeart, Reveal, useLang } from "./shared";
import heroBg from "@/assets/hero-bg.jpg";
import { FallingPetalsCanvas } from "./FallingPetalsCanvas";

export function Hero({ opened }: { opened: boolean }) {
  const { d } = useLang();
  const { groom, bride } = config.couple;

  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-background">
      {/* Background image — garden fountain scene */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      {/* Continuous Falling Petals Shower */}
      <FallingPetalsCanvas active={opened} />

      {/* Main Content */}
      <div
        className="hero-container relative z-20 flex min-h-[100svh] flex-col items-center justify-between px-4 pb-16 md:pb-14 lg:pb-12 text-center transition-opacity duration-700"
        style={{ opacity: opened ? 1 : 0 }}
      >
        <div className="relative flex w-full max-w-[360px] md:max-w-[350px] lg:max-w-[340px] flex-col items-center justify-center text-center">
          <Reveal delay={100}>
            <GoldHeart className="mx-auto h-5 w-5 md:h-4.5 md:w-4.5 lg:h-4.5 lg:w-4.5 text-gold drop-shadow-md" />
          </Reveal>

          <Reveal delay={200} className="mt-1.5 md:mt-1.8 lg:mt-1.5">
            <p className="hero-label drop-shadow">
              {d.gettingMarried}
            </p>
            <p className="font-body text-xs sm:text-sm text-forest/90 italic mt-1 drop-shadow-sm">
              With the blessings of Allah
            </p>
          </Reveal>

          <Reveal delay={300}>
            <Divider className="my-1.5 md:my-1.8 lg:my-1.5 py-0.5" />
          </Reveal>

          <Reveal delay={400}>
            <h1 className="hero-title drop-shadow-md">
              {bride.name}
            </h1>
          </Reveal>

          <Reveal delay={500} className="mt-0.5 md:mt-0.8 lg:mt-0.5">
            <p className="hero-details leading-snug drop-shadow">
              {bride.parents}
              <br />
              {bride.details}
            </p>
          </Reveal>

          <Reveal delay={600}>
            <p className="hero-ampersand my-0.5 md:my-1 lg:my-0.5 drop-shadow-md">&amp;</p>
          </Reveal>

          <Reveal delay={700}>
            <h1 className="hero-title drop-shadow-md">
              {groom.name}
            </h1>
          </Reveal>

          <Reveal delay={800} className="mt-0.5 md:mt-0.8 lg:mt-0.5">
            <p className="hero-details whitespace-pre-line leading-snug drop-shadow">
              {groom.parents}
              <br />
              {groom.details}
            </p>
          </Reveal>
        </div>

        <Reveal delay={900}>
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById("welcome") || document.getElementById("scratch");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className="animate-gentle-bounce flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 text-forest shadow-lg backdrop-blur-sm transition-colors hover:bg-cream"
            aria-label="Scroll to Invitation"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
