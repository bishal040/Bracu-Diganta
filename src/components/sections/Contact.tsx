import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, ArrowRight, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
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
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 relative bg-transparent overflow-hidden border-t border-black/10 dark:border-white/20">
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="contact-reveal text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase font-bold mb-4 block">Mission Control</span>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase mb-6">
            Establish Link
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-mono leading-relaxed max-w-xl mx-auto">
            Interested in sponsoring, joining the team, or just want to say hello? Drop us a transmission.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left — Info Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Email Card */}
            <a 
              href="mailto:hello@bracudiganta.com" 
              className="contact-reveal bg-white/40 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group flex items-start gap-4"
            >
              <div className="w-10 h-10 border border-black/20 dark:border-white/20 bg-white/50 dark:bg-black/50 flex items-center justify-center shrink-0 group-hover:border-black dark:group-hover:border-white transition-colors">
                <Mail className="w-4 h-4 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Secure Channel</p>
                <p className="font-mono text-black dark:text-white text-xs tracking-wider">hello@bracudiganta.com</p>
              </div>
            </a>

            {/* Location Card */}
            <div className="contact-reveal bg-white/40 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 flex items-start gap-4">
              <div className="w-10 h-10 border border-black/20 dark:border-white/20 bg-white/50 dark:bg-black/50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Base Coordinates</p>
                <p className="font-mono text-black dark:text-white text-xs tracking-wider mb-1">BRAC University</p>
                <p className="font-mono text-slate-600 dark:text-slate-400 text-xs tracking-wider">Dhaka, Bangladesh</p>
              </div>
            </div>

            {/* Quick Note */}
            <div className="contact-reveal bg-white dark:bg-black border border-black/10 dark:border-white/20 p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-10 dark:opacity-20 grayscale bg-cover bg-center mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
              <div className="relative z-10">
                <h4 className="font-black text-black dark:text-white text-lg uppercase tracking-widest mb-4">For Sponsors</h4>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed mb-6">
                  Select "Strategic Partnership" in the form and our relations team will transmit the full sponsorship manifest within 24 hours.
                </p>
                <a href="#sponsorship" className="inline-flex items-center gap-3 text-black dark:text-white font-mono text-xs tracking-widest uppercase font-bold hover:text-slate-500 dark:hover:text-slate-400 transition-colors">
                  View Packages <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="contact-reveal lg:col-span-8 bg-white/40 dark:bg-black/40 backdrop-blur-md p-8 md:p-12 border border-black/10 dark:border-white/10">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="contact-name" className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-black dark:bg-white" /> Ident
                  </label>
                  <input 
                    type="text" 
                    id="contact-name"
                    required
                    className="w-full bg-black/5 dark:bg-black/50 border-b border-black/20 dark:border-white/20 px-0 py-3 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-xs font-mono rounded-none" 
                    placeholder="ENTER NAME" 
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="contact-email" className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-black dark:bg-white" /> Comms Link
                  </label>
                  <input 
                    type="email" 
                    id="contact-email"
                    required
                    className="w-full bg-black/5 dark:bg-black/50 border-b border-black/20 dark:border-white/20 px-0 py-3 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-xs font-mono rounded-none" 
                    placeholder="ENTER EMAIL" 
                  />
                </div>
              </div>

              {/* Inquiry Type Dropdown */}
              <div className="flex flex-col gap-3">
                <label htmlFor="contact-type" className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-black dark:bg-white" /> Transmission Type
                </label>
                <select 
                  id="contact-type"
                  className="w-full bg-black/5 dark:bg-black/50 border-b border-black/20 dark:border-white/20 px-0 py-3 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors text-xs font-mono appearance-none cursor-pointer rounded-none"
                  defaultValue=""
                >
                  <option value="" disabled className="text-slate-500 dark:text-slate-600">SELECT INQUIRY TYPE</option>
                  <option value="sponsorship" className="bg-white dark:bg-black text-black dark:text-white">Strategic Partnership</option>
                  <option value="recruitment" className="bg-white dark:bg-black text-black dark:text-white">Crew Application</option>
                  <option value="media" className="bg-white dark:bg-black text-black dark:text-white">Press & Media</option>
                  <option value="general" className="bg-white dark:bg-black text-black dark:text-white">General Comms</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="contact-message" className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-black dark:bg-white" /> Data Payload
                </label>
                <textarea 
                  id="contact-message"
                  rows={4} 
                  required
                  className="w-full bg-black/5 dark:bg-black/50 border border-black/20 dark:border-white/20 p-4 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-xs font-mono resize-none rounded-none" 
                  placeholder="ENTER MESSAGE..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={formStatus !== 'idle'}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-mono text-xs tracking-widest font-bold uppercase transition-all hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {formStatus === 'idle' && <><Send className="w-4 h-4" /> Transmit Signal</>}
                {formStatus === 'sending' && <span className="animate-pulse">Encrypting & Sending...</span>}
                {formStatus === 'sent' && 'Transmission Received'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
