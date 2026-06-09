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
      gsap.fromTo(
        '.reveal-fade',
        { opacity: 0, y: 30 },
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
    <section id="contact" ref={sectionRef} className="py-16 md:py-20 relative bg-[#F4F4F6] overflow-hidden min-h-screen flex flex-col justify-center border-t border-slate-200/50">
      
      {/* Background Graphic Watermark */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-[0.02] z-0">
        <h1 className="font-orbitron font-black text-[25vw] text-slate-900 tracking-tighter whitespace-nowrap">
          PARTNER
        </h1>
      </div>

      <div className="max-w-[1400px] w-[95%] mx-auto px-4 lg:px-8 relative z-10 flex flex-col">
        
        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* ── Left Column: Context, Widgets, and Sponsors ── */}
          <div className="flex flex-col justify-between gap-12 reveal-fade">
            
            {/* 1. Header Area */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6 bg-blue-100/50 px-4 py-2 rounded-full border border-blue-200">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-blue-700">
                  05 // Corporate Partnership
                </span>
              </div>
              <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-6">
                Sponsor Our <br/>
                <span className="text-blue-600">Mission</span>
              </h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg">
                Join industry leaders in empowering the next generation of aerospace innovators. Partner with BRACU Diganta to propel breakthrough research, engineering, and STEM education.
              </p>
            </div>

            {/* 2. Contact Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
              <a 
                href="mailto:sponsorship@bracudiganta.com"
                className="group flex flex-col gap-4 p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase mb-1">Direct Line</p>
                  <p className="font-bold text-slate-900 text-sm xl:text-base">sponsorship@<br/>bracudiganta.com</p>
                </div>
              </a>

              <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm group hover:border-slate-300 transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-all duration-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase mb-1">HQ Coordinates</p>
                  <p className="font-bold text-slate-900 text-sm xl:text-base">BRAC University<br/>Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* 3. Sponsor Marquee (Embedded at bottom left) */}
            <div className="pt-8 border-t border-slate-200/80 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#F4F4F6] to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#F4F4F6] to-transparent z-10 pointer-events-none" />
              
              <p className="text-[10px] font-mono tracking-[0.3em] font-bold text-slate-400 uppercase mb-4">
                Trusted by Industry Leaders
              </p>
              
              <div className="flex w-[200%] animate-marquee items-center">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="flex w-1/2 justify-around items-center px-4">
                    <div className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-all grayscale hover:grayscale-0 cursor-pointer group">
                      <div className="w-8 h-8 bg-slate-300 rounded-md flex items-center justify-center font-orbitron font-bold text-white text-sm group-hover:bg-slate-800 transition-colors">A</div>
                      <span className="font-orbitron font-bold text-sm tracking-widest uppercase">Aerospace</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-all grayscale hover:grayscale-0 cursor-pointer group">
                      <div className="w-8 h-8 rounded-full border-[3px] border-slate-300 group-hover:border-slate-800 transition-colors" />
                      <span className="font-orbitron font-bold text-sm tracking-widest uppercase">Orbital</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-all grayscale hover:grayscale-0 cursor-pointer group">
                      <div className="w-8 h-8 border-[3px] border-slate-300 rotate-45 group-hover:border-slate-800 transition-colors" />
                      <span className="font-orbitron font-bold text-sm tracking-widest uppercase">Nova Dynamics</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right Column: The Action Form ── */}
          <div className="reveal-fade h-full">
            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 h-full flex flex-col">
              
              <h3 className="font-orbitron font-bold text-2xl text-slate-900 mb-8 uppercase tracking-widest">
                Submit Proposal
              </h3>

              <form className="flex flex-col gap-6 flex-1 justify-between" onSubmit={handleSubmit}>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Company / Name</label>
                      <input 
                        type="text" 
                        id="name"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium" 
                        placeholder="Acme Aerospace" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Work Email</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium" 
                        placeholder="partner@example.com" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Inquiry Type</label>
                    <input 
                      type="text" 
                      id="subject"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium" 
                      placeholder="e.g. Platinum Sponsorship Request" 
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Partnership Details</label>
                    <textarea 
                      id="message"
                      rows={5} 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none font-medium" 
                      placeholder="Briefly describe how you'd like to collaborate..." 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={formStatus !== 'idle'}
                  className="mt-6 w-full bg-slate-900 text-white font-orbitron font-bold text-sm uppercase tracking-[0.15em] py-5 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-xl disabled:bg-slate-300 flex items-center justify-center gap-3 group"
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
                       Processing...
                     </>
                  )}
                  {formStatus === 'sent' && '✓ Inquiry Received'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
