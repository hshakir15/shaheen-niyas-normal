import { config } from "@/config";
import { Divider, Section } from "./shared";

export function Welcome() {
  return (
    <Section id="welcome">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center px-4">
        {/* Arabic Quran Verse */}
        <p dir="rtl" className="font-serif text-xl sm:text-2xl leading-[2.2] text-forest font-semibold">
          {config.texts.welcomeArabic}
        </p>

        {/* English Translation */}
        <p className="font-body text-base sm:text-lg leading-relaxed text-foreground/90 italic">
          {config.texts.welcomeTranslation}
        </p>

        {/* Surah Citation */}
        <p className="label-sm text-sage tracking-[0.2em]">
          {config.texts.welcomeCitation}
        </p>
      </div>
      <Divider />
    </Section>
  );
}
