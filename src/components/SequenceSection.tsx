import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlobalCanvas } from './GlobalCanvas';
import { HeroOverlays } from './Hero/HeroOverlays';

gsap.registerPlugin(ScrollTrigger);

export const SequenceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollData = useRef({ progress: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      anticipatePin: 1,
      start: 'top top',
      end: '+=700%',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollData.current.progress = self.progress;
      },
    });
    
    return () => st.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#eef2f5]">
      <GlobalCanvas scrollData={scrollData} />
      <HeroOverlays scrollData={scrollData} />
    </div>
  );
};
