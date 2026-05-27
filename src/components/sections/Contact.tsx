import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Stagger the bento boxes in
      gsap.fromTo(
        '.bento-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
    setTimeout(() => setFormStatus('idle'), 4000);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 relative bg-[#F4F4F6] overflow-hidden">
      
      {/* Background Graphic (Huge Watermark) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] z-0">
        <h1 className="font-orbitron font-black text-[20vw] text-slate-900 tracking-tighter whitespace-nowrap">
          CONTACT
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Widgets ── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Title Card */}
          <div className="bento-card bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-slate-100 flex-1 flex flex-col justify-center">
            <span className="text-blue-600 font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4">
              05 // Establish Link
            </span>
            <h2 className="font-orbitron text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-6 break-words">
              Start<br/>
              <span className="text-blue-600">Transmission</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Reach out to our command center for sponsorships, team applications, or general inquiries. Our comms are always open.
            </p>
          </div>
          
          {/* Mini Cards Row */}
          <div className="grid grid-cols-2 gap-6">
             
             {/* Email Widget */}
             <a 
               href="mailto:hello@bracudiganta.com" 
               className="bento-card block bg-blue-600 text-white rounded-[2rem] p-8 aspect-square relative overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
             >
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-widest font-mono mb-1">Direct Line</p>
                    <p className="font-bold text-sm md:text-base leading-tight">hello@<br/>bracudiganta.com</p>
                  </div>
                </div>
             </a>

             {/* Location Widget (Interactive Radar) */}
             <div className="bento-card bg-white rounded-[2rem] p-8 aspect-square relative overflow-hidden shadow-sm border border-slate-100 group">
                
                {/* CSS Animated Radar Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.2)_1px,transparent_1px)] bg-[size:15px_15px]" />
                  <div className="absolute w-[150%] h-[150%] rounded-full border border-blue-500/30" />
                  <div className="absolute w-[100%] h-[100%] rounded-full border border-blue-500/40" />
                  <div className="absolute w-[50%] h-[50%] rounded-full border border-blue-500/50" />
                  <div 
                    className="absolute w-full h-full rounded-full origin-center" 
                    style={{ background: 'conic-gradient(from 0deg, transparent 75%, rgba(37,99,235,0.4) 100%)', animation: 'radar-spin 3s linear infinite' }} 
                  />
                  {/* Blip */}
                  <div className="absolute w-2 h-2 bg-blue-600 rounded-full top-[40%] right-[30%] shadow-[0_0_10px_rgba(37,99,235,1)] animate-pulse" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
                  <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center border border-slate-100">
                    <MapPin size={24} className="text-slate-900" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mb-1">HQ Coordinates</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base leading-tight">BRAC University<br/>Dhaka, BD</p>
                  </div>
                </div>
             </div>

          </div>
        </div>

        {/* ── Right Column: Form Card ── */}
        <div className="bento-card lg:col-span-7 bg-white rounded-[2.5rem] p-10 md:p-14 shadow-sm border border-slate-100">
          <form className="flex flex-col gap-8 h-full justify-between" onSubmit={handleSubmit}>
            
            <div className="space-y-8">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="name" className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all font-medium" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all font-medium" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col gap-3">
                <label htmlFor="subject" className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all font-medium" 
                  placeholder="What is this transmission regarding?" 
                />
              </div>

              {/* Row 3 */}
              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Message Payload</label>
                <textarea 
                  id="message"
                  rows={5} 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all resize-none font-medium" 
                  placeholder="Transmit your message details here..." 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={formStatus !== 'idle'}
              className="mt-8 w-full bg-slate-900 text-white font-orbitron font-bold uppercase tracking-[0.2em] py-6 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.3)] disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-3 group"
            >
              {formStatus === 'idle' && (
                <>
                  Send Transmission
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
              {formStatus === 'sending' && (
                 <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Transmitting...
                 </>
              )}
              {formStatus === 'sent' && '✓ Link Established'}
            </button>

          </form>
        </div>

      </div>

      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
