import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

const PROJECTS = [
  {
    year: "2024",
    name: "Diganta Mark IV",
    status: "Active",
    desc: "Next-generation modular CanSat featuring dual-redundant flight computers, autonomous parachute deployment, and a custom ground station protocol."
  },
  {
    year: "2023",
    name: "Diganta Mark III",
    status: "Completed",
    desc: "Achieved 99.8% telemetry recovery rate. Implemented custom 3D-printed chassis that survived 50G impact."
  },
  {
    year: "2022",
    name: "Diganta Mark II",
    status: "Completed",
    desc: "First successful deployment of our proprietary environmental sensing array, capturing high-resolution atmospheric data."
  }
];

export const Projects: React.FC = () => {
  return (
    <SectionReveal id="projects" className="relative z-10">
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-telemetry-cyan" />
            <span className="text-telemetry-cyan font-mono tracking-widest text-sm uppercase">Missions</span>
            <div className="h-[2px] w-8 bg-telemetry-cyan" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Flight Hardware</h2>
        </div>
        
        <div className="relative border-l border-gray-200 ml-4 md:ml-0 md:pl-0 space-y-12">
          {PROJECTS.map((project, idx) => (
            <div key={idx} className="relative group md:flex md:items-center md:justify-between md:gap-8">
              {/* Timeline indicator for desktop */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white bg-gray-300 group-hover:scale-150 transition-transform duration-300 z-10" />
              {project.status === 'Active' && (
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-[-48px] w-[1px] bg-gradient-to-b from-telemetry-cyan to-transparent z-0" />
              )}
              {project.status === 'Active' && (
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white bg-telemetry-cyan group-hover:scale-150 transition-transform duration-300 z-10" />
              )}
              
              <div className={`md:w-[45%] ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 md:order-2'}`}>
                <h3 className="text-3xl font-bold mb-2">{project.name}</h3>
                <span className="text-gray-500 font-mono text-lg">{project.year}</span>
              </div>
              
              <div className={`md:w-[45%] ${idx % 2 === 0 ? 'md:order-2' : ''}`}>
                <GlassmorphismCard className="w-full">
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border ${
                      project.status === 'Active' 
                        ? 'border-telemetry-cyan text-telemetry-cyan bg-telemetry-cyan/10' 
                        : 'border-gray-200 text-gray-500 bg-gray-100'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-body text-gray-600">
                    {project.desc}
                  </p>
                </GlassmorphismCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
