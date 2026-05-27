import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NEWS_UPDATES = [
  { 
    id: 1, 
    day: '24', 
    month: 'OCT', 
    category: 'COMPETITION', 
    title: 'National CanSat Champions', 
    desc: 'Bracu-Diganta secures 1st place overall, demonstrating unprecedented telemetry accuracy and perfect payload recovery.',
    alt: 'T+ 00:00 // LIFTOFF'
  },
  { 
    id: 2, 
    day: '12', 
    month: 'SEP', 
    category: 'ENGINEERING', 
    title: 'Next-Gen Avionics Tested', 
    desc: 'Successfully integrated our proprietary flight computer featuring dual-redundant sensors and a long-range LoRa module.',
    alt: 'ALT // 10,000 FT'
  },
  { 
    id: 3, 
    day: '05', 
    month: 'AUG', 
    category: 'LAUNCH LOG', 
    title: 'Sub-Orbital Flight Alpha', 
    desc: 'Atmospheric deployment executed perfectly at 10,000 ft. Parachutes deployed nominally with 100% data retention.',
    alt: 'ALT // 45,000 FT'
  },
  { 
    id: 4, 
    day: '18', 
    month: 'JUN', 
    category: 'COMMUNITY', 
    title: 'Global Aerospace Summit', 
    desc: 'Our leads presented Diganta’s modular rocket architecture to international researchers, earning the prestigious Innovation Award.',
    alt: 'ALT // KARMAN LINE'
  }
];

const AerospaceRocket = () => (
  <svg viewBox="-10 0 120 200" className="w-12 md:w-16 h-auto drop-shadow-2xl relative z-10" fill="none">
    {/* Engine Nozzle */}
    <path d="M35 150 L65 150 L75 180 L25 180 Z" fill="#334155" />
    <path d="M40 180 L60 180 L65 190 L35 190 Z" fill="#1e293b" />
    
    {/* Fins */}
    <path d="M20 110 L-5 160 L20 160 Z" fill="#2563EB" />
    <path d="M80 110 L105 160 L80 160 Z" fill="#2563EB" />
    
    {/* Main Body */}
    <path d="M50 10 C30 40 20 70 20 150 L80 150 C80 70 70 40 50 10 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
    
    {/* Blue Stripe */}
    <path d="M20 110 L80 110 L80 130 L20 130 Z" fill="#2563EB" />
    
    {/* Window */}
    <circle cx="50" cy="65" r="12" fill="#94a3b8" />
    <circle cx="50" cy="65" r="8" fill="#0f172a" />
    <circle cx="52" cy="63" r="3" fill="#38bdf8" opacity="0.8" />
  </svg>
);

export const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const totalSteps = NEWS_UPDATES.length - 1;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=4000', // Scroll distance to complete the flight
        scrub: 1, // Smooth scrub
        pin: true,
        anticipatePin: 1
      }
    });

    const START_TIME = 1;

    // 1. Move the entire flight track upwards, creating the illusion of the rocket ascending
    tl.to('.flight-track', {
      yPercent: -(100 / NEWS_UPDATES.length) * totalSteps,
      ease: 'none',
      duration: totalSteps
    }, START_TIME);

    // 2. Sync the Typography Panels and Altitude Labels
    NEWS_UPDATES.forEach((item, i) => {
      // Setup initial states
      if (i === 0) {
        gsap.set(`.panel-${i}`, { opacity: 1, x: 0 });
        gsap.set(`.panel-alt-${i}`, { opacity: 1, x: 0 });
        gsap.set(`.node-${i}`, { borderColor: '#2563EB', backgroundColor: '#EFF6FF', scale: 1.5 });

        // Fade out as scroll begins
        tl.to(`.panel-${i}`, { opacity: 0, x: -40, duration: 0.4 }, START_TIME);
        tl.to(`.panel-alt-${i}`, { opacity: 0, x: 20, duration: 0.4 }, START_TIME);
        tl.to(`.node-${i}`, { borderColor: '#cbd5e1', backgroundColor: '#ffffff', scale: 1, duration: 0.4 }, START_TIME);
      } else {
        gsap.set(`.panel-${i}`, { opacity: 0, x: 40 });
        gsap.set(`.panel-alt-${i}`, { opacity: 0, x: 20 });
        gsap.set(`.node-${i}`, { borderColor: '#cbd5e1', backgroundColor: '#ffffff', scale: 1 });

        // Fade in as node aligns with the rocket (center screen)
        const enterTime = START_TIME + i - 0.4;
        tl.to(`.panel-${i}`, { opacity: 1, x: 0, duration: 0.4 }, enterTime);
        tl.to(`.panel-alt-${i}`, { opacity: 1, x: 0, duration: 0.4 }, enterTime);
        tl.to(`.node-${i}`, { borderColor: '#2563EB', backgroundColor: '#EFF6FF', scale: 1.5, duration: 0.4 }, enterTime);

        // Fade out as it passes, unless it's the final update
        if (i < totalSteps) {
          const exitTime = START_TIME + i + 0.4;
          tl.to(`.panel-${i}`, { opacity: 0, x: -40, duration: 0.4 }, exitTime);
          tl.to(`.panel-alt-${i}`, { opacity: 0, x: 20, duration: 0.4 }, exitTime);
          tl.to(`.node-${i}`, { borderColor: '#cbd5e1', backgroundColor: '#ffffff', scale: 1, duration: 0.4 }, exitTime);
        }
      }
    });

    // 3. Final resting buffer before unpinning
    tl.to({}, { duration: 1 }, START_TIME + totalSteps);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative bg-slate-50 h-screen overflow-hidden flex items-center"
    >
      {/* Background Texture - Engineering Blueprint Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Massive Background Watermark */}
      <div className="absolute -left-[5%] top-1/2 -translate-y-1/2 font-orbitron text-[15vw] font-black text-slate-200/50 whitespace-nowrap pointer-events-none z-0">
        ASCENT
      </div>

      {/* ── Left Side: Typography Display ── */}
      <div className="w-full md:w-[60%] h-full relative pl-6 md:pl-24 pr-4 flex flex-col justify-center z-20">
        
        {/* Section Header */}
        <div className="mb-12 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1.5 h-5 bg-blue-600" />
            <div className="w-1.5 h-5 bg-blue-400" />
            <div className="w-1.5 h-5 bg-blue-200" />
          </div>
          <h2 className="font-mono text-sm md:text-base text-blue-600 font-bold tracking-[0.2em] uppercase">
            Flight Log // Telemetry
          </h2>
        </div>

        {/* Data Panels */}
        <div className="relative h-[350px] md:h-[400px] w-full max-w-2xl">
          {NEWS_UPDATES.map((item, i) => (
            <div key={item.id} className={`panel-${i} absolute inset-0 w-full h-full flex flex-col justify-center`}>
              
              {/* Date & Category */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-orbitron text-6xl md:text-8xl font-black text-slate-800 leading-none">
                  {item.day}
                </span>
                <div className="flex flex-col">
                  <span className="font-orbitron text-2xl md:text-3xl font-bold text-blue-600 uppercase tracking-widest leading-none mb-1.5">
                    {item.month}
                  </span>
                  <span className="font-mono text-[10px] md:text-xs text-slate-500 font-bold tracking-[0.2em] uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              
              {/* Headline */}
              <h3 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 uppercase tracking-tight mb-5 leading-[1.1]">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed border-l-4 border-blue-500 pl-5 max-w-xl">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Side: Rocket Flight Path Telemetry ── */}
      <div className="absolute right-0 top-0 w-full md:w-[40%] h-full z-10 pointer-events-none">
        
        {/* Vertical Rail */}
        <div className="absolute left-[85%] md:left-1/3 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 shadow-[inset_0_0_2px_rgba(0,0,0,0.1)]" />
        
        {/* Pinned Rocket */}
        <div className="absolute top-1/2 left-[85%] md:left-1/3 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
          <AerospaceRocket />
          {/* Thrust Flame */}
          <div className="relative w-full flex justify-center -mt-2">
            <div className="w-5 md:w-6 h-20 md:h-24 bg-gradient-to-b from-blue-400 via-cyan-300 to-transparent rounded-b-full animate-[pulse_0.4s_ease-in-out_infinite] blur-[2px] absolute top-0" />
            <div className="w-2 md:w-3 h-14 md:h-16 bg-gradient-to-b from-white to-transparent rounded-b-full animate-[pulse_0.2s_ease-in-out_infinite] absolute top-0" />
          </div>
        </div>

        {/* Scrolling Altitude Track */}
        <div 
          ref={trackRef}
          className="flight-track absolute top-0 left-0 w-full"
          style={{ height: `${NEWS_UPDATES.length * 100}vh` }}
        >
          {NEWS_UPDATES.map((item, i) => (
            <div key={item.id} className="relative w-full h-[100vh] flex items-center">
               
               {/* Node Marker on Rail */}
               <div className={`node-${i} absolute left-[85%] md:left-1/3 -translate-x-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full border-[4px] border-slate-300 bg-white z-20 transition-all duration-300 shadow-md`} />
               
               {/* Altitude Label Tag */}
               <div className={`panel-alt-${i} absolute left-[85%] md:left-1/3 ml-6 md:ml-10 flex items-center gap-2 md:gap-4 transition-all duration-300 hidden sm:flex`}>
                 <div className="w-6 md:w-10 h-px bg-slate-300" />
                 <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded border border-slate-200 shadow-sm">
                   <span className="font-mono text-[10px] md:text-sm font-bold text-slate-500 tracking-widest whitespace-nowrap">
                     {item.alt}
                   </span>
                 </div>
               </div>

               {/* Subtle grid line crossing the rail horizontally */}
               <div className="absolute left-0 w-full h-px bg-slate-200/50 -z-10" />

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
