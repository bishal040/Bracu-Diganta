import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HomeHero } from '../Hero/HomeHero';
import { Overview } from '../sections/Overview';
import { Projects } from '../sections/Projects';
import { Achievements } from '../sections/Achievements';
import { Team } from '../sections/Team';
import { Contact } from '../sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // We animate the tearing of the hero cover inside the 300vh wrapper.
    const ctx = gsap.context(() => {
      const leftHalf = document.querySelector('.hero-left-half');
      const rightHalf = document.querySelector('.hero-right-half');
      const overviewContainer = document.querySelector('.overview-layer');
      const stickyContainer = document.querySelector('.sticky-container');
      
      if (leftHalf && rightHalf && overviewContainer && stickyContainer && wrapperRef.current) {
        
        const mm = gsap.matchMedia();
        
        mm.add({
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)"
        }, (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
              pin: stickyContainer,
              anticipatePin: 1,
            }
          });

          // Overview starts scaled down slightly and darker
          gsap.set(overviewContainer, { scale: 0.85, opacity: 0 });

          // Tearing animation happens cleanly (duration: 1)
          if (isMobile) {
            tl.to(leftHalf, { yPercent: -100, ease: 'power2.inOut', duration: 1 }, 0)
              .to(rightHalf, { yPercent: 100, ease: 'power2.inOut', duration: 1 }, 0);
          } else {
            tl.to(leftHalf, { xPercent: -100, ease: 'power2.inOut', duration: 1 }, 0)
              .to(rightHalf, { xPercent: 100, ease: 'power2.inOut', duration: 1 }, 0);
          }
          
          tl.to(overviewContainer, { scale: 1, opacity: 1, ease: 'power2.out', duration: 1 }, 0);
            
          // INSTEAD of a dead hold (which feels like lag), we apply a slow, continuous cinematic zoom 
          // to the overview page. This provides visual feedback that the user is still scrolling,
          // while giving them time to read before the 3rd page naturally slides up.
          tl.to(overviewContainer, { scale: 1.05, ease: 'none', duration: 1.5 }, 1);
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-[#eef2f5]">
      
      {/* 
        THE SCROLL WRAPPER
        Provides 400vh for a balanced scroll: Tear -> Slow Zoom -> Next Page Slides Up
      */}
      <div ref={wrapperRef} className="relative w-full h-[400vh]">
        
        {/* 
          THE PINNED CONTAINER
          This is pinned by GSAP to the top of the viewport for the entire 300vh duration.
        */}
        <div className="sticky-container w-full h-screen overflow-hidden">
          
          {/* Layer 0: The Overview page that gets revealed */}
          <div className="overview-layer absolute inset-0 z-0 bg-[#eef2f5]">
            <Overview />
          </div>
          
          {/* Layer 1: The Hero cover that tears apart */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* We wrap HomeHero to isolate pointer events just in case */}
            <div className="pointer-events-auto h-full">
              <HomeHero />
            </div>
          </div>
          
        </div>
      </div>

      {/* 
        THE REST OF THE PAGE
        By using a negative margin of -100vh, the top of this container starts EXACTLY 
        at the bottom of the sticky container's visible area when the user has scrolled 100vh.
        As the user scrolls the remaining 100vh of the wrapper, this container naturally 
        slides up and covers the sticky container. Pure CSS stacking magic!
      */}
      <div className="relative z-20 bg-[#eef2f5] rounded-t-[3rem] -mt-[100vh] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
        <Projects />
        <Achievements />
        <Team />
        <Contact />
      </div>

    </div>
  );
};
