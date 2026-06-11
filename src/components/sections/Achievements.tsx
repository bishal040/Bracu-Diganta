import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Radio, Cpu, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NEWS_UPDATES = [
  {
    id: 1,
    day: '24',
    month: 'OCT',
    year: '2024',
    category: 'COMPETITION',
    title: 'National CanSat Champions',
    desc: 'Bracu-Diganta secures 1st place overall, demonstrating unprecedented telemetry accuracy and perfect payload recovery.',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1600&auto=format&fit=crop',
    color: 'from-blue-500 to-cyan-400',
    maskClass: 'rounded-[2rem] md:rounded-[3rem] md:rounded-tr-[12rem]' // Sweeping top-right corner
  },
  {
    id: 2,
    day: '12',
    month: 'SEP',
    year: '2024',
    category: 'ENGINEERING',
    title: 'Next-Gen Avionics Tested',
    desc: 'Successfully integrated our proprietary flight computer featuring dual-redundant sensors and a long-range LoRa module.',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    color: 'from-emerald-500 to-teal-400',
    maskClass: 'rounded-[2rem] rounded-t-[8rem] md:rounded-t-[20rem]' // Arch window shape
  },
  {
    id: 3,
    day: '05',
    month: 'AUG',
    year: '2024',
    category: 'LAUNCH LOG',
    title: 'Sub-Orbital Flight Alpha',
    desc: 'Atmospheric deployment executed perfectly at 10,000 ft. Parachutes deployed nominally with 100% data retention.',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    color: 'from-purple-500 to-pink-400',
    maskClass: 'rounded-[2rem] rounded-tl-[6rem] rounded-br-[6rem] md:rounded-tl-[12rem] md:rounded-br-[12rem]' // Aerodynamic leaf shape
  },
  {
    id: 4,
    day: '18',
    month: 'JUN',
    year: '2024',
    category: 'COMMUNITY',
    title: 'Global Aerospace Summit',
    desc: 'Our leads presented Diganta’s modular rocket architecture to international researchers, earning the prestigious Innovation Award.',
    icon: Radio,
    image: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=1600&auto=format&fit=crop',
    color: 'from-orange-500 to-red-400',
    maskClass: 'rounded-[3rem] md:rounded-[10rem]' // Pill / capsule shape
  }
];

export const Achievements: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.h-slide');

      // Calculate total horizontal scroll width
      const scrollWidth = scrollWrapperRef.current!.scrollWidth - window.innerWidth;

      gsap.to(scrollWrapperRef.current, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1), // Snaps gracefully to each section
          end: () => `+=${scrollWidth}`,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative bg-[#f8fafc] h-screen overflow-hidden flex items-center"
    >
      {/* High-End Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

      {/* Floating Global Header (Stays Fixed) */}
      <div className="absolute top-8 left-8 md:top-16 md:left-16 z-50 pointer-events-none">
        <h2 className="font-orbitron text-2xl md:text-4xl font-black text-slate-900 tracking-widest uppercase">Timeline</h2>
        <div className="flex items-center gap-3 mt-3 bg-white/95 md:bg-white/80 md:backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 w-max shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
          <span className="font-mono text-[10px] md:text-xs text-blue-600 tracking-[0.3em] font-bold">LIVE TELEMETRY // SECURE</span>
        </div>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div ref={scrollWrapperRef} className="flex h-full w-[400vw] will-change-transform">
        {NEWS_UPDATES.map((item) => (
          <div key={item.id} className="h-slide w-screen h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-24 relative">

            {/* Huge background number graphic */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[50vw] font-black text-slate-900/[0.03] pointer-events-none z-0 leading-none">
              0{item.id}
            </div>

            {/* Left Column: Cinematic Image Panel */}
            <div
              className={`w-full md:w-[45%] h-[40vh] md:h-[70vh] relative z-10 overflow-hidden border border-slate-200 group shadow-[0_30px_60px_rgba(0,0,0,0.1)] mt-24 md:mt-0 ${item.maskClass}`}
              style={{
                // Fixes WebKit bug where border-radius disappears during child transform transitions
                transform: 'translateZ(0)',
                WebkitMaskImage: '-webkit-radial-gradient(white, black)'
              }}
            >
              <img src={item.image} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] grayscale opacity-90 md:mix-blend-multiply" />
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
            <div className="w-full md:w-[55%] relative z-10 mt-12 md:mt-0 md:pl-24 flex flex-col justify-center">

              <div className="flex items-end gap-6 mb-8">
                <span className="font-orbitron text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 leading-none">
                  {item.day}
                </span>
                <div className="flex flex-col pb-2 md:pb-4">
                  <span className="font-orbitron text-3xl md:text-4xl text-blue-600 tracking-widest uppercase font-bold leading-none">{item.month}</span>
                  <span className="font-mono text-sm text-slate-500 tracking-[0.3em] font-bold mt-2">{item.year}</span>
                </div>
              </div>

              <h3 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight uppercase max-w-2xl">
                {item.title}
              </h3>

              <p className="text-slate-600 text-base md:text-xl max-w-xl leading-relaxed font-medium mb-12">
                {item.desc}
              </p>

              {/* Tech Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-200 pt-8 max-w-xl">
                <div>
                  <span className="block font-mono text-[10px] md:text-xs text-slate-500 tracking-[0.2em] mb-2 uppercase">System Status</span>
                  <span className="font-orbitron text-sm md:text-base text-slate-900 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    NOMINAL
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] md:text-xs text-slate-500 tracking-[0.2em] mb-2 uppercase">Record ID</span>
                  <span className="font-orbitron text-sm md:text-base text-slate-900 tracking-widest">SYS-{item.id}X9</span>
                </div>
                <div className="hidden md:block">
                  <span className="block font-mono text-[10px] md:text-xs text-slate-500 tracking-[0.2em] mb-2 uppercase">Encryption</span>
                  <span className="font-orbitron text-sm md:text-base text-blue-600 tracking-widest">AES-256</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
