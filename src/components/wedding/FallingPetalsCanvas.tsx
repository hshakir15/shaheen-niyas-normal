import { useCallback, useEffect, useRef } from "react";
import petalPeachUrl from "@/assets/petal-peach.png";

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

let sharedSprites: HTMLCanvasElement[] = [];
let sharedSpritesReady = false;

function buildSharedSprites() {
  if (sharedSpritesReady) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = petalPeachUrl;
  img.onload = () => {
    sharedSprites = extractPetalBlobs(img);
    sharedSpritesReady = true;
  };
}

if (typeof window !== "undefined") buildSharedSprites();

interface FallingPetal {
  x: number; y: number; vx: number; vy: number;
  size: number; spriteIdx: number;
  rotation: number; vRot: number;
  swaySpeed: number; swayAmount: number;
  phase: number; opacity: number; gravity: number;
}

export function FallingPetalsCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const petals: FallingPetal[] = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const delay = Math.random() * 100;
      petals.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 200 - delay * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.12 + Math.random() * 0.2,
        size: 11 + Math.random() * 14,
        spriteIdx: Math.floor(Math.random() * (sharedSprites.length || 1)),
        rotation: -0.4 + Math.random() * 0.8,
        vRot: (Math.random() - 0.5) * 0.003,
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

      petals.forEach((p) => {
        p.vy += p.gravity;
        p.vy = Math.min(p.vy, 1.0);
        p.x += p.vx + Math.sin(frame * p.swaySpeed + p.phase) * p.swayAmount;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Recycle petal to top when it reaches bottom for continuous gentle flow
        if (p.y > height + 30) {
          p.y = -20 - Math.random() * 60;
          p.x = Math.random() * width;
          p.vy = 0.12 + Math.random() * 0.2;
          p.opacity = 0.8 + Math.random() * 0.2;
        }

        const sprite = sharedSprites[p.spriteIdx % (sharedSprites.length || 1)];
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

      animRef.current = requestAnimationFrame(animate);
    };

    if (!sharedSpritesReady) {
      const wait = () => {
        if (sharedSpritesReady) animRef.current = requestAnimationFrame(animate);
        else setTimeout(wait, 50);
      };
      wait();
    } else {
      animRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (active) {
      startAnimation();
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, startAnimation]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
}
