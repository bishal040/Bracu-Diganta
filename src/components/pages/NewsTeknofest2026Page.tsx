import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Rocket, Target, Cpu, Radio, Video, LocateFixed } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

export const NewsTeknofest2026Page: React.FC = () => {
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
        <div className="reveal-anim mb-8 flex flex-wrap items-center gap-4">
          <div className="bg-rose-100 border border-rose-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-rose-700 font-bold">Latest Milestone</span>
          </div>
          <span className="font-mono text-sm text-slate-500 font-medium">JUNE 2026</span>
        </div>

        <h1 className="reveal-anim font-orbitron text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.1] mb-4 text-slate-900">
          Advances to PDR Stage at <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            TEKNOFEST 2026
          </span>
        </h1>

        <p className="reveal-anim font-orbitron text-lg md:text-2xl font-bold text-slate-500 uppercase tracking-wider mb-10">
          Stability-Integrated Guidance Mechanical Actuator (SIGMA)
        </p>

        {/* Hero Image */}
        <div className="reveal-anim relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-[0_20px_60px_rgba(37,99,235,0.15)] group">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'url("https://i.ibb.co.com/FNmvLvB/IMG-4654.jpg")' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
              <Radio size={18} className="text-cyan-300" />
              <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-white font-bold drop-shadow-md">TURKSAT Model Satellite Competition</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Article */}
          <div className="md:col-span-8">
            <div className="reveal-anim prose prose-lg max-w-none text-slate-600">
              <p className="text-xl text-slate-700 leading-relaxed font-medium mb-8">
                BRACU Diganta has successfully advanced to the Project Design Review (PDR) stage of TEKNOFEST 2026 and is preparing to present its mission through an online evaluation interview. This milestone reflects the team's technical progress and commitment to representing Bangladesh on an international aerospace platform.
              </p>
              
              <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">Mission Overview — SIGMA</h3>
              <p className="leading-relaxed mb-6">
                The TURKSAT Model Satellite Competition (SIGMA) focuses on designing a two-part model satellite system (Container and Science Payload) capable of stable, controlled, and autonomous landing using an active guidance mechanism.
              </p>
              
              <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">Mission Profile</h3>
              <p className="leading-relaxed mb-6">
                After release from 1500–1800 m altitude, the Science Payload separates from the Container at 1000 m and descends safely using a propulsion system while continuously transmitting telemetry and live video to the ground station.
              </p>
              <p className="leading-relaxed mb-6">
                Throughout the mission, all data are recorded onboard and at the ground station. After landing, the payload continues transmitting for 10 seconds before automatically stopping and activating a buzzer for recovery.
              </p>
              
              <div className="my-12 p-8 bg-white border border-slate-200 rounded-3xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                <p className="font-mono text-sm text-slate-600 italic leading-relaxed font-medium">
                  "Advancing to the PDR stage at TEKNOFEST is a huge validation of our engineering approach. The SIGMA mission challenges us to integrate guidance, propulsion, and telemetry into a single cohesive system — exactly the kind of challenge BRACU Diganta was built for."
                </p>
                <span className="block mt-4 font-bold text-blue-700 text-sm uppercase tracking-wider">— BRACU Diganta Team</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-8">
            
            {/* Quick Facts */}
            <div className="reveal-anim bg-white border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
              <h4 className="font-orbitron font-bold text-lg text-slate-900 uppercase mb-6 tracking-wider relative z-10">SIGMA Specs</h4>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                    <Rocket size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Release Altitude</span>
                    <span className="font-bold text-slate-900 text-sm">1500–1800 m</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center shrink-0 border border-cyan-100 shadow-sm">
                    <Target size={18} className="text-cyan-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Payload Separation</span>
                    <span className="font-bold text-slate-900 text-sm">1000 m Altitude</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                    <Cpu size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Guidance System</span>
                    <span className="font-bold text-slate-900 text-sm">Active Mechanical Actuator</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100 shadow-sm">
                    <Video size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Live Feed</span>
                    <span className="font-bold text-slate-900 text-sm">Video + Telemetry</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 shadow-sm">
                    <LocateFixed size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-semibold">Recovery</span>
                    <span className="font-bold text-slate-900 text-sm">Auto-stop + Buzzer</span>
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
                  Follow Our Journey
                </h4>
                <p className="text-slate-300 text-sm mb-8">
                  Track our progress as we prepare for the TEKNOFEST 2026 competition and the SIGMA mission launch.
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
