import React, { useEffect, useRef, useState } from 'react';
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
    desc: 'Bracu-Diganta secures 1st place overall, demonstrating unprecedented telemetry accuracy and perfect payload recovery.' 
  },
  { 
    id: 2, 
    day: '12', 
    month: 'SEP', 
    category: 'ENGINEERING', 
    title: 'Next-Gen Avionics Tested', 
    desc: 'Successfully integrated our proprietary flight computer featuring dual-redundant sensors and a long-range LoRa module.' 
  },
  { 
    id: 3, 
    day: '05', 
    month: 'AUG', 
    category: 'LAUNCH LOG', 
    title: 'Sub-Orbital Flight Alpha', 
    desc: 'Atmospheric deployment executed perfectly at 10,000 ft. Parachutes deployed nominally with 100% data retention.' 
  },
  { 
    id: 4, 
    day: '18', 
    month: 'JUN', 
    category: 'COMMUNITY', 
    title: 'Global Aerospace Summit', 
    desc: 'Our leads presented Diganta’s modular rocket architecture to international researchers, earning the prestigious Innovation Award.' 
  }
];

export const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<Date | null>(null);

  // Real-time Clock
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !dialRef.current) return;

    // Total rotation required to cycle through 4 steps
    const angleStep = 360 / NEWS_UPDATES.length; // 90 degrees
    const totalSteps = NEWS_UPDATES.length - 1; // 3 transitions

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=4000', // Increased total scroll distance to accommodate resting buffers
        scrub: 1, // Smooth scrub
        pin: true, // This explicitly freezes the section
        anticipatePin: 1
      }
    });

    // We add a "resting" buffer at the start and end of the timeline
    // so the user can read the first and last slides without the page moving.
    const START_TIME = 1;

    // 1. Rotate the massive dial counter-clockwise
    tl.to('.chronometer-dial', {
      rotation: -angleStep * totalSteps,
      ease: 'none',
      duration: totalSteps
    }, START_TIME);

    // 2. Counter-rotate the nodes so the text inside stays perfectly upright
    tl.to('.node-wrapper', {
      rotation: angleStep * totalSteps,
      ease: 'none',
      duration: totalSteps
    }, START_TIME);

    // 3. Sync the Typography Panels and Node colors
    NEWS_UPDATES.forEach((item, i) => {
      // Setup initial states
      if (i === 0) {
        gsap.set(`.panel-${i}`, { opacity: 1, y: 0 });
        gsap.set(`.node-${i}`, { borderColor: '#2563EB', color: '#2563EB', scale: 1.1 });

        // Fade out as scroll begins (after the initial 1-unit buffer)
        tl.to(`.panel-${i}`, { opacity: 0, y: -40, duration: 0.4 }, START_TIME);
        tl.to(`.node-${i}`, { borderColor: '#f3f4f6', color: '#d1d5db', scale: 1, duration: 0.4 }, START_TIME);
      } else {
        gsap.set(`.panel-${i}`, { opacity: 0, y: 40 });
        gsap.set(`.node-${i}`, { borderColor: '#f3f4f6', color: '#d1d5db', scale: 1 });

        // Fade in as node hits 9 o'clock
        const enterTime = START_TIME + i - 0.4;
        tl.to(`.panel-${i}`, { opacity: 1, y: 0, duration: 0.4 }, enterTime);
        tl.to(`.node-${i}`, { borderColor: '#2563EB', color: '#2563EB', scale: 1.1, duration: 0.4 }, enterTime);

        // Fade out as it passes, unless it's the very last one
        if (i < totalSteps) {
          const exitTime = START_TIME + i + 0.4;
          tl.to(`.panel-${i}`, { opacity: 0, y: -40, duration: 0.4 }, exitTime);
          tl.to(`.node-${i}`, { borderColor: '#f3f4f6', color: '#d1d5db', scale: 1, duration: 0.4 }, exitTime);
        }
      }
    });

    // 4. Final resting buffer
    // By adding an empty 1-unit animation at the end, we force the timeline
    // to stay pinned for an extra chunk of scroll distance before releasing.
    tl.to({}, { duration: 1 }, START_TIME + totalSteps);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative bg-[#eef2f5] h-screen overflow-hidden flex items-center"
    >

      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply" />
      </div>

      {/* Massive Background Watermark */}
      <div className="absolute -left-[5%] top-1/2 -translate-y-1/2 font-orbitron text-[15vw] font-black text-gray-200/40 whitespace-nowrap pointer-events-none z-0">
        RECORD
      </div>

      {/* ── Left Side: Typography Display ── */}
      <div className="w-[85%] md:w-1/2 h-full relative pl-8 md:pl-20 pr-4 flex flex-col justify-center z-20">
        
        <div className="mb-12 flex items-center gap-4">
           <div className="w-3 h-3 rounded-full bg-[#2563EB] animate-pulse" />
           <h2 className="font-orbitron font-black text-xl md:text-3xl text-gray-400 tracking-widest uppercase">
             Latest Dispatches
           </h2>
        </div>

        <div className="relative h-[300px] md:h-[450px] w-full max-w-2xl">
          {NEWS_UPDATES.map((item, i) => (
            <div key={item.id} className={`panel-${i} absolute inset-0 w-full h-full flex flex-col justify-center`}>
              
              {/* News Header: Massive Date + Category */}
              <div className="flex items-end gap-6 mb-6 md:mb-8">
                <div className="font-orbitron text-[7rem] md:text-[9rem] lg:text-[11rem] font-black text-gray-900 tracking-tighter leading-[0.8]">
                  {item.day}
                </div>
                <div className="flex flex-col pb-2 md:pb-4">
                  <div className="font-orbitron text-2xl md:text-4xl lg:text-5xl font-bold text-[#2563EB] uppercase tracking-widest mb-2">
                    {item.month}
                  </div>
                  <div className="font-mono text-sm md:text-lg text-gray-400 font-bold uppercase tracking-[0.2em]">
                    // {item.category}
                  </div>
                </div>
              </div>
              
              {/* Headline */}
              <div className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-black text-gray-800 uppercase tracking-tight mb-6 leading-none">
                {item.title}
              </div>
              
              {/* Snippet */}
              <p className="text-gray-500 text-lg md:text-2xl leading-relaxed pr-8 border-l-4 border-[#2563EB]/40 pl-6 max-w-xl">
                {item.desc}
              </p>

            </div>
          ))}
        </div>

      </div>

      {/* ── Right Side: Massive Chronometer Dial ── */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[60%] md:translate-x-[30%] w-[800px] md:w-[1200px] h-[800px] md:h-[1200px] z-10 pointer-events-none">
        
        {/* Target Laser Sensor (Points towards node from outside) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-12 md:pr-16 z-50 flex items-center">
          <div className="w-16 md:w-32 h-[2px] bg-gradient-to-r from-transparent to-[#2563EB] relative flex items-center justify-end">
            <div className="absolute -top-5 right-0 font-mono text-[8px] md:text-[10px] text-[#2563EB] tracking-[0.2em] font-bold whitespace-nowrap">
              SENSOR_ALIGN //
            </div>
            <div className="absolute -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#2563EB] animate-ping" />
            <div className="absolute right-[0px] w-2 h-2 md:w-3 md:h-3 rounded-full bg-white shadow-[0_0_10px_#2563EB]" />
          </div>
        </div>

        {/* The Rotating Dial Container */}
        <div 
          ref={dialRef}
          className="chronometer-dial absolute inset-0 rounded-full border border-gray-200 bg-white/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.03)]"
        >
           
           {/* Subtle Structural Texture (Grid + Radial Gradient) */}
           <div className="absolute inset-0 rounded-full opacity-[0.10] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.03)_80%,rgba(0,0,0,0.08)_100%)]" />

           {/* Clean Concentric Track Rings */}
           <div className="absolute inset-[15%] rounded-full border border-gray-200/50 pointer-events-none" />
           <div className="absolute inset-[30%] rounded-full border border-gray-200/30 pointer-events-none" />
           <div className="absolute inset-[45%] rounded-full border border-dashed border-gray-300/40 pointer-events-none" />

           {/* Beautiful SVG Ruler Ticks */}
           <svg viewBox="0 0 1200 1200" className="absolute inset-0 w-full h-full pointer-events-none">
              
              {/* Tick Marks */}
              <g stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round">
                 {Array.from({length: 120}).map((_, i) => (
                   <line 
                     key={`tick-${i}`} 
                     x1="600" y1="0" x2="600" 
                     y2={i % 10 === 0 ? 40 : (i % 5 === 0 ? 20 : 10)} 
                     transform={`rotate(${i * 3} 600 600)`} 
                   />
                 ))}
              </g>
           </svg>

           {/* The Nodes mounted on the dial */}
           {NEWS_UPDATES.map((item, i) => {
              const angle = i * (360 / NEWS_UPDATES.length);
              return (
                <div 
                  key={item.id}
                  className="absolute top-1/2 left-0 w-full h-0 origin-center flex items-center justify-start z-10"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                   {/* GSAP strictly controls this wrapper, starting at 0 and animating to +angleStep * totalSteps */}
                   <div className="node-wrapper w-16 h-16 md:w-24 md:h-24 -ml-8 md:-ml-12">
                     {/* This inner div handles the STATIC initial counter-rotation so the text is upright at time=0 */}
                     <div className="w-full h-full" style={{ transform: `rotate(${-angle}deg)` }}>
                       <div className={`node-${i} w-full h-full rounded-full bg-white border-[4px] md:border-[6px] border-gray-100 shadow-xl flex items-center justify-center text-gray-300 transition-colors duration-200`}>
                         <span className="font-orbitron text-xl md:text-3xl font-black">0{item.id}</span>
                       </div>
                     </div>
                   </div>
                </div>
              );
           })}
        </div>

        {/* ── Massive Static Hands (Does NOT rotate with the dial) ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          
          {time && (() => {
            const hours = time.getHours() % 12;
            const minutes = time.getMinutes();
            // Removed seconds calculation for cleaner aesthetic
            
            const minuteDeg = minutes * 6; // Snap to minutes
            const hourDeg = hours * 30 + (minutes / 60) * 30; // Smooth hour progression

            return (
              <div className="absolute inset-0">
                
                {/* Hour Hand: Premium Dauphine (Faceted Polished Metal) */}
                <div 
                  className="absolute transition-transform duration-[100ms] w-6 md:w-8 -ml-3 md:-ml-4 flex flex-col items-center drop-shadow-2xl z-10"
                  style={{ 
                    height: '24%', left: '50%', bottom: '50%', 
                    transformOrigin: 'bottom center', transform: `rotate(${hourDeg}deg)` 
                  }}
                >
                   <div className="w-full h-full relative" style={{ clipPath: 'polygon(50% 0%, 100% 85%, 50% 100%, 0% 85%)' }}>
                      {/* Left side: Light-catching polished metal */}
                      <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-gray-100 to-gray-400" />
                      {/* Right side: Shadowed brushed metal */}
                      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-gray-500 to-gray-800" />
                   </div>
                </div>

                {/* Minute Hand: Premium Dauphine (Blue Steel) */}
                <div 
                  className="absolute transition-transform duration-[100ms] w-4 md:w-[20px] -ml-2 md:-ml-[10px] flex flex-col items-center drop-shadow-2xl z-20"
                  style={{ 
                    height: '36%', left: '50%', bottom: '50%', 
                    transformOrigin: 'bottom center', transform: `rotate(${minuteDeg}deg)` 
                  }}
                >
                   <div className="w-full h-full relative" style={{ clipPath: 'polygon(50% 0%, 100% 85%, 50% 100%, 0% 85%)' }}>
                      {/* Left side: Heated blue steel highlight */}
                      <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#60A5FA] to-[#2563EB]" />
                      {/* Right side: Deep blue steel shadow */}
                      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-[#1E3A8A] to-gray-900" />
                   </div>
                </div>

                {/* Center Hub: Polished Metal Pinion */}
                <div className="absolute w-5 h-5 md:w-7 md:h-7 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 shadow-[0_5px_15px_rgba(0,0,0,0.4)] z-30 flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-400" />
                </div>
              </div>
            );
          })()}

        </div>

      </div>

    </section>
  );
};
