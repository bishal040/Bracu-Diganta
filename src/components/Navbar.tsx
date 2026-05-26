import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

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

  const links = ['Projects', 'Research', 'Achievements', 'Team', 'Contact'];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'py-2 bg-white/80 backdrop-blur-xl backdrop-saturate-[1.8] border-b border-gray-200/60 shadow-sm' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className={`font-aeonik font-bold text-lg tracking-tight cursor-pointer flex items-center gap-2.5 transition-colors duration-500 ${
            scrolled ? 'text-gray-900' : 'text-gray-800'
          }`}
          onClick={scrollToTop}
        >
          <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-glow-pulse"></span>
          BRACU Diganta
        </div>

        {/* Links — only visible after scrolling past sequence */}
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

        {/* CTA */}
        <div className={`flex items-center gap-3 transition-all duration-500 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <MagneticButton 
            className="bg-[#2563EB] text-white hover:bg-gray-900 border border-transparent !px-5 !py-2 text-[13px] shadow-md hover:shadow-lg"
            onClick={() => document.getElementById('sponsor')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Support Mission
          </MagneticButton>
        </div>

      </div>
    </nav>
  );
};
