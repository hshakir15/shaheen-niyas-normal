import { config } from "@/config";
import { Reveal, Section } from "./shared";

function Wave() {
  return (
    <div className="flex flex-col items-center gap-1 py-4 text-gold">
      <svg viewBox="0 0 200 14" className="h-3 w-44" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M2 8c12-9 24 9 36 0s24 9 36 0 24 9 36 0 24 9 36 0 24 9 36 0" strokeLinecap="round" />
      </svg>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-gold/70" />
        ))}
      </div>
    </div>
  );
}

export function Closing() {
  return (
    <Section id="closing" className="pb-8">
      <Wave />
      <Reveal className="text-center">
        <p className="heading-script text-2xl sm:text-3xl leading-snug px-4">{config.texts.closing}</p>
        <p className="script-name mt-5 text-3xl sm:text-4xl">
          {config.couple.bride.name}
          <span className="mx-3.5 inline-block text-gold">&amp;</span>
          {config.couple.groom.name}
        </p>
      </Reveal>
      <Wave />
      <p className="label-sm mt-4 text-center text-[0.6rem]">
        © {new Date(config.wedding.isoStart).getFullYear()} · With love
      </p>
    </Section>
  );
}
