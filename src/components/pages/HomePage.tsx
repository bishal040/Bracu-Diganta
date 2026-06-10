import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HomeHero } from '../Hero/HomeHero';
import { Overview } from '../sections/Overview';
import { Projects } from '../sections/Projects';
import { Achievements } from '../sections/Achievements';
import { Team } from '../sections/Team';

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

        // Tearing animation happens in the first 50% of the scroll timeline
        tl.to(leftHalf, { xPercent: -100, ease: 'power2.inOut' }, 0)
          .to(rightHalf, { xPercent: 100, ease: 'power2.inOut' }, 0)
          // The Overview page "pops" from the inside (scale 0.85 -> 1.0, opacity 0 -> 1)
          .to(overviewContainer, { scale: 1, opacity: 1, ease: 'power2.out' }, 0)
          // Add a dummy tween to hold the timeline open for the remaining duration (the Projects slide up)
          .to({}, { duration: 1 });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-[#eef2f5]">
      
      {/* 
        THE SCROLL WRAPPER
        This div provides 300vh of scrollable space. 
      */}
      <div ref={wrapperRef} className="relative w-full h-[300vh]">
        
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
      </div>

    </div>
  );
};
