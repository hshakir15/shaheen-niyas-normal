import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { config } from "@/config";
import { saveTheDate } from "@/lib/invitation";
import { Divider, Reveal, SectionTitle, Section, useLang } from "./shared";

import petalPeachUrl from "@/assets/petal-peach.png";

const W = 320;
const H = 300;

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

/* ------------------------------------------------------------------ */
/*  Build sprite pool                                                */
/* ------------------------------------------------------------------ */

type PetalSprite = HTMLCanvasElement;
let petalSprites: PetalSprite[] = [];
let spritesReady = false;

function buildSprites() {
  if (spritesReady) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = petalPeachUrl;
  img.onload = () => {
    petalSprites = extractPetalBlobs(img);
    spritesReady = true;
  };
}

if (typeof window !== "undefined") {
  buildSprites();
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

interface RealisticPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spriteIdx: number;
  rotation: number;
  vRot: number;
  flipAngle: number;
  vFlip: number;
  swaySpeed: number;
  swayAmount: number;
  phase: number;
  opacity: number;
  gravity: number;
}

export function ScratchReveal() {
  const { d } = useLang();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [cleared, setCleared] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const paintFoil = useCallback((ctx: CanvasRenderingContext2D) => {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#8FA06A");
    g.addColorStop(0.35, "#B9C79A");
    g.addColorStop(0.5, "#7C8A58");
    g.addColorStop(0.75, "#C9A66B");
    g.addColorStop(1, "#7C8A58");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.3})`;
      const r = Math.random() * 1.8;
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    paintFoil(ctx);
  }, [paintFoil]);

  const triggerPetalBlast = useCallback(() => {
    const heartEl = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!heartEl || !overlayCanvas) return;

    const ctx = overlayCanvas.getContext("2d");
    if (!ctx) return;

    const width = (overlayCanvas.width = window.innerWidth);
    const height = (overlayCanvas.height = window.innerHeight);

    const rect = heartEl.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height * 0.45;

    const particles: RealisticPetal[] = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 12;
      const size = 14 + Math.random() * 16;

      particles.push({
        x: startX + (Math.random() - 0.5) * 30,
        y: startY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 8,
        size,
        spriteIdx: Math.floor(Math.random() * (petalSprites.length || 1)),
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        flipAngle: Math.random() * Math.PI * 2,
        vFlip: 0.015 + Math.random() * 0.03,
        swaySpeed: 0.015 + Math.random() * 0.025,
        swayAmount: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        opacity: 1,
        gravity: 0.02 + Math.random() * 0.1,
      });
    }

    let frameCount = 0;

    const animate = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      let active = 0;

      particles.forEach((p) => {
        if (p.opacity <= 0.01 || p.y > height + 60) return;
        active++;

        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + p.gravity;
        p.x += p.vx + Math.sin(frameCount * p.swaySpeed + p.phase) * p.swayAmount;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.flipAngle += p.vFlip;

        if (p.y > height * 0.85) {
          p.opacity *= 0.98;
        }

        const sprite = petalSprites[p.spriteIdx % (petalSprites.length || 1)];
        if (!sprite) return;

        const aspect = sprite.height / sprite.width;
        const drawW = p.size;
        const drawH = p.size * aspect;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(Math.cos(p.flipAngle), 1);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.drawImage(sprite, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      });

      if (frameCount === 1) {
        confetti({
          particleCount: 16,
          spread: 50,
          origin: { x: startX / width, y: startY / height },
          colors: ["#E91E63", "#F48FB1", "#FFCDD2", "#FFF8E1"],
          scalar: 0.85,
        });
      }

      if (active > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (!spritesReady) {
      const waitForSprites = () => {
        if (spritesReady) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setTimeout(waitForSprites, 50);
        }
      };
      waitForSprites();
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const scratchCount = useRef(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || cleared) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 34;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
    } else {
      ctx.arc(x, y, 17, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.fill();
    lastPos.current = { x, y };

    scratchCount.current++;
    if (scratchCount.current >= 115) {
      setCleared(true);
      triggerPetalBlast();
    }
  };

  const stopDrawing = () => {
    drawing.current = false;
    lastPos.current = null;
  };

  return (
    <Section id="scratch">
      <SectionTitle>{d.scratchTitle}</SectionTitle>

      <canvas
        ref={overlayCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      <Reveal className="mt-8 flex justify-center">
        <div className="relative" style={{ width: W, height: H }}>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-gold/50 bg-card text-center"
            style={{ clipPath: "url(#heartClip)" }}
          >
            <p className="script-name text-3xl italic">{d.youreInvited}</p>
            <p className="font-num text-base font-bold tracking-wider text-forest">
              {config.wedding.dateLabel}
            </p>
            {config.wedding.hijriDate && (
              <p className="font-num text-xs font-semibold tracking-wider text-gold">
                {config.wedding.hijriDate}
              </p>
            )}
            <p className="label-sm">{config.wedding.weekday}</p>
            <p className="font-num text-sm font-bold tracking-wider text-sage">
              {config.wedding.timeLabel}
            </p>
          </div>

          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onPointerDown={(e) => {
              drawing.current = true;
              lastPos.current = null;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratch(e);
            }}
            onPointerMove={scratch}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            className="absolute inset-0 h-full w-full touch-none transition-opacity duration-[1800ms] ease-in-out"
            style={{
              clipPath: "url(#heartClip)",
              opacity: cleared ? 0 : 1,
              pointerEvents: cleared ? "none" : "auto",
            }}
          />

          <svg width="0" height="0" aria-hidden>
            <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
              <path d="M0.5,1 C0.5,1 0,0.68 0,0.36 C0,0.14 0.17,0.02 0.32,0.02 C0.41,0.02 0.47,0.08 0.5,0.14 C0.53,0.08 0.59,0.02 0.68,0.02 C0.83,0.02 1,0.14 1,0.36 C1,0.68 0.5,1 0.5,1 Z" />
            </clipPath>
          </svg>
        </div>
      </Reveal>

      <Reveal delay={150} className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={saveTheDate}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-label text-xs uppercase tracking-[0.18em] text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
          </svg>
          {d.saveTheDate}
        </button>
      </Reveal>

      <Divider />
    </Section>
  );
}
