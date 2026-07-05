import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Handshake, Activity, Zap } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';
import { sponsorsData, type MappedSponsor } from '../../data/sponsors';

const getSponsorContent = (sponsor: MappedSponsor) => {
  const getColors = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-500', hoverBg: 'group-hover:bg-blue-50', shadow: 'shadow-[0_10px_20px_rgba(37,99,235,0.3)]' };
      case 'indigo': return { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-500', hoverBg: 'group-hover:bg-indigo-50', shadow: 'shadow-[0_10px_20px_rgba(79,70,229,0.2)]' };
      case 'cyan': return { bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-500', hoverBg: 'group-hover:bg-cyan-50', shadow: 'shadow-[0_10px_20px_rgba(6,182,212,0.2)]' };
      case 'violet': return { bg: 'bg-violet-600', border: 'border-violet-500', text: 'text-violet-500', hoverBg: 'group-hover:bg-violet-50', shadow: 'shadow-[0_10px_20px_rgba(139,92,246,0.3)]' };
      case 'slate': default: return { bg: 'bg-slate-600', border: 'border-slate-500', text: 'text-slate-500', hoverBg: 'group-hover:bg-slate-50', shadow: 'shadow-[0_10px_20px_rgba(100,116,139,0.3)]' };
    }
  };
  const c = getColors(sponsor.color);

  if (sponsor.logoUrl) {
    return (
      <div className="w-24 h-20 sm:h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
        <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain mix-blend-multiply" />
      </div>
    );
  }

  return (
    <div className={`w-16 h-16 flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-500 relative z-10`}>
      {sponsor.icon}
    </div>
  );
};

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { showToast } = useToast();
  const initialSponsors = sponsorsData.slice(0, 4).map(s => ({
    ...s,
    content: getSponsorContent(s)
  }));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      const apiUrl = import.meta.env.VITE_API_URL;

      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
      } else {
        // Fallback for testing without DB
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setFormStatus('sent');
      showToast('Partnership request transmitted successfully!', 'success');
      (e.target as HTMLFormElement).reset();

      setTimeout(() => setFormStatus('idle'), 4000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      setFormStatus('error');
      showToast('Transmission failed — please retry.', 'error');

      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen w-full relative bg-[#F4F4F6] overflow-hidden flex flex-col justify-center py-24 lg:py-32 border-t border-slate-200/60 z-0">

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
        <div className="bento-reveal flex flex-col gap-4 mb-6 lg:mb-8 shrink-0 relative z-20 will-change-transform">
          <h2 className="font-orbitron text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            Fuel Our Next <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-1">Breakthrough</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
            {/* Sponsors Space */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-[0_8px_30px_rgba(37,99,235,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-orbitron font-bold text-sm lg:text-base text-slate-900 uppercase tracking-widest">Sponsorship</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Gain premium brand visibility. Interact directly with our latest aerospace missions and secure your spot on our flagship rovers and satellites.
              </p>
            </div>

            {/* Investment Space */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-[0_8px_30px_rgba(37,99,235,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-orbitron font-bold text-sm lg:text-base text-slate-900 uppercase tracking-widest">Investment & Support</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Drive our research forward. We invite companies to provide technological resources, financial investments, and collaborative expertise.
              </p>
            </div>

            {/* Partners Space */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-[0_8px_30px_rgba(37,99,235,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Handshake className="w-4 h-4" />
                </div>
                <h3 className="font-orbitron font-bold text-sm lg:text-base text-slate-900 uppercase tracking-widest">Partners</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Join our network of industry leaders. Collaborate on cutting-edge space technology and foster the growth of STEM education in Bangladesh.
              </p>
            </div>
          </div>
        </div>

        {/* ── MIDDLE: 50/50 Split (Form & Grid) ── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative z-20">

          {/* LEFT: Clean Modern Form UI */}
          <div className="bento-reveal h-full bg-white/95 rounded-[2rem] border border-white shadow-[0_20px_40px_rgba(37,99,235,0.06)] p-6 flex flex-col relative overflow-hidden group will-change-transform">
            {/* Glossy highlight */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[2rem]" />

            <div className="flex items-center gap-3 mb-4 lg:mb-6 border-b border-blue-100 pb-3 relative z-10 shrink-0">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-orbitron font-bold text-xs lg:text-sm text-slate-900 uppercase tracking-widest">
                Initiate Partnership
              </h3>
            </div>

            <form className="flex flex-col gap-3 lg:gap-4 h-full relative z-10" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 lg:gap-4 shrink-0">
                <div className="flex flex-col md:flex-row gap-3 lg:gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Organization</label>
                    <input type="text" name="organization" required className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="Company Name" />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                    <input type="email" name="email" required className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="contact@domain.com" />
                  </div>
                </div>



                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Partnership Type</label>
                  <select
                    name="type"
                    className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select Interest...</option>
                    <option value="sponsor">Sponsorship & Brand Visibility</option>
                    <option value="invest">Corporate Investment</option>
                    <option value="resource">Resource & Tech Support</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 mt-2">
                <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 shrink-0">Message / Proposal</label>
                <textarea name="message" required className="w-full h-full min-h-[150px] bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all" placeholder="How would you like to collaborate with us?" />
              </div>
              <button type="submit" disabled={formStatus !== 'idle'} className="shrink-0 w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-orbitron font-bold text-sm lg:text-base uppercase tracking-widest py-3 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none">
                {formStatus === 'idle' && <>Submit Request <ArrowRight size={18} /></>}
                {formStatus === 'sending' && <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>}
                {formStatus === 'sent' && '✓ Received'}
                {formStatus === 'error' && '✕ Failed'}
              </button>
            </form>
          </div>

          {/* RIGHT: Wrapper for Grid & Marquee */}
          <div className="flex flex-col h-full gap-4 lg:gap-6">

            {/* High-End Glassmorphic Prestige Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 relative">

              {sponsors.map((sponsor) => (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={sponsor.id}
                  className="sponsor-item bento-reveal h-full rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-300 group relative overflow-hidden will-change-transform z-10 hover:z-20"
                >
                  <div className="w-full flex items-center justify-center">{sponsor.content}</div>
                  {!sponsor.logoUrl && (
                    <span className="font-orbitron font-black text-[10px] tracking-widest uppercase text-slate-800 relative z-10 mt-2">{sponsor.name}</span>
                  )}
                </motion.div>
              ))}

              {/* THE MINIMALIST FOMO SLOT (Spans 2 columns) */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bento-reveal fomo-pulse sm:col-span-2 h-full relative bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:bg-white hover:border-blue-400 hover:shadow-md cursor-pointer group overflow-hidden min-h-0 will-change-transform z-0"
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
                  <div key={set} className="flex items-center gap-10 px-6 shrink-0">
                    {sponsorsData.slice(0, 10).map((sponsor, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {sponsor.logoUrl ? (
                          <img src={sponsor.logoUrl} alt={sponsor.name} className="h-12 w-auto max-w-[120px] lg:max-w-[180px] object-contain mix-blend-multiply opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300" />
                        ) : (
                          <>
                            <div className="text-blue-600 scale-75 lg:scale-100">{sponsor.icon}</div>
                            <span className="font-orbitron font-black text-[11px] lg:text-[13px] tracking-widest uppercase text-slate-900">{sponsor.name}</span>
                          </>
                        )}
                      </div>
                    ))}
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
