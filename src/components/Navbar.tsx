import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom hook for magnetic effect
function useMagnetic(strength = 0.2) {
  const ref = useRef<any>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: position.x,
      y: position.y,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, [position]);

  return { ref, handleMouseMove, handleMouseLeave };
}

export const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  const [scrolled, setScrolled] = useState(!isHomePage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;

    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    // On homepage, check initial scroll position
    if (window.scrollY > window.innerHeight) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    // Show solid navbar after scrolling past the hero sequence on homepage
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: '100vh top',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => {
      if (st) st.kill();
    };
  }, [isHomePage]);

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

  const navLinks = [
    { label: 'Home', type: 'route', target: '/' },
    { label: 'Projects', type: 'hash', target: 'projects' },
    { label: 'CanSat', type: 'route', target: '/project/cansat-2024' },
    { label: 'Achievements', type: 'hash', target: 'achievements' },
    { label: 'Team', type: 'route', target: '/team' },
    { label: 'Contact', type: 'hash', target: 'contact' }
  ];

  const scrollToTop = () => {
    if (!isHomePage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.type === 'route') {
      navigate(link.target);
      if (link.target === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      return;
    }

    if (!isHomePage) {
      navigate('/');
      // Delay scrolling to allow homepage to mount
      setTimeout(() => {
        document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dockRef = useRef<HTMLDivElement>(null);
  const [hoverRect, setHoverRect] = useState({ left: 0, width: 0, opacity: 0 });

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!dockRef.current) return;
    const linkRect = e.currentTarget.getBoundingClientRect();
    const dockRect = dockRef.current.getBoundingClientRect();
    setHoverRect({
      left: linkRect.left - dockRect.left,
      width: linkRect.width,
      opacity: 1
    });
  };

  const handleLinkLeave = () => {
    setHoverRect(prev => ({ ...prev, opacity: 0 }));
  };

  // Magnetic instances
  const logoMagnetic = useMagnetic(0.2);
  const ctaMagnetic = useMagnetic(0.2);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-2 left-0 w-full px-4 md:px-8 z-50 transition-all duration-700 ease-out pointer-events-none flex justify-between items-start pt-2"
      >
        {/* 1. LOGO PILL */}
        <div
          className="pointer-events-auto"
          ref={logoMagnetic.ref}
          onMouseMove={logoMagnetic.handleMouseMove}
          onMouseLeave={logoMagnetic.handleMouseLeave}
        >
          {/* Logo */}
          <div
            className={`cursor-pointer flex items-center gap-3 shrink-0 transition-all duration-700 rounded-full bg-white/30 backdrop-blur-2xl backdrop-saturate-[2.0] border border-white/50 shadow-[0_8px_32px_rgba(37,99,235,0.15)] ${
              scrolled ? 'px-4 py-2' : 'px-5 py-3'
            }`}
            onClick={scrollToTop}
          >
            <img 
              src="/Diganta%20Logo.png" 
              alt="BRACU Diganta Logo" 
              className={`object-contain transition-all duration-500 ${scrolled ? 'h-8' : 'h-12'}`} 
            />
            <span className={`font-orbitron font-black tracking-widest text-slate-900 uppercase transition-all duration-500 ${scrolled ? 'text-sm' : 'text-lg'}`}>
              Diganta
            </span>
          </div>
        </div>

        {/* 2. LINKS DOCK */}
        <div
          ref={dockRef}
          onMouseLeave={handleLinkLeave}
          className="pointer-events-auto hidden lg:flex items-center gap-1 transition-all duration-700 rounded-full p-1.5 relative bg-white/30 backdrop-blur-2xl backdrop-saturate-[2.0] border border-white/50 shadow-[0_8px_32px_rgba(37,99,235,0.15)] opacity-100 translate-y-0"
        >
          {/* Sliding Magic Highlight Pill */}
          <div
            className="absolute top-1.5 bottom-1.5 bg-white/70 rounded-full transition-all duration-300 ease-out shadow-sm border border-white/50 pointer-events-none"
            style={{
              left: `${hoverRect.left}px`,
              width: `${hoverRect.width}px`,
              opacity: hoverRect.opacity,
              transform: hoverRect.opacity === 0 ? 'scale(0.8)' : 'scale(1)'
            }}
          />

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.type === 'route' ? link.target : `#${link.target}`}
              onClick={(e) => handleLinkClick(e, link)}
              onMouseEnter={handleLinkHover}
              className="group relative px-6 py-2.5 text-gray-700 hover:text-[#2563EB] text-[11px] font-mono font-bold transition-colors duration-300 tracking-[0.15em] uppercase rounded-full overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 duration-300" />
                {link.label}
              </span>
            </a>
          ))}
        </div>

        {/* 3. CTA PILL */}
        <div className="pointer-events-auto hidden lg:block transition-all duration-700 opacity-100 translate-y-0">
          <div
            ref={ctaMagnetic.ref}
            onMouseMove={ctaMagnetic.handleMouseMove}
            onMouseLeave={ctaMagnetic.handleMouseLeave}
          >
            <button
              className="relative overflow-hidden group bg-[#2563EB] text-white rounded-full px-8 py-3 text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-3"
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
            >
              <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2.5s_linear_infinite]" />
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Support Mission
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="pointer-events-auto lg:hidden flex items-center transition-all duration-500 rounded-full z-50 bg-white/30 backdrop-blur-2xl border border-white/50 shadow-sm p-2 opacity-100">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative w-12 h-12 flex items-center justify-center transition-all duration-500 group cursor-pointer"
            aria-label="Toggle Menu"
          >
            {/* Staggered Lines Menu (Animated Loop State) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
              <style>{`
                 @keyframes lineWave1 { 0%, 100% { width: 24px; } 50% { width: 14px; } }
                 @keyframes lineWave2 { 0%, 100% { width: 14px; } 50% { width: 24px; } }
                 @keyframes lineWave3 { 0%, 100% { width: 8px; } 50% { width: 20px; } }
               `}</style>
              <div className="w-6 flex justify-end"><span className="h-[2px] bg-gray-800 group-hover:bg-[#2563EB] group-hover:shadow-[0_0_8px_#2563EB] rounded-full transition-colors duration-300" style={{ animation: 'lineWave1 2.5s ease-in-out infinite' }} /></div>
              <div className="w-6 flex justify-end"><span className="h-[2px] bg-gray-800 group-hover:bg-[#2563EB] group-hover:shadow-[0_0_8px_#2563EB] rounded-full transition-colors duration-300" style={{ animation: 'lineWave2 3s ease-in-out infinite' }} /></div>
              <div className="w-6 flex justify-end"><span className="h-[2px] bg-gray-800 group-hover:bg-[#2563EB] group-hover:shadow-[0_0_8px_#2563EB] rounded-full transition-colors duration-300" style={{ animation: 'lineWave3 2.5s ease-in-out infinite' }} /></div>
            </div>

            {/* Sci-Fi Cross (Open State) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-180'}`}>
              <div className="relative w-6 h-6">
                {/* X Lines */}
                <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-gray-900 rounded-full -translate-y-1/2 rotate-45 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-gray-900 rounded-full -translate-y-1/2 -rotate-45 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                {/* Diamond Border */}
                <div className="absolute inset-[-6px] border-[1.5px] border-gray-900/30 rotate-45 scale-[0.7]" />
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl border-t border-gray-200 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col justify-center px-8 overflow-hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-200'
          }`}
      >
        {/* Deep Space Background with Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.05)_0%,transparent_50%)] pointer-events-none" />

        {/* Solar System SVG Diagram */}
        <div className={`absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[160vw] h-[160vw] max-w-[800px] max-h-[800px] pointer-events-none transition-all duration-[1500ms] ease-out ${mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
            <defs>
              <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <style>{`
              @keyframes orbit {
                100% { transform: rotate(360deg); }
              }
              @keyframes orbit-reverse {
                100% { transform: rotate(-360deg); }
              }
              .orbit-slow { animation: orbit 180s linear infinite; transform-origin: 100px 100px; }
              .orbit-med { animation: orbit 90s linear infinite; transform-origin: 100px 100px; }
              .orbit-fast { animation: orbit 45s linear infinite; transform-origin: 100px 100px; }
              .orbit-rev { animation: orbit-reverse 120s linear infinite; transform-origin: 100px 100px; }
            `}</style>

            {/* Orbit Paths */}
            <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.3" strokeDasharray="2 4" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.2" strokeDasharray="1 6" />

            {/* Earth (Center) */}
            <circle cx="100" cy="100" r="6" fill="#2563EB" filter="url(#glow)" className="animate-pulse" />
            <circle cx="100" cy="100" r="14" fill="url(#earthGlow)" className="animate-ping opacity-30" style={{ animationDuration: '3s' }} />

            {/* Inner Orbit (ISS / Satellites) */}
            <g className="orbit-fast">
              <rect x="98" y="68" width="4" height="4" fill="#1f2937" opacity="0.8" />
            </g>

            {/* Middle Orbit (Asteroid/Probe) */}
            <g className="orbit-rev">
              <circle cx="100" cy="50" r="1" fill="#1f2937" opacity="0.6" />
            </g>

            {/* Outer Orbit (Moon) */}
            <g className="orbit-slow">
              <circle cx="100" cy="25" r="3" fill="#4b5563" filter="url(#glow)" />
              <circle cx="100" cy="25" r="8" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            </g>

            {/* Telemetry Path: Earth to Moon */}
            <g className="orbit-slow">
              <path d="M 100 90 L 100 35" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="1 3" className="opacity-40" />
              {/* Traveling Ship Dot */}
              <circle cx="100" cy="90" r="1.5" fill="cyan" filter="url(#glow)">
                <animate attributeName="cy" values="90;35;90" dur="8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0" dur="8s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        <div className="relative flex flex-col gap-8 items-start text-left z-10">
          <div className={`mb-4 flex items-center gap-3 transition-all duration-500 delay-100 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse shadow-[0_0_10px_#2563EB]"></span>
            <span className="font-mono text-[10px] text-[#2563EB] tracking-[0.4em] uppercase">Navigation Active</span>
          </div>

          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.type === 'route' ? link.target : `#${link.target}`}
              onClick={(e) => handleLinkClick(e, link)}
              className={`relative flex items-center gap-4 text-3xl font-mono font-bold text-gray-400 hover:text-gray-900 transition-all duration-500 group ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}
              style={{ transitionDelay: `${(idx + 2) * 100}ms` }}
            >
              <span className="text-[#2563EB] text-xl opacity-0 group-hover:opacity-100 transition-all font-mono tracking-widest translate-x-4 group-hover:translate-x-0">[</span>
              {link.label.toUpperCase()}
              <span className="text-[#2563EB] text-xl opacity-0 group-hover:opacity-100 transition-all font-mono tracking-widest -translate-x-4 group-hover:translate-x-0">]</span>
            </a>
          ))}

          <div
            className={`mt-12 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
            style={{ transitionDelay: `${(navLinks.length + 2) * 100}ms` }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (!isHomePage) {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="relative overflow-hidden group bg-transparent border border-[#2563EB] text-[#2563EB] hover:text-white px-10 py-5 rounded-none text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300"
            >
              <div className="absolute inset-0 bg-[#2563EB] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
              <span className="relative z-10 flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-ping"></span>
                ENGAGE SUPPORT
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
