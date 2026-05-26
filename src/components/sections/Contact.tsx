import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Send, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { name: 'Facebook', url: '#', label: 'fb' },
  { name: 'Instagram', url: '#', label: 'ig' },
  { name: 'LinkedIn', url: '#', label: 'in' },
  { name: 'GitHub', url: '#', label: 'gh' },
];

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
      gsap.fromTo(
        '.contact-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-grid', start: 'top 78%' },
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
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 relative z-10 bg-[#eef2f5] overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563EB]/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* ── Header ── */}
        <div className="contact-header mb-16 md:mb-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase mb-4">
            <span className="w-8 h-[1px] bg-[#2563EB]" />
            05 // Contact
            <span className="w-8 h-[1px] bg-[#2563EB]" />
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gray-900 tracking-tight uppercase">
            Establish Link
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base leading-relaxed mt-6">
            Whether you're interested in joining the team, sponsoring a mission,
            or collaborating on research — we'd love to hear from you.
          </p>
        </div>

        {/* ── Main Grid ── */}
        <div className="contact-grid grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left column — Info cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email card */}
            <div className="contact-card group bg-white/70 backdrop-blur-md border border-gray-200 hover:border-[#2563EB]/40 p-6 md:p-8 rounded-2xl transition-all duration-500 hover:bg-white shadow-sm hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#2563EB]" size={20} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-2">
                    Transmission
                  </h4>
                  <a
                    href="mailto:hello@bracudiganta.com"
                    className="text-base md:text-lg font-bold text-gray-900 hover:text-[#2563EB] transition-colors flex items-center gap-2"
                  >
                    hello@bracudiganta.com
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>

            {/* Location card */}
            <div className="contact-card group bg-white/70 backdrop-blur-md border border-gray-200 hover:border-[#2563EB]/40 p-6 md:p-8 rounded-2xl transition-all duration-500 hover:bg-white shadow-sm hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-[#2563EB]" size={20} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-2">
                    Coordinates
                  </h4>
                  <p className="text-base font-medium text-gray-900 leading-relaxed">
                    BRAC University<br />
                    Mohakhali Campus<br />
                    <span className="text-gray-500 text-sm">Dhaka, Bangladesh</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="contact-card flex items-center gap-3 pt-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  className="w-11 h-11 rounded-full bg-white/70 border border-gray-200 hover:border-[#2563EB] hover:bg-[#2563EB]/10 shadow-sm flex items-center justify-center text-gray-600 hover:text-[#2563EB] transition-all duration-300"
                >
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right column — Form */}
          <div className="contact-card lg:col-span-3 bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm p-8 md:p-10 rounded-3xl">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 pl-1">
                    Identification
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 pl-1">
                    Return Channel
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 pl-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 pl-1">
                  Payload
                </label>
                <textarea
                  placeholder="Your message..."
                  rows={5}
                  required
                  className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all resize-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus !== 'idle'}
                className="mt-2 w-full relative group bg-[#2563EB] hover:bg-[#1d4ed8] disabled:bg-[#2563EB]/50 text-white font-orbitron text-sm font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300 overflow-hidden flex items-center justify-center gap-2"
              >
                {formStatus === 'idle' && (
                  <>
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    Transmit Message
                  </>
                )}
                {formStatus === 'sending' && (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
                    Transmitting...
                  </span>
                )}
                {formStatus === 'sent' && (
                  <span className="flex items-center gap-2">
                    ✓ Message Delivered
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
