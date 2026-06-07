import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckSquare, Clock, Zap } from 'lucide-react';
import { useTheme } from '../../App';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'CANSAT 2024',
    category: 'Competition Payload',
    description: 'Design and deployment of a miniaturized satellite within a soda can format. The payload autonomously gathered atmospheric pressure, temperature, and GPS coordinates during its descent.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    status: 'Mission Complete',
    statusIcon: CheckSquare,
    date: 'Spring 2024',
    stats: [
      { label: 'Apogee', value: '2,350 ft' },
      { label: 'Descent', value: '14 m/s' }
    ]
  },
  {
    id: 2,
    title: 'PROJECT AETHER',
    category: 'Research Avionics',
    description: 'Next-generation flight computing cluster featuring machine learning algorithms for real-time descent trajectory prediction and autonomous correction mechanisms.',
    image: 'https://images.unsplash.com/photo-1541881329562-b91a539b7843?q=80&w=2070&auto=format&fit=crop',
    status: 'In Development',
    statusIcon: Zap,
    date: 'Fall 2024',
    stats: [
      { label: 'Compute', value: 'Dual STM32' },
      { label: 'Telemetry', value: '915 MHz' }
    ]
  },
  {
    id: 3,
    title: 'STRATO NODE',
    category: 'High-Altitude Balloon',
    description: 'High-altitude balloon mission designed to test extreme cold weather operations of our new battery management system and long-range LoRaWAN communication module.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    status: 'Awaiting Launch',
    statusIcon: Clock,
    date: 'Spring 2025',
    stats: [
      { label: 'Target', value: '90K ft' },
      { label: 'Duration', value: '4 Hours' }
    ]
  }
];

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // const { isDark } = useTheme();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-24 relative z-10 bg-transparent border-t border-black/10 dark:border-white/20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase font-bold">
                Missions
              </span>
            </div>
            <h2 className="font-sans text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase">
              Project Showcase
            </h2>
          </div>
          
          <button className="hidden md:flex items-center gap-3 text-black dark:text-white font-mono text-xs tracking-widest uppercase hover:text-slate-500 dark:hover:text-slate-400 transition-colors">
            View All Missions <ArrowRight size={14} />
          </button>
        </div>

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const StatusIcon = project.statusIcon;
            
            return (
              <div 
                key={project.id}
                className="project-card bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden border border-black/10 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/5 transition-all duration-300 flex flex-col group relative shadow-sm dark:shadow-none"
              >
                {/* Image Header */}
                <div className="relative aspect-video overflow-hidden border-b border-black/10 dark:border-white/10">
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105 opacity-80 dark:opacity-60 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/20 dark:border-white/20 px-3 py-1 flex items-center gap-2 z-20">
                    <StatusIcon size={12} className="text-black dark:text-white" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-black dark:text-white">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-8 flex flex-col flex-1 relative z-10 bg-white/60 dark:bg-black/60">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase">
                      {project.category}
                    </span>
                    <span className="text-[10px] text-black dark:text-white font-mono tracking-widest uppercase">
                      {project.date}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-black dark:text-white mb-3 uppercase tracking-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-8 flex-1 font-mono">
                    {project.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-black/10 dark:border-white/10 pt-6">
                    {project.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
                        <span className="font-mono text-lg font-light text-black dark:text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
