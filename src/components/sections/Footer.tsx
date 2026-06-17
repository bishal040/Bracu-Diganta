import React, { useRef } from 'react';
import * as Icons from 'lucide-react';
import { ArrowUp, ArrowUpRight, Send, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MouseCrosshair } from '../ui/MouseCrosshair';
import { sponsorsData } from '../../data/sponsors';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const footerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    if (!isHomePage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Mission Overview', type: 'route', target: '/' },
    { label: 'Project Archive', type: 'route', target: '/missions' },
    { label: 'CanSat 2025', type: 'route', target: '/project/cansat-2024' },
    { label: 'Crew Directory', type: 'route', target: '/team' }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    if (link.type === 'route') {
      navigate(link.target);
      window.scrollTo({ top: 0, behavior: link.target === '/' ? 'smooth' : 'instant' });
      return;
    }
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="relative bg-[#eef2f5] w-full pt-20 pb-8 px-4 md:px-8 border-t border-slate-200 overflow-hidden">

      {/* Background tracking crosshair (restricted to footer) */}
      <MouseCrosshair parentRef={footerRef} />

      <div className="relative z-10 max-w-[90rem] mx-auto">

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-16">

          {/* Main Hero Bento (Left) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-mono text-[10px] tracking-widest font-bold uppercase mb-8">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                BRAC University
              </div>

              <h3 className="font-orbitron font-black text-5xl md:text-6xl text-slate-900 tracking-tighter uppercase leading-[0.9] mb-6">
                BRACU<br />
                <span className="text-blue-600">DIGANTA</span>
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-4">
                Pioneering autonomous telemetry, satellite systems, and next-generation aerospace research in Bangladesh.
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full mt-8">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isHomePage) {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group/btn relative w-full overflow-hidden rounded-2xl px-6 py-5 shadow-xl transition-all hover:scale-[1.02] animate-bulb"
              >
                <div className="relative z-10 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-widest">
                  Become a Sponsor
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                </div>
              </button>

              {/* Animated Sponsor Marquee inside the bento */}
              <div className="w-full relative py-3 z-30 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-[marquee_20s_linear_infinite]">
                  {[1, 2].map((set) => (
                    <div key={set} className="flex items-center gap-8 px-4 shrink-0">
                      {sponsorsData.slice(0, 5).map((sponsor, idx) => {
                        const Icon = Icons[sponsor.iconName as keyof typeof Icons] as React.ElementType || Icons.Globe;
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            {sponsor.logoUrl ? (
                              <img src={sponsor.logoUrl} alt={sponsor.name} className="h-10 w-auto max-w-[100px] lg:max-w-[140px] object-contain mix-blend-multiply" />
                            ) : (
                              <>
                                <div className="w-6 h-6 flex items-center justify-center text-slate-500 shadow-sm">
                                  <Icon size={16} />
                                </div>
                                <span className="font-orbitron font-black text-[10px] tracking-widest uppercase text-slate-500">{sponsor.name}</span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Stacked Bentos) */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">

            {/* Top Wide Bento: Newsletter / Contact */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
              {/* Decorative graphic inside the card */}
              <div className="absolute -right-10 -top-10 text-slate-50 opacity-50 pointer-events-none transform rotate-12">
                <Send size={180} strokeWidth={0.5} />
              </div>

              <div className="relative z-10 w-full md:w-auto">
                <h4 className="font-orbitron font-bold text-2xl text-slate-900 uppercase mb-2">Send Us A Message</h4>
                <p className="text-slate-500 text-sm max-w-xs font-medium">Get in touch with us for mission updates and research breakthroughs.</p>
              </div>

              <div className="relative z-20 w-full md:w-auto flex-1 max-w-md mt-4 md:mt-0">
                <div className="grid grid-cols-1 sm:flex sm:flex-row gap-4 sm:gap-1.5 sm:p-1.5 bg-transparent sm:bg-slate-50 sm:border border-slate-200 rounded-2xl w-full">
                  <input
                    type="email"
                    placeholder="ENTER EMAIL ADDRESS"
                    className="w-full bg-slate-50 sm:bg-transparent border border-slate-200 sm:border-transparent rounded-xl outline-none px-5 py-4 sm:py-3 font-mono text-xs text-slate-900 placeholder:text-slate-400 font-bold tracking-wider focus:bg-white focus:border-blue-500 transition-all z-10"
                  />
                  <button className="w-full sm:w-auto flex justify-center items-center bg-blue-600 hover:bg-slate-900 text-white rounded-xl px-8 py-4 sm:py-3 font-mono text-[11px] tracking-widest font-bold uppercase transition-all gap-2 shadow-lg shadow-blue-600/20 sm:shadow-none z-10 min-h-[50px]">
                    <Send size={14} /> Send
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Split Bentos: Navigation & Network */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">

              {/* Navigation Bento */}
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between">
                <h4 className="font-mono text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <MapPin size={12} /> System Navigation
                </h4>
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.type === 'route' ? link.target : `#${link.target}`}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors w-fit group flex items-center gap-3"
                    >
                      <span className="w-6 h-[1px] bg-slate-200 group-hover:w-8 group-hover:bg-blue-600 transition-all duration-300" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Social Network Bento */}
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between">
                <h4 className="font-mono text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <ArrowUpRight size={12} /> Social Network
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61574161791951', icon: <FacebookIcon className="w-5 h-5" /> },
                    { name: 'LinkedIn', url: '#', icon: <LinkedinIcon className="w-5 h-5" /> },
                    { name: 'Instagram', url: '#', icon: <InstagramIcon className="w-5 h-5" /> }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target={social.url !== '#' ? '_blank' : undefined}
                      rel={social.url !== '#' ? 'noreferrer' : undefined}
                      className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 font-mono text-[10px] uppercase tracking-widest font-bold transition-all border border-transparent hover:border-blue-100"
                    >
                      {social.icon}
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Deep Footer Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-12">
            <img src={`${import.meta.env.BASE_URL}Bracu%20Logo.png`} alt="BRAC University Logo" className="h-14 md:h-16 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 mix-blend-multiply" />
            <img src={`${import.meta.env.BASE_URL}Lasset%20Logo.png`} alt="Lasset Logo" className="h-14 md:h-16 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 mix-blend-multiply" />
            <img src={`${import.meta.env.BASE_URL}Diganta%20Logo.png`} alt="Diganta Logo" className="h-20 md:h-24 object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 mix-blend-multiply" />
          </div>

          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest text-center">
            © {new Date().getFullYear()} BRACU DIGANTA. ALL RIGHTS RESERVED.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 font-mono text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors group"
          >
            Return to Top
            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-blue-600 transition-all">
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
