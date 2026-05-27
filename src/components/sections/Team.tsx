import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Base data
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

// Flattened data with responsive CSS Grid assignments (Bento Box style)
const crewData = [
  { ...teamHierarchy.advisors[0], col: 'col-span-12 md:col-span-6 lg:col-span-6', height: 'h-[300px]', tier: 'LVL-5 // ADVISOR' },
  { ...teamHierarchy.advisors[1], col: 'col-span-12 md:col-span-6 lg:col-span-6', height: 'h-[300px]', tier: 'LVL-5 // ADVISOR' },
  { ...teamHierarchy.lead,        col: 'col-span-12 md:col-span-12 lg:col-span-4', height: 'h-[400px]', tier: 'LVL-4 // COMMAND' },
  { ...teamHierarchy.core[0],     col: 'col-span-12 md:col-span-6 lg:col-span-4',  height: 'h-[400px]', tier: 'LVL-3 // CORE' },
  { ...teamHierarchy.core[1],     col: 'col-span-12 md:col-span-6 lg:col-span-4',  height: 'h-[400px]', tier: 'LVL-3 // CORE' },
  { ...teamHierarchy.core[2],     col: 'col-span-12 md:col-span-12 lg:col-span-6', height: 'h-[300px]', tier: 'LVL-3 // CORE' },
  { ...teamHierarchy.alumni[0],   col: 'col-span-12 md:col-span-6 lg:col-span-3',  height: 'h-[300px]', tier: 'LVL-X // ALUMNI' },
  { ...teamHierarchy.alumni[1],   col: 'col-span-12 md:col-span-6 lg:col-span-3',  height: 'h-[300px]', tier: 'LVL-X // ALUMNI' },
];

// Sci-Fi Chamfered corner clip-path
const sciFiClip = 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)';

const CrewCard = ({ member }: { member: typeof crewData[0] }) => (
  <div className={`crew-card ${member.col} ${member.height} relative group cursor-pointer`}>
    
    {/* Border Wrapper (creates a 1px border that perfectly follows the clip-path) */}
    <div 
      className="absolute inset-0 bg-slate-300 group-hover:bg-blue-500 transition-colors duration-500 z-0"
      style={{ clipPath: sciFiClip }}
    />
    
    {/* Inner Content Container */}
    <div 
      className="absolute inset-[1px] bg-slate-900 z-10 overflow-hidden"
      style={{ clipPath: sciFiClip }}
    >
      {/* Background Image */}
      <img 
        src={member.image} 
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />

      {/* Top Left Tier Badge */}
      <div className="absolute top-4 left-4 flex gap-2 items-center z-20 bg-slate-900/50 backdrop-blur-sm px-2 py-1 rounded">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        <span className="font-mono text-[9px] md:text-[10px] text-white/90 tracking-widest uppercase font-bold">
          {member.tier}
        </span>
      </div>

      {/* Top Right Tech Detail Icon */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <ArrowUpRight className="w-5 h-5 text-white" />
      </div>

      {/* Bottom Text Info */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end">
        <span className="block font-mono text-[10px] md:text-xs text-blue-400 font-bold tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-all duration-300 mb-1">
          {member.role}
        </span>
        <h3 className="font-orbitron font-black text-2xl md:text-3xl text-white uppercase tracking-wider">
          {member.name}
        </h3>
      </div>
      
      {/* Scanline overlay (subtle CRT effect) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] mix-blend-overlay z-10" />
      
    </div>
  </div>
);

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // Staggered entrance animation for all crew cards
      gsap.fromTo('.crew-card', 
        { opacity: 0, y: 100, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="bg-slate-50 min-h-screen py-32 relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply" />
      </div>
      
      {/* Massive Background Watermark */}
      <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.03] z-0">
        <h1 className="font-orbitron font-black text-[12vw] text-slate-900 tracking-tighter leading-none text-right">
          MISSION<br/>ROSTER
        </h1>
      </div>

      <div className="relative max-w-[90rem] mx-auto px-6 md:px-8 z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex gap-1 mb-4">
            <div className="w-2 h-2 bg-blue-600" />
            <div className="w-2 h-2 bg-blue-400" />
            <div className="w-2 h-2 bg-blue-200" />
          </div>
          <h2 className="font-orbitron text-4xl md:text-6xl text-slate-900 font-black tracking-widest uppercase drop-shadow-sm mb-2">
            Command Crew
          </h2>
          <p className="font-mono text-sm md:text-base text-slate-500 uppercase tracking-widest">
            // Active Personnel Deployment
          </p>
        </div>

        {/* The Bento Grid Container */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {crewData.map((member, i) => (
            <CrewCard key={i} member={member} />
          ))}
        </div>

      </div>
    </section>
  );
};
