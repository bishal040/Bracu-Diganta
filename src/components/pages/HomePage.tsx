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

          // Use the wrapper's physical scroll distance to drive the timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              pin: stickyContainer,
              anticipatePin: 1,
            }
          });

          // Overview starts scaled down slightly and darker
          gsap.set(overviewContainer, { scale: 0.85, opacity: 0 });

          // TIMELINE MATH: 
          // Total duration = 2.0 (arbitrary GSAP units).
          // 0 to 0.5 (first 25% of scroll): Tearing happens very fast.
          if (isMobile) {
            tl.to(leftHalf, { yPercent: -100, ease: 'power2.inOut', duration: 0.5 }, 0)
              .to(rightHalf, { yPercent: 100, ease: 'power2.inOut', duration: 0.5 }, 0);
          } else {
            tl.to(leftHalf, { xPercent: -100, ease: 'power2.inOut', duration: 0.5 }, 0)
              .to(rightHalf, { xPercent: 100, ease: 'power2.inOut', duration: 0.5 }, 0);
          }

          tl.to(overviewContainer, { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.5 }, 0);

          // 0.5 to 2.0 (remaining 75% of scroll): Very slow zoom. 
          // The user has ample time to read the overview before the CSS stacking overlap reaches the screen.
          tl.to(overviewContainer, { scale: 1.02, ease: 'none', duration: 1.5 }, 0.5);
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full bg-[#eef2f5]">

      {/* 
        THE SCROLL WRAPPER
        h-[300vh] provides 200vh of pure scroll distance.
        - First 50vh: Teardrop animation finishes.
        - Next 50vh: Hold/read time on Overview.
        - Last 100vh: Projects page slides up using CSS negative margins.
      */}
      <div ref={wrapperRef} className="relative w-full h-[300vh]">

        {/* 
          THE PINNED CONTAINER
          This is pinned by GSAP to the top of the viewport for the entire duration.
        */}
        <div className="sticky-container w-full h-screen overflow-hidden">

          {/* Layer 0: The Overview page that gets revealed */}
          <div className="overview-layer absolute inset-0 z-0 bg-[#eef2f5]">
            <Overview />
          </div>

          {/* Layer 1: The Hero cover that tears apart */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="h-full">
              <HomeHero />
            </div>
          </div>

        </div>
      </div>

      {/* 
        THE STACKING SLIDE ANIMATION
        This naturally slides over the sticky-container when the user reaches the end of the wrapper.
        -mt-[100vh] pulls it up visually so it overlaps the end of the sticky container.
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
