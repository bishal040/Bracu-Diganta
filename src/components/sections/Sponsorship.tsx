import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Cpu, Radar, Target, Network } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Sponsorship: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sponsor-elem',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="sponsorship" ref={sectionRef} className="py-32 relative z-10 overflow-hidden font-sans border-t border-black/10 dark:border-white/20 bg-white dark:bg-black">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="sponsor-elem text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-3 px-3 py-1 border border-black/20 dark:border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 bg-black dark:bg-white animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-black dark:text-white uppercase font-bold">Strategic Partnership</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter uppercase mb-8">
            Fuel The Next Generation
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-mono leading-relaxed max-w-3xl mx-auto">
            Align your brand with cutting-edge aerospace engineering. We provide our sponsors with unparalleled access to top-tier technical talent, global brand exposure, and the opportunity to shape the future of space technology.
          </p>
        </div>

        {/* Tech-Stack / Capabilities Showcase */}
        <div className="sponsor-elem mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest">Mission Capabilities</h3>
            <div className="h-[1px] flex-1 bg-black/20 dark:bg-white/20" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: 'Proprietary Avionics',
                desc: 'Custom-designed flight computers featuring dual-redundant sensor arrays and real-time state estimation algorithms.',
                metric: '100Hz',
                metricLabel: 'Sampling Rate'
              },
              {
                icon: Radar,
                title: 'Long-Range Telemetry',
                desc: 'Advanced RF communication systems ensuring uninterrupted data links between ground control and payload during high-G maneuvers.',
                metric: '2.4GHz',
                metricLabel: 'LoRa Network'
              },
              {
                icon: Rocket,
                title: 'Modular Architecture',
                desc: 'Rapid-iteration airframe designs utilizing carbon-fiber composites and 3D printed aerospace-grade polymers.',
                metric: 'Mach 0.8',
                metricLabel: 'Structural Integrity'
              }
            ].map((tech, i) => (
              <div key={i} className="group relative bg-white/60 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-5 group-hover:opacity-10 transition-opacity">
                  <tech.icon size={120} className="text-black dark:text-white" />
                </div>
                <div className="w-10 h-10 border border-black/20 dark:border-white/20 flex items-center justify-center mb-8 bg-white/50 dark:bg-black/50">
                  <tech.icon className="text-black dark:text-white" size={20} />
                </div>
                <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-wide mb-3">{tech.title}</h4>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-1">
                  {tech.desc}
                </p>
                <div className="flex items-end gap-3 mt-auto border-t border-black/10 dark:border-white/10 pt-4">
                  <span className="text-xl font-mono text-black dark:text-white font-light">{tech.metric}</span>
                  <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase pb-1">{tech.metricLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Invest / Value Proposition */}
        <div className="sponsor-elem mb-24">
          <div className="flex items-center gap-4 mb-12 flex-row-reverse">
            <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest">Sponsorship Value</h3>
            <div className="h-[1px] flex-1 bg-black/20 dark:bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Value Panel 1 */}
            <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/10 p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-20 dark:opacity-10 grayscale bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <Target className="w-8 h-8 text-black dark:text-white mb-8" />
                <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-wide mb-4">Brand Integration</h4>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  Achieve global visibility. Your branding will be integrated into our rocket hulls, ground station equipment, team apparel, and digital properties, seen by thousands at international aerospace competitions.
                </p>
                <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 border border-black/50 dark:border-white/50" /> Hardware Decals & Livery</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 border border-black/50 dark:border-white/50" /> Media & Documentary Features</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 border border-black/50 dark:border-white/50" /> VIP Launch Event Access</li>
                </ul>
              </div>
            </div>

            {/* Value Panel 2 */}
            <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/10 p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541881329562-b91a539b7843?q=80&w=2070&auto=format&fit=crop')] opacity-20 dark:opacity-10 grayscale bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-white/40 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <Network className="w-8 h-8 text-black dark:text-white mb-8" />
                <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-wide mb-4">Talent Pipeline</h4>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  Get direct access to a curated pool of exceptional STEM talent. Our engineers are battle-tested in high-pressure, interdisciplinary environments, making them ideal candidates for your organization.
                </p>
                <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 border border-black/50 dark:border-white/50" /> Exclusive Resume Books</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 border border-black/50 dark:border-white/50" /> Priority Recruitment Opportunities</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 border border-black/50 dark:border-white/50" /> Joint R&D Potential</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Technical CTA */}
        <div className="mt-16 text-center">
          <a 
            href="#contact"
            className="inline-flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-mono text-xs tracking-widest font-bold uppercase transition-all hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            Initiate Sponsor Protocol
          </a>
          <p className="mt-6 font-mono text-xs text-slate-500 uppercase tracking-widest">Custom tailored sponsorship packages available upon request.</p>
        </div>

      </div>
    </section>
  );
};
