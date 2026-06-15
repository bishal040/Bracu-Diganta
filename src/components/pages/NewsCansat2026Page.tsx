import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Rocket, Target, Cpu, Activity } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

export const NewsCansat2026Page: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#eef2f5] text-slate-900 pt-24 pb-20 px-6 md:px-12 selection:bg-blue-500/20">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation */}
        <div className="reveal-anim mb-12">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
              <ArrowLeft size={16} />
            </div>
            <span className="font-mono text-sm tracking-widest uppercase font-semibold">Return to Hub</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="reveal-anim mb-8 flex items-center gap-4">
          <div className="bg-blue-100 border border-blue-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-blue-700 font-bold">Official Announcement</span>
          </div>
          <span className="font-mono text-sm text-slate-500 font-medium">OCTOBER 15, 2025</span>
        </div>

        <h1 className="reveal-anim font-orbitron text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[1.1] mb-8 text-slate-900">
          Diganta Selected for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            CANSAT 2026
          </span>
        </h1>

        {/* Hero Image */}
        <div className="reveal-anim relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-[0_20px_60px_rgba(37,99,235,0.15)] group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop")' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
              <Activity size={18} className="text-cyan-300" />
              <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-white font-bold drop-shadow-md">Payload Architecture Finalized</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Article */}
          <div className="md:col-span-8">
            <div className="reveal-anim prose prose-lg max-w-none text-slate-600">
              <p className="text-xl text-slate-700 leading-relaxed font-medium mb-8">
                We are incredibly thrilled to announce that Team Diganta has officially qualified for the International CanSat Competition 2026. Following a rigorous Preliminary Design Review (PDR), our latest modular payload design scored in the top 5% of global submissions, securing our place on the launch pad.
              </p>
              
              <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">Mission Objective</h3>
              <p className="leading-relaxed mb-6">
                This year's mission simulates a planetary atmospheric entry probe. Our CanSat is tasked with ascending to an altitude of 750 meters, deploying a heat shield, and transmitting live telemetry data (including temperature, pressure, altitude, and GPS coordinates) at 1Hz directly to our ground control station during its controlled descent.
              </p>
              
              <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">Engineering Innovation</h3>
              <p className="leading-relaxed mb-6">
                To meet the strict weight limit of 600 grams and size constraints, our engineering team has developed a custom carbon-fiber chassis and a miniaturized avionics bay. The recovery system utilizes a novel bio-inspired parachute design that actively adjusts its drag coefficient based on barometric feedback.
              </p>
              
              <div className="my-12 p-8 bg-white border border-slate-200 rounded-3xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                <p className="font-mono text-sm text-slate-600 italic leading-relaxed font-medium">
                  "This qualification is a testament to the relentless late nights and engineering excellence of the entire Diganta team. We are not just building a payload; we are pushing the boundaries of student-led aerospace research."
                </p>
                <span className="block mt-4 font-bold text-blue-700 text-sm uppercase tracking-wider">— Lead Systems Engineer</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-8">
            
            {/* Quick Facts */}
            <div className="reveal-anim bg-white border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
              <h4 className="font-orbitron font-bold text-lg text-slate-900 uppercase mb-6 tracking-wider relative z-10">Mission Specs</h4>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                    <Rocket size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Target Altitude</span>
                    <span className="font-bold text-slate-900 text-sm">750 Meters (2,460 ft)</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center shrink-0 border border-cyan-100 shadow-sm">
                    <Target size={18} className="text-cyan-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Descent Velocity</span>
                    <span className="font-bold text-slate-900 text-sm">15 m/s (Controlled)</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                    <Cpu size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Telemetry Rate</span>
                    <span className="font-bold text-slate-900 text-sm">1 Hz Continuous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="reveal-anim bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h4 className="font-orbitron font-bold text-xl text-white uppercase mb-4 leading-tight">
                  Join The Journey
                </h4>
                <p className="text-slate-300 text-sm mb-8">
                  Follow our development logs as we prepare the payload for launch day.
                </p>
                <MagneticButton onClick={() => navigate('/missions')} className="w-full bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 shadow-lg shadow-blue-600/20 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all text-center group-hover:-translate-y-1">
                  View All Missions
                </MagneticButton>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
