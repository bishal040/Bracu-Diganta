import { useRef, useEffect } from 'react';
import { useImageSequence } from './useImageSequence';

const TOTAL_FRAMES = 240;

interface HeroCanvasProps {
  scrollData: React.MutableRefObject<{ progress: number; phase: 1 | 2 | 3 }>;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ scrollData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const seq1 = useImageSequence('Heroimages');
  const seq2 = useImageSequence('Heroimages2');

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    let rafId: number;
    let lastFrame = -1;
    let lastSeq = -1;
    let cachedWidth = 0;
    let cachedHeight = 0;

    const render = () => {
      const { progress, phase } = scrollData.current;

      // ── Which sequence & frame? ──
      let seqId: number;
      let frameIdx: number;

      if (progress <= 0.5) {
        // Seq1: entire 0→0.5 progress maps to frames 0→239
        seqId = 1;
        const t = Math.min(1, Math.max(0, progress / 0.5));
        frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(t * TOTAL_FRAMES));
      } else {
        // Seq2: 0.5→1.0 maps to frames 0→239
        seqId = 2;
        const t = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));
        frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(t * TOTAL_FRAMES));
      }

      // ── CSS transform on canvas wrapper ──
      // Phase 1 (0 → 0.35): centered, subtle scale 1.02→1
      // Phase 2 (0.35 → 0.5): centered, scale 1
      // Phase 3 (0.5 → 1.0): slide right to make room for text panels on left
      if (phase === 1) {
        const t = progress / 0.35;
        const scale = 1.02 - t * 0.02;
        wrapper.style.transform = `scale(${scale})`;
      } else if (phase === 2) {
        wrapper.style.transform = 'scale(1)';
      } else {
        const t = Math.min(1, (progress - 0.5) / 0.3); // reaches max shift at 80% scroll
        const shiftVw = t * 15; // shift 15vw to the right
        wrapper.style.transform = `translateX(${shiftVw}vw)`;
      }

      // ── Draw frame ──
      if (frameIdx === lastFrame && seqId === lastSeq) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const frames = seqId === 1 ? seq1.current : seq2.current;
      const img = frames[frameIdx];

      if (!img) {
        // Frame not loaded yet — try nearest loaded frame
        for (let delta = 1; delta < 10; delta++) {
          const prev = frames[frameIdx - delta];
          if (prev) { drawImage(ctx, canvas, prev); break; }
        }
        rafId = requestAnimationFrame(render);
        return;
      }

      drawImage(ctx, canvas, img);
      lastFrame = frameIdx;
      lastSeq = seqId;

      rafId = requestAnimationFrame(render);
    };

    const drawImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      if (cachedWidth !== w || cachedHeight !== h) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cachedWidth = w;
        cachedHeight = h;
      }

      // Fill white so multiply blend makes white areas transparent against dark bg
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Contain the image — fit it inside the canvas with padding
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW: number, drawH: number;

      if (imgRatio > canvasRatio) {
        drawW = w * 0.85; // 85% width = 7.5% padding each side
        drawH = drawW / imgRatio;
      } else {
        drawH = h * 0.85;
        drawW = drawH * imgRatio;
      }

      const x = (w - drawW) / 2;
      const y = (h - drawH) / 2;
      ctx.drawImage(img, x, y, drawW, drawH);
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, [seq1, seq2, scrollData]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0 will-change-transform"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
};
