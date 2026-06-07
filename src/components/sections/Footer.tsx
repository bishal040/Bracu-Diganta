import React from 'react';
import { ArrowUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useTheme } from '../../App';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white dark:bg-black w-full overflow-hidden border-t border-black/10 dark:border-white/20">

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 pt-24 pb-8">

        {/* Pre-footer CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-10">
          <div className="max-w-xl">
            <h3 className="font-sans font-black text-4xl md:text-6xl text-black dark:text-white mb-4 leading-tight tracking-tighter uppercase">
              Ready to Launch?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-mono tracking-widest uppercase">
              Join the mission. Support the next generation of aerospace engineers at BRAC University.
            </p>
          </div>

          <a
            href="#sponsorship"
            className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-mono text-xs tracking-widest font-bold uppercase hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shrink-0 border border-black dark:border-white"
          >
            Initiate Link <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="w-full h-px bg-black/10 dark:bg-white/20 mb-16" />

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-20">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="font-black text-2xl tracking-tighter text-black dark:text-white uppercase">
                BRACU DIGANTA
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs font-mono uppercase tracking-widest leading-relaxed max-w-xs">
              Pioneering aerospace and satellite technology research at BRAC University, Bangladesh.
            </p>
            <a href="mailto:hello@bracudiganta.com" className="font-mono text-[10px] text-black dark:text-white hover:text-slate-500 dark:hover:text-slate-400 transition-colors inline-flex items-center gap-2 w-fit uppercase tracking-[0.2em] border-b border-black/20 dark:border-white/20 pb-1 mt-2">
              hello@bracudiganta.com
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.3em] uppercase mb-4">Systems</h4>
            {['Projects', 'Achievements', 'Team', 'Sponsorship', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-mono text-xs tracking-widest uppercase transition-colors w-fit flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-black/20 dark:bg-white/20 group-hover:bg-black dark:group-hover:bg-white transition-colors" />
                {link}
              </a>
            ))}
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.3em] uppercase mb-4">Comms Array</h4>
            {['Facebook', 'LinkedIn', 'Instagram', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-mono text-xs tracking-widest uppercase transition-colors w-fit inline-flex items-center gap-2 group"
              >
                <span className="w-1 h-1 bg-black/20 dark:bg-white/20 group-hover:bg-black dark:group-hover:bg-white transition-colors" />
                {social}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-black/10 dark:bg-white/20 mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-12">
              <img src="/Bracu%20Logo.png" alt="BRAC University Logo" className={`h-12 md:h-16 object-contain grayscale opacity-60 hover:opacity-100 transition-all duration-300 ${isDark ? 'invert' : ''}`} />
              <img src="/Lasset%20Logo.png" alt="Lasset Logo" className={`h-12 md:h-16 object-contain grayscale opacity-60 hover:opacity-100 transition-all duration-300 ${isDark ? 'invert' : ''}`} />
              <img src="/Diganta%20Logo.png" alt="Diganta Logo" className={`h-20 md:h-24 object-contain grayscale opacity-60 hover:opacity-100 transition-all duration-300 ${isDark ? 'invert' : ''}`} />
            </div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} BRACU Diganta. All systems nominal.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex flex-col items-center gap-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-black dark:hover:text-white transition-colors group"
          >
            <div className="w-12 h-12 border border-black/20 dark:border-white/20 flex items-center justify-center group-hover:border-black dark:group-hover:border-white group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-all">
              <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            </div>
            Ascend
          </button>
        </div>

      </div>
    </footer>
  );
};
