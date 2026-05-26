import React, { useEffect, useState } from 'react';

export const LoadingPage: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // in → hold → out
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('out'), 2200);
    const t3 = setTimeout(() => onComplete?.(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#eef2f5] flex items-center justify-center"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
      }}
    >
      <div
        className="flex flex-col items-center gap-6"
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(12px) scale(0.97)' : phase === 'out' ? 'translateY(-8px) scale(0.98)' : 'translateY(0) scale(1)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo text */}
        <h1 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 tracking-[0.2em] uppercase select-none">
          DIGANTA
        </h1>

        {/* Minimal line loader */}
        <div className="relative w-32 h-[2px] bg-gray-300/50 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#2563EB] rounded-full"
            style={{
              animation: 'lineLoad 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
        </div>

        {/* Tagline */}
        <p className="font-mono text-[10px] tracking-[0.4em] text-gray-400 uppercase">
          Beyond the Horizon
        </p>
      </div>

      <style>{`
        @keyframes lineLoad {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
