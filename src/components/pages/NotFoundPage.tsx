import React, { useEffect, useState } from 'react';

/* ── Broken satellite SVG with detached parts ── */
const BrokenSatellite: React.FC = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main body — drifting */}
      <g style={{ animation: 'drift 6s ease-in-out infinite', transformOrigin: '150px 150px' }}>
        {/* Satellite body */}
        <rect x="120" y="120" width="60" height="60" rx="8" stroke="#3b82f6" strokeWidth="1.5" fill="#3b82f610" />
        <rect x="130" y="130" width="40" height="40" rx="4" stroke="#3b82f6" strokeWidth="1" fill="#3b82f608" strokeDasharray="3 3" />
        {/* Antenna */}
        <line x1="150" y1="120" x2="150" y2="90" stroke="#6b7280" strokeWidth="1.5" />
        <circle cx="150" cy="86" r="4" stroke="#3b82f6" strokeWidth="1" fill="none">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Signal waves */}
        <path d="M140 80 Q150 70 160 80" stroke="#3b82f6" strokeWidth="0.8" fill="none" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M135 74 Q150 60 165 74" stroke="#3b82f6" strokeWidth="0.6" fill="none" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </path>
      </g>

      {/* Left solar panel — detached, drifting away */}
      <g style={{ animation: 'floatLeft 8s ease-in-out infinite', transformOrigin: '80px 150px' }}>
        <rect x="40" y="130" width="70" height="40" rx="3" stroke="#6b7280" strokeWidth="1" fill="#3b82f605" />
        {/* Panel grid */}
        <line x1="63" y1="130" x2="63" y2="170" stroke="#6b7280" strokeWidth="0.5" opacity="0.3" />
        <line x1="86" y1="130" x2="86" y2="170" stroke="#6b7280" strokeWidth="0.5" opacity="0.3" />
        <line x1="40" y1="150" x2="110" y2="150" stroke="#6b7280" strokeWidth="0.5" opacity="0.3" />
        {/* Broken connection */}
        <line x1="110" y1="145" x2="120" y2="145" stroke="#ff3333" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="110" y1="155" x2="120" y2="155" stroke="#ff3333" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      </g>

      {/* Right solar panel — detached, drifting away */}
      <g style={{ animation: 'floatRight 7s ease-in-out infinite', transformOrigin: '220px 150px' }}>
        <rect x="190" y="130" width="70" height="40" rx="3" stroke="#6b7280" strokeWidth="1" fill="#3b82f605" />
        <line x1="213" y1="130" x2="213" y2="170" stroke="#6b7280" strokeWidth="0.5" opacity="0.3" />
        <line x1="236" y1="130" x2="236" y2="170" stroke="#6b7280" strokeWidth="0.5" opacity="0.3" />
        <line x1="190" y1="150" x2="260" y2="150" stroke="#6b7280" strokeWidth="0.5" opacity="0.3" />
        {/* Broken connection */}
        <line x1="180" y1="145" x2="190" y2="145" stroke="#ff3333" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        <line x1="180" y1="155" x2="190" y2="155" stroke="#ff3333" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      </g>

      {/* Sparks at break points */}
      <circle cx="115" cy="150" r="2" fill="#fbbf24" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="r" values="1;3;1" dur="0.8s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="185" cy="150" r="2" fill="#fbbf24" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="r" values="1;3;1" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
      </circle>

      {/* Debris fragments */}
      <rect x="100" y="190" width="6" height="3" rx="1" fill="#6b7280" opacity="0.3" style={{ animation: 'fragment1 10s linear infinite' }} />
      <rect x="200" y="100" width="4" height="4" rx="1" fill="#6b7280" opacity="0.2" style={{ animation: 'fragment2 12s linear infinite' }} />
      <circle cx="90" cy="110" r="1.5" fill="#3b82f6" opacity="0.2" style={{ animation: 'fragment3 14s linear infinite' }} />
    </svg>
  </div>
);

/* ── Drifting stars background ── */
const DriftingStars: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 80 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: `${Math.random() * 2 + 0.5}px`,
          height: `${Math.random() * 2 + 0.5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.1,
          animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

export const NotFoundPage: React.FC = () => {
  const [signalStrength, setSignalStrength] = useState(0);

  // Flickering signal strength
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength(Math.random() * 15);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center relative overflow-hidden">
      <DriftingStars />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-2xl w-full">

        {/* Broken satellite illustration */}
        <BrokenSatellite />

        {/* 404 text */}
        <div className="mt-6 mb-4">
          <h1 className="font-orbitron text-6xl md:text-8xl font-black tracking-widest">
            <span className="text-white/10">4</span>
            <span className="text-[#2563EB]" style={{ textShadow: '0 0 20px #2563EB40, 0 0 40px #2563EB20' }}>0</span>
            <span className="text-white/10">4</span>
          </h1>
        </div>

        <h2 className="font-orbitron text-xl md:text-2xl font-bold text-black dark:text-white uppercase tracking-wider mb-3">
          Signal Lost
        </h2>

        <p className="font-mono text-xs md:text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
          The requested coordinates could not be resolved. The target module has either been jettisoned, deorbited, or was never deployed.
        </p>

        {/* Telemetry status bar */}
        <div className="bg-[#0d1117] border border-[#1e2a3a] rounded-xl p-4 mb-8 max-w-sm mx-auto text-left">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">Route</span>
              <span className="font-mono text-[10px] text-[#ff3333]">{window.location.pathname}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">Status</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3333]" style={{ animation: 'pulse 1.5s infinite' }} />
                <span className="font-mono text-[10px] text-[#ff3333]">NOT FOUND</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">Signal</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-300"
                    style={{
                      height: `${(i + 1) * 3}px`,
                      backgroundColor: signalStrength > i * 3 ? '#3b82f6' : '#1e2a3a',
                    }}
                  />
                ))}
                <span className="font-mono text-[10px] text-gray-600 ml-1.5">{signalStrength.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="group relative px-8 py-3.5 rounded-full font-mono text-sm uppercase tracking-widest bg-[#2563EB] text-white hover:bg-[#1d4ed8] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L1 7l6 6M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Return to Base
            </span>
          </a>

          <button
            onClick={() => window.history.back()}
            className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors duration-300"
          >
            Go Back →
          </button>
        </div>

        {/* Bottom coordinates */}
        <div className="mt-16 flex items-center justify-center gap-6 text-[10px] font-mono text-gray-700 tracking-widest">
          <span>LAT 23.7749°N</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>LON 90.3651°E</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>ALT — — —</span>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(3px, -5px) rotate(1deg); }
          50% { transform: translate(-2px, -8px) rotate(-0.5deg); }
          75% { transform: translate(4px, -3px) rotate(0.8deg); }
        }
        @keyframes floatLeft {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-12px, 6px) rotate(-4deg); }
        }
        @keyframes floatRight {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(10px, -8px) rotate(3deg); }
        }
        @keyframes fragment1 {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0.3; }
          100% { transform: translate(-40px, 60px) rotate(360deg); opacity: 0; }
        }
        @keyframes fragment2 {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0.2; }
          100% { transform: translate(30px, -50px) rotate(-270deg); opacity: 0; }
        }
        @keyframes fragment3 {
          0% { transform: translate(0,0); opacity: 0.2; }
          100% { transform: translate(-60px, -40px); opacity: 0; }
        }
        @keyframes twinkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.6; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
