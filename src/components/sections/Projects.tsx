import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BookOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'CanSat 2024',
    category: 'Competition / Payload',
    description: 'Design and deployment of a miniaturized satellite within a soda can format. The payload autonomously gathered atmospheric pressure, temperature, and GPS coordinates during its descent via an active auto-rotation mechanism.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    status: 'Completed',
    date: 'Spring 2024'
  },
  {
    id: 2,
    title: 'Project Aether',
    category: 'Research / Avionics',
    description: 'Next-generation flight computing cluster featuring machine learning algorithms for real-time descent trajectory prediction and autonomous correction mechanisms.',
    image: 'https://images.unsplash.com/photo-1541881329562-b91a539b7843?q=80&w=2070&auto=format&fit=crop',
    status: 'In Development',
    date: 'Fall 2024'
  },
  {
    id: 3,
    title: 'Strato-Balloon Telemetry',
    category: 'Outreach / Data',
    description: 'High-altitude balloon mission designed to test extreme cold weather operations of our new battery management system and long-range LoRaWAN communication module.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    status: 'Planning',
    date: 'Spring 2025'
  }
];

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.archive-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="projects" ref={sectionRef} className="py-24 relative z-10 bg-[#eef2f5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="archive-header flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <div>
            <span className="text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase mb-4 block">
              02 // Projects
            </span>
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gray-900 tracking-tight uppercase">
              Mission Archive
            </h2>
            <div className="w-16 h-[3px] bg-[#2563EB] mt-6" />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="hidden md:flex items-center gap-2 text-sm font-mono tracking-widest text-gray-500 hover:text-gray-900 uppercase transition-colors">
              View Technical Docs <BookOpen size={16} />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={prevProject}
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextProject}
                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden pb-12">
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projects.map((project, idx) => (
              <div key={project.id} className="w-full flex-shrink-0 px-4 md:px-0">
                <div className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center transition-opacity duration-700 ${currentIndex === idx ? 'opacity-100' : 'opacity-30'}`}>
                  
                  {/* Image Container */}
                  <div className="w-full md:w-1/2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl group">
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <span className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase font-semibold backdrop-blur-md border shadow-lg ${
                        project.status === 'Completed' ? 'bg-emerald-500/80 border-emerald-400 text-white' : 
                        project.status === 'In Development' ? 'bg-amber-500/80 border-amber-400 text-white' :
                        'bg-white/80 border-white text-gray-900'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {/* Decorative Target Brackets */}
                    <div className="absolute inset-6 border border-white/20 z-10 pointer-events-none rounded-xl">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-xs font-mono text-[#2563EB] uppercase tracking-widest font-bold bg-blue-100 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                      <span className="flex items-center gap-2 text-sm font-mono text-gray-500">
                        <Clock size={14} /> {project.date}
                      </span>
                    </div>
                    
                    <h3 className="font-orbitron text-4xl lg:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-4 group cursor-pointer">
                      {project.title}
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-md">
                        <ArrowUpRight className="text-[#2563EB]" size={24} />
                      </div>
                    </h3>
                    
                    <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-xl font-medium">
                      {project.description}
                    </p>
                    
                    <div className="mt-10 flex gap-4">
                       {projects.map((_, dotIdx) => (
                         <div 
                           key={dotIdx}
                           onClick={() => setCurrentIndex(dotIdx)}
                           className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                             dotIdx === currentIndex ? 'w-12 bg-[#2563EB]' : 'w-4 bg-gray-300 hover:bg-gray-400'
                           }`}
                         />
                       ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
