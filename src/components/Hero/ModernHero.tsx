import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useTheme } from '../../App';

export const ModernHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(
      elementsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 font-sans overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto pt-32 pb-20">
        
        {/* Technical Data Pill */}
        <div 
          ref={el => { elementsRef.current[0] = el; }}
          className="flex items-center gap-3 px-4 py-1.5 border border-black/20 dark:border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-sm mb-12"
        >
          <div className="w-2 h-2 bg-black dark:bg-white animate-pulse" />
          <span className="text-xs font-mono font-bold text-black dark:text-white tracking-[0.2em] uppercase">
            Spaceport America Cup 2026
          </span>
        </div>
        
        {/* Stark Headline */}
        <h1 
          ref={el => { elementsRef.current[1] = el; }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.95] mb-8 text-black dark:text-white uppercase"
        >
          Pioneering<br />
          <span className="text-transparent" style={{ WebkitTextStroke: isDark ? '2px white' : '2px black' }}>
            Aerospace
          </span>
        </h1>
        
        {/* Subtitle */}
        <p 
          ref={el => { elementsRef.current[2] = el; }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl leading-relaxed mb-12"
        >
          BRACU Diganta is Bangladesh's premier student aerospace team. We design, build, and launch high-powered rockets — competing on the world stage.
        </p>

        {/* Technical CTA Buttons */}
        <div 
          ref={el => { elementsRef.current[3] = el; }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a 
            href="#sponsorship"
            className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            Initiate Partnership <ArrowRight className="w-4 h-4" />
          </a>
          
          <a 
            href="#overview"
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-black dark:text-white border border-black/20 dark:border-white/20 font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Telemetry <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* As Featured In — Technical Line */}
      <div 
        ref={el => { elementsRef.current[4] = el; }}
        className="mt-auto pb-12 w-full flex flex-col items-center relative z-10"
      >
        <div className="flex items-center gap-4 mb-8 opacity-60 w-full max-w-4xl px-8">
          <div className="h-[1px] bg-black/20 dark:bg-white/20 flex-1" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-black dark:text-white">Transmitting</p>
          <div className="h-[1px] bg-black/20 dark:bg-white/20 flex-1" />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-xl font-bold font-serif italic text-black dark:text-white transition-all">The Daily Star</div>
          <div className="text-xl font-bold text-black dark:text-white transition-all flex items-center gap-2">প্রথম আলো</div>
          <div className="text-xl font-bold text-black dark:text-white transition-all">JAMUNA TV</div>
          <div className="text-sm font-bold text-black dark:text-white transition-all leading-tight tracking-widest">THE BUSINESS<br/>STANDARD</div>
        </div>
      </div>
    </section>
  );
};
