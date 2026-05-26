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

      // Calculate translation for the wrapper
      let translateX = 0;
      if (progress > 0.5) {
        const t = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const maxShift = w * 0.25;
        translateX = easeT * maxShift;
      }
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translateX(${translateX}px)`;
      }

      // We will crossfade seq1 and seq2 between progress 0.47 and 0.53
      const crossfadeStart = 0.47;
      const crossfadeEnd = 0.53;

      // Map seq1 from 0.0 to 0.53 so it keeps moving during the fade out
      const t1 = Math.min(1, Math.max(0, progress / crossfadeEnd));
      const frameIdx1 = Math.min(TOTAL_FRAMES - 1, Math.floor(t1 * TOTAL_FRAMES));
      
      // Map seq2 from 0.47 to 1.0 so it is already moving while fading in
      const t2 = Math.min(1, Math.max(0, (progress - crossfadeStart) / (1.0 - crossfadeStart)));
      const frameIdx2 = Math.min(TOTAL_FRAMES - 1, Math.floor(t2 * TOTAL_FRAMES));

      // Calculate alphas
      let alpha1 = 1;
      let alpha2 = 0;

      if (progress > crossfadeStart && progress < crossfadeEnd) {
        alpha2 = (progress - crossfadeStart) / (crossfadeEnd - crossfadeStart);
        alpha1 = 1 - alpha2;
      } else if (progress >= crossfadeEnd) {
        alpha1 = 0;
        alpha2 = 1;
      }

      if (cachedDims.current.w !== w || cachedDims.current.h !== h) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cachedDims.current = { w, h };
      }

      ctx.fillStyle = '#eef2f5';
      ctx.fillRect(0, 0, w, h);

      const drawImage = (img: HTMLImageElement | null, alpha: number) => {
        if (!img || alpha <= 0) return;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = w / h;
        let drawW: number, drawH: number;
        const SCALE = 0.80;
        
        if (imgRatio > canvasRatio) {
          drawH = h * SCALE;
          drawW = (h * imgRatio) * SCALE;
        } else {
          drawW = w * SCALE;
          drawH = (w / imgRatio) * SCALE;
        }

        const x = (w - drawW) / 2;
        const y = (h - drawH) / 2;
        
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, x, y, drawW, drawH);
      };

      drawImage(seq1.current[frameIdx1], alpha1);
      drawImage(seq2.current[frameIdx2], alpha2);
      ctx.globalAlpha = 1.0;

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
