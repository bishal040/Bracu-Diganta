import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Rocket, Target, Cpu, Radio, Video, LocateFixed } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

const ALL_GALLERY_IMAGES = [
  "https://i.ibb.co.com/8DKLyHWS/Whats-App-Image-2026-06-17-at-01-47-35-1.jpg",
  "https://i.ibb.co.com/WvJvYjYj/Whats-App-Image-2026-06-17-at-01-47-35-2.jpg",
  "https://i.ibb.co.com/prbVZ8sb/Whats-App-Image-2026-06-17-at-01-47-35.jpg",
  "https://i.ibb.co.com/KxThc0hN/Whats-App-Image-2026-06-17-at-01-47-36-1.jpg",
  "https://i.ibb.co.com/bj7QSj2S/Whats-App-Image-2026-06-17-at-01-47-36-2.jpg",
  "https://i.ibb.co.com/Gvr6YZ01/Whats-App-Image-2026-06-17-at-01-47-36.jpg",
  "https://i.ibb.co.com/ynNs3gYr/Whats-App-Image-2026-06-17-at-01-47-37-1.jpg",
  "https://i.ibb.co.com/7d2MTKMm/Whats-App-Image-2026-06-17-at-01-47-37-2.jpg",
  "https://i.ibb.co.com/Kcbt4Y4t/Whats-App-Image-2026-06-17-at-01-47-37.jpg",
  "https://i.ibb.co.com/JWZfrVXM/Whats-App-Image-2026-06-17-at-01-47-38-1.jpg",
  "https://i.ibb.co.com/TD2hyM5k/Whats-App-Image-2026-06-17-at-01-47-38-2.jpg",
  "https://i.ibb.co.com/qLyLQJ0Z/Whats-App-Image-2026-06-17-at-01-47-38.jpg",
  "https://i.ibb.co.com/rKPR3N1h/Whats-App-Image-2026-06-17-at-01-47-39-1.jpg",
  "https://i.ibb.co.com/C5PX8GNn/Whats-App-Image-2026-06-17-at-01-47-39-2.jpg",
  "https://i.ibb.co.com/HD2KZ9Ns/Whats-App-Image-2026-06-17-at-01-47-40-1.jpg",
  "https://i.ibb.co.com/n8PjhYjt/Whats-App-Image-2026-06-17-at-01-47-40.jpg",
  "https://i.ibb.co.com/9k2RzPY7/Whats-App-Image-2026-06-17-at-01-47-41-1.jpg",
  "https://i.ibb.co.com/LzP2f9TQ/Whats-App-Image-2026-06-17-at-01-47-41-2.jpg",
  "https://i.ibb.co.com/HDBTyNRt/Whats-App-Image-2026-06-17-at-01-47-41.jpg",
  "https://i.ibb.co.com/Ndzxfmbc/Whats-App-Image-2026-06-17-at-01-47-42-1.jpg",
  "https://i.ibb.co.com/9QjdGvd/Whats-App-Image-2026-06-17-at-01-47-42-2.jpg",
  "https://i.ibb.co.com/DfM7GPL5/Whats-App-Image-2026-06-17-at-01-47-43-1.jpg",
  "https://i.ibb.co.com/jk1DyJtQ/Whats-App-Image-2026-06-17-at-01-47-43-2.jpg",
  "https://i.ibb.co.com/wh0nz9mJ/Whats-App-Image-2026-06-17-at-01-47-44-2.jpg",
  "https://i.ibb.co.com/qYfTDFjq/Whats-App-Image-2026-06-17-at-01-47-45.jpg",
  "https://i.ibb.co.com/bVWCrBB/Whats-App-Image-2026-06-17-at-01-47-46.jpg",
  "https://i.ibb.co.com/zW1YgbmM/Whats-App-Image-2026-06-17-at-01-47-47-2.jpg",
  "https://i.ibb.co.com/0156Xkd/Whats-App-Image-2026-06-17-at-01-47-47.jpg",
  "https://i.ibb.co.com/S4dZ9grx/Whats-App-Image-2026-06-17-at-01-47-48-1.jpg",
  "https://i.ibb.co.com/W42n1dsP/Whats-App-Image-2026-06-17-at-01-47-48-2.jpg",
  "https://i.ibb.co.com/35WZ6czz/Whats-App-Image-2026-06-17-at-01-47-49-1.jpg",
  "https://i.ibb.co.com/20dfZ4gZ/Whats-App-Image-2026-06-17-at-01-47-49.jpg",
  "https://i.ibb.co.com/k2t4Jp36/Whats-App-Image-2026-06-17-at-01-47-50-2.jpg",
  "https://i.ibb.co.com/fYzBb6VQ/Whats-App-Image-2026-06-17-at-01-47-50.jpg",
  "https://i.ibb.co.com/7NpXkRxq/Whats-App-Image-2026-06-17-at-01-47-51.jpg",
  "https://i.ibb.co.com/20jJtBRY/Whats-App-Image-2026-06-17-at-01-47-52-1.jpg",
  "https://i.ibb.co.com/SXWFygdT/Whats-App-Image-2026-06-17-at-01-47-52.jpg",
  "https://i.ibb.co.com/Txyrz8CK/Whats-App-Image-2026-06-17-at-01-47-53-1.jpg",
  "https://i.ibb.co.com/xnXnV6t/Whats-App-Image-2026-06-17-at-01-47-53-2.jpg"
];

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
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'url("https://i.ibb.co.com/9k2RzPY7/Whats-App-Image-2026-06-17-at-01-47-41-1.jpg")' }} />
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
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-12">
                <div>
                  <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-6">Mission Overview — SIGMA</h3>
                  <p className="leading-relaxed">
                    The TURKSAT Model Satellite Competition (SIGMA) focuses on designing a two-part model satellite system (Container and Science Payload) capable of stable, controlled, and autonomous landing using an active guidance mechanism.
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl relative group h-64 md:h-80 w-full transform transition-all duration-500 hover:-translate-y-2">
                  <img src="https://i.ibb.co.com/Ndzxfmbc/Whats-App-Image-2026-06-17-at-01-47-42-1.jpg" alt="Mission Objective" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    SIGMA Prototype
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-12">
                <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl relative group h-64 md:h-80 w-full transform transition-all duration-500 hover:-translate-y-2">
                  <img src="https://i.ibb.co.com/wh0nz9mJ/Whats-App-Image-2026-06-17-at-01-47-44-2.jpg" alt="Engineering Innovation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-cyan-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Avionics Bay Testing
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-6">Mission Profile</h3>
                  <p className="leading-relaxed mb-4">
                    After release from 1500–1800 m altitude, the Science Payload separates from the Container at 1000 m and descends safely using a propulsion system while continuously transmitting telemetry and live video to the ground station.
                  </p>
                  <p className="leading-relaxed">
                    Throughout the mission, all data are recorded onboard and at the ground station. After landing, the payload continues transmitting for 10 seconds before automatically stopping and activating a buzzer for recovery.
                  </p>
                </div>
              </div>

              
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


        {/* Mission Archives Scrolling Gallery */}
        <div className="mt-24 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal-anim">
            <div>
              <h3 className="font-orbitron text-3xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter">
                Mission Archives
              </h3>
              <p className="text-slate-500 font-mono text-sm tracking-widest uppercase mt-4">
                Visual Documentation — SIGMA
              </p>
            </div>
          </div>

          <div className="relative w-full overflow-hidden flex flex-col gap-4 py-8 reveal-anim">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#eef2f5] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#eef2f5] to-transparent z-10 pointer-events-none" />
            
            {/* First Row (Left to Right) */}
            <div className="flex w-max animate-[marquee_40s_linear_infinite]">
              {[1, 2].map((set) => (
                <div key={set} className="flex gap-4 px-2 shrink-0">
                  {ALL_GALLERY_IMAGES.slice(0, 19).map((src, i) => (
                    <div key={i} className="w-48 h-32 md:w-64 md:h-48 rounded-2xl overflow-hidden shrink-0 group relative shadow-md">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Second Row (Right to Left) */}
            <div className="flex w-max animate-[marquee-reverse_45s_linear_infinite]">
              {[1, 2].map((set) => (
                <div key={set} className="flex gap-4 px-2 shrink-0">
                  {ALL_GALLERY_IMAGES.slice(19).map((src, i) => (
                    <div key={i} className="w-48 h-32 md:w-72 md:h-56 rounded-2xl overflow-hidden shrink-0 group relative shadow-md">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-cyan-900/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
