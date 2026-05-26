import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const teamHierarchy = {
  advisors: [
    { name: 'Dr. John Doe', role: 'Faculty Advisor', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Dr. Jane Smith', role: 'Aerospace Consultant', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop' },
  ],
  lead: { name: 'Alex Johnson', role: 'Team Lead', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' },
  core: [
    { name: 'Sarah Lee', role: 'Lead Avionics', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
    { name: 'Michael Chen', role: 'Structures Head', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Emily Davis', role: 'Recovery Systems', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop' },
  ],
  alumni: [
    { name: 'David Wilson', role: 'Former Team Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Jessica Brown', role: 'Propulsion', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop' },
  ]
};

// Data map containing responsive X/Y coordinates for the HUD Network Constellation
const nodesData = [
  // 0: Advisor 1
  { ...teamHierarchy.advisors[0], type: 'advisor', size: 'w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40', xb: '25%', yb: '15%', xd: '35%', yd: '20%' },
  // 1: Advisor 2
  { ...teamHierarchy.advisors[1], type: 'advisor', size: 'w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40', xb: '75%', yb: '15%', xd: '65%', yd: '20%' },
  // 2: Lead (Massive Center)
  { ...teamHierarchy.lead,        type: 'lead',    size: 'w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80', xb: '50%', yb: '45%', xd: '50%', yd: '50%' },
  // 3: Core 1
  { ...teamHierarchy.core[0],     type: 'core',    size: 'w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48', xb: '15%', yb: '65%', xd: '20%', yd: '50%' },
  // 4: Core 2
  { ...teamHierarchy.core[1],     type: 'core',    size: 'w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48', xb: '85%', yb: '65%', xd: '80%', yd: '50%' },
  // 5: Core 3
  { ...teamHierarchy.core[2],     type: 'core',    size: 'w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48', xb: '50%', yb: '75%', xd: '50%', yd: '80%' },
  // 6: Alumni 1
  { ...teamHierarchy.alumni[0],   type: 'alumni',  size: 'w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32', xb: '30%', yb: '90%', xd: '30%', yd: '80%' },
  // 7: Alumni 2
  { ...teamHierarchy.alumni[1],   type: 'alumni',  size: 'w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32', xb: '70%', yb: '90%', xd: '70%', yd: '80%' },
];

// Which node indexes connect to each other to draw the SVG lines sequentially via tiers
const connections = [
  { from: 2, to: 0, tier: 1 }, { from: 2, to: 1, tier: 1 }, // Lead -> Advisors
  { from: 2, to: 3, tier: 1 }, { from: 2, to: 4, tier: 1 }, { from: 2, to: 5, tier: 1 }, // Lead -> Core
  { from: 3, to: 6, tier: 2 }, { from: 4, to: 7, tier: 2 }, // Core -> Alumni
  { from: 5, to: 6, tier: 2 }, { from: 5, to: 7, tier: 2 }  // Core3 -> Both Alumni
];

const octagonClip = 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)';

const NetworkNode = ({ node }: { node: any }) => (
  <div 
    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 hover:z-50 cursor-crosshair ${node.size} node-position node-${node.type}`}
    style={{ '--xb': node.xb, '--yb': node.yb, '--xd': node.xd, '--yd': node.yd } as React.CSSProperties}
  >
    {/* Octagon Avatar Node (Light Theme - GPU Optimized) */}
    <div 
      className="w-full h-full relative p-1 bg-gradient-to-br from-blue-200 via-white to-transparent transition-transform duration-300 group-hover:scale-110 shadow-[0_10px_30px_rgba(59,130,246,0.15)] group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)]" 
      style={{ clipPath: octagonClip, willChange: 'transform, box-shadow' }}
    >
       <img 
         src={node.image} 
         alt={node.name}
         className="w-full h-full object-cover" 
         style={{ clipPath: octagonClip }} 
       />
       {/* Simple overlay, removed heavy scanner animation to ensure smoothness */}
       <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>

    {/* Permanently Visible Text Info Below Node */}
    <div className="absolute top-[105%] flex flex-col items-center w-[250%] text-center pointer-events-none transition-transform duration-300 group-hover:translate-y-2">
       {/* Solid pill background to avoid heavy backdrop-blur repaints */}
       <div className="bg-white px-3 py-1 rounded-full shadow-sm mb-1 border border-blue-100">
         <p className="text-blue-600 font-mono text-[8px] md:text-[10px] tracking-widest uppercase font-bold">
           {node.role}
         </p>
       </div>
       <h3 className="text-slate-900 font-orbitron font-black text-[10px] md:text-sm uppercase tracking-wider drop-shadow-sm">
         {node.name}
       </h3>
    </div>
  </div>
);

const SvgLines = ({ isDesktop }: { isDesktop: boolean }) => (
  <svg className={`absolute inset-0 w-full h-full pointer-events-none ${isDesktop ? 'hidden md:block' : 'block md:hidden'}`}>
    {connections.map((conn, i) => (
      <React.Fragment key={i}>
        {/* Base connecting line (Draws sequentially on scroll via strokeDashoffset) */}
        <line 
          x1={nodesData[conn.from][isDesktop ? 'xd' : 'xb']}
          y1={nodesData[conn.from][isDesktop ? 'yd' : 'yb']}
          x2={nodesData[conn.to][isDesktop ? 'xd' : 'xb']}
          y2={nodesData[conn.to][isDesktop ? 'yd' : 'yb']}
          className={`stroke-blue-200 data-line line-tier-${conn.tier}`}
          strokeWidth="2"
        />
        {/* Glowing pulse that travels along the line (Filter removed for 60fps performance) */}
        <line 
          x1={nodesData[conn.from][isDesktop ? 'xd' : 'xb']}
          y1={nodesData[conn.from][isDesktop ? 'yd' : 'yb']}
          x2={nodesData[conn.to][isDesktop ? 'xd' : 'xb']}
          y2={nodesData[conn.to][isDesktop ? 'yd' : 'yb']}
          className="stroke-blue-500 pulse-line"
          strokeWidth="3"
          strokeDasharray="15 150"
          style={{ willChange: 'stroke-dashoffset' }}
        />
      </React.Fragment>
    ))}
  </svg>
);

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      
      // Setup initial states to be completely hidden before the scroll sequence begins
      gsap.set('.data-line', { strokeDasharray: 2000, strokeDashoffset: 2000 });
      gsap.set('.node-position', { scale: 0, opacity: 0 });
      gsap.set('.pulse-line', { opacity: 0 });

      // Create scroll-linked timeline (Pins the section and builds the network perfectly in sync with the scrollbar)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2500', // Forces user to scroll 2500px to play out the cinematic animation
          scrub: 1, // 1-second smoothing perfectly locks to user scroll physics
          pin: true,
        }
      });

      // 1. Reveal Lead at the center
      tl.to('.node-lead', { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' });

      // 2. Draw first layer lines (Lead -> Advisors/Core)
      tl.to('.line-tier-1', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, '-=0.5');

      // 3. Reveal Advisors and Core exactly when the lines reach them
      tl.to('.node-advisor, .node-core', { scale: 1, opacity: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.5)' }, '-=1');

      // 4. Draw second layer lines (Core -> Alumni)
      tl.to('.line-tier-2', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, '-=0.5');

      // 5. Reveal Alumni
      tl.to('.node-alumni', { scale: 1, opacity: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.5)' }, '-=1');

      // 6. Fade in continuous pulse lines
      tl.to('.pulse-line', { opacity: 1, duration: 0.5 }, '-=0.2');

      // Independent continuous pulse loop (runs seamlessly in the background)
      gsap.to('.pulse-line', {
        strokeDashoffset: -165,
        duration: 2.5,
        repeat: -1,
        ease: 'none',
        stagger: 0.3
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="bg-slate-50 min-h-screen py-24 relative overflow-hidden flex items-center justify-center">
      
      {/* CSS variable mapping for responsive absolute positioning */}
      <style>{`
        .node-position { left: var(--xb); top: var(--yb); }
        @media (min-width: 768px) { .node-position { left: var(--xd); top: var(--yd); } }
      `}</style>
      
      {/* Light Space Background Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 pointer-events-none" />
      
      {/* Massive Cinematic Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h1 className="font-orbitron font-black text-[12vw] text-slate-900 whitespace-nowrap tracking-tighter">
          CONSTELLATION
        </h1>
      </div>

      <div className="relative w-full h-[85vh] max-h-[1100px] min-h-[700px] max-w-[100rem] mx-auto z-10">
         
         {/* Top Center Title */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center mt-4 md:mt-0 z-20">
           <span className="text-blue-600 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold block mb-2">
             03 // Strategic Deployment
           </span>
           <h2 className="font-orbitron text-3xl md:text-5xl text-slate-900 font-black tracking-widest uppercase drop-shadow-sm">
             Command Map
           </h2>
         </div>

         {/* SVG Network Lines (Separated for Mobile/Desktop coordinates) */}
         <SvgLines isDesktop={false} />
         <SvgLines isDesktop={true} />

         {/* Render All 8 Avatar Nodes */}
         {nodesData.map((node, i) => (
           <NetworkNode key={i} node={node} />
         ))}

      </div>
    </section>
  );
};
