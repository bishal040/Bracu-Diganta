import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Rocket, Target, Cpu, Activity } from 'lucide-react';
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
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'url("https://i.ibb.co.com/W42n1dsP/Whats-App-Image-2026-06-17-at-01-47-48-2.jpg")' }} />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-12">
                <div>
                  <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-6">Mission Objective</h3>
                  <p className="leading-relaxed">
                    This year's mission simulates a planetary atmospheric entry probe. Our CanSat is tasked with ascending to an altitude of 750 meters, deploying a heat shield, and transmitting live telemetry data (including temperature, pressure, altitude, and GPS coordinates) at 1Hz directly to our ground control station during its controlled descent.
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-2xl relative group h-64 md:h-80 w-full transform transition-all duration-500 hover:-translate-y-2">
                  <img src="https://i.ibb.co.com/ynNs3gYr/Whats-App-Image-2026-06-17-at-01-47-37-1.jpg" alt="Mission Objective" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Deployment Simulation
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-12">
                <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl relative group h-64 md:h-80 w-full transform transition-all duration-500 hover:-translate-y-2">
                  <img src="https://i.ibb.co.com/7d2MTKMm/Whats-App-Image-2026-06-17-at-01-47-37-2.jpg" alt="Engineering Innovation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-cyan-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Avionics Bay Testing
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-6">Engineering Innovation</h3>
                  <p className="leading-relaxed">
                    To meet the strict weight limit of 600 grams and size constraints, our engineering team has developed a custom carbon-fiber chassis and a miniaturized avionics bay. The recovery system utilizes a novel bio-inspired parachute design that actively adjusts its drag coefficient based on barometric feedback.
                  </p>
                </div>
              </div>
              
              <div className="my-12 p-8 bg-white border border-slate-200 rounded-3xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                <p className="font-mono text-sm text-slate-600 italic leading-relaxed font-medium">
                  "This qualification is a testament to the relentless late nights and engineering excellence of the entire Diganta team. We are not just building a payload; we are pushing the boundaries of student-led aerospace research."
                </p>
                <span className="block mt-4 font-bold text-blue-700 text-sm uppercase tracking-wider">— Lead Systems Engineer</span>
              </div>
              
              {/* Interactive Group Images Gallery */}
              <h3 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mt-12 mb-6">The Team Behind the Mission</h3>
              <div className="reveal-anim grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8 mb-8 auto-rows-[160px] md:auto-rows-[200px]">
                {/* Large Featured Image */}
                <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden relative group shadow-lg cursor-pointer">
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent z-10 transition-colors duration-500" />
                  <img src="https://i.ibb.co.com/8DKLyHWS/Whats-App-Image-2026-06-17-at-01-47-35-1.jpg" alt="Team Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <div className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-2 rounded-lg inline-block uppercase tracking-widest shadow-xl">
                      Late Night Assembly
                    </div>
                  </div>
                </div>
                
                {/* Small Top Right Image */}
                <div className="rounded-3xl overflow-hidden relative group shadow-md cursor-pointer">
                  <div className="absolute inset-0 bg-cyan-900/10 group-hover:bg-transparent z-10 transition-colors duration-500" />
                  <img src="https://i.ibb.co.com/WvJvYjYj/Whats-App-Image-2026-06-17-at-01-47-35-2.jpg" alt="Team Planning" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                {/* Small Middle Right Image */}
                <div className="rounded-3xl overflow-hidden relative group shadow-md cursor-pointer">
                  <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent z-10 transition-colors duration-500" />
                  <img src="https://i.ibb.co.com/prbVZ8sb/Whats-App-Image-2026-06-17-at-01-47-35.jpg" alt="Field Testing" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                </div>

                {/* Wide Bottom Image */}
                <div className="col-span-2 rounded-3xl overflow-hidden relative group shadow-md cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-500" />
                  <img src="https://i.ibb.co.com/KxThc0hN/Whats-App-Image-2026-06-17-at-01-47-36-1.jpg" alt="Team Discussion" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <div className="text-white text-xs font-bold uppercase tracking-widest shadow-xl">
                      Strategy Session
                    </div>
                  </div>
                </div>

                {/* Small Bottom Right Image */}
                <div className="rounded-3xl overflow-hidden relative group shadow-md cursor-pointer">
                  <img src="https://i.ibb.co.com/bj7QSj2S/Whats-App-Image-2026-06-17-at-01-47-36-2.jpg" alt="Celebration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
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

      {/* Massive Full-Width Gallery */}
      <div className="reveal-anim w-full overflow-hidden relative bg-slate-900 py-16 mt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none z-10" />
        
        <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20">
          <h3 className="font-orbitron text-3xl md:text-5xl font-black uppercase text-white tracking-tighter text-center">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Archives</span>
          </h3>
          <p className="text-center text-slate-400 mt-4 max-w-xl mx-auto font-mono text-sm uppercase tracking-widest">
            A comprehensive look at the team behind the engineering
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative flex overflow-x-hidden group mb-6">
          <div className="animate-marquee whitespace-nowrap flex items-center group-hover:[animation-play-state:paused]">
            {[...ALL_GALLERY_IMAGES.slice(0, 20), ...ALL_GALLERY_IMAGES.slice(0, 20)].map((img, i) => (
              <div key={'row1'+i} className="w-[280px] md:w-[350px] h-[200px] md:h-[250px] mx-3 rounded-2xl overflow-hidden shrink-0 shadow-2xl relative cursor-pointer transform transition-transform duration-500 hover:scale-105 hover:z-30">
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Reverse) */}
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee-reverse whitespace-nowrap flex items-center group-hover:[animation-play-state:paused]">
            {[...ALL_GALLERY_IMAGES.slice(19), ...ALL_GALLERY_IMAGES.slice(19)].map((img, i) => (
              <div key={'row2'+i} className="w-[280px] md:w-[350px] h-[200px] md:h-[250px] mx-3 rounded-2xl overflow-hidden shrink-0 shadow-2xl relative cursor-pointer transform transition-transform duration-500 hover:scale-105 hover:z-30">
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
