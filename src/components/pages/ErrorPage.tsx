import React, { useEffect, useState } from 'react';

/* ── Glitching text effect ── */
const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <div className={`relative inline-block ${className}`}>
    <span className="relative z-10">{text}</span>
    <span className="absolute inset-0 text-[#ff3333] z-0" style={{ animation: 'glitch1 3s infinite', clipPath: 'inset(20% 0 30% 0)' }} aria-hidden>{text}</span>
    <span className="absolute inset-0 text-[#2563EB] z-0" style={{ animation: 'glitch2 3s infinite', clipPath: 'inset(50% 0 10% 0)' }} aria-hidden>{text}</span>
  </div>
);

/* ── Floating debris particles ── */
const Debris: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 4 + 2;
      return (
        <div
          key={i}
          className="absolute bg-gray-500/20 rounded-sm"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `debris ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${Math.random() * -10}s`,
          }}
        />
      );
    })}
  </div>
);

export const ErrorPage: React.FC<{
  code?: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  code = 500,
  title = 'System Malfunction',
  message = 'A critical error occurred in the flight computer. Our ground crew has been alerted and is working on a resolution.',
  onRetry,
}) => {
  const [glitchActive, setGlitchActive] = useState(false);

  // Periodic glitch burst
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center relative overflow-hidden">
      <Debris />

      {/* Radial warning glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#ff333308_0%,_transparent_60%)]" />

      {/* Scan lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
          animation: 'scanlines 8s linear infinite',
        }}
      />

      <div className={`relative z-10 text-center px-6 max-w-lg transition-transform duration-200 ${glitchActive ? 'translate-x-[2px]' : ''}`}>

        {/* Error Code - Giant */}
        <div className="mb-8">
          <GlitchText
            text={String(code)}
            className="font-orbitron text-[120px] md:text-[160px] font-black text-white/10 leading-none select-none"
          />
        </div>

        {/* Warning icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[#ff3333]">
              <path
                d="M24 4L2 44h44L24 4z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinejoin="round"
              />
              <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="36" r="1.5" fill="currentColor" />
            </svg>
            {/* Pulsing ring */}
            <div
              className="absolute inset-[-8px] rounded-full border border-[#ff3333]/30"
              style={{ animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-4">
          {title}
        </h1>

        {/* Error log */}
        <div className="bg-[#0d1117] border border-[#1e2a3a] rounded-xl p-4 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#ff3333]" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-[10px] font-mono tracking-widest text-[#ff3333] uppercase">
              Error Log — {new Date().toISOString().slice(0, 19)}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-400 leading-relaxed">
            {message}
          </p>
          <div className="mt-3 pt-3 border-t border-[#1e2a3a]">
            <span className="font-mono text-[10px] text-gray-600">
              ERR_CODE: 0x{code.toString(16).toUpperCase().padStart(4, '0')} | NODE: MISSION-CTRL-PRIMARY
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="group relative px-8 py-3 rounded-full font-mono text-sm uppercase tracking-widest text-white border border-[#2563EB]/50 hover:border-[#2563EB] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:rotate-180 transition-transform duration-500">
                <path d="M1 7a6 6 0 0111.196-3M13 7A6 6 0 011.804 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Retry Connection
            </span>
            <div className="absolute inset-0 bg-[#2563EB]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <a
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-[#2563EB] transition-colors duration-300"
          >
            Return to Base →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-3px, 1px); }
          94% { transform: translate(3px, -1px); }
          96% { transform: translate(-1px, 2px); }
        }
        @keyframes glitch2 {
          0%, 88%, 100% { transform: translate(0); }
          90% { transform: translate(2px, -1px); }
          93% { transform: translate(-2px, 1px); }
          95% { transform: translate(1px, -2px); }
        }
        @keyframes debris {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
