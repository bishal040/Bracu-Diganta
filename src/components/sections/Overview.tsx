import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Rocket, Cpu, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export const Overview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.overview-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={sectionRef} className="py-24 relative z-10 bg-[#eef2f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-8" ref={containerRef}>
        
        <div className="mb-16 md:mb-20">
          <span className="text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase mb-4 block">
            01 // Overview
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gray-900 tracking-tight uppercase">
            What is Diganta?
          </h2>
          <div className="w-16 h-[3px] bg-[#2563EB] mt-6" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[minmax(250px,_auto)]">
          
          {/* Mission & Vision - Large Card */}
          <div className="overview-card md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:bg-white/80 transition-colors duration-500">
            <div>
              <div className="w-12 h-12 bg-blue-100/80 rounded-2xl flex items-center justify-center mb-6">
                <Target className="text-[#2563EB]" size={24} />
              </div>
              <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-4 uppercase">Mission & Vision</h3>
              <p className="text-gray-600 leading-relaxed max-w-xl text-sm md:text-base">
                To pioneer accessible aerospace research and democratize space technology by developing low-cost, high-reliability modular satellites. We envision a future where student-led initiatives drive the next generation of atmospheric data collection and orbital mechanics.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[#2563EB] font-medium text-sm font-mono uppercase tracking-wider group-hover:gap-3 transition-all">
              Learn about our strategic roadmap <ChevronRight size={16} />
            </div>
          </div>

          {/* Portfolio Download */}
          <div className="overview-card bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h3 className="font-orbitron text-2xl font-bold text-white mb-3 uppercase">Portfolio</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Download our comprehensive mission documentation, subsystem breakdown, and technical whitepapers.
              </p>
            </div>
            <div className="relative z-10">
              <MagneticButton className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-2 py-4">
                <Download size={18} />
                <span className="font-semibold tracking-wide text-sm">Download PDF</span>
              </MagneticButton>
            </div>
          </div>

          {/* Subsystems Breakdown */}
          <div className="overview-card bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors duration-500">
            <div className="w-10 h-10 bg-cyan-100/80 rounded-xl flex items-center justify-center mb-5">
              <Cpu className="text-cyan-600" size={20} />
            </div>
            <h4 className="font-orbitron text-lg font-bold text-gray-900 mb-2 uppercase">Avionics & Computing</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Custom-built flight computers featuring ESP32 dual-core processors, redundant IMUs, and high-gain UHF telemetry systems.
            </p>
          </div>

          <div className="overview-card bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors duration-500">
            <div className="w-10 h-10 bg-indigo-100/80 rounded-xl flex items-center justify-center mb-5">
              <Rocket className="text-indigo-600" size={20} />
            </div>
            <h4 className="font-orbitron text-lg font-bold text-gray-900 mb-2 uppercase">Recovery Systems</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Active aerodynamics utilizing auto-rotation blades and precision-deployed parafoils for controlled, targeted descent.
            </p>
          </div>

          <div className="overview-card bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors duration-500">
            <div className="w-10 h-10 bg-emerald-100/80 rounded-xl flex items-center justify-center mb-5">
              <ShieldCheck className="text-emerald-600" size={20} />
            </div>
            <h4 className="font-orbitron text-lg font-bold text-gray-900 mb-2 uppercase">Structure & Payload</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ultra-lightweight, 3D-printed modular chassis designed to withstand high G-forces while housing delicate atmospheric sensors.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
