import React, { useEffect, useRef, useState } from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { Trophy, Medal, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS = [
  { label: "Missions Launched", value: 4, suffix: "+" },
  { label: "Data Points Collected", value: 1.2, suffix: "M" },
  { label: "Engineering Hours", value: 8500, suffix: "+" },
  { label: "Team Members", value: 35, suffix: "" }
];

const AWARDS = [
  { year: "2023", title: "National CanSat Competition", position: "1st Place", icon: <Trophy />, accent: "text-[#F59E0B]" },
  { year: "2023", title: "Best Telemetry Design", position: "Winner", icon: <Award />, accent: "text-[#2563EB]" },
  { year: "2022", title: "Space Innovation Challenge", position: "Runner Up", icon: <Medal />, accent: "text-[#E11D48]" },
];

export const Achievements: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!statsRef.current || hasAnimated) return;

    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 80%",
      onEnter: () => {
        const counters = statsRef.current?.querySelectorAll('.counter-val');
        counters?.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: target % 1 === 0 ? 1 : 0.1 },
            onUpdate: function() {
              if (target % 1 !== 0) {
                 counter.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
              }
            }
          });
        });
        setHasAnimated(true);
      }
    });
  }, [hasAnimated]);

  return (
    <SectionReveal id="achievements" className="relative">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-[#E11D48]" />
            <span className="text-[#E11D48] font-mono tracking-widest text-sm uppercase">Track Record</span>
            <div className="h-[2px] w-8 bg-[#E11D48]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Mission Milestones</h2>
        </div>
        
        {/* Stats Row */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 border border-gray-200/60">
              <div className="text-4xl md:text-5xl font-black font-aeonik mb-2">
                <span className="counter-val" data-target={stat.value}>0</span>
                <span className="text-[#2563EB]">{stat.suffix}</span>
              </div>
              <div className="text-gray-500 font-mono text-xs uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AWARDS.map((award, idx) => (
            <GlassmorphismCard key={idx} className="flex flex-col items-center text-center p-8">
              <div className={`w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center ${award.accent} mb-5`}>
                {award.icon}
              </div>
              <span className="text-gray-400 font-mono text-xs mb-2">{award.year}</span>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{award.title}</h3>
              <span className={`${award.accent} font-semibold text-sm`}>{award.position}</span>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
