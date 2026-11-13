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

  let resolvedTarget: number | HTMLElement;

  if (typeof target === 'string') {
    const cleanId = target.startsWith('#') ? target.slice(1) : target;
    const el = document.getElementById(cleanId);
    if (!el) return;
    resolvedTarget = el;
  } else {
    resolvedTarget = target;
  }

  // If the target element is pinned by GSAP ScrollTrigger, its pin-spacer
  // shifts its bounding box when scrolled past; jump directly to trigger.start.
  if (resolvedTarget instanceof HTMLElement) {
    const pinnedTrigger = ScrollTrigger.getAll().find(
      (st) => st.trigger === resolvedTarget && st.pin
    );
    if (pinnedTrigger) {
      resolvedTarget = pinnedTrigger.start + offset;
    }
  }

  if (activeLenis) {
    // Recompute Lenis bounds before scrolling so route transitions from shorter pages
    // never clamp against a stale scroll limit.
    activeLenis.resize();
    activeLenis.scrollTo(resolvedTarget, {
      immediate,
      offset: typeof resolvedTarget === 'number' ? 0 : offset,
      duration: immediate ? 0 : 0.85,
      lock: false,
      force: true,
    });
  } else if (typeof resolvedTarget === 'number') {
    window.scrollTo({ top: resolvedTarget, behavior: immediate ? 'auto' : 'smooth' });
  } else {
    resolvedTarget.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
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

    if (lenisRef.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    if (scrollTo) {
      let raf1 = 0;
      let raf2 = 0;
      let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

      const performJump = () => {
        ScrollTrigger.refresh();
        activeLenis?.resize();
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
  }, [pathname, state]);

  return <>{children}</>;
};
