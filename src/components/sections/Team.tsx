import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, Mail, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type TeamCategory = 'advisors' | 'current' | 'alumni';

const teamData = {
  advisors: [
    { name: 'Dr. John Doe', role: 'Faculty Advisor', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Dr. Jane Smith', role: 'Aerospace Consultant', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop' },
  ],
  current: [
    { name: 'Alex Johnson', role: 'Team Lead', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Sarah Lee', role: 'Lead Avionics Engineer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop' },
    { name: 'Michael Chen', role: 'Structures Head', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Emily Davis', role: 'Recovery Systems', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop' },
  ],
  alumni: [
    { name: 'David Wilson', role: 'Former Team Lead (2022)', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Jessica Brown', role: 'Propulsion (2021)', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop' },
  ]
};

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<TeamCategory>('current');

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.team-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate grid on tab change
  useEffect(() => {
    gsap.fromTo(
      '.team-member-card',
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
    );
  }, [activeTab]);

  return (
    <section id="team" ref={sectionRef} className="py-24 relative z-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="team-header mb-16 text-center flex flex-col items-center">
          <span className="text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase mb-4 block">
            03 // Personnel
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gray-900 tracking-tight uppercase">
            Meet the Team
          </h2>
          <div className="w-16 h-[3px] bg-[#2563EB] mt-6 mb-10" />
          
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            The brilliant minds behind BRACU Diganta. Our multidisciplinary team is united by a shared passion for aerospace engineering and exploration.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-full flex gap-1">
            {(['advisors', 'current', 'alumni'] as TeamCategory[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-mono tracking-widest uppercase transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-sm font-bold' 
                    : 'text-gray-500 hover:text-gray-700 font-medium'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
          {teamData[activeTab].map((member, idx) => (
            <div key={`${activeTab}-${idx}`} className="team-member-card group">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-5 bg-gray-100">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                  <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#2563EB] hover:text-white transition-colors border border-white/30">
                    <Link size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#2563EB] hover:text-white transition-colors border border-white/30">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              
              <div className="text-center px-2">
                <h3 className="font-orbitron text-xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-1 group-hover:text-[#2563EB] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-mono tracking-wider text-gray-500 uppercase">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recruitment CTA */}
        {activeTab === 'current' && (
          <div className="mt-16 text-center team-member-card flex flex-col items-center">
            <div className="inline-flex items-center gap-3 bg-[#eef2f5] px-6 py-3 rounded-full cursor-pointer hover:bg-gray-200 transition-colors group">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-gray-900 font-semibold uppercase">
                Recruitments Open
              </span>
              <ArrowUpRight size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
