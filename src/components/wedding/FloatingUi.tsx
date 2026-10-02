import { useLang } from "./shared";

export function FloatingUi({
  muted,
  onToggleMute,
  hasMusic,
}: {
  muted: boolean;
  onToggleMute: () => void;
  hasMusic: boolean;
}) {
  const { lang, setLang, d } = useLang();

  return (
    <>
      {/* Audio Toggle Button */}
      {hasMusic ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto flex max-w-[480px] justify-end px-4 pt-4"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
        >
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-cream/85 text-forest shadow-md backdrop-blur-md transition-transform active:scale-95 hover:bg-cream"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-forest" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 9v6h3l4 3V6L8 9H5Z" strokeLinejoin="round" />
              {muted ? (
                <path d="m16 9 5 6M21 9l-5 6" strokeLinecap="round" />
              ) : (
                <path d="M16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
