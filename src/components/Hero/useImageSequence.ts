import { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 240;

/**
 * Preloads an image sequence into an array of HTMLImageElements.
 * Returns a ref to the array so consumers can read frames without triggering re-renders.
 */
export const useImageSequence = (folder: string) => {
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const frames = framesRef.current;

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const num = String(index + 1).padStart(3, '0');
        img.src = `/${folder}/ezgif-frame-${num}.jpg`;
        img.onload = () => {
          if (!cancelled) {
            frames[index] = img;
            loadedCountRef.current++;
          }
          resolve();
        };
        img.onerror = () => resolve(); // skip broken frames silently
      });
    };

    const loadAll = async () => {
      // Load first 30 frames immediately (critical for first paint)
      const firstBatch: Promise<void>[] = [];
      for (let i = 0; i < Math.min(30, TOTAL_FRAMES); i++) {
        firstBatch.push(loadFrame(i));
      }
      await Promise.all(firstBatch);

      // Load remaining in batches of 20
      for (let start = 30; start < TOTAL_FRAMES && !cancelled; start += 20) {
        const batch: Promise<void>[] = [];
        for (let i = start; i < Math.min(start + 20, TOTAL_FRAMES); i++) {
          batch.push(loadFrame(i));
        }
        await Promise.all(batch);
      }
    };

    loadAll();

    return () => { cancelled = true; };
  }, [folder]);

  return framesRef;
};
