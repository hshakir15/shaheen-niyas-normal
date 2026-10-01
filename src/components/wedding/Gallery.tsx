import { useEffect, useRef, useState } from "react";
import { config } from "@/config";
import { Divider, Reveal, Section } from "./shared";

export function Gallery() {
  const images = config.media.gallery;
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <Section id="gallery">
      <Divider className="pt-0" />
      <Reveal>
        <div
          className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-gold/30 shadow-[var(--shadow-card)]"
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX ?? null;
            if (start == null || end == null) return;
            const dx = end - start;
            if (Math.abs(dx) > 40) {
              setIndex((i) => (dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length));
            }
          }}
        >
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[2000ms] ease-out"
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? "scale(1.06)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </Reveal>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Photo ${i + 1}`}
            onClick={() => setIndex(i)}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === index ? 18 : 8,
              background: i === index ? "var(--gold)" : "var(--border)",
            }}
          />
        ))}
      </div>
    </Section>
  );
}
