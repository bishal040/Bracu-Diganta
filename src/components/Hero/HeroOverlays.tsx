import { useEffect, useRef } from 'react';

interface HeroOverlaysProps {
  scrollData: React.MutableRefObject<{ progress: number }>;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const calculatePhase = (progress: number, start: number, fadeStart: number, fadeEnd: number, end: number) => {
  if (progress <= start || progress >= end) return { opacity: 0, y: 40, scale: 0.96 };
  
  if (progress < fadeStart) {
    const t = easeOutCubic((progress - start) / (fadeStart - start));
    return { opacity: t, y: 40 * (1 - t), scale: 0.96 + 0.04 * t };
  }
  
  if (progress > fadeEnd) {
    const t = easeOutCubic((progress - fadeEnd) / (end - fadeEnd));
    return { opacity: 1 - t, y: -30 * t, scale: 1 - 0.02 * t };
  }
  
  return { opacity: 1, y: 0, scale: 1 };
};

export const HeroOverlays: React.FC<HeroOverlaysProps> = ({ scrollData }) => {
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);
  const phase4Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      let { progress } = scrollData.current;
      // MAGIC: Since we extended SequenceSection from 700% to 1050% (1.5x longer),
      // we multiply progress by 1.5 and clamp it at 1.0. This guarantees that 
      // phases 1-4 execute at the EXACT same scroll wheel speed as they did before!
      progress = Math.min(1.0, progress * 1.5);

      // Phase 1: 0.0 - 0.22
      if (phase1Ref.current) {
        const { opacity, y, scale } = calculatePhase(progress, 0.00, 0.06, 0.16, 0.22);
        phase1Ref.current.style.opacity = String(opacity);
        phase1Ref.current.style.transform = `translateY(${y}px) scale(${scale})`;
        phase1Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      // Phase 2: 0.18 - 0.40
      if (phase2Ref.current) {
        const { opacity, y, scale } = calculatePhase(progress, 0.18, 0.24, 0.34, 0.40);
        phase2Ref.current.style.opacity = String(opacity);
        phase2Ref.current.style.transform = `translateY(${y}px) scale(${scale})`;
        phase2Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      // Phase 3: 0.36 - 0.58
      if (phase3Ref.current) {
        const { opacity, y, scale } = calculatePhase(progress, 0.36, 0.42, 0.52, 0.58);
        phase3Ref.current.style.opacity = String(opacity);
        phase3Ref.current.style.transform = `translateY(${y}px) scale(${scale})`;
        phase3Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      // Phase 4: 0.54 - 0.76
      if (phase4Ref.current) {
        const { opacity, y, scale } = calculatePhase(progress, 0.54, 0.60, 0.70, 0.76);
        phase4Ref.current.style.opacity = String(opacity);
        phase4Ref.current.style.transform = `translateY(${y}px) scale(${scale})`;
        phase4Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      // Phase 5: Telemetry HUD (0.72 - 1.0)
      if (hudRef.current) {
        const { opacity, y } = calculatePhase(progress, 0.72, 0.78, 0.95, 1.0);
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
        style={{ opacity: 0, visibility: 'hidden' }}
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
        style={{ opacity: 0, visibility: 'hidden' }}
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

      {/* ── Phase 3: Sensor Suite ── */}
      <div
        ref={phase3Ref}
        className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%]">
          <span className="text-xs font-mono tracking-[0.5em] text-telemetry-cyan uppercase mb-4 text-left block">
            Payload
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight text-left uppercase">
            Sensor Suite
          </h2>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-8" />
          <p className="text-base md:text-lg text-gray-600 mt-2 text-left max-w-xl leading-relaxed">
            High-fidelity atmospheric data collection via dual BMP280s, an MPU6050 6-axis IMU, and a Neo-M6N GPS module.
          </p>
        </div>
      </div>

      {/* ── Phase 4: Active Aerodynamics ── */}
      <div
        ref={phase4Ref}
        className="absolute inset-0 flex flex-col items-end justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%] flex flex-col items-end">
          <span className="text-xs font-mono tracking-[0.5em] text-telemetry-cyan uppercase mb-4 text-right block">
            Descent
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight text-right uppercase">
            Active Aero
          </h2>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-8" />
          <p className="text-base md:text-lg text-gray-600 mt-2 text-right max-w-xl leading-relaxed">
            Passive auto-rotation stabilization coupled with a custom parafoil recovery system ensures safe touchdown within targeted descent zones.
          </p>
        </div>
      </div>

      {/* ── Phase 5: Telemetry HUD ── */}
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
