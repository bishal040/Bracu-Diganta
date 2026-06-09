import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const initialSponsors = [
    { id: 'aerospace', name: 'Aerospace', color: 'blue', content: <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-orbitron font-black text-white text-3xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500 relative z-10">A</div> },
    { id: 'orbital', name: 'Orbital', color: 'indigo', content: <div className="w-16 h-16 rounded-full border-[4px] border-indigo-500 shadow-[0_10px_20px_rgba(79,70,229,0.2)] group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500 relative z-10" /> },
    { id: 'novadyn', name: 'Nova Dyn.', color: 'cyan', content: <div className="w-16 h-16 border-[4px] border-cyan-500 rotate-45 shadow-[0_10px_20px_rgba(6,182,212,0.2)] group-hover:rotate-90 group-hover:bg-cyan-50 transition-all duration-500 relative z-10" /> },
    { id: 'stellar', name: 'Stellar', color: 'violet', content: <div className="w-16 h-16 bg-violet-500 rounded-full shadow-[0_10px_20px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform duration-500 relative z-10" /> }
  ];
  
  const [sponsors, setSponsors] = useState(initialSponsors);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Elegant staggered reveal with dynamic pop
      gsap.fromTo(
        '.bento-reveal',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
      
      // Minimalist pulsing for the empty slot
      gsap.to('.fomo-pulse', {
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
      
    }, sectionRef);
    
    // Physical Shuffling Interval (No fade out, just raw position swapping)
    const shuffleInterval = setInterval(() => {
      setSponsors(prev => {
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    }, 4000);

    return () => {
      ctx.revert();
      clearInterval(shuffleInterval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
    setTimeout(() => setFormStatus('idle'), 4000);
  };

  return (
    <section id="contact" ref={sectionRef} className="h-[100dvh] w-full relative bg-[#F4F4F6] overflow-hidden flex flex-col justify-center pt-20 lg:pt-24 pb-16 lg:pb-20 border-t border-slate-200/60 z-0">
      
      {/* ── MASSIVE CRAZY GLOWING ORBS (OPTIMIZED) ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10" 
           style={{
             background: 'radial-gradient(circle at 30% 30%, rgba(147, 197, 253, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(165, 180, 252, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(165, 243, 252, 0.2) 0%, transparent 60%)'
           }} 
      />

      {/* Background Technical Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.3] -z-10" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Main Container */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col h-full z-10 relative">
        
        {/* ── TOP: Horizontal Hook Texts ── */}
        <div className="bento-reveal flex flex-col gap-2 mb-4 lg:mb-6 shrink-0 relative z-20 will-change-transform">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 lg:mb-3 bg-white/90 px-3 py-1.5 rounded-full border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              <span className="text-[9px] lg:text-[11px] font-orbitron font-bold tracking-widest uppercase text-blue-700">
                Classified // Corporate Partnership
              </span>
            </div>
            <h2 className="font-orbitron text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[1.1]">
              We have the blueprints.<br/>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-1">We need your fuel.</span>
            </h2>
          </div>
          <p className="text-slate-600 text-xs lg:text-sm leading-relaxed font-semibold max-w-2xl bg-white/60 p-3 rounded-xl border border-white/40">
            Join an elite circle of aerospace pioneers. We are pushing the boundaries of what is possible.
          </p>
        </div>

        {/* ── MIDDLE: 50/50 Split (Form & Grid) ── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative z-20">
          
          {/* LEFT: Crazy Glassmorphic Form UI */}
          <div className="bento-reveal h-full bg-white/95 rounded-[2rem] border border-white shadow-[0_20px_40px_rgba(37,99,235,0.06)] p-6 flex flex-col relative overflow-hidden group will-change-transform">
            {/* Glossy highlight */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[2rem]" />
            
            <div className="flex items-center gap-3 mb-4 lg:mb-6 border-b border-blue-100 pb-3 relative z-10 shrink-0">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <Lock size={14} className="text-blue-600" />
              </div>
              <h3 className="font-orbitron font-bold text-xs lg:text-sm text-slate-900 uppercase tracking-widest">
                Secure Comm Link
              </h3>
            </div>

            {/* Changed to stack vertically for a "broader" description field layout */}
            <form className="flex flex-col gap-3 lg:gap-5 h-full relative z-10 min-h-0" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 lg:gap-4 shrink-0">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Target Organization</label>
                  <input type="text" required className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="Enter Name..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Clearance Email</label>
                  <input type="email" required className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="director@domain.com" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-h-0">
                <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 shrink-0">Mission Proposal (Broad Field)</label>
                <textarea required className="w-full h-full min-h-0 bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all" placeholder="Initiate partnership sequence..." />
              </div>
              <button type="submit" disabled={formStatus !== 'idle'} className="shrink-0 w-full bg-slate-900 hover:bg-blue-600 text-white font-orbitron font-bold text-sm lg:text-base uppercase tracking-widest py-3 lg:py-4 rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.35)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none">
                {formStatus === 'idle' && <>Transmit Proposal <ArrowRight size={20} /></>}
                {formStatus === 'sending' && <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Encrypting...</>}
                {formStatus === 'sent' && '✓ Transmission Secure'}
              </button>
            </form>
          </div>

          {/* RIGHT: Wrapper for Grid & Marquee */}
          <div className="flex flex-col h-full min-h-0 gap-4 lg:gap-6">
            
            {/* High-End Glassmorphic Prestige Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 content-start relative shrink-0">
            
            {sponsors.map((sponsor) => (
              <motion.div 
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                key={sponsor.id} 
                className="sponsor-item bento-reveal bg-white/95 border border-white rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] group aspect-[4/3] lg:aspect-square relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] will-change-transform z-10 hover:z-20"
              >
                <div className={`absolute inset-0 bg-gradient-to-b from-${sponsor.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="scale-75 lg:scale-100">{sponsor.content}</div>
                <span className="font-orbitron font-black text-[10px] tracking-widest uppercase text-slate-800 relative z-10">{sponsor.name}</span>
              </motion.div>
            ))}

            {/* THE MINIMALIST FOMO SLOT (Spans 2 columns) */}
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bento-reveal fomo-pulse sm:col-span-2 relative bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:bg-white hover:border-blue-400 hover:shadow-md cursor-pointer group overflow-hidden min-h-0 aspect-[8/3] sm:aspect-auto will-change-transform z-0"
            >
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10 border border-blue-100 shrink-0">
                <Plus size={24} className="text-blue-500" />
              </div>
              <div className="text-center z-10">
                <span className="font-orbitron font-bold text-xs lg:text-sm tracking-widest uppercase text-blue-800 block mb-0.5">
                  Awaiting Partner
                </span>
                <span className="font-mono text-[8px] font-medium text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                  Secure Your Position
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── INTERNAL MARQUEE LOOP ── */}
          <div className="bento-reveal w-full relative bg-white/95 border border-white rounded-[1.5rem] py-3 lg:py-4 z-30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden shrink-0 mt-auto">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l-[1.5rem]" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-[1.5rem]" />
            
            {/* Seamless Pure CSS Marquee */}
            <div className="flex w-max animate-[marquee_20s_linear_infinite]">
              {[1, 2].map((set) => (
                <div key={set} className="flex items-center gap-12 px-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-orbitron font-black text-white text-[12px] shadow-sm">A</div>
                    <span className="font-orbitron font-black text-[11px] tracking-widest uppercase text-slate-900">Aerospace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-[3px] border-indigo-500 shadow-sm" />
                    <span className="font-orbitron font-black text-[11px] tracking-widest uppercase text-slate-900">Orbital</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-[3px] border-cyan-500 rotate-45 shadow-sm" />
                    <span className="font-orbitron font-black text-[11px] tracking-widest uppercase text-slate-900">Nova Dyn.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-500 rounded-full shadow-sm" />
                    <span className="font-orbitron font-black text-[11px] tracking-widest uppercase text-slate-900">Stellar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
