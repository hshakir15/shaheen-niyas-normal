import { useEffect, useState } from "react";
import { config } from "@/config";
import { Divider, Reveal, Section, SectionTitle, useLang } from "./shared";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown() {
  const { d } = useLang();
  const target = new Date(config.wedding.isoStart).getTime();
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const boxes = [
    { value: time.days, label: d.days },
    { value: time.hours, label: d.hours },
    { value: time.minutes, label: d.minutes },
    { value: time.seconds, label: d.seconds },
  ];

  return (
    <Section id="countdown">
      <SectionTitle>{d.countdown}</SectionTitle>
      <Reveal delay={120} className="mt-8 grid grid-cols-4 gap-2">
        {boxes.map((b) => (
          <div key={b.label} className="soft-card flex flex-col items-center gap-1 px-1 py-4">
            <span
              key={b.value}
              className="animate-flip-in font-num text-2xl font-bold tracking-wider text-forest"
            >
              {String(b.value).padStart(2, "0")}
            </span>
            <span className="label-sm text-[0.55rem]">{b.label}</span>
          </div>
        ))}
      </Reveal>
      <Divider />
    </Section>
  );
}
