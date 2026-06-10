import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { teamData, type TeamMember as TeamMemberType } from '../../data/team';
import { TeamMemberModal } from '../ui/TeamMemberModal';

gsap.registerPlugin(ScrollTrigger);

// Sci-Fi Chamfered corner clip-path
const sciFiClip = 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)';

// Add layout prop for bento grid since it was removed from data
interface CrewCardProps {
  member: TeamMemberType;
  layout: { col: string; height: string };
  onClick: () => void;
}

const CrewCard = ({ member, layout, onClick }: CrewCardProps) => (
  <div onClick={onClick} className={`crew-card ${layout.col} ${layout.height} relative group cursor-pointer`}>
    
    {/* Border Wrapper (creates a 1px border that perfectly follows the clip-path) */}
    <div 
      className="absolute inset-0 bg-blue-200 group-hover:bg-blue-400 transition-colors duration-500 z-0"
      style={{ clipPath: sciFiClip }}
    />
    
    {/* Inner Content Container */}
    <div 
      className="absolute inset-[1px] bg-white z-10 overflow-hidden"
      style={{ clipPath: sciFiClip }}
    >
      {/* Background Image */}
      <img 
        src={member.image} 
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none transition-all duration-500 group-hover:from-black/70 group-hover:via-black/30" />

      {/* Top Left Tier Badge (replacing dynamic tier with COMMAND CREW to match old aesthetic) */}
      <div className="absolute top-4 left-4 flex gap-2 items-center z-20 bg-white/10 border border-white/20 backdrop-blur-md px-2 py-1 rounded shadow-sm">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
        <span className="font-mono text-[9px] md:text-[10px] text-white tracking-widest uppercase font-bold">
          COMMAND CREW
        </span>
      </div>

      {/* Top Right Tech Detail Icon */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <ArrowUpRight className="w-5 h-5 text-white drop-shadow-sm" />
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end transition-all duration-300 transform group-hover:-translate-y-2">
        <span className="block font-mono text-[10px] md:text-xs text-blue-300 font-bold tracking-[0.2em] uppercase mb-1">
          {member.role}
        </span>
        <h3 className="font-orbitron font-black text-2xl md:text-3xl text-white uppercase tracking-wider mb-2">
          {member.name}
        </h3>
      </div>
    </div>
  </div>
);

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(null);
  
  // Get 2024 data for the home page showcase
  const currentYearData = teamData.find(d => d.year === '2024') || teamData[0];
  
  // Reconstruct a subset of crew for the Home page bento grid
  const crewData = [
    ...currentYearData.supervisors,
    ...currentYearData.advisors,
    ...currentYearData.teamLeads,
    ...currentYearData.subTeamLeads,
    ...currentYearData.teamMembers
  ].slice(0, 7);

  // Original Bento Layout Maps
  const bentoLayouts = [
    { col: "col-span-12 md:col-span-8", height: "h-[400px]" },
    { col: "col-span-12 md:col-span-4", height: "h-[400px]" },
    { col: "col-span-12 md:col-span-4", height: "h-[300px]" },
    { col: "col-span-12 md:col-span-4", height: "h-[300px]" },
    { col: "col-span-12 md:col-span-4", height: "h-[300px]" },
    { col: "col-span-12 md:col-span-4", height: "h-[350px]" },
    { col: "col-span-12 md:col-span-8", height: "h-[350px]" },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
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
            // Active Personnel Deployment ({currentYearData.year})
          </p>
        </div>

        {/* The Bento Grid Container */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 mb-16">
          {crewData.map((member, i) => (
            <CrewCard 
              key={i} 
              member={member} 
              layout={bentoLayouts[i % bentoLayouts.length]} 
              onClick={() => setSelectedMember(member)} 
            />
          ))}
        </div>

        {/* View All Crew CTA */}
        <div className="flex justify-center">
          <Link 
            to="/team" 
            className="group relative inline-flex items-center justify-center px-10 py-5 font-mono text-sm font-bold tracking-[0.2em] text-white uppercase bg-blue-600 overflow-hidden shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_50px_rgba(37,99,235,0.5)] transition-all duration-300"
            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
          >
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-[shimmer_1.5s_linear_infinite]" />
            <span className="relative z-10 flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              View All Crew History
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </Link>
        </div>

      </div>
      
      {/* Central Modal Dialog */}
      <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </section>
  );
};
