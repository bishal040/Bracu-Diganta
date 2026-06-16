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

const CrewCard = ({ member, layout, onClick }: CrewCardProps) => {
  // Collection of sci-fi/engineering quotes
  const quotes = [
    "Exploring the final frontier, one mission at a time.",
    "Innovation happens when we push past the atmosphere.",
    "Engineering the future of autonomous telemetry.",
    "Our designs are forged in the fires of reentry.",
    "Every payload is a step closer to the stars.",
    "Defying gravity through rigorous testing and sheer will.",
    "Precision in manufacturing means survival in orbit.",
    "Space is not a void, it's a canvas for our engineering.",
  ];
  
  // Stable random index based on name so it stays consistent
  const quoteIndex = member.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length;
  const quote = quotes[quoteIndex];

  return (
  <div onClick={onClick} className={`crew-card ${layout.col} ${layout.height} absolute inset-0 w-full md:relative md:inset-auto md:w-auto group cursor-pointer`}>
    
    {/* Image / Main Card Container (shrinks slightly on mobile to leave space below, but stays large) */}
    <div className="relative w-full h-[480px] md:h-full">
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



        {/* Top Right Tech Detail Icon */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <ArrowUpRight className="w-5 h-5 text-white drop-shadow-sm" />
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end transition-all duration-300 transform group-hover:-translate-y-2">
          <span className="block font-mono text-[10px] md:text-xs text-blue-300 font-bold tracking-[0.2em] uppercase mb-1">
            {member.role || 'CREW MEMBER'}
          </span>
          <h3 className="font-orbitron font-black text-2xl md:text-3xl text-white uppercase tracking-wider mb-2 group-hover:text-blue-400 transition-colors">
            {member.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {member.linkedin && member.linkedin !== "N/A" && member.linkedin !== "" && (
              <a 
                href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            )}
            {member.facebook && member.facebook !== "N/A" && member.facebook !== "" && (
              <a 
                href={member.facebook.startsWith('http') ? member.facebook : `https://${member.facebook}`} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Only: Random Quote Area utilizing the bottom space */}
    <div className="absolute top-[500px] left-0 w-full md:hidden flex flex-col justify-start items-center px-6 text-center z-10">
      <span className="text-[#2563EB] text-6xl font-serif leading-none mb-2 opacity-30">"</span>
      <p className="font-serif text-lg md:text-xl text-slate-700 italic leading-relaxed">
        {quote}
      </p>
    </div>

  </div>
)};

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(null);
  
  // Get 2026 data for the home page showcase
  const currentYearData = teamData.find(d => d.year === '2026') || teamData[0];
  
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
    { col: "col-span-12 md:col-span-8", height: "h-full md:h-[400px]" },
    { col: "col-span-12 md:col-span-4", height: "h-full md:h-[400px]" },
    { col: "col-span-12 md:col-span-4", height: "h-full md:h-[300px]" },
    { col: "col-span-12 md:col-span-4", height: "h-full md:h-[300px]" },
    { col: "col-span-12 md:col-span-4", height: "h-full md:h-[300px]" },
    { col: "col-span-12 md:col-span-4", height: "h-full md:h-[350px]" },
    { col: "col-span-12 md:col-span-8", height: "h-full md:h-[350px]" },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop: Elegant staggered reveal
      mm.add("(min-width: 768px)", () => {
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
      });

      // Mobile: Pinned Swap Animation
      mm.add("(max-width: 767px)", () => {
        const cards = gsap.utils.toArray('.crew-card') as HTMLElement[];
        
        // Initial setup for the stack
        cards.forEach((card, i) => {
          if (i === 0) {
            gsap.set(card, { opacity: 1, xPercent: 0, rotation: 0, scale: 1, zIndex: 20 });
          } else {
            const isEven = i % 2 === 0;
            gsap.set(card, { opacity: 0, xPercent: isEven ? 100 : -100, rotation: isEven ? 10 : -10, scale: 0.8, zIndex: 20 - i });
          }
        });

        // Pinned container timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.crew-grid-container',
            start: 'top 20%', // Pin slightly below the header
            end: `+=${cards.length * 80}%`, // Scroll distance proportional to cards
            pin: true,
            scrub: 1,
          }
        });

        // Sequence the swaps
        cards.forEach((card, i) => {
          if (i > 0) {
            const isEven = i % 2 === 0;
            const prevCard = cards[i - 1];

            // Add a brief pause so users can actually see each card
            tl.add(`swap${i}`, "+=0.3");

            // Slide previous card out
            tl.to(prevCard, {
              xPercent: isEven ? -120 : 120, // Fly out opposite direction
              rotation: isEven ? -15 : 15,
              opacity: 0,
              scale: 0.8,
              ease: 'power2.inOut',
              duration: 1
            }, `swap${i}`);

            // Slide new card in
            tl.to(card, {
              xPercent: 0,
              rotation: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              duration: 1
            }, `swap${i}`);
          }
        });
      });
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
        <div className="crew-grid-container relative h-[650px] md:h-auto block md:grid grid-cols-12 gap-4 md:gap-6 mb-16">
          {crewData.map((member, i) => (
            <CrewCard 
              key={i} 
              member={member} 
              layout={bentoLayouts[i % bentoLayouts.length]} 
              onClick={() => setSelectedMember(member)} 
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            to="/team" 
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-mono text-xs md:text-sm font-bold tracking-[0.2em] text-slate-900 uppercase bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
          >
            <span className="relative z-10 flex items-center gap-3">
              View All Crew History
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </Link>

          <Link 
            to="/careers"
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-mono text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase bg-[#2563eb] overflow-hidden shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_50px_rgba(37,99,235,0.5)] transition-all duration-300 cursor-pointer"
            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
          >
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-[shimmer_1.5s_linear_infinite]" />
            <span className="relative z-10 flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Join the Crew
            </span>
          </Link>
        </div>

      </div>
      
      {/* Central Modal Dialog */}
      <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </section>
  );
};
