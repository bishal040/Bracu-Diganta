import { useEffect, useRef } from 'react';

interface HeroOverlaysProps {
  scrollData: React.MutableRefObject<{ progress: number }>;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const HeroOverlays: React.FC<HeroOverlaysProps> = ({ scrollData }) => {
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const { progress } = scrollData.current;

      // ─── PHASE 1: Title reveal (0 → 0.35) ───
      if (phase1Ref.current) {
        let opacity = 0;
        let y = 40;
        let scale = 0.96;

        if (progress >= 0.02 && progress <= 0.08) {
          const t = easeOutCubic((progress - 0.02) / 0.06);
          opacity = t;
          y = 40 * (1 - t);
          scale = 0.96 + 0.04 * t;
        } else if (progress > 0.08 && progress <= 0.28) {
          opacity = 1;
          y = 0;
          scale = 1;
        } else if (progress > 0.28 && progress <= 0.35) {
          const t = easeOutCubic((progress - 0.28) / 0.07);
          opacity = 1 - t;
          y = -30 * t;
          scale = 1 - 0.03 * t;
        }

        phase1Ref.current.style.opacity = String(opacity);
        phase1Ref.current.style.transform = `translateY(${y}px) scale(${scale})`;
      }

      // ─── PHASE 2: "Modular by Design" (0.35 → 0.5) ───
      if (phase2Ref.current) {
        let opacity = 0;
        let y = 50;

        if (progress > 0.36 && progress <= 0.42) {
          const t = easeOutCubic((progress - 0.36) / 0.06);
          opacity = t;
          y = 50 * (1 - t);
        } else if (progress > 0.42 && progress <= 0.46) {
          opacity = 1;
          y = 0;
        } else if (progress > 0.46 && progress <= 0.5) {
          const t = easeOutCubic((progress - 0.46) / 0.04);
          opacity = 1 - t;
          y = -40 * t;
        }

        phase2Ref.current.style.opacity = String(opacity);
        phase2Ref.current.style.transform = `translateY(${y}px)`;
      }

      // ─── PHASE 3: Live Telemetry HUD (0.5 → 1.0) ───
      if (hudRef.current) {
        const p3 = progress > 0.5 ? (progress - 0.5) / 0.5 : 0;
        let opacity = 0;
        let y = 30;

        if (p3 > 0.05 && p3 <= 0.15) {
          const t = easeOutCubic((p3 - 0.05) / 0.1);
          opacity = t;
          y = 30 * (1 - t);
        } else if (p3 > 0.15 && p3 <= 0.85) {
          opacity = 1;
          y = 0;
        } else if (p3 > 0.85 && p3 <= 1.0) {
          const t = easeOutCubic((p3 - 0.85) / 0.15);
          opacity = 1 - t;
          y = -30 * t;
        }

        hudRef.current.style.opacity = String(opacity);
        hudRef.current.style.transform = `translateY(${y}px)`;
        hudRef.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [scrollData]);

  const telemetryStats = [
    { label: 'APOGEE TARGET', value: '1,000', unit: 'M' },
    { label: 'MAX VELOCITY', value: '254', unit: 'M/S' },
    { label: 'OBC PROCESSOR', value: 'ESP32', unit: 'DUAL' },
    { label: 'UHF DOWNLINK', value: '433', unit: 'MHZ' },
  ];

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">

      {/* ── Phase 1: Hero Title ── */}
      <div
        ref={phase1Ref}
        className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0 }}
      >
        <div className="w-full lg:w-[38%]">
          <p className="text-xs md:text-sm font-mono tracking-[0.4em] text-telemetry-cyan uppercase mb-6 text-left">
            BRAC University Aerospace Research
          </p>
          <h1 className="font-orbitron text-6xl md:text-8xl lg:text-[7rem] font-black text-gray-900 tracking-[-0.04em] leading-[0.9] text-left uppercase">
            BRACU<br />DIGANTA
          </h1>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-8" />
          <p className="text-base md:text-lg text-gray-600 text-left max-w-md leading-relaxed">
            Democratizing space,<br />one launch at a time.
          </p>
        </div>
      </div>

      {/* ── Phase 2: Modular by Design ── */}
      <div
        ref={phase2Ref}
        className="absolute inset-0 flex flex-col items-end justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0 }}
      >
        <div className="w-full lg:w-[38%] flex flex-col items-end">
          <span className="text-xs font-mono tracking-[0.5em] text-telemetry-cyan uppercase mb-4 text-right">
            Architecture
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight text-right uppercase">
            Modular by Design
          </h2>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-8" />
          <p className="text-base md:text-lg text-gray-600 mt-2 text-right max-w-xl leading-relaxed">
            A nearly screwless 3D-printed architecture built for<br />rapid assembly and mission reliability.
          </p>
        </div>
      </div>

      {/* ── Phase 3: Telemetry HUD ── */}
      <div 
        id="telemetry-hud"
        ref={hudRef}
        className="absolute inset-y-0 left-0 w-full md:w-[45%] px-6 md:px-16 lg:px-24 flex flex-col justify-center"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-telemetry-cyan animate-pulse" />
            <span className="text-xs font-mono tracking-[0.4em] text-telemetry-cyan uppercase">
              System Online
            </span>
          </div>
          <h3 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase mb-4">
            FLIGHT<br/>COMPUTING
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
            Custom-engineered avionics bay featuring redundant sensors, real-time ground station data linking, and active payload deployment systems.
          </p>
        </div>

        {/* HUD Data Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {telemetryStats.map((stat, idx) => (
            <div key={idx} className="bg-white/40 backdrop-blur-sm border border-gray-200/60 p-5 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-3">
                {stat.label}
              </span>
              <div className="flex items-end gap-1.5">
                <span className="font-orbitron text-2xl font-bold text-gray-900 leading-none">
                  {stat.value}
                </span>
                <span className="text-xs font-mono font-semibold text-telemetry-cyan mb-0.5">
                  {stat.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Terminal decorative line */}
        <div className="mt-8 pt-4 border-t border-gray-200/60 max-w-lg">
          <div className="font-mono text-[10px] text-gray-400">
            {'>'} CANSAT_STATUS: NOMINAL<br/>
            {'>'} INITIALIZING DOWNLINK... [OK]<br/>
            {'>'} AWAITING LAUNCH COMMAND
          </div>
        </div>
      </div>

    </div>
  );
};
