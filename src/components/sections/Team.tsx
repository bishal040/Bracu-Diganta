import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

const TEAM_MEMBERS = [
  { name: "Abdullah Al Mahmud", role: "Team Lead", dept: "Robotics & Hardware" },
  { name: "Sarah Rahman", role: "Chief Engineer", dept: "Systems Integration" },
  { name: "Tahmid Hasan", role: "Software Lead", dept: "Flight Software" },
  { name: "Nadia Islam", role: "Avionics Lead", dept: "Electronics" },
  { name: "Farhan Ahmed", role: "Mechanical Lead", dept: "Aerospace Structures" },
  { name: "Raiyaan Hossain", role: "Ground Station Lead", dept: "Communications" },
];

export const Team: React.FC = () => {
  return (
    <SectionReveal id="team" className="relative">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-telemetry-cyan" />
            <span className="text-telemetry-cyan font-mono tracking-widest text-sm uppercase">Crew</span>
            <div className="h-[2px] w-8 bg-telemetry-cyan" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight text-center">The Engineering Team</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TEAM_MEMBERS.map((member, index) => (
            <GlassmorphismCard key={index} className="group cursor-pointer p-4">
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 bg-gray-100 border border-gray-200">
                {/* Placeholder for member photo */}
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-transparent flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-telemetry-cyan font-mono text-[10px] uppercase mb-1 truncate">{member.dept}</span>
                <h3 className="text-sm font-bold mb-1 group-hover:text-telemetry-cyan transition-colors truncate">{member.name}</h3>
                <p className="text-gray-600 text-xs">{member.role}</p>
              </div>
              
              {/* Hover border effect */}
              <div className="absolute inset-0 border border-telemetry-cyan/0 rounded-2xl group-hover:border-telemetry-cyan/50 transition-colors duration-500 pointer-events-none" />
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
