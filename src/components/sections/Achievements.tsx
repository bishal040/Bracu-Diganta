import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NEWS_UPDATES } from '../../data/timeline';

gsap.registerPlugin(ScrollTrigger);

const VISIBLE_COUNT = 4;
const TOTAL_SLIDES = VISIBLE_COUNT + 1; // 4 cards + 1 CTA

export const Achievements: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const visibleItems = NEWS_UPDATES.slice(0, VISIBLE_COUNT);

  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const sections = gsap.utils.toArray('.h-slide');
        const scrollWidth = scrollWrapperRef.current!.scrollWidth - window.innerWidth;

        gsap.to(scrollWrapperRef.current, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => `+=${scrollWidth}`,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative bg-[#f8fafc] min-h-screen md:h-screen md:overflow-hidden block md:flex md:items-center pt-24 md:pt-0"
    >
      {/* High-End Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

      {/* Floating Global Header (Stays Fixed) */}
      <div className="sticky top-20 md:absolute md:top-16 left-0 md:left-16 z-0 md:z-50 pointer-events-none pl-6 md:pl-0 pb-4 md:pb-0 mb-4 md:mb-0">
        <h2 className="font-orbitron text-3xl md:text-4xl font-black text-slate-900 tracking-widest uppercase md:bg-transparent bg-white/50 backdrop-blur-md inline-block px-4 py-2 -ml-4 md:ml-0 md:p-0 md:backdrop-blur-none rounded-r-xl md:rounded-none">
          Timeline
        </h2>
      </div>

      {/* Horizontal Scroll Wrapper — uses inline style for dynamic width since Tailwind can't resolve interpolated values */}
      <div
        ref={scrollWrapperRef}
        data-scroll-track=""
        className="flex flex-col md:flex-row h-auto md:h-full w-full will-change-transform md:pb-0 relative"
        style={{ ['--tw-slides' as string]: TOTAL_SLIDES }}
      >
        {/* Inject responsive width via <style> since we need a media-query-scoped dynamic value */}
        <style>{`
          @media (min-width: 768px) {
            [data-scroll-track] { width: ${TOTAL_SLIDES * 100}vw !important; }
          }
        `}</style>

        {visibleItems.map((item, index) => (
          <div 
            key={item.id} 
            className="h-slide w-full md:w-screen h-auto md:h-full flex flex-col md:flex-row items-center justify-center py-8 px-6 md:p-24 relative min-h-[85vh] md:min-h-0 bg-white md:bg-transparent rounded-t-[2.5rem] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none border-t border-slate-200 md:border-none sticky md:static z-10"
            style={{ top: `calc(130px + ${index * 16}px)` }}
          >

            {/* Huge background number graphic */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[50vw] font-black text-slate-900/[0.03] pointer-events-none z-0 leading-none">
              0{item.id}
            </div>

            {/* Left Column: Cinematic Image Panel */}
            <div
              className={`w-full md:w-[45%] h-[25vh] md:h-[70vh] relative z-10 overflow-hidden border border-slate-200 group shadow-[0_30px_60px_rgba(0,0,0,0.1)] mt-4 md:mt-0 ${item.maskClass}`}
              style={{
                transform: 'translateZ(0)',
                WebkitMaskImage: '-webkit-radial-gradient(white, black)'
              }}
            >
              <img src={item.image} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] opacity-90" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${item.color} opacity-20 md:opacity-10 md:mix-blend-multiply`} />

              {/* Image Overlay HUD */}
              <div className="absolute top-6 left-6 bg-white/95 md:bg-white/90 md:backdrop-blur-xl border border-slate-200 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-sm">
                <item.icon size={16} className="text-blue-600" />
                <span className="text-slate-900 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">{item.category}</span>
              </div>

              {/* Decorative Crosshair */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-slate-400" />
                <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-slate-400" />
                <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-slate-400" />
                <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-slate-400" />
              </div>
            </div>

            {/* Right Column: Data & Typography */}
            <div className="w-full md:w-[55%] relative z-10 mt-6 md:mt-0 md:pl-24 flex flex-col justify-center">

              <div className="flex items-end gap-4 md:gap-6 mb-4 md:mb-8">
                <span className="font-orbitron text-5xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 leading-none">
                  {item.day}
                </span>
                <div className="flex flex-col pb-1 md:pb-4">
                  <span className="font-orbitron text-xl md:text-4xl text-blue-600 tracking-widest uppercase font-bold leading-none">{item.month}</span>
                  <span className="font-mono text-[10px] md:text-sm text-slate-500 tracking-[0.3em] font-bold mt-1 md:mt-2">{item.year}</span>
                </div>
              </div>

              <h3 className="font-orbitron text-2xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-4 md:mb-8 tracking-tight uppercase max-w-2xl">
                {item.title}
              </h3>

              <p className="text-slate-600 text-sm md:text-xl max-w-xl leading-relaxed font-medium mb-6 md:mb-12">
                {item.desc}
              </p>

              {/* Tech Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 border-t border-slate-200 pt-4 md:pt-8 max-w-xl">
                <div>
                  <span className="block font-mono text-[10px] md:text-xs text-slate-500 tracking-[0.2em] mb-2 uppercase">System Status</span>
                  <span className="font-orbitron text-xs md:text-base text-slate-900 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    NOMINAL
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] md:text-xs text-slate-500 tracking-[0.2em] mb-2 uppercase">Record ID</span>
                  <span className="font-orbitron text-xs md:text-base text-slate-900 tracking-widest">SYS-{item.id}X9</span>
                </div>
                <div className="hidden md:block">
                  <span className="block font-mono text-[10px] md:text-xs text-slate-500 tracking-[0.2em] mb-2 uppercase">Encryption</span>
                  <span className="font-orbitron text-xs md:text-base text-blue-600 tracking-widest">AES-256</span>
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* See More CTA Slide */}
        <div
          className="h-slide w-full md:w-screen h-auto md:h-full flex items-center justify-center py-16 px-6 md:p-24 relative min-h-[60vh] md:min-h-0 bg-white md:bg-transparent rounded-t-[2.5rem] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none border-t border-slate-200 md:border-none sticky md:static z-10"
          style={{ top: `calc(130px + ${VISIBLE_COUNT * 16}px)` }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[40vw] font-black text-slate-900/[0.02] pointer-events-none z-0 leading-none select-none">
            ...
          </div>
          <div className="relative z-10 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-700 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
                {NEWS_UPDATES.length - VISIBLE_COUNT} More Entries
              </span>
            </div>
            <h3 className="font-orbitron text-3xl md:text-5xl font-bold text-slate-900 mb-4 uppercase tracking-tight">
              Explore Full<br />Timeline
            </h3>
            <p className="text-slate-500 text-sm md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Discover every milestone, conference, and breakthrough in BRACU Diganta's journey from 2017 to today.
            </p>
            <button
              onClick={() => navigate('/timeline')}
              className="group inline-flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:shadow-2xl"
            >
              See All Milestones
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
