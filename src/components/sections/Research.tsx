import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { Cpu, Printer, Radio, Wifi } from 'lucide-react';

const RESEARCH_AREAS = [
  {
    icon: <Cpu size={32} className="text-telemetry-cyan" />,
    title: "Flight Computers",
    desc: "Custom PCB design using STM32 and ESP32 microcontrollers. Our modular architecture allows for rapid sensor integration and payload testing."
  },
  {
    icon: <Printer size={32} className="text-aerospace-orange" />,
    title: "Additive Manufacturing",
    desc: "Developing screwless, high-impact chassis designs using advanced polymers like Carbon Fiber PETG to withstand extreme G-forces."
  },
  {
    icon: <Radio size={32} className="text-mission-blue" />,
    title: "Telemetry & RF",
    desc: "Long-range LoRaWAN communication protocols ensuring real-time data transmission from high altitudes back to our ground station."
  },
  {
    icon: <Wifi size={32} className="text-gray-900" />,
    title: "Ground Station UI",
    desc: "React-based mission control dashboards displaying live coordinates, atmospheric pressure, and orientation data during descent."
  }
];

export const Research: React.FC = () => {
  return (
    <SectionReveal id="research" className="relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_center,rgba(0,136,255,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-mission-blue" />
            <span className="text-mission-blue font-mono tracking-widest text-sm uppercase">Focus Areas</span>
            <div className="h-[2px] w-8 bg-mission-blue" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight text-center">Engineering The Future</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {RESEARCH_AREAS.map((area, idx) => (
            <GlassmorphismCard key={idx} className="group flex flex-col md:flex-row gap-6 items-start h-full">
              <div className="p-4 rounded-2xl bg-gray-100 border border-gray-200 group-hover:bg-gray-200 transition-colors shrink-0">
                {area.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {area.desc}
                </p>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
