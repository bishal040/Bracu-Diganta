import React, { useEffect, useState } from 'react';
import { Mail, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../App';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const links = ['Overview', 'Projects', 'Achievements', 'Team', 'Sponsorship'];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-black border-b border-black/10 dark:border-white/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between">
            
            {/* Logo */}
            <div className="flex lg:flex-1">
              <button onClick={scrollToTop} className="flex items-center gap-2 -m-1.5 p-1.5 group">
                <img 
                  src="/Diganta%20Logo.png" 
                  alt="BRACU Diganta" 
                  className={`h-14 object-contain opacity-90 group-hover:opacity-100 transition-opacity ${isDark ? 'brightness-0 invert' : ''}`} 
                />
              </button>
            </div>

            {/* Desktop Nav Links — Center */}
            <div className="hidden lg:flex lg:gap-x-8">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="inline-flex items-center justify-center text-[11px] font-mono tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors relative group py-2"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA — Right */}
            <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6">
              
              <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <a href="#contact">
                <button className="inline-flex items-center justify-center gap-3 bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black h-10 px-6 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300">
                  <Mail className="w-3.5 h-3.5" />
                  Transmit
                </button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center p-2.5 text-black dark:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-black lg:hidden">
          <div className="flex flex-col h-full pt-24 px-6 pb-8">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={handleLinkClick}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors uppercase font-mono tracking-widest"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <a
                href="#contact"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full rounded-none bg-black dark:bg-white text-white dark:text-black py-4 font-mono text-xs tracking-widest uppercase font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
