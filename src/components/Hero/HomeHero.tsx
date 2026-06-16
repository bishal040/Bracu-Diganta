import React, { useState, useEffect } from 'react';

const ALL_IMAGES = [
  "https://i.ibb.co.com/bj7QSj2S/Whats-App-Image-2026-06-17-at-01-47-36-2.jpg",
  "https://i.ibb.co.com/Gvr6YZ01/Whats-App-Image-2026-06-17-at-01-47-36.jpg",
  "https://i.ibb.co.com/ynNs3gYr/Whats-App-Image-2026-06-17-at-01-47-37-1.jpg",
  "https://i.ibb.co.com/7d2MTKMm/Whats-App-Image-2026-06-17-at-01-47-37-2.jpg",
  "https://i.ibb.co.com/Kcbt4Y4t/Whats-App-Image-2026-06-17-at-01-47-37.jpg",
  "https://i.ibb.co.com/JWZfrVXM/Whats-App-Image-2026-06-17-at-01-47-38-1.jpg",
  "https://i.ibb.co.com/TD2hyM5k/Whats-App-Image-2026-06-17-at-01-47-38-2.jpg",
  "https://i.ibb.co.com/qLyLQJ0Z/Whats-App-Image-2026-06-17-at-01-47-38.jpg",
  "https://i.ibb.co.com/rKPR3N1h/Whats-App-Image-2026-06-17-at-01-47-39-1.jpg",
  "https://i.ibb.co.com/C5PX8GNn/Whats-App-Image-2026-06-17-at-01-47-39-2.jpg",
  "https://i.ibb.co.com/HD2KZ9Ns/Whats-App-Image-2026-06-17-at-01-47-40-1.jpg",
  "https://i.ibb.co.com/n8PjhYjt/Whats-App-Image-2026-06-17-at-01-47-40.jpg"
];

export const HomeHero: React.FC = () => {
  const [shuffledPool, setShuffledPool] = useState<number[]>([]);
  const [poolIndex, setPoolIndex] = useState(0);
  const [isStacking, setIsStacking] = useState(false);

  useEffect(() => {
    // Initial shuffle
    const initial = Array.from({ length: ALL_IMAGES.length }, (_, i) => i);
    initial.sort(() => Math.random() - 0.5);
    setShuffledPool(initial);
  }, []);

  useEffect(() => {
    if (shuffledPool.length === 0) return;

    const timer = setInterval(() => {
      // 1. Trigger the stacking collapse animation
      setIsStacking(true);

      // 2. Wait for collapse, change images, then unstack
      setTimeout(() => {
        setPoolIndex(prev => {
          const next = prev + 4;
          if (next >= ALL_IMAGES.length) {
            setShuffledPool(currentPool => {
              const newPool = [...currentPool].sort(() => Math.random() - 0.5);
              return newPool;
            });
            return 0;
          }
          return next;
        });
        setIsStacking(false);
      }, 700); // Wait 700ms in stacked state

    }, 4500); // 4.5 seconds per cycle
    return () => clearInterval(timer);
  }, [shuffledPool.length]);

  const indices = shuffledPool.slice(poolIndex, poolIndex + 4);
  const currentIndices = indices.length === 4 ? indices : [0, 1, 2, 3];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent hero-cover-wrapper flex flex-col md:flex-row">

      {/* LEFT HALF (Top in mobile, Left in desktop) */}
      <div
        className="hero-left-half relative w-full md:w-1/2 h-1/2 md:h-full bg-[#eef2f5] flex flex-col items-center justify-center p-6 md:p-12 will-change-transform z-10"
      >
        <div className="relative z-10 text-center flex flex-col items-center px-4 w-full max-w-[100vw]">
          <p className="text-telemetry-cyan font-mono tracking-[0.1em] md:tracking-[0.2em] text-[10px] sm:text-xs md:text-sm uppercase mb-4 md:mb-8 max-w-xs md:max-w-md mx-auto leading-relaxed">
            Small Satellite Research under LaSSET at BRAC University
          </p>
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] xl:text-[7rem] font-black text-gray-900 tracking-[-0.04em] leading-[0.9] uppercase">
            BRACU
            <br />
            DIGANTA
          </h1>
          <div className="w-16 md:w-32 h-[3px] md:h-[4px] bg-telemetry-cyan my-6 md:my-10" />
          <p className="text-lg md:text-xl lg:text-3xl text-gray-600 max-w-lg font-medium px-4">
            Looking Over the Horizon
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
          <svg width="24" height="24" md:width="32" md:height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-telemetry-cyan w-6 h-6 md:w-8 md:h-8">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* RIGHT HALF (Bottom in mobile, Right in desktop) */}
      <div
        className="hero-right-half relative w-full md:w-1/2 h-1/2 md:h-full bg-[#eef2f5] will-change-transform flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 overflow-hidden"
      >
        <div className="w-full h-full max-h-[50vh] lg:max-h-[60vh] max-w-[420px] lg:max-w-[500px] grid grid-cols-2 gap-3 lg:gap-5 relative group z-10">

          {/* Left Column */}
          <div className="flex flex-col gap-3 lg:gap-5 h-full translate-y-4 md:translate-y-8 relative z-20">
            {/* Box 1: Left Top */}
            <div className={`flex-[3] w-full rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative transition-all duration-[700ms] ease-[cubic-bezier(0.87,0,0.13,1)] origin-bottom-right ${isStacking ? 'translate-x-6 md:translate-x-10 translate-y-10 md:translate-y-20 scale-[0.8] rotate-[8deg] z-40 brightness-75' : 'translate-x-0 translate-y-0 scale-100 rotate-0 z-10 brightness-100'}`}>
              {ALL_IMAGES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Aerospace"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${idx === currentIndices[0] ? 'opacity-100 relative' : 'opacity-0'}`}
                />
              ))}
            </div>

            {/* Box 2: Left Bottom */}
            <div className={`flex-[2] w-full rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative transition-all duration-[700ms] ease-[cubic-bezier(0.87,0,0.13,1)] origin-top-right ${isStacking ? 'translate-x-6 md:translate-x-10 -translate-y-10 md:-translate-y-20 scale-[0.8] -rotate-[6deg] z-30 brightness-50' : 'translate-x-0 translate-y-0 scale-100 rotate-0 z-10 brightness-100'}`}>
              {ALL_IMAGES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Aerospace"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${idx === currentIndices[1] ? 'opacity-100 relative' : 'opacity-0'}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-3 lg:gap-5 h-full -translate-y-4 md:-translate-y-8 relative z-10">
            {/* Box 3: Right Top */}
            <div className={`flex-[2] w-full rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative transition-all duration-[700ms] ease-[cubic-bezier(0.87,0,0.13,1)] origin-bottom-left ${isStacking ? '-translate-x-6 md:-translate-x-10 translate-y-10 md:translate-y-20 scale-[0.8] -rotate-[8deg] z-50 brightness-100' : 'translate-x-0 translate-y-0 scale-100 rotate-0 z-10 brightness-100'}`}>
              {ALL_IMAGES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Aerospace"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${idx === currentIndices[2] ? 'opacity-100 relative' : 'opacity-0'}`}
                />
              ))}
            </div>

            {/* Box 4: Right Bottom */}
            <div className={`flex-[3] w-full rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative transition-all duration-[700ms] ease-[cubic-bezier(0.87,0,0.13,1)] origin-top-left ${isStacking ? '-translate-x-6 md:-translate-x-10 -translate-y-10 md:-translate-y-20 scale-[0.8] rotate-[6deg] z-20 brightness-75' : 'translate-x-0 translate-y-0 scale-100 rotate-0 z-10 brightness-100'}`}>
              {ALL_IMAGES.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Aerospace"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${idx === currentIndices[3] ? 'opacity-100 relative' : 'opacity-0'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
