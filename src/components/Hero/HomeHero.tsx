import React from 'react';

export const HomeHero: React.FC = () => {
  // The inner content of the hero. We extract this so we can render it twice identically.
  const HeroContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/50">
      <div className="relative z-10 text-center flex flex-col items-center">
        <p className="text-telemetry-cyan font-mono tracking-[0.4em] text-sm md:text-base uppercase mb-6">
          BRAC University Aerospace Research
        </p>
        <h1 className="font-orbitron text-7xl md:text-[9rem] font-black text-white tracking-[-0.04em] leading-[0.9] uppercase drop-shadow-2xl">
          BRACU
          <br />
          DIGANTA
        </h1>
        <div className="w-24 h-[3px] bg-telemetry-cyan my-8" />
        <p className="text-xl md:text-2xl text-gray-200 max-w-xl font-medium drop-shadow-lg">
          Democratizing space, one launch at a time.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-telemetry-cyan">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent hero-cover-wrapper">
      {/* LEFT HALF */}
      <div
        className="hero-left-half absolute inset-0 w-full h-full will-change-transform"
        style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }}
      >
        <HeroContent />

        {/* Tear edge styling (optional cool glowing line) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-telemetry-cyan/50 shadow-[0_0_15px_#00e5ff] z-20" />
      </div>

      {/* RIGHT HALF */}
      <div
        className="hero-right-half absolute inset-0 w-full h-full will-change-transform"
        style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
      >
        <HeroContent />
      </div>
    </div>
  );
};
