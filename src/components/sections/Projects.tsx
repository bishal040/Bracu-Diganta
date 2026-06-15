import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Target, Activity } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

import { missionsData as projects } from '../../data/missions';
export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initial Section Reveal and Pinning
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Header reveal animation
      gsap.fromTo(
        '.archive-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      );

      // Pin the section to create a pause for exploration
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%', // Pause for 1 viewport height of scrolling
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animate content inside the active card
  useEffect(() => {
    const activeContent = contentRefs.current[activeIndex];
    if (!activeContent) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-item', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.3 }
      );
    }, activeContent);

    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <section id="projects" ref={sectionRef} className="py-12 md:py-24 relative z-10 bg-[#eef2f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="archive-header flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-4 md:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="w-8 h-[1px] bg-[#2563EB]" />
              <span className="text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase font-semibold">
                02 // Mission Archive
              </span>
            </div>
            <h2 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Project <br /> Showcase
            </h2>
          </div>
          
          <MagneticButton className="hidden md:flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 rounded-full text-sm font-semibold transition-all">
            <button onClick={() => { navigate('/missions'); window.scrollTo(0, 0); }} className="flex items-center gap-3">
              View All Missions <ArrowUpRight size={16} />
            </button>
          </MagneticButton>
        </div>

        {/* Expanding Cards Layout */}
        <div className="w-full h-[80vh] md:h-[70vh] lg:h-[600px] flex flex-col lg:flex-row gap-3 md:gap-4 pb-4 md:pb-0">
          {projects.map((project, index) => {
            const isActive = activeIndex === index;
            
            return (
              <div 
                key={project.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  setActiveIndex(index);
                  if (project.route) {
                    navigate(project.route);
                    window.scrollTo(0, 0);
                  }
                }}
                className={`group relative overflow-hidden rounded-[2rem] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer
                  ${isActive ? 'lg:flex-[3] flex-[4] shadow-2xl' : 'lg:flex-[1] flex-[1] grayscale-[50%] hover:grayscale-0'}`}
              >
                {/* Background Image */}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Dark Overlays */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent lg:via-[#0a0a0c]/60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-transparent hidden lg:block" />
                </div>

                {/* --- INACTIVE STATE CONTENT (Vertical Title) --- */}
                <div className={`absolute inset-0 flex flex-col justify-end lg:justify-center items-center pb-8 lg:pb-0 transition-opacity duration-500 delay-100 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="lg:-rotate-90 flex items-center gap-4">
                    <span className="text-[10px] font-mono tracking-widest text-[#2563EB] font-bold">
                      0{index + 1}
                    </span>
                    <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white whitespace-nowrap tracking-widest uppercase">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* --- ACTIVE STATE CONTENT --- */}
                <div 
                  ref={el => { contentRefs.current[index] = el; }}
                  className={`absolute inset-0 p-4 md:p-8 lg:p-12 flex flex-col justify-end transition-opacity duration-500 ${isActive ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none'}`}
                >
                  
                  {/* Top Meta Data */}
                  <div className="reveal-item flex items-center gap-3 mb-auto">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-white">
                      <Activity size={14} className="text-[#2563EB]" />
                      <span className="text-[9px] md:text-[10px] font-mono tracking-widest">SYS.ONLINE</span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="max-w-2xl mt-auto">
                    
                    <div className="reveal-item flex items-center gap-3 mb-2 md:mb-4">
                      <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-[#2563EB] uppercase font-bold">
                        {project.category}
                      </span>
                      <div className="w-8 h-[1px] bg-gray-600" />
                      <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                        {project.date}
                      </span>
                    </div>
                    
                    <h3 className="reveal-item font-orbitron text-2xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 uppercase tracking-tighter leading-none">
                      {project.title}
                    </h3>
                    
                    <p className="reveal-item text-gray-300 text-xs md:text-base leading-relaxed mb-4 md:mb-8 max-w-lg hidden md:block">
                      {project.description}
                    </p>

                    <div className="reveal-item flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 justify-between border-t border-gray-800/60 pt-3 md:pt-6">
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 md:gap-8">
                        {project.stats.map((stat, idx) => (
                          <div key={idx} className="border-l-2 border-[#2563EB]/50 pl-3">
                            <div className="text-[9px] font-mono text-gray-500 tracking-widest uppercase mb-1">{stat.label}</div>
                            <div className="font-orbitron text-lg text-white font-semibold">{stat.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Status & Action */}
                      <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ color: project.statusColor }} />
                          <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${project.statusColor}`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (project.route) {
                              navigate(project.route);
                              window.scrollTo(0, 0);
                            }
                          }}
                          className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                        >
                          <ArrowUpRight size={16} />
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
                
                {/* Decorative Target crosshairs on Active */}
                {isActive && (
                  <div className="absolute top-8 right-8 pointer-events-none hidden lg:block">
                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-1 border-t-2 border-r-2 border-[#2563EB]/60 rounded-full animate-spin-slow" />
                      <Target size={16} className="text-[#2563EB]/80" />
                    </div>
                  </div>
                )}
                
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
