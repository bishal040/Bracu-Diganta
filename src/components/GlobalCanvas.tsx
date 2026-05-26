import { useRef, useEffect } from 'react';
import { useImageSequence } from './Hero/useImageSequence';

const TOTAL_FRAMES = 240;

interface GlobalCanvasProps {
  scrollData: React.MutableRefObject<{ progress: number }>;
}

export const GlobalCanvas: React.FC<GlobalCanvasProps> = ({ scrollData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const seq1 = useImageSequence('Heroimages');
  const seq2 = useImageSequence('Heroimages2');

  const cachedDims = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false })!;
    let rafId: number;
    let lastFrameIdx = -1;
    let lastSeqId = -1;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      const progress = scrollData.current.progress;
      let seqId: number;
      let frameIdx: number;

      if (progress <= 0.5) {
        seqId = 1;
        const t = Math.min(1, Math.max(0, progress / 0.5));
        frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(t * TOTAL_FRAMES));
        
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = `translateX(0px)`;
        }
      } else {
        seqId = 2;
        const t = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));
        frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(t * TOTAL_FRAMES));
        
        if (wrapperRef.current && w > 0) {
          // Smooth ease-in-out for the translation
          const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const maxShift = w * 0.25; // Shift to the right by 25% of screen width
          wrapperRef.current.style.transform = `translateX(${easeT * maxShift}px)`;
        }
      }

      if (frameIdx === lastFrameIdx && seqId === lastSeqId) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const frames = seqId === 1 ? seq1.current : seq2.current;
      const img = frames[frameIdx];

      if (!img) {
        rafId = requestAnimationFrame(render);
        return;
      }

      lastFrameIdx = frameIdx;
      lastSeqId = seqId;

      if (cachedDims.current.w !== w || cachedDims.current.h !== h) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cachedDims.current = { w, h };
      }

      ctx.fillStyle = '#eef2f5';
      ctx.fillRect(0, 0, w, h);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW: number, drawH: number;
      const SCALE = 0.80; // Increased scale
      
      if (imgRatio > canvasRatio) {
        drawH = h * SCALE;
        drawW = (h * imgRatio) * SCALE;
      } else {
        drawW = w * SCALE;
        drawH = (w / imgRatio) * SCALE;
      }

      const x = (w - drawW) / 2;
      const y = (h - drawH) / 2;
      
      ctx.drawImage(img, x, y, drawW, drawH);
      
      rafId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, [scrollData, seq1, seq2]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 w-full h-full"
      style={{
        WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 45%)',
        maskImage: 'radial-gradient(circle at center, black 25%, transparent 45%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};
