import { useEffect, useRef, useState } from "react";
import { config } from "@/config";
import { Divider, Reveal, Section, SectionTitle, useLang } from "./shared";

export function Timeline() {
  const { d } = useLang();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [draw, setDraw] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.85 - rect.top) / rect.height;
      setDraw(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Section id="timeline">
      <SectionTitle
        icon={
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
        }
      >
        {d.timeline}
      </SectionTitle>

      <div ref={wrapRef} className="relative mt-10 pl-8">
        <span className="absolute left-[7px] top-1 h-full w-px bg-border" />
        <span
          className="absolute left-[7px] top-1 w-px bg-gold transition-[height] duration-300"
          style={{ height: `${draw * 100}%` }}
        />
        <ul className="flex flex-col gap-8">
          {config.timeline.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 120} className="relative">
              <span className="absolute -left-8 top-1.5 h-4 w-4 rounded-full border-2 border-gold bg-background" />
              <h3 className="font-body text-xl font-semibold text-forest">{item.title}</h3>
              <p className="font-num label-sm mt-1 font-semibold tracking-widest">{item.date}</p>
              <p className="font-num text-sm font-bold tracking-wider text-sage mt-0.5">{item.time}</p>
            </Reveal>
          ))}
        </ul>
      </div>
      <Divider />
    </Section>
  );
}
