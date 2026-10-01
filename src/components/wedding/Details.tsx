import { config } from "@/config";
import { Divider, Reveal, Section, SectionTitle, useLang } from "./shared";

import venuePalace from "@/assets/shadi-mahal.png";

const iconProps = {
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
} as const;

export function Venue() {
  const { d } = useLang();
  return (
    <Section id="venue">
      <SectionTitle
        icon={
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        }
      >
        {d.venue}
      </SectionTitle>

      <Reveal delay={100} className="mt-6">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-card p-5 shadow-[var(--shadow-card)] backdrop-blur-md text-center">
          {/* Decorative Top Gold Accent Line */}
          <div className="mx-auto mb-3 h-0.5 w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Venue Name & Address */}
          <p className="font-body text-2xl font-bold text-forest">{config.venue.name}</p>
          <p className="label-sm mt-1 text-sage tracking-[0.2em]">{config.venue.city}</p>

          {/* Framed Palace Photo in place of raw map */}
          <a
            href={config.venue.mapLink}
            target="_blank"
            rel="noreferrer"
            className="group relative mt-5 block overflow-hidden rounded-2xl border border-gold/40 shadow-md transition-transform active:scale-[0.99]"
            title="View directions on Google Maps"
          >
            <img
              src={venuePalace}
              alt={config.venue.name}
              className="h-56 w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Overlay Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-cream/90 font-label tracking-wider drop-shadow-md">
              <span className="flex items-center gap-1.5 font-medium">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {config.venue.name}
              </span>
              <span className="rounded-full bg-black/40 px-2.5 py-1 text-[0.65rem] uppercase backdrop-blur-sm">
                Tap for directions ↗
              </span>
            </div>
          </a>

          {/* Action Button: Opens Google Maps Directions */}
          <div className="mt-5 flex justify-center">
            <a
              href={config.venue.mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-label text-xs uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95 hover:bg-primary/90"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {d.viewMap}
            </a>
          </div>

          {/* Concierge & Guest Assistance */}
          <div className="mt-5 pt-4 border-t border-gold/20 flex flex-col items-center justify-center gap-1.5 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="font-body text-xs sm:text-sm font-bold text-forest uppercase tracking-wider">
                Concierge &amp; Guest Assistance
              </span>
            </div>
            <p className="font-num text-[0.75rem] sm:text-xs font-medium text-forest/90 tracking-wider">
              <a href="tel:+917012201757" className="hover:underline">+91 70122 01757</a>
              <span className="mx-2 text-gold">·</span>
              <a href="tel:+919972268927" className="hover:underline">+91 99722 68927</a>
            </p>
          </div>
        </div>
      </Reveal>

      <Divider />
    </Section>
  );
}

export function DressCode() {
  const { d } = useLang();
  return (
    <Section id="dress-code">
      <SectionTitle
        icon={
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M9 4 4 7v4h3v9h10v-9h3V7l-5-3a3 3 0 0 1-6 0Z" strokeLinejoin="round" />
          </svg>
        }
      >
        {d.dressCode}
      </SectionTitle>
      <div className="mt-6 grid gap-4">
        {[
          { title: d.women, text: config.dressCode.women },
          { title: d.men, text: config.dressCode.men },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 120} className="soft-card px-5 py-4 text-center">
            <h3 className="heading-script text-2xl">{item.title}</h3>
            <p className="mt-1 font-body text-base text-muted-foreground">{item.text}</p>
          </Reveal>
        ))}
      </div>
      <Divider />
    </Section>
  );
}

export function PreEvents() {
  const { d } = useLang();
  return (
    <Section id="pre-events">
      <SectionTitle
        icon={
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="m12 3 1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" strokeLinejoin="round" />
            <path d="M18 16.5 18.8 18.6 21 19.5l-2.2.9-.8 2.1-.8-2.1-2.2-.9 2.2-.9.8-2.1Z" strokeLinejoin="round" />
          </svg>
        }
      >
        {d.preEvents}
      </SectionTitle>
      <div className="mt-6 grid gap-4">
        {config.preEvents.map((e, i) => (
          <Reveal key={e.name} delay={i * 120} className="soft-card px-5 py-4 text-center">
            <h3 className="font-body text-xl font-semibold text-forest">{e.name}</h3>
            <p className="label-sm mt-1">
              {e.date} · {e.time}
            </p>
            {e.location ? (
              <p className="font-body text-base text-sage">{e.location}</p>
            ) : null}
          </Reveal>
        ))}
      </div>
      <Divider />
    </Section>
  );
}

function InfoBlock({
  id,
  title,
  text,
  icon,
}: {
  id: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <Section id={id}>
      <SectionTitle icon={icon}>{title}</SectionTitle>
      <Reveal delay={120} className="mx-auto mt-4 max-w-sm text-center">
        <p className="font-body text-lg leading-relaxed text-muted-foreground">{text}</p>
      </Reveal>
      <Divider />
    </Section>
  );
}

export function Transportation() {
  const { d } = useLang();
  return (
    <InfoBlock
      id="transportation"
      title={d.transportation}
      text={config.transportation}
      icon={
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M4 16v-3l1.8-4.3A2 2 0 0 1 7.6 7h8.8a2 2 0 0 1 1.8 1.7L20 13v3" strokeLinejoin="round" />
          <path d="M4 16h16v2h-3v-2M7 18v-2H4v2" strokeLinejoin="round" />
          <circle cx="7.5" cy="16" r="1.2" />
          <circle cx="16.5" cy="16" r="1.2" />
        </svg>
      }
    />
  );
}

export function Accommodation() {
  const { d } = useLang();
  return (
    <InfoBlock
      id="accommodation"
      title={d.accommodation}
      text={config.accommodation}
      icon={
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
          <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" strokeLinecap="round" />
        </svg>
      }
    />
  );
}

export function Gifts() {
  const { d } = useLang();
  return (
    <InfoBlock
      id="gifts"
      title={d.gifts}
      text={config.gifts}
      icon={
        <svg viewBox="0 0 24 24" {...iconProps}>
          <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13" />
          <path d="M12 7S10.5 3 8.5 3a2 2 0 0 0 0 4M12 7s1.5-4 3.5-4a2 2 0 0 1 0 4" strokeLinejoin="round" />
        </svg>
      }
    />
  );
}
