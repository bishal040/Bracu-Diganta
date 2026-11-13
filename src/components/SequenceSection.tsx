import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlobalCanvas } from './GlobalCanvas';
import { HeroOverlays } from './Hero/HeroOverlays';
import { useCanSatSequences } from './Hero/useImageSequence';

gsap.registerPlugin(ScrollTrigger);

export const SequenceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollData = useRef({ progress: 0 });
  const { ready, percent } = useCanSatSequences();
  const [showLoader, setShowLoader] = useState(() => !ready);

  useEffect(() => {
    if (!ready) {
      setShowLoader(true);
      return;
    }
    const timer = setTimeout(() => setShowLoader(false), 350);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      anticipatePin: 1,
      start: 'top top',
      end: '+=1050%',
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

      {showLoader && (
        <div
          className={`fixed inset-0 z-40 bg-[#eef2f5]/95 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${
            ready ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-slate-500 mb-3">
            Loading CanSat Telemetry
          </span>
          <div className="w-48 h-[2px] bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-200"
              style={{ width: `${Math.max(8, percent)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-blue-600 mt-2.5">
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
};
