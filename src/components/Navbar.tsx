import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './ui/MagneticButton';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;

    // Only show the solid navbar after scrolling past the entire sequence
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: '100vh top',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => st.kill();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const links = ['Projects', 'Research', 'Achievements', 'Team', 'Contact'];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    setMobileMenuOpen(false);
    // Smooth scroll is handled natively or by lenis if configured, just close menu
  };

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled || mobileMenuOpen
            ? 'py-2 lg:py-2 bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-gray-200/60 shadow-sm' 
            : 'py-4 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className={`font-aeonik font-bold text-lg tracking-tight cursor-pointer flex items-center gap-2.5 transition-colors duration-500 z-50 ${
              scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-gray-800'
            }`}
            onClick={scrollToTop}
          >
            <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-glow-pulse"></span>
            BRACU Diganta
          </div>

          {/* Desktop Links — only visible after scrolling past sequence */}
          <div className={`hidden lg:flex items-center gap-8 transition-all duration-500 ${
            scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            {links.map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-gray-500 hover:text-gray-900 text-[13px] font-medium transition-colors duration-300 tracking-wide"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className={`hidden lg:flex items-center gap-3 transition-all duration-500 ${
            scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            <MagneticButton 
              className="bg-[#2563EB] text-white hover:bg-gray-900 border border-transparent !px-5 !py-2 text-[13px] shadow-md hover:shadow-lg"
              onClick={() => document.getElementById('sponsor')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Support Mission
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className={`lg:hidden flex items-center transition-opacity duration-500 z-50 ${
            scrolled || mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 p-2 -mr-2"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col justify-center px-8 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 items-start">
          {links.map((link, idx) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              onClick={(e) => handleLinkClick(e, link)}
              className={`text-4xl font-orbitron font-bold text-gray-900 transition-all duration-500 delay-${idx * 100} ${
                mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {link}
            </a>
          ))}
          <div 
            className={`mt-8 transition-all duration-500 delay-500 ${
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('sponsor')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#2563EB] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide shadow-lg"
            >
              Support Mission
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
