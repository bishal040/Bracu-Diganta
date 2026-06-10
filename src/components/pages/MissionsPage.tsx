import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Cpu, Rocket } from 'lucide-react';
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
        { opacity: 0, y: 80, rotationX: 15 },
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          duration: 1, 
          stagger: 0.15, 
          ease: 'power3.out',
          delay: 0.4 
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#f4f7fb] text-slate-900 pt-32 pb-24 px-6 md:px-12 selection:bg-blue-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-cyan-400/10 blur-[120px] rounded-full mix-blend-multiply" />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Navigation / Back Button */}
        <div className="mb-16 mt-8">
          <MagneticButton className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer bg-white px-6 py-3 rounded-full border border-slate-200/60 shadow-sm backdrop-blur-md">
            <div onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-xs tracking-widest uppercase font-semibold">Return to Base</span>
            </div>
          </MagneticButton>
        </div>

        {/* Header Section */}
        <div ref={headerRef} className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="text-blue-600" size={20} />
              <span className="text-xs font-mono tracking-[0.4em] text-blue-600 uppercase font-bold">
                Global Operations
              </span>
            </div>
            <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-6">
              Mission <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-slate-800">
                Archive
              </span>
            </h1>
          </div>
          <p className="text-slate-600 font-mono text-sm max-w-md leading-relaxed border-l-2 border-blue-500/30 pl-6 pb-2">
            A comprehensive overview of our active, completed, and developmental aerospace projects. 
            Pushing the boundaries of miniaturized satellites and high-altitude systems.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missionsData.map((mission, index) => (
            <div
              key={mission.id}
              ref={el => { cardsRef.current[index] = el; }}
              onClick={() => {
                if (mission.route) {
                  navigate(mission.route);
                }
              }}
              className={`group relative rounded-3xl overflow-hidden bg-white/70 border border-slate-200/50 transition-all duration-500 hover:bg-white hover:border-blue-400/50 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:-translate-y-1 ${mission.route ? 'cursor-pointer' : ''} backdrop-blur-md flex flex-col`}
            >
              {/* Card Image Wrapper */}
              <div className="relative h-[280px] overflow-hidden p-3">
                <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-sm">
                  <img 
                    src={mission.image} 
                    alt={mission.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                      <Cpu size={12} className="text-blue-600" />
                      <span className="text-[9px] font-mono tracking-widest text-slate-800 uppercase font-bold">{mission.category}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-sm">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${mission.statusColor}`} />
                    <span className={`text-[9px] font-mono tracking-widest uppercase font-bold ${mission.statusColor}`}>
                      {mission.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 pt-4 flex-grow flex flex-col relative z-10">
                
                {/* Number / Date */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-mono text-slate-500 tracking-widest bg-slate-100 px-2 py-1 rounded">
                    M-{mission.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-blue-600/80 tracking-widest uppercase font-bold">
                    {mission.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-orbitron text-2xl font-bold text-slate-900 mb-4 tracking-wide uppercase group-hover:text-blue-600 transition-colors">
                  {mission.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3 flex-grow">
                  {mission.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                  {mission.stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase mb-1">{stat.label}</div>
                      <div className="font-orbitron text-base text-slate-900 font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Hover Reveal Action */}
                {mission.route && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

