import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { saveRsvp } from "@/lib/invitation";
import { Divider, Reveal, Section, SectionTitle, useLang } from "./shared";

export function Rsvp() {
  const { d, lang } = useLang();
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; guests?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === "#rsvp") {
        setIsExpanded(true);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = d.errName;
    const g = Number(guests);
    if (!Number.isFinite(g) || g < 1 || g > 20) next.guests = d.errGuests;
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    await new Promise((r) => setTimeout(r, 700));
    saveRsvp({ name: name.trim(), guests: g, message: message.trim().slice(0, 500) });
    setStatus("done");
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#C9A66B", "#F7EEE1", "#E8B9A8", "#7C8A58"],
    });
  }

  return (
    <Section id="rsvp">
      <SectionTitle>{d.rsvp}</SectionTitle>

      {status === "done" ? (
        <Reveal className="soft-card mt-6 px-6 py-8 text-center">
          <p className="heading-script text-2xl">{d.thankYou}</p>
        </Reveal>
      ) : !isExpanded ? (
        <Reveal delay={100}>
          <div
            onClick={() => setIsExpanded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setIsExpanded(true)}
            className="soft-card mt-6 cursor-pointer px-6 py-5 flex items-center justify-between transition-all active:scale-[0.99] hover:border-gold/60 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 text-forest">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
              </div>
              <div className="text-left rtl:text-right">
                <p className="font-body text-lg font-bold text-forest">{d.rsvp}</p>
                <p className="label-sm text-sage tracking-wider">
                  {lang === "ar" ? "اضغط لملء الاستمارة" : "Tap to fill RSVP form"}
                </p>
              </div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card-highlight)] text-forest shadow-xs">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-forest" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={100}>
          <form onSubmit={submit} className="soft-card mt-6 flex flex-col gap-4 px-5 py-6 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--card-border)]">
              <span className="label-sm text-forest font-bold tracking-[0.2em]">{d.rsvp}</span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-sage hover:text-forest text-xs font-label uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === "ar" ? "إغلاق" : "Close"}</span>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <label className="flex flex-col gap-1">
              <span className="label-sm">{d.yourName}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-input bg-[var(--card-highlight)] px-4 py-3 font-body text-base outline-none focus:border-gold"
              />
              {errors.name ? (
                <span className="font-body text-sm text-destructive">{errors.name}</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1">
              <span className="label-sm">{d.guests}</span>
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="rounded-xl border border-input bg-[var(--card-highlight)] px-4 py-3 font-body text-base outline-none focus:border-gold"
              />
              {errors.guests ? (
                <span className="font-body text-sm text-destructive">{errors.guests}</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1">
              <span className="label-sm">{d.message}</span>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none rounded-xl border border-input bg-[var(--card-highlight)] px-4 py-3 font-body text-base outline-none focus:border-gold"
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 rounded-full bg-primary px-7 py-3 font-label text-xs uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {status === "sending" ? d.sending : d.sendMessage}
            </button>
          </form>
        </Reveal>
      )}
      <Divider />
    </Section>
  );
}
