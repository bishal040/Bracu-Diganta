import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    type: '',
    message: ''
  });

  const { showToast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch(`/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Submission failed');

      showToast('Transmission Successful. We will contact you soon.', 'success');
      setFormStatus('sent');
      setFormData({ name: '', organization: '', email: '', type: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Transmission Failed. Network Error Detected.', 'error');
      setFormStatus('idle');
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen lg:h-[100dvh] w-full relative bg-[#F4F4F6] overflow-hidden flex flex-col justify-center pt-24 lg:pt-24 pb-16 lg:pb-20 border-t border-slate-200/60 z-0">

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl">
            {/* Sponsors Space */}
            <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-[0_8px_30px_rgba(37,99,235,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-orbitron font-bold text-sm lg:text-base text-slate-900 uppercase tracking-widest">Investment & Support</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Drive our research forward. We invite companies to provide technological resources, financial investments, and collaborative expertise.
              </p>
            </div>
          </div>
        </div>

        {/* ── MIDDLE: 50/50 Split (Form & Grid) ── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 relative z-20">

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

            <form className="flex flex-col gap-3 lg:gap-4 h-full relative z-10 min-h-0" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3 lg:gap-4 shrink-0">
                <div className="flex flex-col md:flex-row gap-3 lg:gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Contact Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      Organization / Company
                      <span className="font-mono text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">OPTIONAL</span>
                    </label>
                    <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="Acme Corp" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="contact@domain.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Partnership Type</label>
                  <select 
                    className="w-full bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm lg:text-base font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all appearance-none cursor-pointer" 
                    required 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="" disabled>Select Interest...</option>
                    <option value="sponsor">Sponsorship & Brand Visibility</option>
                    <option value="invest">Corporate Investment</option>
                    <option value="resource">Resource & Tech Support</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-h-0">
                <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 shrink-0">Message / Proposal</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full h-full min-h-[120px] lg:min-h-0 bg-white/90 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all" placeholder="How would you like to collaborate with us?" />
              </div>
              <button type="submit" disabled={formStatus !== 'idle'} className="shrink-0 w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-orbitron font-bold text-sm lg:text-base uppercase tracking-widest py-3 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none">
                {formStatus === 'idle' && <>Submit Request <ArrowRight size={18} /></>}
                {formStatus === 'sending' && <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>}
                {formStatus === 'sent' && '✓ Received'}
              </button>
            </form>
          </div>

          {/* RIGHT: Wrapper for Grid & Marquee */}
          <div className="flex flex-col h-full min-h-0 gap-4 lg:gap-6">

            {/* High-End Glassmorphic Prestige Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 relative">

              {sponsors.map((sponsor) => (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={sponsor.id}
                  className="sponsor-item bento-reveal h-full bg-white/95 border border-white rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] group relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] will-change-transform z-10 hover:z-20"
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
