import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';

export const Overview: React.FC = () => {
  return (
    <SectionReveal id="overview" className="relative">
      
      <div className="relative z-10 flex justify-start">
        <div className="w-full lg:w-[38%]">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-telemetry-cyan" />
            <span className="text-telemetry-cyan font-mono tracking-widest text-sm uppercase">Mission Overview</span>
          </div>
          
          <h2 className="text-section mb-8">Democratizing Access To Space</h2>
          
          <div className="space-y-6 text-body text-gray-600">
            <p>
              BRACU Diganta is an autonomous student-led aerospace research team at BRAC University. 
              Our mission is to push the boundaries of undergraduate engineering by designing, 
              building, and launching sophisticated CanSat systems.
            </p>
            <p>
              We believe that space exploration should not be limited to government agencies 
              and multi-billion dollar corporations. Through open-source development, modular 
              architectures, and rigorous testing, we are creating reliable platforms for 
              atmospheric research and telemetry gathering.
            </p>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};
