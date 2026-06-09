import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Cpu } from 'lucide-react';
import { missionsData } from '../../data/missions';
import { MagneticButton } from '../ui/MagneticButton';

export const MissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!pageRef.current || !headerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.2 }
      );

      // Cards Staggered Animation
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out',
          delay: 0.5 
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#eef2f5] text-gray-900 pt-32 pb-24 px-6 md:px-12 selection:bg-[#2563EB] selection:text-white relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2563EB]/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Navigation / Back Button */}
        <div className="mb-16">
          <MagneticButton className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors group cursor-pointer">
            <div onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-xs tracking-widest uppercase">Return to Base</span>
            </div>
          </MagneticButton>
        </div>

        {/* Header Section */}
        <div ref={headerRef} className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-[#2563EB]" />
            <span className="text-xs font-mono tracking-[0.4em] text-[#2563EB] uppercase font-bold">
              Global Operations
            </span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-8">
            Mission <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400">
              Archive
            </span>
          </h1>
          <p className="text-gray-600 font-mono text-sm max-w-2xl leading-relaxed border-l border-gray-300 pl-4">
            A comprehensive overview of our active, completed, and developmental aerospace projects. 
            Pushing the boundaries of miniaturized satellites and high-altitude systems.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {missionsData.map((mission, index) => (
            <div
              key={mission.id}
              ref={el => { cardsRef.current[index] = el; }}
              onClick={() => {
                if (mission.route) {
                  navigate(mission.route);
                }
              }}
              className={`group relative rounded-3xl overflow-hidden bg-white border border-gray-200 transition-all duration-500 hover:border-blue-200 hover:shadow-xl ${mission.route ? 'cursor-pointer' : ''}`}
            >
              {/* Card Image Wrapper */}
              <div className="relative h-[250px] overflow-hidden">
                <img 
                  src={mission.image} 
                  alt={mission.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/80 backdrop-blur-md border border-white/40 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <Cpu size={12} className="text-gray-700" />
                    <span className="text-[9px] font-mono tracking-widest text-gray-900 uppercase font-bold">{mission.category}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/40 px-3 py-1.5 rounded-full">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${mission.statusColor}`} />
                  <span className={`text-[9px] font-mono tracking-widest uppercase font-bold ${mission.statusColor}`}>
                    {mission.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 relative">
                
                {/* Number / Date */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-gray-500 tracking-widest">
                    M-{mission.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                    {mission.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-orbitron text-2xl font-bold text-gray-900 mb-3 tracking-wide uppercase group-hover:text-[#2563EB] transition-colors">
                  {mission.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3">
                  {mission.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                  {mission.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mb-1">{stat.label}</div>
                      <div className="font-orbitron text-base text-gray-900 font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Hover Reveal Action */}
                {mission.route && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                )}
                
                {mission.route && (
                  <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg">
                      <ArrowLeft size={16} className="rotate-135 -scale-x-100" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
