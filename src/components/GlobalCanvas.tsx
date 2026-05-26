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
  const seq3 = useImageSequence('Heroimages3');

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

      const rawProgress = scrollData.current.progress;
      // Preserve exact identical visual timing for seq1 and seq2 from the original 700vh setup
      const virtualProg12 = Math.min(1.0, rawProgress * 1.5); 

      // --- Original logic using `virtualProg12` (0 to 1) ---
      let translateX = 0;
      let translateY = 0;
      
      let alpha1 = 0;
      let alpha2 = 0;
      let alpha3 = 0;
      
      let frameIdx1 = 0;
      let frameIdx2 = 0;
      let frameIdx3 = 0;

      // Crossfade seq1 and seq2 exactly as before
      const crossfadeStart = 0.47;
      const crossfadeEnd = 0.53;

      if (rawProgress <= 0.666) {
          // Seq1 frame
          const t1 = Math.min(1, Math.max(0, virtualProg12 / crossfadeEnd));
          frameIdx1 = Math.min(TOTAL_FRAMES - 1, Math.floor(t1 * TOTAL_FRAMES));
          
          // Seq2 frame
          const t2 = Math.min(1, Math.max(0, (virtualProg12 - crossfadeStart) / (1.0 - crossfadeStart)));
          frameIdx2 = Math.min(TOTAL_FRAMES - 1, Math.floor(t2 * TOTAL_FRAMES));

          if (virtualProg12 > crossfadeStart && virtualProg12 < crossfadeEnd) {
            alpha2 = (virtualProg12 - crossfadeStart) / (crossfadeEnd - crossfadeStart);
            alpha1 = 1 - alpha2;
          } else if (virtualProg12 >= crossfadeEnd) {
            alpha1 = 0;
            alpha2 = 1;
          } else {
            alpha1 = 1;
            alpha2 = 0;
          }

          // Shifting for seq2 exactly as before
          if (virtualProg12 > 0.5) {
            const t = Math.min(1, Math.max(0, (virtualProg12 - 0.5) / 0.5));
            const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            translateX = easeT * (w * 0.25);
          }
      } else {
          // --- New logic using `rawProgress` (0.666 to 1.0) ---
          const p3 = (rawProgress - 0.666) / 0.334; // 0 to 1

          frameIdx1 = TOTAL_FRAMES - 1;
          frameIdx2 = TOTAL_FRAMES - 1; // Hold on last frame of seq2

          // 1. Shift from Right to Center (p3: 0 to 0.2)
          let shiftBackEase = 1;
          if (p3 <= 0.2) {
              const shiftT = p3 / 0.2;
              shiftBackEase = shiftT < 0.5 ? 2 * shiftT * shiftT : 1 - Math.pow(-2 * shiftT + 2, 2) / 2;
          }
          translateX = (w * 0.25) * (1 - shiftBackEase);

          // 2. HIDE THE CUT IN THE MOTION!
          // Crossfade from seq2 to seq3 WHILE moving from right to center (p3: 0.05 to 0.15)
          if (p3 < 0.05) {
              alpha2 = 1;
              alpha3 = 0;
          } else if (p3 <= 0.15) {
              alpha3 = (p3 - 0.05) / 0.10;
              alpha2 = 1 - alpha3;
          } else {
              alpha2 = 0;
              alpha3 = 1;
          }

          // 3. Play seq3
          let fallT = 0;
          if (p3 > 0.2) {
              fallT = (p3 - 0.2) / 0.8;
          }
          
          // Heroimages3 only has 114 frames (index 0 to 113)
          const maxSeq3Frame = 113;
          frameIdx3 = Math.min(maxSeq3Frame, Math.floor(fallT * maxSeq3Frame));
          
          // Use continuous floating-point frame for perfectly smooth sub-pixel translation
          const smoothFrame = fallT * maxSeq3Frame;
          
          // Choreography:
          // - Frames 0-35: Come slightly down from the center (+15% height)
          // - Frames 35-60: Smoothly shoot up to just below the navbar (-35% height)
          // - Frames 60+: Hold at the top and let the raw image's downward motion fall naturally
          if (smoothFrame <= 35) {
              const moveDownT = smoothFrame / 35;
              const easeDown = moveDownT < 0.5 ? 2 * moveDownT * moveDownT : 1 - Math.pow(-2 * moveDownT + 2, 2) / 2;
              translateY = (h * 0.15) * easeDown; // Dip down slightly
          } else if (smoothFrame <= 60) {
              const moveUpT = (smoothFrame - 35) / 25; // Continuous float from 0.0 to 1.0
              const easeUp = moveUpT < 0.5 ? 2 * moveUpT * moveUpT : 1 - Math.pow(-2 * moveUpT + 2, 2) / 2;
              // We start at +15% and want to go to -35%, which is a total travel of 50%
              translateY = (h * 0.15) - (h * 0.50) * easeUp;
          } else {
              // - Frames 60+: Hold position at the top!
              translateY = -(h * 0.35);
          }
      }

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
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
        
        // Scale down on mobile to prevent the CanSat from being massively zoomed in
        const isMobile = w < 768;
        const SCALE = isMobile ? 0.80 : 0.80;
        
        if (imgRatio > canvasRatio) {
          drawH = h * SCALE;
          drawW = (h * imgRatio) * SCALE;
        } else {
          drawW = w * SCALE;
          drawH = (w / imgRatio) * SCALE;
        }

        const drawX = (w - drawW) / 2;
        let drawY = (h - drawH) / 2;

        // Push the image slightly lower on mobile view
        if (isMobile) {
          drawY += h * 0.08;
        }
        
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      };

      drawImage(seq1.current[frameIdx1], alpha1);
      drawImage(seq2.current[frameIdx2], alpha2);
      drawImage(seq3.current[frameIdx3], alpha3);

      ctx.globalAlpha = 1.0;

      rafId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, [scrollData, seq1, seq2, seq3]);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Mobile Vignette (Oval Frame) */}
      <div 
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{ 
          background: 'radial-gradient(ellipse at center, transparent 15%, #eef2f5 55%)'
        }}
      />
      {/* Desktop Vignette (Oval Frame) */}
      <div 
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ 
          background: 'radial-gradient(ellipse at center, transparent 30%, #eef2f5 70%)'
        }}
      />
    </div>
  );
};
