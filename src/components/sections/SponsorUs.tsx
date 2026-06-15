import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { Hexagon, Triangle, Circle, Square, Command, Anchor, Aperture, Globe } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

const SPONSORS = [
  { name: "AeroTech", icon: <Triangle size={32} strokeWidth={1.5} /> },
  { name: "Nova Systems", icon: <Hexagon size={32} strokeWidth={1.5} /> },
  { name: "Quantum Dynamics", icon: <Circle size={32} strokeWidth={1.5} /> },
  { name: "NexGen", icon: <Square size={32} strokeWidth={1.5} /> },
  { name: "Nexus", icon: <Command size={32} strokeWidth={1.5} /> },
  { name: "Horizon", icon: <Anchor size={32} strokeWidth={1.5} /> },
  { name: "Orbit Systems", icon: <Aperture size={32} strokeWidth={1.5} /> },
  { name: "Stratos", icon: <Globe size={32} strokeWidth={1.5} /> },
];

export const SponsorUs: React.FC = () => {
  return (
    <SectionReveal id="sponsor" className="relative py-12 overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-[#E11D48]" />
            <span className="text-[#E11D48] font-mono tracking-widest text-sm uppercase">Partnerships</span>
            <div className="h-[2px] w-8 bg-[#E11D48]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Our Beloved Sponsors</h2>
        </div>

        <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-16">
          Building spacecraft requires capital, materials, and mentorship. By partnering with BRACU Diganta,
          you invest in the next generation of engineers.
        </p>

        {/* Marquee Section */}
        <div className="relative w-full max-w-[100vw] overflow-hidden -mx-6 md:mx-0 py-10">
          {/* Gradient Fades for edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#eef2f5] to-transparent z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#eef2f5] to-transparent z-10" />

          {/* Marquee Track */}
          <div className="flex whitespace-nowrap animate-marquee w-max items-center gap-16 md:gap-24 px-8">
            {/* Double the array to create seamless loop */}
            {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 text-gray-400 hover:text-[#2563EB] transition-colors duration-300 group cursor-pointer"
              >
                <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors duration-300">
                  {sponsor.icon}
                </div>
                <span className="font-orbitron text-2xl md:text-3xl font-bold tracking-wider">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <MagneticButton className="bg-gray-900 text-white hover:bg-[#2563EB] py-4 px-8 rounded-full font-mono uppercase tracking-widest text-sm transition-colors shadow-xl shadow-gray-900/10">
            Become a Partner
          </MagneticButton>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </SectionReveal>
  );
};
