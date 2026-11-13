import { useEffect, useRef, useState } from 'react';

const DEFAULT_TOTAL_FRAMES = 240;
const CRITICAL_STRIDE = 8;
const CRITICAL_INTRO_COUNT = 12;
const BG_BATCH_SIZE = 6;

export interface SequenceEntry {
  folder: string;
  frameCount: number;
  frames: (HTMLImageElement | null)[];
  loadedCount: number;
  criticalCount: number;
  criticalTotal: number;
  criticalReady: boolean;
  fullyLoaded: boolean;
  version: number;
  started: boolean;
  promise: Promise<void> | null;
}

export interface CanSatLoadStatus {
  ready: boolean;
  percent: number;
  version: number;
}

const sequenceCache = new Map<string, SequenceEntry>();
const listeners = new Set<() => void>();
let cansatPipelinePromise: Promise<void> | null = null;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function getOrCreateEntry(folder: string, frameCount: number): SequenceEntry {
  const existing = sequenceCache.get(folder);
  if (existing) return existing;

  const entry: SequenceEntry = {
    folder,
    frameCount,
    frames: new Array(frameCount).fill(null),
    loadedCount: 0,
    criticalCount: 0,
    criticalTotal: 1,
    criticalReady: false,
    fullyLoaded: false,
    version: 0,
    started: false,
    promise: null,
  };
  sequenceCache.set(folder, entry);
  return entry;
}

function buildLoadOrder(frameCount: number): { critical: number[]; background: number[] } {
  const seen = new Set<number>();
  const critical: number[] = [];

  const addCritical = (idx: number) => {
    if (idx >= 0 && idx < frameCount && !seen.has(idx)) {
      seen.add(idx);
      critical.push(idx);
    }
  };

  // Frame 0 + immediate intro frames first for instant initial display & scroll
  for (let i = 0; i < CRITICAL_INTRO_COUNT; i++) {
    addCritical(i);
  }
  // Sparse keyframes across the sequence so fast scrubbing never stalls
  for (let i = 0; i < frameCount; i += CRITICAL_STRIDE) {
    addCritical(i);
  }

  const background: number[] = [];
  for (let i = 0; i < frameCount; i++) {
    if (!seen.has(i)) background.push(i);
  }

  return { critical, background };
}

function resolveFrameUrl(folder: string, index: number): string {
  const num = String(index + 1).padStart(3, '0');
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${folder}/ezgif-frame-${num}.jpg`;
}

function loadAndDecodeFrame(entry: SequenceEntry, index: number, isCritical: boolean): Promise<void> {
  if (entry.frames[index]) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';

    const finish = () => {
      if (!entry.frames[index]) {
        entry.frames[index] = img;
        entry.loadedCount++;
        entry.version++;
      }
      if (isCritical) {
        entry.criticalCount++;
      }
      notifyListeners();
      resolve();
    };

    img.onload = () => {
      // Pre-decode off the paint path so the first drawImage call never stutters the main thread
      if (typeof img.decode === 'function') {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    };

    img.onerror = () => {
      if (isCritical) {
        entry.criticalCount++;
        notifyListeners();
      }
      resolve();
    };

    img.src = resolveFrameUrl(entry.folder, index);
  });
}

function yieldFrame(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 16));
}

function ensureSequence(folder: string, frameCount: number): Promise<void> {
  const entry = getOrCreateEntry(folder, frameCount);
  if (entry.promise) return entry.promise;

  entry.started = true;
  const { critical, background } = buildLoadOrder(frameCount);
  entry.criticalTotal = Math.max(1, critical.length);

  entry.promise = (async () => {
    // 1. Load & decode critical keyframes in modest batches so connection pool stays responsive
    for (let i = 0; i < critical.length; i += BG_BATCH_SIZE) {
      const batch = critical.slice(i, i + BG_BATCH_SIZE);
      await Promise.all(batch.map((idx) => loadAndDecodeFrame(entry, idx, true)));
    }

    entry.criticalReady = true;
    notifyListeners();

    // 2. Fill remaining frames smoothly in the background with yields between batches
    for (let i = 0; i < background.length; i += BG_BATCH_SIZE) {
      const batch = background.slice(i, i + BG_BATCH_SIZE);
      await Promise.all(batch.map((idx) => loadAndDecodeFrame(entry, idx, false)));
      await yieldFrame();
    }

    entry.fullyLoaded = true;
    notifyListeners();
  })();

  return entry.promise;
}

/**
 * Starts the staged CanSat sequence preload pipeline (Heroimages -> Heroimages2 -> Heroimages3).
 * Safe to call multiple times (from hover prefetch or page mount); work runs at most once.
 */
export function startCanSatPreload(): Promise<void> {
  if (cansatPipelinePromise) return cansatPipelinePromise;

  // Ensure registry entries exist synchronously before async cascade begins
  getOrCreateEntry('Heroimages', 240);
  getOrCreateEntry('Heroimages2', 240);
  getOrCreateEntry('Heroimages3', 114);

  cansatPipelinePromise = (async () => {
    await ensureSequence('Heroimages', 240);
    await ensureSequence('Heroimages2', 240);
    await ensureSequence('Heroimages3', 114);
  })();

  return cansatPipelinePromise;
}

export function getSequenceFrames(folder: string, frameCount = DEFAULT_TOTAL_FRAMES): (HTMLImageElement | null)[] {
  return getOrCreateEntry(folder, frameCount).frames;
}

export function getSequenceVersion(folder: string): number {
  return sequenceCache.get(folder)?.version ?? 0;
}

export function getCanSatLoadStatus(): CanSatLoadStatus {
  const seq1 = sequenceCache.get('Heroimages');
  const seq2 = sequenceCache.get('Heroimages2');
  const seq3 = sequenceCache.get('Heroimages3');

  const ready = Boolean(seq1?.criticalReady);
  const percent = seq1
    ? Math.min(100, Math.round((seq1.criticalCount / Math.max(1, seq1.criticalTotal)) * 100))
    : 0;
  const version = (seq1?.version ?? 0) + (seq2?.version ?? 0) + (seq3?.version ?? 0);

  return { ready, percent, version };
}

/**
 * Subscribes to CanSat staged sequence loading progress and starts preloading on mount.
 */
export function useCanSatSequences(): CanSatLoadStatus {
  const [status, setStatus] = useState<CanSatLoadStatus>(() => getCanSatLoadStatus());

  useEffect(() => {
    startCanSatPreload();

    const sync = () => {
      const next = getCanSatLoadStatus();
      setStatus((prev) =>
        prev.ready === next.ready && prev.percent === next.percent
          ? prev
          : next
      );
    };

    listeners.add(sync);
    sync();

    return () => {
      listeners.delete(sync);
    };
  }, []);

  return status;
}

/**
 * Finds the target decoded frame or falls back to the nearest loaded frame
 * so fast scrubbing never renders a blank frame while background fill completes.
 */
export function getNearestLoadedFrame(
  frames: (HTMLImageElement | null)[],
  targetIndex: number
): HTMLImageElement | null {
  if (!frames.length) return null;
  const clamped = Math.max(0, Math.min(frames.length - 1, targetIndex));
  if (frames[clamped]) return frames[clamped];

  for (let offset = 1; offset < frames.length; offset++) {
    const back = clamped - offset;
    if (back >= 0 && frames[back]) return frames[back];
    const fwd = clamped + offset;
    if (fwd < frames.length && frames[fwd]) return frames[fwd];
  }

  return null;
}

/**
 * Backwards-compatible hook for preloading a single image sequence with session caching.
 */
export const useImageSequence = (folder: string, frameCount = DEFAULT_TOTAL_FRAMES) => {
  const entry = getOrCreateEntry(folder, frameCount);
  const framesRef = useRef<(HTMLImageElement | null)[]>(entry.frames);
  framesRef.current = entry.frames;

  useEffect(() => {
    ensureSequence(folder, frameCount);
  }, [folder, frameCount]);

  return framesRef;
};
