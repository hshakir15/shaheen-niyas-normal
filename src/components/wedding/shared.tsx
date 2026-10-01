import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { t, type Dict, type Lang } from "@/lib/i18n";

/* ---------------- language ---------------- */

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; d: Dict }>({
  lang: "en",
  setLang: () => {},
  d: t.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <LangCtx.Provider value={{ lang, setLang, d: t[lang] as Dict }}>{children}</LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);

/* ---------------- reveal on scroll ---------------- */

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "h3" | "span" | "li";
}) {
  const Component = Tag as React.ElementType;
  return <Component className={className}>{children}</Component>;
}

/* ---------------- decorations ---------------- */

export function GoldHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`h-4 w-4 text-gold ${className}`} fill="currentColor">
      <path d="M12 21s-7.5-4.7-9.5-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.5 12c-2 4.3-9.5 9-9.5 9Z" />
    </svg>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
      <GoldHeart />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}

export function SectionTitle({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <Reveal className="flex flex-col items-center gap-2 text-center">
      {icon ? <span className="text-sage">{icon}</span> : null}
      <h2 className="heading-script text-4xl">{children}</h2>
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-6 py-10 ${className}`}>
      <Petals />
      <div className="relative">{children}</div>
    </section>
  );
}

/* very light floating petals / sparkles */
export function Petals({ count = 6 }: { count?: number }) {
  const seeds = Array.from({ length: count }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((i) => {
        const size = 5 + ((i * 7) % 9);
        return (
          <span
            key={i}
            className="petal"
            style={{
              left: `${(i * 17 + 6) % 92}%`,
              width: size,
              height: size,
              animationDuration: `${13 + (i % 5) * 3}s`,
              animationDelay: `${i * 2.2}s`,
              ["--drift-x" as string]: `${(i % 2 === 0 ? 1 : -1) * (18 + i * 6)}px`,
              opacity: 0.45,
            }}
          />
        );
      })}
    </div>
  );
}
