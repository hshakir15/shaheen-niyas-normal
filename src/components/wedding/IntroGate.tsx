import { useCallback, useEffect, useRef, useState } from "react";
import { config } from "@/config";
import { Divider, GoldHeart, useLang } from "./shared";
import petalPeachUrl from "@/assets/petal-peach.png";
import heroBg from "@/assets/hero-bg.jpg";
import { FallingPetalsCanvas } from "./FallingPetalsCanvas";

/* ------------------------------------------------------------------ */
/*  Automatic Petal Extraction: Blob Detection + Smooth Edge Feather  */
/* ------------------------------------------------------------------ */

function extractPetalBlobs(img: HTMLImageElement): HTMLCanvasElement[] {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const visited = new Uint8Array(w * h);
  const blobs: { minX: number; minY: number; maxX: number; maxY: number; count: number }[] = [];

  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      const idx = y * w + x;
      if (visited[idx]) continue;

      const pxIdx = idx * 4;
      const r = data[pxIdx], g = data[pxIdx + 1], b = data[pxIdx + 2];
      const brightness = (r + g + b) / 3;

      if (brightness < 242) {
        let minX = x, maxX = x, minY = y, maxY = y, count = 0;
        const queue: number[] = [x, y];
        visited[idx] = 1;

        let qHead = 0;
        while (qHead < queue.length) {
          const cx = queue[qHead++];
          const cy = queue[qHead++];
          count++;

          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          const neighbors = [
            [cx + 4, cy], [cx - 4, cy], [cx, cy + 4], [cx, cy - 4]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nIdx = ny * w + nx;
              if (!visited[nIdx]) {
                visited[nIdx] = 1;
                const nPxIdx = nIdx * 4;
                const nb = (data[nPxIdx] + data[nPxIdx + 1] + data[nPxIdx + 2]) / 3;
                if (nb < 242) {
                  queue.push(nx, ny);
                }
              }
            }
          }
        }

        const bw = maxX - minX + 1;
        const bh = maxY - minY + 1;
        if (bw >= 16 && bh >= 16 && count >= 10) {
          blobs.push({ minX, minY, maxX, maxY, count });
        }
      }
    }
  }

  const sprites: HTMLCanvasElement[] = [];
  blobs.forEach((b) => {
    const pad = 4;
    const sx = Math.max(0, b.minX - pad);
    const sy = Math.max(0, b.minY - pad);
    const sw = Math.min(w - sx, b.maxX - b.minX + 1 + pad * 2);
    const sh = Math.min(h - sy, b.maxY - b.minY + 1 + pad * 2);

    const petalCanvas = document.createElement("canvas");
    petalCanvas.width = sw;
    petalCanvas.height = sh;
    const pCtx = petalCanvas.getContext("2d")!;
    pCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const pData = pCtx.getImageData(0, 0, sw, sh);
    const pd = pData.data;
    for (let i = 0; i < pd.length; i += 4) {
      const pr = pd[i], pg = pd[i + 1], pb = pd[i + 2];
      const brightness = (pr + pg + pb) / 3;
      if (brightness > 246) {
        pd[i + 3] = 0;
      } else if (brightness > 210) {
        const alphaFactor = (246 - brightness) / 36;
        pd[i + 3] = Math.round(alphaFactor * pd[i + 3]);
      }
    }
    pCtx.putImageData(pData, 0, 0);
    sprites.push(petalCanvas);
  });

  return sprites;
}

let gateSprites: HTMLCanvasElement[] = [];
let gateSpritesReady = false;

function buildGateSprites() {
  if (gateSpritesReady) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = petalPeachUrl;
  img.onload = () => {
    gateSprites = extractPetalBlobs(img);
    gateSpritesReady = true;
  };
}

if (typeof window !== "undefined") buildGateSprites();

/* ------------------------------------------------------------------ */
/*  Falling petal particle                                            */
/* ------------------------------------------------------------------ */

interface FallingPetal {
  x: number; y: number; vx: number; vy: number;
  size: number; spriteIdx: number;
  rotation: number; vRot: number;
  flipAngle: number; vFlip: number;
  swaySpeed: number; swayAmount: number;
  phase: number; opacity: number; gravity: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

type Props = {
  onOpened: () => void;
  opened: boolean;
};

export function IntroGate({ onOpened, opened }: Props) {
  const { d } = useLang();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const petalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalAnimRef = useRef<number | null>(null);
  const petalTriggered = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showText, setShowText] = useState(false);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Unlock body scroll once text is revealed or gate is opened
  useEffect(() => {
    if (showText || (opened && ended)) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened, ended, showText]);

  useEffect(() => {
    if (reduced) {
      setLoading(false);
      setEnded(true);
      onOpened();
    }
  }, [reduced, onOpened]);

  // Loader fallback timer
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(id);
  }, []);

  function dismissGate() {
    setEnded(true);
    onOpened();
    document.body.style.overflow = "";
  }

  function handleChevronClick() {
    dismissGate();
    requestAnimationFrame(() => {
      const target = document.getElementById("welcome") || document.getElementById("scratch");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Detect tap / touch / scroll anywhere on starting screen to play video
  useEffect(() => {
    if (ended) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (!playing) {
        handleOpen();
      } else if (showText && e.deltaY > 5) {
        dismissGate();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (!playing) {
        handleOpen();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      if (showText && deltaY > 10) dismissGate();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [playing, showText, ended]);

  /* ---------- Falling petals animation ---------- */
  const startFallingPetals = useCallback(() => {
    const canvas = petalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const petals: FallingPetal[] = [];
    const count = 18; // Reduced to 30% of 60 for a subtle, elegant shower
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 120;
      petals.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 180 - delay * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.12 + Math.random() * 0.2,
        size: 11 + Math.random() * 14,
        spriteIdx: Math.floor(Math.random() * gateSprites.length),
        rotation: -0.4 + Math.random() * 0.8, // gentle fixed tilt
        vRot: (Math.random() - 0.5) * 0.003, // no fast spinning round & round
        flipAngle: Math.random() * Math.PI,
        vFlip: 0, // static flat rendering, no flipping loops
        swaySpeed: 0.008 + Math.random() * 0.012,
        swayAmount: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.8 + Math.random() * 0.2,
        gravity: 0.008 + Math.random() * 0.015,
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);
      let active = 0;

      petals.forEach((p) => {
        if (p.y > height + 40) return;
        active++;
        p.vy += p.gravity;
        p.vy = Math.min(p.vy, 1.0);
        p.x += p.vx + Math.sin(frame * p.swaySpeed + p.phase) * p.swayAmount;
        p.y += p.vy;
        p.rotation += p.vRot; // tiny natural drift, no spinning

        if (p.y > height * 0.8) p.opacity *= 0.985;

        const sprite = gateSprites[p.spriteIdx];
        if (!sprite) return;
        const aspect = sprite.height / sprite.width;
        const drawW = p.size;
        const drawH = p.size * aspect;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.drawImage(sprite, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      });

      if (active > 0) {
        petalAnimRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    if (!gateSpritesReady) {
      const wait = () => {
        if (gateSpritesReady) petalAnimRef.current = requestAnimationFrame(animate);
        else setTimeout(wait, 50);
      };
      wait();
    } else {
      petalAnimRef.current = requestAnimationFrame(animate);
    }
  }, []);

  // Trigger falling petals immediately when text reveals
  useEffect(() => {
    if (showText && !petalTriggered.current) {
      petalTriggered.current = true;
      startFallingPetals();
    }
  }, [showText, startFallingPetals]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (petalAnimRef.current) cancelAnimationFrame(petalAnimRef.current);
    };
  }, []);

  async function handleOpen() {
    setPlaying(true);
    if (reduced || failed) {
      dismissGate();
      onOpened();
      return;
    }
    const v = videoRef.current;
    if (!v) {
      dismissGate();
      onOpened();
      return;
    }
    try {
      await v.play();
      onOpened();
    } catch {
      setShowText(true);
      onOpened();
    }
  }

  return (
    <div
      className="fixed inset-y-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 overflow-hidden bg-background shadow-2xl transition-opacity duration-700"
      style={{ display: ended && opened ? "none" : "block" }}
    >
      {/* Background image (last frame) when video ends OR active video before end */}
      {showText ? (
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : !reduced && !failed ? (
        <video
          ref={videoRef}
          src={config.media.introVideo}
          muted
          playsInline
          preload="auto"
          onPlay={() => onOpened()}
          onCanPlay={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (!v.duration) return;
            // Reveal text exactly when video reaches 5.8 seconds (or near end)
            if ((v.currentTime >= 5.8 || v.currentTime >= v.duration - 0.15) && !showText) {
              v.pause();
              setShowText(true);
              onOpened();
            }
          }}
          onEnded={() => {
            if (!showText) {
              setShowText(true);
              onOpened();
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* Falling petals canvas — above video, behind text */}
      <FallingPetalsCanvas active={showText} />

      {/* Starting State: Touch Anywhere to Play Video */}
      {!playing ? (
        <div
          onClick={handleOpen}
          onTouchStart={handleOpen}
          className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer"
          aria-label="Touch screen to open invitation"
        >
          <div className="animate-soft-pulse pointer-events-none flex flex-col items-center justify-center text-center px-4">
            <span className="font-label text-[0.68rem] sm:text-xs font-bold uppercase tracking-[0.25em] text-forest drop-shadow px-4 py-1.5 rounded-full bg-cream/90 backdrop-blur-xs border border-gold/50 shadow-md">
              {d.touchToOpen || "TOUCH SCREEN TO OPEN"}
            </span>
          </div>
        </div>
      ) : null}

      {/* Text Revealed Over Video Frame at 5.8 Seconds */}
      {playing && showText ? (
        <div className="hero-container absolute inset-0 z-20 flex flex-col items-center justify-between px-4 pb-16 md:pb-14 lg:pb-12 animate-fade-in">
          <div className="relative flex w-full max-w-[360px] md:max-w-[350px] lg:max-w-[340px] flex-col items-center justify-center text-center">
            <GoldHeart className="h-5 w-5 md:h-4.5 md:w-4.5 lg:h-4.5 lg:w-4.5 text-gold drop-shadow-md" />

            <p className="hero-label mt-1.5 md:mt-1.8 lg:mt-1.5 drop-shadow">
              {d.gettingMarried}
            </p>
            <p className="font-body text-xs sm:text-sm text-forest/90 italic mt-1 drop-shadow-sm">
              With the blessings of Allah
            </p>

            <Divider className="my-1.5 md:my-1.8 lg:my-1.5 py-0.5" />

            <h1 className="hero-title drop-shadow-md">
              {config.couple.bride.name}
            </h1>
            <p className="hero-details mt-0.5 md:mt-0.8 lg:mt-0.5 leading-snug drop-shadow">
              {config.couple.bride.parents}
              <br />
              {config.couple.bride.details}
            </p>

            <p className="hero-ampersand my-0.5 md:my-1 lg:my-0.5 drop-shadow-md">&amp;</p>

            <h1 className="hero-title drop-shadow-md">
              {config.couple.groom.name}
            </h1>
            <p className="hero-details mt-0.5 md:mt-0.8 lg:mt-0.5 leading-snug drop-shadow">
              {config.couple.groom.parents}
              <br />
              {config.couple.groom.details}
            </p>
          </div>

          <button
            type="button"
            onClick={handleChevronClick}
            className="animate-gentle-bounce flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 text-forest shadow-lg backdrop-blur-sm transition-colors hover:bg-cream"
            aria-label="Scroll to Invitation"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="m6 9 6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
