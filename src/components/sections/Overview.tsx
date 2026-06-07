import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Activity } from 'lucide-react';
import { useTheme } from '../../App';

gsap.registerPlugin(ScrollTrigger);

const MinimalStat: React.FC<{ end: number; suffix?: string; label: string }> = ({ end, suffix = '', label }) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!countRef.current) return;
    const el = countRef.current;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        const counter = { val: 0 };
        gsap.to(counter, {
          val: end,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(counter.val).toString();
          }
        });
      }
    });
  }, [end]);

  return (
    <div className="flex flex-col items-start group border-l border-black/20 dark:border-white/20 pl-4 py-1">
      <div className="flex items-center mb-1">
        <span
          ref={countRef}
          className="font-mono text-3xl md:text-4xl lg:text-5xl font-light text-black dark:text-white tabular-nums group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors duration-300 leading-none tracking-tight"
        >
          0
        </span>
        <span className="font-mono text-2xl md:text-3xl lg:text-4xl font-light text-black dark:text-white group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors duration-300 leading-none tracking-tight">
          {suffix}
        </span>
      </div>
      <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-slate-500 uppercase leading-tight mt-2 transition-colors">
        {label}
      </span>
    </div>
  );
};

export const Overview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Reveal animation
      gsap.fromTo(
        '.reveal-elem',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={sectionRef} className="py-24 md:py-32 relative z-10 bg-white dark:bg-black overflow-hidden border-t border-black/10 dark:border-white/20">
      
      {/* Massive Background Text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none opacity-[0.03] dark:opacity-[0.01]">
        <h1 className="font-mono font-black text-[25vw] leading-none whitespace-nowrap text-black dark:text-white tracking-tighter">
          DIGANTA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full">
        
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Narrative & Stats */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full reveal-elem">
            <div>
              <div className="inline-flex items-center gap-3 px-3 py-1 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/20 mb-8 backdrop-blur-sm">
                <Activity size={14} className="text-black dark:text-white" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-black dark:text-white uppercase font-bold">
                  Status: Operational
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-sans font-black text-black dark:text-white leading-[1.1] mb-6 tracking-tighter uppercase">
                Pushing <br/>
                <span className="text-transparent" style={{ WebkitTextStroke: isDark ? '1px white' : '1px black' }}>
                  The Exosphere
                </span>
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-md font-mono">
                We are a student-led engineering team dedicated to democratizing space technology. By developing low-cost, high-reliability modular CanSats, we push the boundaries of atmospheric science and orbital mechanics.
              </p>
              
              <a href="#projects" className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-6 py-3 text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-none">
                Explore Projects
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* 2x2 Grid for the Stats */}
            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12">
              <MinimalStat end={6} suffix="+" label="Successful Missions" />
              <MinimalStat end={32} label="Active Engineers" />
              <MinimalStat end={15} suffix="K" label="Max Altitude (ft)" />
              <MinimalStat end={98} suffix="%" label="Recovery Rate" />
            </div>
          </div>

          {/* Right Column: Technical Panel */}
          <div className="lg:col-span-7 reveal-elem">
            <div className="w-full bg-white/60 dark:bg-black/60 backdrop-blur-md overflow-hidden border border-black/10 dark:border-white/10 group flex flex-col relative">
              
              {/* Technical grid background */}
              <div 
                className="absolute inset-0 bg-[size:20px_20px] pointer-events-none" 
                style={{ 
                  backgroundImage: isDark 
                    ? 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)' 
                    : 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)'
                }}
              />

              {/* Background Image - Desaturated */}
              <div 
                className="w-full aspect-video bg-cover bg-center opacity-40 dark:opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop")' }}
              />

              {/* Content Box */}
              <div className="p-8 md:p-10 flex flex-col justify-end relative z-10 border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="border border-black/20 dark:border-white/20 px-3 py-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black dark:bg-white animate-pulse" />
                    <span className="text-black dark:text-white text-[10px] font-mono tracking-[0.2em] uppercase font-bold">Log: 2026.1</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-sans font-black text-black dark:text-white mb-3 leading-[1.2] uppercase tracking-tight">
                  Diganta Selected for <br/>
                  <span className="text-transparent" style={{ WebkitTextStroke: isDark ? '1px white' : '1px black' }}>CANSAT 2026</span>
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-8 max-w-md font-mono">
                  We are thrilled to announce that Team Diganta has officially qualified for the International CanSat Competition. Our latest modular payload design scored in the top 5% of global submissions.
                </p>

                {/* Minimal Button */}
                <button className="inline-flex items-center justify-center gap-3 bg-transparent text-black dark:text-white px-6 py-3 text-xs font-mono font-bold tracking-widest uppercase transition-all w-full sm:w-auto border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10">
                  Read Full Report
                  <ArrowUpRight size={14} />
                </button>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
