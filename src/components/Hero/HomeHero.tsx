import React, { useState, useEffect } from 'react';

const IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=2000&auto=format&fit=crop"
];

export const HomeHero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000); // 4 seconds per image
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent hero-cover-wrapper flex flex-col md:flex-row">

      {/* LEFT HALF (Top in mobile, Left in desktop) */}
      <div
        className="hero-left-half relative w-full md:w-1/2 h-1/2 md:h-full bg-[#eef2f5] flex flex-col items-center justify-center p-6 md:p-12 will-change-transform z-10"
      >
        <div className="relative z-10 text-center flex flex-col items-center">
          <p className="text-telemetry-cyan font-mono tracking-[0.2em] md:tracking-[0.4em] text-sm md:text-base uppercase mb-4 md:mb-8">
            BRAC University Aerospace Research
          </p>
          <h1 className="font-orbitron text-6xl sm:text-7xl md:text-7xl lg:text-[8rem] xl:text-[9rem] font-black text-gray-900 tracking-[-0.04em] leading-[0.9] uppercase whitespace-nowrap">
            BRACU
            <br />
            DIGANTA
          </h1>
          <div className="w-20 md:w-32 h-[4px] bg-telemetry-cyan my-8 md:my-10" />
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-lg font-medium">
            Democratizing space, one launch at a time.
          </p>
        </div>

        {/* Scroll indicator - pinned to the bottom of the left half (desktop) / top half (mobile) */}
        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-telemetry-cyan">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* RIGHT HALF (Bottom in mobile, Right in desktop) */}
      <div
        className="hero-right-half relative w-full md:w-1/2 h-1/2 md:h-full bg-[#eef2f5] will-change-transform flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24"
      >
        {/* Sci-Fi Panel Shape Container */}
        <div className="relative w-full h-full max-h-[65vh] md:max-h-[70vh] group">

          {/* Cyberpunk/Aerospace Cut Background (Drop shadow effect) */}
          <div
            className="absolute inset-0 bg-[#2563EB]/20 translate-x-3 translate-y-3 transition-all duration-700 group-hover:translate-x-5 group-hover:translate-y-5"
            style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' }}
          />

          {/* Main Image Container */}
          <div
            className="absolute inset-0 overflow-hidden bg-black transition-transform duration-700 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2"
            style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' }}
          >
            {/* Slider Images */}
            {IMAGES.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${src})`,
                    transform: index === currentImageIndex ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 8s ease-out'
                  }}
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              </div>
            ))}
          </div>

          {/* Futuristic Decorative Accents */}
          {/* Top Left corner framing */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#2563EB] transition-transform duration-500 group-hover:-translate-x-4 group-hover:-translate-y-4" />

          {/* Bottom Right corner framing */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#2563EB] transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />

          {/* Floating Data String */}
          <div className="absolute top-8 -left-6 md:-left-8 text-[10px] font-mono tracking-[0.2em] text-gray-400 -rotate-90 origin-bottom-left transition-opacity duration-500 opacity-0 group-hover:opacity-100">
            AERO_SYS // v2.0.4
          </div>
        </div>
      </div>
    </div>
  );
};
