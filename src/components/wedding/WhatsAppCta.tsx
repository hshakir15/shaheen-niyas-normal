import { Reveal } from "./shared";

export function WhatsAppCta() {
  const message =
    "Hi! I’m interested in creating a wedding invitation like this. Could you please share the pricing and details?";
  const whatsappUrl = `https://wa.me/918660844842?text=${encodeURIComponent(message)}`;

  return (
    <footer className="relative mt-4 px-3 pt-4 pb-16 text-center">
      <Reveal className="mx-auto flex flex-col items-center">
        {/* Compact CTA Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-forest/40 bg-transparent px-2.5 py-0.5 font-label text-[0.45rem] sm:text-[0.5rem] font-medium uppercase tracking-[0.1em] text-forest/80 transition-colors hover:border-forest hover:text-forest active:scale-95 cursor-pointer"
        >
          CREATE YOUR INVITATION →
        </a>
      </Reveal>
    </footer>
  );
}
