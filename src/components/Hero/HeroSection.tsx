import { useRef } from 'react';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero-track" ref={containerRef} className="relative w-full h-screen flex flex-col items-start justify-center px-6 md:px-12 lg:px-24">
      <div className="w-full lg:w-[38%]">
        {/* Hero Title — always visible on first viewport */}
        <p className="text-xs md:text-sm font-mono tracking-[0.4em] text-telemetry-cyan uppercase mb-6 text-left">
          BRAC University Aerospace Research
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-gray-900 tracking-[-0.04em] leading-[0.9] text-left">
          BRACU<br />DIGANTA
        </h1>
        <div className="w-12 h-[3px] bg-telemetry-cyan my-8" />
        <p className="text-base md:text-lg text-gray-600 text-left max-w-md leading-relaxed">
          Democratizing space,<br />one launch at a time.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 opacity-60">
        <span className="text-xs font-mono tracking-[0.3em] text-gray-500 uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gray-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
};
