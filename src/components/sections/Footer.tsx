import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white w-full overflow-hidden border-t border-gray-200/50">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Subtle pulsing bottom radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.15)_0%,rgba(255,255,255,0)_70%)] pointer-events-none animate-[pulseGlow_4s_ease-in-out_infinite]" />

      {/* Retro CRT Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="w-full h-12 bg-gradient-to-b from-transparent via-[#2563EB]/10 to-transparent animate-[scanline_6s_linear_infinite]" />
      </div>

      {/* Infinite Scrolling Marquee Background Typography */}
      <div className="absolute top-[40%] left-0 w-[200%] overflow-hidden pointer-events-none flex opacity-[0.02] select-none z-0" style={{ animation: 'marquee 40s linear infinite' }}>
        <h2 className="font-orbitron font-black text-[18vw] leading-none whitespace-nowrap text-gray-900 pr-[10vw]">
          BRACU DIGANTA
        </h2>
        <h2 className="font-orbitron font-black text-[18vw] leading-none whitespace-nowrap text-gray-900 pr-[10vw]">
          BRACU DIGANTA
        </h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-8">

        {/* Pre-footer CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-10">
          <div className="max-w-2xl relative">
            <h3 className="font-orbitron font-bold text-5xl md:text-7xl text-gray-900 mb-6 leading-tight tracking-tight relative z-10">
              READY TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-cyan-400 to-[#2563EB] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">LAUNCH?</span>
            </h3>
            {/* Glitch layers behind the text */}
            <h3 className="font-orbitron font-bold text-5xl md:text-7xl text-[#2563EB]/20 absolute top-0 left-1 blur-[2px] animate-pulse pointer-events-none">
              READY TO <br /> LAUNCH?
            </h3>
            <h3 className="font-orbitron font-bold text-5xl md:text-7xl text-cyan-500/20 absolute -top-1 -left-1 blur-[1px] animate-[pulse_2s_ease-in-out_infinite_reverse] pointer-events-none">
              READY TO <br /> LAUNCH?
            </h3>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mt-4 relative z-10">
              Join the mission. Support the next generation of aerospace engineers at BRAC University.
            </p>
          </div>

          <button
            className="group relative w-64 h-16 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex-shrink-0 transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:border-[#2563EB]"
            onClick={() => document.getElementById('sponsor')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {/* Background Base Text */}
            <div className="absolute inset-0 flex items-center justify-center pl-10">
              <span className="font-mono text-xs tracking-[0.3em] font-bold text-gray-400 group-hover:text-transparent transition-colors duration-300 z-10">
                GET INVOLVED
              </span>
            </div>

            {/* The active blue background that sweeps in */}
            <div className="absolute top-0 left-0 h-full w-16 group-hover:w-full bg-[#2563EB] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-0 rounded-full" />

            {/* The text inside the blue background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 z-10">
              <span className="font-mono text-xs tracking-[0.3em] font-bold text-white flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                INITIATE
              </span>
            </div>

            {/* The Slider Handle */}
            <div className="absolute top-1 left-1 w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center group-hover:translate-x-[192px] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 border border-gray-200">
              <ArrowUpRight className="w-5 h-5 text-gray-900 group-hover:text-[#2563EB] transition-colors" />
            </div>
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 mb-16" />

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24">

          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-5 h-5">
                <span className="absolute w-2.5 h-2.5 bg-[#2563EB] rounded-full"></span>
                <span className="absolute w-5 h-5 border border-[#2563EB] rounded-full animate-ping opacity-75"></span>
              </div>
              <span className="font-orbitron font-bold text-xl tracking-widest text-gray-900">
                BRACU<span className="text-[#2563EB]">DIGANTA</span>
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm max-w-xs leading-relaxed">
              Pioneering aerospace and satellite technology research at BRAC University, Bangladesh.
            </p>
            <a href="mailto:contact@bracudiganta.com" className="font-mono text-sm font-bold text-gray-900 hover:text-[#2563EB] transition-colors mt-4 inline-flex items-center gap-2 group w-fit">
              INITIATE COMMS
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">Navigation</h4>
            {['Projects', 'Research', 'Achievements', 'Team'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors w-fit group flex items-center gap-2"
              >
                <span className="w-0 h-px bg-[#2563EB] group-hover:w-4 transition-all duration-300" />
                {link}
              </a>
            ))}
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">Social Network</h4>
            {['Facebook', 'LinkedIn', 'Instagram', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-600 hover:text-[#2563EB] font-medium text-sm transition-colors w-fit group flex items-center gap-2"
              >
                {social}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-mono text-xs text-gray-500 uppercase tracking-wider text-center md:text-left">
            © {new Date().getFullYear()} BRACU DIGANTA. ALL SYSTEMS NOMINAL.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 font-mono text-xs font-bold text-gray-900 uppercase tracking-widest hover:text-[#2563EB] transition-colors group"
          >
            Back to Top
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#2563EB] group-hover:bg-blue-50 transition-all">
              <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
