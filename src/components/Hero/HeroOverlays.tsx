import { useEffect, useRef } from 'react';

interface HeroOverlaysProps {
  scrollData: React.MutableRefObject<{ progress: number }>;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const calculatePhase = (
  progress: number, 
  start: number, fadeStart: number, fadeEnd: number, end: number,
  animType: 'flip' | 'slide-from-right' | 'slide-from-left' | 'zoom' | 'float' = 'flip'
) => {
  if (progress <= start || progress >= end) return { opacity: 0, transform: '' };
  
  let t = 1;
  let direction = 0; // 1 entering, -1 exiting, 0 stable

  if (progress < fadeStart) {
    t = easeOutCubic((progress - start) / (fadeStart - start));
    direction = 1;
  } else if (progress > fadeEnd) {
    t = 1 - easeOutCubic((progress - fadeEnd) / (end - fadeEnd));
    direction = -1;
  }
  
  const opacity = Math.max(0, t);
  const inv = 1 - t;
  let transform = '';

  switch (animType) {
    case 'flip':
      const rX = direction === 1 ? 60 * inv : (direction === -1 ? -60 * inv : 0);
      const yF = direction === 1 ? 40 * inv : (direction === -1 ? -40 * inv : 0);
      const sF = direction === 1 ? 0.9 + 0.1 * t : (direction === -1 ? 1 - 0.1 * inv : 1);
      transform = `perspective(1000px) translateY(${yF}px) scale(${sF}) rotateX(${rX}deg)`;
      break;
    case 'slide-from-right':
      const xL = direction === 1 ? 80 * inv : (direction === -1 ? -80 * inv : 0);
      transform = `translateX(${xL}px)`;
      break;
    case 'slide-from-left':
      const xR = direction === 1 ? -80 * inv : (direction === -1 ? 80 * inv : 0);
      transform = `translateX(${xR}px)`;
      break;
    case 'zoom':
      const sZ = direction === 1 ? 0.85 + 0.15 * t : (direction === -1 ? 1 + 0.15 * inv : 1);
      transform = `scale(${sZ})`;
      break;
    case 'float':
      const yL = direction === 1 ? 50 * inv : (direction === -1 ? -50 * inv : 0);
      transform = `translateY(${yL}px)`;
      break;
  }
  return { opacity, transform };
};

export const HeroOverlays: React.FC<HeroOverlaysProps> = ({ scrollData }) => {
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);
  const phase4Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const deploymentRef = useRef<HTMLDivElement>(null);
  const textFillRef = useRef<HTMLHeadingElement>(null);
  const phase6Ref = useRef<HTMLDivElement>(null);
  const phase7Ref = useRef<HTMLDivElement>(null);
  const phase8Ref = useRef<HTMLDivElement>(null);
  const glitchTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = ["SYSTEMS", "ONLINE", "TARGET", "LOCKED", "DESCEND"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      if (glitchTextRef.current) {
        const word = words[currentIndex];
        glitchTextRef.current.innerText = word;
        glitchTextRef.current.setAttribute("data-text", word);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      let { progress } = scrollData.current;
      progress = Math.min(1.0, progress * 1.5);

      if (phase1Ref.current) {
        const { opacity, transform } = calculatePhase(progress, 0.00, 0.06, 0.16, 0.22, 'float');
        phase1Ref.current.style.opacity = String(opacity);
        phase1Ref.current.style.transform = transform;
        phase1Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      if (phase2Ref.current) {
        const { opacity, transform } = calculatePhase(progress, 0.18, 0.24, 0.34, 0.40, 'slide-from-right');
        phase2Ref.current.style.opacity = String(opacity);
        phase2Ref.current.style.transform = transform;
        phase2Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      if (phase3Ref.current) {
        const { opacity, transform } = calculatePhase(progress, 0.36, 0.42, 0.52, 0.58, 'flip');
        phase3Ref.current.style.opacity = String(opacity);
        phase3Ref.current.style.transform = transform;
        phase3Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      if (phase4Ref.current) {
        const { opacity, transform } = calculatePhase(progress, 0.54, 0.60, 0.70, 0.76, 'zoom');
        phase4Ref.current.style.opacity = String(opacity);
        phase4Ref.current.style.transform = transform;
        phase4Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      const rawProgress = scrollData.current.progress;

      if (hudRef.current) {
        const { opacity, transform } = calculatePhase(progress, 0.72, 0.78, 0.95, 1.0, 'slide-from-left');
        hudRef.current.style.opacity = String(opacity);
        hudRef.current.style.transform = transform;
        hudRef.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      if (deploymentRef.current && textFillRef.current) {
        const { opacity, transform } = calculatePhase(rawProgress, 0.65, 0.68, 0.75, 0.78, 'float');
        deploymentRef.current.style.opacity = String(opacity);
        deploymentRef.current.style.transform = transform;
        deploymentRef.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';

        let fill = 0;
        if (rawProgress >= 0.67 && rawProgress <= 0.74) {
          fill = (rawProgress - 0.67) / 0.07;
        } else if (rawProgress > 0.74) {
          fill = 1;
        }
        
        const fullText = "PRIMARY RECOVERY SYSTEM ENGAGED.\nCOMMENCING ACTIVE DESCENT.";
        const charCount = Math.floor(fullText.length * fill);
        const filledText = fullText.slice(0, charCount);
        const unfilledText = fullText.slice(charCount);
        
        const formatHTML = (str: string) => str.replace(/\n/g, '<br/>');

        textFillRef.current.innerHTML = `
          <span style="color: #111827">${formatHTML(filledText)}</span><span style="color: transparent; -webkit-text-stroke: 1px rgba(17, 24, 39, 0.4)">${formatHTML(unfilledText)}</span>
        `;
      }

      if (phase6Ref.current) {
        const { opacity, transform } = calculatePhase(rawProgress, 0.76, 0.82, 1.0, 1.01, 'float');
        phase6Ref.current.style.opacity = String(opacity);
        phase6Ref.current.style.transform = transform;
        phase6Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      if (phase7Ref.current) {
        const { opacity, transform } = calculatePhase(rawProgress, 0.78, 0.84, 1.0, 1.01, 'slide-from-right');
        phase7Ref.current.style.opacity = String(opacity);
        phase7Ref.current.style.transform = transform;
        phase7Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      if (phase8Ref.current) {
        const { opacity, transform } = calculatePhase(rawProgress, 0.82, 0.88, 1.0, 1.01, 'float');
        phase8Ref.current.style.opacity = String(opacity);
        phase8Ref.current.style.transform = `translateX(-50%) ${transform}`;
        phase8Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
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
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col items-start justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%] max-md:bg-white/40 max-md:backdrop-blur-md max-md:p-8 max-md:rounded-3xl max-md:border max-md:border-white/50 max-md:shadow-xl transition-all">
          <p className="text-[10px] md:text-sm font-mono tracking-[0.4em] text-telemetry-cyan uppercase mb-4 md:mb-6 text-left">
            BRAC University Aerospace Research
          </p>
          <h1 className="font-orbitron text-[3.5rem] md:text-8xl lg:text-[7rem] font-black text-gray-900 tracking-[-0.04em] leading-[0.9] text-left uppercase">
            BRACU<br />DIGANTA
          </h1>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-6 md:my-8" />
          <p className="text-sm md:text-lg text-gray-800 md:text-gray-600 text-left max-w-md leading-relaxed font-medium md:font-normal">
            Democratizing space,<br />one launch at a time.
          </p>
        </div>
      </div>

      {/* ── Phase 2: Modular by Design ── */}
      <div
        ref={phase2Ref}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col items-end justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%] flex flex-col items-end max-md:bg-white/40 max-md:backdrop-blur-md max-md:p-8 max-md:rounded-3xl max-md:border max-md:border-white/50 max-md:shadow-xl transition-all">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-telemetry-cyan uppercase mb-3 md:mb-4 text-right">
            Architecture
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight text-right uppercase">
            Modular by Design
          </h2>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-6 md:my-8" />
          <p className="text-sm md:text-lg text-gray-800 md:text-gray-600 mt-2 text-right max-w-xl leading-relaxed font-medium md:font-normal">
            A nearly screwless 3D-printed architecture built for<br className="hidden md:block" /> rapid assembly and mission reliability.
          </p>
        </div>
      </div>

      {/* ── Phase 3: Sensor Suite ── */}
      <div
        ref={phase3Ref}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col items-start justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%] max-md:bg-white/40 max-md:backdrop-blur-md max-md:p-8 max-md:rounded-3xl max-md:border max-md:border-white/50 max-md:shadow-xl transition-all">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-telemetry-cyan uppercase mb-3 md:mb-4 text-left block">
            Payload
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight text-left uppercase">
            Sensor Suite
          </h2>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-6 md:my-8" />
          <p className="text-sm md:text-lg text-gray-800 md:text-gray-600 mt-2 text-left max-w-xl leading-relaxed font-medium md:font-normal">
            High-fidelity atmospheric data collection via dual BMP280s, an MPU6050 6-axis IMU, and a Neo-M6N GPS module.
          </p>
        </div>
      </div>

      {/* ── Phase 4: Active Aerodynamics ── */}
      <div
        ref={phase4Ref}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col items-end justify-center px-6 md:px-12 lg:px-24"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%] flex flex-col items-end max-md:bg-white/40 max-md:backdrop-blur-md max-md:p-8 max-md:rounded-3xl max-md:border max-md:border-white/50 max-md:shadow-xl transition-all">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.5em] text-telemetry-cyan uppercase mb-3 md:mb-4 text-right block">
            Descent
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight text-right uppercase">
            Active Aero
          </h2>
          <div className="w-12 h-[3px] bg-telemetry-cyan my-6 md:my-8" />
          <p className="text-sm md:text-lg text-gray-800 md:text-gray-600 mt-2 text-right max-w-xl leading-relaxed font-medium md:font-normal">
            Passive auto-rotation stabilization coupled with a custom parafoil recovery system ensures safe touchdown within targeted descent zones.
          </p>
        </div>
      </div>

      {/* ── Phase 5: Telemetry HUD ── */}
      <div 
        id="telemetry-hud"
        ref={hudRef}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-y-0 md:h-full md:w-[45%] px-6 md:px-16 lg:px-24 flex flex-col justify-center max-md:bg-white/40 max-md:backdrop-blur-md transition-all"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-telemetry-cyan animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono tracking-[0.4em] text-telemetry-cyan uppercase">
              System Online
            </span>
          </div>
          <h3 className="font-orbitron text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase mb-3 md:mb-4">
            FLIGHT<br/>COMPUTING
          </h3>
          <p className="text-gray-800 md:text-gray-600 text-sm md:text-base leading-relaxed max-w-md font-medium md:font-normal">
            Custom-engineered avionics bay featuring redundant sensors, real-time ground station data linking, and active payload deployment systems.
          </p>
        </div>

        {/* HUD Data Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-lg">
          {telemetryStats.map((stat, idx) => (
            <div key={idx} className="bg-white/60 md:bg-white/40 backdrop-blur-sm border border-gray-200/60 p-4 md:p-5 rounded-xl flex flex-col justify-between shadow-sm">
              <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-2 md:mb-3">
                {stat.label}
              </span>
              <div className="flex items-end gap-1.5">
                <span className="font-orbitron text-xl md:text-2xl font-bold text-gray-900 leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] md:text-xs font-mono font-semibold text-telemetry-cyan mb-0.5">
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

      {/* ── Phase 5.5: Scroll Typewriter Fill (Left Side) ── */}
      <div 
        ref={deploymentRef}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-y-0 md:h-full md:w-[45%] px-6 md:px-16 lg:px-24 flex items-center justify-start pointer-events-none transition-all z-0"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <h2 
          ref={textFillRef}
          className="font-mono text-3xl md:text-5xl lg:text-[4rem] font-black uppercase tracking-tight leading-[1.1] text-left"
        >
          {/* Text injected via JS */}
        </h2>
      </div>

      {/* ── Phase 6: Mission Archive Preview (Left Side) ── */}
      <div 
        ref={phase6Ref}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-y-0 md:h-full md:w-[45%] px-6 md:px-16 lg:px-24 flex flex-col justify-center items-start max-md:hidden transition-all"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="flex flex-col items-start text-left w-full">
          <span className="text-xs font-mono tracking-[0.5em] text-[#2563EB] uppercase mb-4 block">
            Discover
          </span>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-gray-900 tracking-tight uppercase mb-4">
            Mission<br/>Archive
          </h2>
          <div className="w-12 h-[3px] bg-[#2563EB] mb-6" />
          <p className="text-gray-600 text-sm md:text-base max-w-sm leading-relaxed mb-8">
            Explore our history of atmospheric data collection, recovery system testing, and full-scale CanSat competition launches.
          </p>
          <div className="bg-white/60 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full max-w-sm group" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono font-semibold text-[#2563EB] uppercase tracking-wider">Latest Mission</span>
              <span className="px-2 py-1 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-700 uppercase">Completed</span>
            </div>
            <h4 className="font-orbitron text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2563EB] transition-colors">CanSat 2024</h4>
            <p className="text-xs text-gray-500 mb-4">Autonomous atmospheric sensing payload.</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-900 group-hover:gap-3 transition-all">
              View Archive <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase 7: Team & Recruitment Preview (Right Side) ── */}
      <div 
        ref={phase7Ref}
        className="absolute bottom-0 right-0 w-full h-[50dvh] md:inset-y-0 md:h-full md:w-[45%] px-6 md:px-16 lg:px-24 flex flex-col justify-center items-end max-md:hidden transition-all"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="flex flex-col items-end text-right w-full">
          <span className="text-xs font-mono tracking-[0.5em] text-[#2563EB] uppercase mb-4 block">
            Join Us
          </span>
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-gray-900 tracking-tight uppercase mb-4">
            The<br/>Crew
          </h2>
          <div className="w-12 h-[3px] bg-[#2563EB] mb-6" />
          <p className="text-gray-600 text-sm md:text-base max-w-sm leading-relaxed mb-8">
            Meet the brilliant multidisciplinary minds engineering our next generation of spaceflight systems.
          </p>
          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-full max-w-sm group" onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">Status</span>
              <span className="flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 uppercase border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Recruiting
              </span>
            </div>
            <h4 className="font-orbitron text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">Spring Cohort</h4>
            <p className="text-xs text-gray-400 mb-4">Openings in Avionics, Structures, and Recovery.</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase group-hover:gap-3 transition-all">
              Apply Now <span>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase 8: Bottom Center Drive (Glitching Typography) ── */}
      <div 
        ref={phase8Ref}
        className="absolute bottom-24 left-1/2 flex flex-col items-center justify-center transition-all z-20"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <style>{`
          .glitch-text {
            position: relative;
            font-size: 3rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #111827;
            cursor: pointer;
            transition: transform 0.3s ease;
            white-space: nowrap;
          }
          
          .glitch-text:hover {
            transform: scale(1.05);
          }
          
          .glitch-text::before,
          .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            white-space: nowrap;
          }
          
          .glitch-text::before {
            left: 3px;
            text-shadow: -3px 0 rgba(255, 0, 193, 0.8);
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            animation: glitch-anim 2.5s infinite linear alternate-reverse;
          }
          
          .glitch-text::after {
            left: -3px;
            text-shadow: -3px 0 rgba(0, 255, 249, 0.8);
            clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
            animation: glitch-anim2 3s infinite linear alternate-reverse;
          }

          @keyframes glitch-anim {
            0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
            10% { clip-path: inset(50% 0 30% 0); transform: translate(2px, -1px); }
            20% { clip-path: inset(10% 0 60% 0); transform: translate(-2px, 2px); }
            30% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
            40% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 1px); }
            50% { clip-path: inset(90% 0 2% 0); transform: translate(2px, -1px); }
            60% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
            70% { clip-path: inset(15% 0 70% 0); transform: translate(2px, -2px); }
            80% { clip-path: inset(60% 0 10% 0); transform: translate(-2px, 1px); }
            90% { clip-path: inset(5% 0 90% 0); transform: translate(2px, -1px); }
            100% { clip-path: inset(70% 0 20% 0); transform: translate(-2px, 2px); }
          }
          
          @keyframes glitch-anim2 {
            0% { clip-path: inset(15% 0 60% 0); transform: translate(2px, -1px); }
            15% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 1px); }
            30% { clip-path: inset(20% 0 30% 0); transform: translate(2px, 2px); }
            45% { clip-path: inset(50% 0 40% 0); transform: translate(-2px, -2px); }
            60% { clip-path: inset(10% 0 80% 0); transform: translate(2px, 1px); }
            75% { clip-path: inset(90% 0 2% 0); transform: translate(-2px, -1px); }
            90% { clip-path: inset(30% 0 50% 0); transform: translate(2px, 2px); }
            100% { clip-path: inset(65% 0 15% 0); transform: translate(-2px, -2px); }
          }
        `}</style>
        
        <div 
          ref={glitchTextRef}
          className="glitch-text font-orbitron md:text-5xl lg:text-7xl" 
          data-text="SYSTEMS"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          SYSTEMS
        </div>
        
        <span className="font-mono text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-6">
          Scroll Down to Continue
        </span>
      </div>

    </div>
  );
};
