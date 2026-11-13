import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;

/**
 * Scrolls using the active Lenis instance so smooth scrolling never fights
 * GSAP ScrollTrigger pins or native browser smooth scrolling.
 */
export function scrollToTarget(
  target: string | number | HTMLElement,
  options: { immediate?: boolean; offset?: number } = {}
) {
  const { immediate = false, offset = 0 } = options;

  if (typeof target === 'string') {
    const cleanId = target.startsWith('#') ? target.slice(1) : target;
    const el = document.getElementById(cleanId);
    if (!el) return;
    if (activeLenis) {
      activeLenis.scrollTo(el, {
        immediate,
        offset,
        duration: immediate ? 0 : 0.85,
        lock: !immediate,
      });
    } else {
      el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
    }
    return;
  }

  if (activeLenis) {
    activeLenis.scrollTo(target, {
      immediate,
      offset,
      duration: immediate ? 0 : 0.85,
      lock: !immediate,
    });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  } else {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  }
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname, state } = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(onTick);
      if (activeLenis === lenis) {
        activeLenis = null;
      }
      lenis.destroy();
    };
  }, []);

  // Reset scroll position or jump cleanly to requested homepage section after route change
  useEffect(() => {
    const scrollTo = (state as { scrollTo?: string } | null)?.scrollTo;

    if (scrollTo) {
      let raf1 = 0;
      let raf2 = 0;
      let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

      const performJump = () => {
        ScrollTrigger.refresh();
        const el = document.getElementById(scrollTo);
        if (el) {
          scrollToTarget(el, { immediate: true });
          ScrollTrigger.update();
          return true;
        }
        return false;
      };

      // Wait two frames so all pinned ScrollTrigger sections finish mounting & measuring
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (!performJump()) {
            fallbackTimer = setTimeout(performJump, 120);
          }
        });
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return <>{children}</>;
};
