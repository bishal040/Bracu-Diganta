import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useTheme } from '../../App';

gsap.registerPlugin(ScrollTrigger);

const advisors = [
  { name: 'Dr. John Doe', role: 'Faculty Advisor', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
  { name: 'Dr. Jane Smith', role: 'Aerospace Consultant', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
];

const leadership = [
  { name: 'Alex Johnson', role: 'Team Lead', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' },
];

const coreTeam = [
  { name: 'Sarah Lee', role: 'Lead Avionics', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop' },
  { name: 'Michael Chen', role: 'Structures Head', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Emily Davis', role: 'Recovery Systems', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' },
  { name: 'David Wilson', role: 'Propulsion Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { name: 'Jessica Brown', role: 'Ground Control', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Ryan Park', role: 'Software Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
];

interface MemberCardProps {
  name: string;
  role: string;
  image: string;
  size?: 'lg' | 'md';
}

const MemberCard: React.FC<MemberCardProps> = ({ name, role, image, size = 'md' }) => {
  const imgSize = size === 'lg' ? 'w-28 h-28 md:w-32 md:h-32' : 'w-20 h-20 md:w-24 md:h-24';
  return (
    <div className="team-member flex flex-col items-center text-center group">
      <div className={`${imgSize} overflow-hidden mb-4 border border-black/20 dark:border-white/20 group-hover:border-black dark:group-hover:border-white transition-all duration-300 relative`}>
        <div className="absolute inset-0 bg-white/20 dark:bg-black/40 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors" />
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover grayscale opacity-80 dark:opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
      </div>
      <h3 className="font-bold text-black dark:text-white text-sm md:text-base uppercase tracking-wider">{name}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] mt-1">{role}</p>
    </div>
  );
};

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.team-member', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="bg-transparent py-24 md:py-32 relative overflow-hidden border-t border-black/10 dark:border-white/20">
      
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase font-bold mb-4 block">Personnel</span>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase mb-6">
            The Engineers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-mono leading-relaxed max-w-2xl mx-auto">
            50+ dedicated students from BRAC University working across avionics, structures, propulsion, recovery, and ground control systems.
          </p>
        </div>

        {/* Advisors */}
        <div className="mb-16">
          <p className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase mb-8 text-center font-bold">Faculty Advisors</p>
          <div className="flex justify-center gap-12 md:gap-20">
            {advisors.map((member) => (
              <MemberCard key={member.name} {...member} size="lg" />
            ))}
          </div>
        </div>

        <div className="w-px h-16 bg-black/10 dark:bg-white/10 mx-auto mb-16" />

        {/* Team Lead */}
        <div className="mb-16">
          <p className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase mb-8 text-center font-bold">Team Lead</p>
          <div className="flex justify-center">
            {leadership.map((member) => (
              <MemberCard key={member.name} {...member} size="lg" />
            ))}
          </div>
        </div>

        <div className="w-px h-16 bg-black/10 dark:bg-white/10 mx-auto mb-16" />

        {/* Core Team */}
        <div>
          <p className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase mb-8 text-center font-bold">Core Engineering Team</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 md:gap-6">
            {coreTeam.map((member) => (
              <MemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-20 border border-black/10 dark:border-white/10 p-4 text-center bg-white/40 dark:bg-black/40 backdrop-blur-sm max-w-sm mx-auto">
          <p className="text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase tracking-widest">
            + 40 additional engineers across all sub-teams
          </p>
        </div>

      </div>
    </section>
  );
};
