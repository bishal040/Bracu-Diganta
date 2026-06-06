import { useEffect, useRef } from 'react';
import { Hexagon, Triangle, Circle, Square, Command, Anchor, Aperture, Globe } from 'lucide-react';

const SPONSORS = [
  { name: "AeroTech", icon: <Triangle size={32} strokeWidth={1.5} /> },
  { name: "Nova Systems", icon: <Hexagon size={32} strokeWidth={1.5} /> },
  { name: "Quantum Dynamics", icon: <Circle size={32} strokeWidth={1.5} /> },
  { name: "NexGen", icon: <Square size={32} strokeWidth={1.5} /> },
  { name: "Nexus", icon: <Command size={32} strokeWidth={1.5} /> },
  { name: "Horizon", icon: <Anchor size={32} strokeWidth={1.5} /> },
  { name: "Orbit Systems", icon: <Aperture size={32} strokeWidth={1.5} /> },
  { name: "Stratos", icon: <Globe size={32} strokeWidth={1.5} /> },
];

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
  const phase3GridRef = useRef<HTMLDivElement>(null);
  const phase4Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const deploymentRef = useRef<HTMLDivElement>(null);
  const textFillRef = useRef<HTMLHeadingElement>(null);
  const phase6Ref = useRef<HTMLDivElement>(null);
  const phase7Ref = useRef<HTMLDivElement>(null);
  const phase8Ref = useRef<HTMLDivElement>(null);
  const leftLabelsRef = useRef<HTMLDivElement>(null);
  const rightLabelsRef = useRef<HTMLDivElement>(null);
  const gridImg1Ref = useRef<HTMLDivElement>(null);
  const gridImg2Ref = useRef<HTMLDivElement>(null);
  const gridImg3Ref = useRef<HTMLDivElement>(null);
  const gridImg4Ref = useRef<HTMLDivElement>(null);

  // Refs for the individual graphics in Phase 3 so they can rearrange during transfer
  const circleGraphicRef = useRef<HTMLDivElement>(null);
  const pillGraphicRef = useRef<HTMLDivElement>(null);
  const squareGraphicRef = useRef<HTMLDivElement>(null);

  // Phase 5.5 Recovery Artifacts
  const recoveryArtifactsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      let { progress } = scrollData.current;
      progress = Math.min(1.0, progress * 1.5);

      // Labels slide outward and fade out on scroll
      const rawP = scrollData.current.progress;
      const labelOpacity = rawP <= 0.001 ? 1 : Math.max(0, 1 - rawP / 0.015);
      const slideAmount = Math.min(1, rawP / 0.015) * 120; // px to slide

      if (leftLabelsRef.current) {
        leftLabelsRef.current.style.opacity = String(labelOpacity);
        leftLabelsRef.current.style.transform = `translateX(-${slideAmount}px)`;
        leftLabelsRef.current.style.visibility = labelOpacity === 0 ? 'hidden' : 'visible';
      }
      if (rightLabelsRef.current) {
        rightLabelsRef.current.style.opacity = String(labelOpacity);
        rightLabelsRef.current.style.transform = `translateX(${slideAmount}px)`;
        rightLabelsRef.current.style.visibility = labelOpacity === 0 ? 'hidden' : 'visible';
      }

      if (phase1Ref.current) {
        // Fade out earlier (0.12 to 0.18) to avoid overlapping with incoming images
        const { opacity, transform } = calculatePhase(progress, 0.00, 0.06, 0.12, 0.18, 'float');
        phase1Ref.current.style.opacity = String(opacity);
        phase1Ref.current.style.transform = transform;
        phase1Ref.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';
      }

      const vw = window.innerWidth;
      // Mathematically calculate the exact distance to align with the left padding
      // lg: vw - 96px (right pad) - 464px (grid width) - 96px (target left pad) = vw - 656
      // md: vw - 48px (right pad) - 400px (grid width) - 48px (target left pad) = vw - 496
      const shiftDistance = vw >= 1024 ? vw - 656 : vw - 496;

      const animateGridImage = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
        if (!ref.current) return;
        const entryStart = 0.00 + index * 0.01;
        const entryEnd = 0.04 + index * 0.01;
        // Shift timing perfectly synced between Phase 1 exit and Phase 2 entry
        const shiftStart = 0.14 + (3 - index) * 0.01;
        const shiftEnd = 0.20 + (3 - index) * 0.01;
        const exitStart = 0.34;
        const exitEnd = 0.40;

        let opacity = 0;
        let xOffset = 0;
        let rotate = 0;

        if (progress <= entryStart || progress >= exitEnd) {
          ref.current.style.opacity = '0';
          ref.current.style.visibility = 'hidden';
          return;
        }
        ref.current.style.visibility = 'visible';

        if (progress < entryEnd) {
          // Entering
          const t = easeOutCubic((progress - entryStart) / (entryEnd - entryStart));
          opacity = t;
          xOffset = 80 * (1 - t);
          ref.current.style.setProperty('--crossfade', '0');
        } else if (progress < shiftStart) {
          // Stable in Phase 1
          opacity = 1;
          xOffset = 0;
          ref.current.style.setProperty('--crossfade', '0');
        } else if (progress < shiftEnd) {
          // Shifting to left for Phase 2
          const t = easeOutCubic((progress - shiftStart) / (shiftEnd - shiftStart));
          opacity = 1;
          xOffset = -t * shiftDistance;
          // Add a slight rotation during shift for animation feel
          rotate = Math.sin(t * Math.PI) * -5;
          // Crossfade to new images
          ref.current.style.setProperty('--crossfade', String(t));
        } else if (progress < exitStart) {
          // Stable in Phase 2
          opacity = 1;
          xOffset = -shiftDistance;
          ref.current.style.setProperty('--crossfade', '1');
        } else {
          // Exiting Phase 2
          const t = 1 - easeOutCubic((progress - exitStart) / (exitEnd - exitStart));
          opacity = t;
          xOffset = -shiftDistance - 80 * (1 - t);
          ref.current.style.setProperty('--crossfade', '1');
        }

        ref.current.style.opacity = String(opacity);
        ref.current.style.transform = `translateX(${xOffset}px) rotate(${rotate}deg)`;
      };

      animateGridImage(gridImg4Ref, 0);
      animateGridImage(gridImg3Ref, 1);
      animateGridImage(gridImg2Ref, 2);
      animateGridImage(gridImg1Ref, 3);


      if (phase2Ref.current) {
        // Start entering later (0.20) to ensure images have vacated the right side
        const { opacity, transform } = calculatePhase(progress, 0.20, 0.26, 0.34, 0.40, 'slide-from-right');
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

      if (phase3GridRef.current) {
        let opacity = 0;
        let xOffset = 0;

        const vw = window.innerWidth;
        const isMobile = vw < 768;
        const targetLeft = isMobile ? -vw * 0.75 : -vw * 0.65;

        if (progress >= 0.36 && progress < 0.42) {
          // Entry Phase 3
          const t = easeOutCubic((progress - 0.36) / 0.06);
          opacity = t;
          xOffset = 80 * (1 - t);
        } else if (progress >= 0.42 && progress < 0.52) {
          // Stable Phase 3
          opacity = 1;
          xOffset = 0;
        } else if (progress >= 0.52 && progress < 0.60) {
          // Smooth glide transfer for Phase 4
          const t = easeOutCubic((progress - 0.52) / 0.08);
          opacity = 1;
          xOffset = targetLeft * t;
        } else if (progress >= 0.60 && progress < 0.70) {
          // Stable Phase 4
          opacity = 1;
          xOffset = targetLeft;
        } else if (progress >= 0.70 && progress <= 0.76) {
          // Exit Phase 4
          const t = easeOutCubic((progress - 0.70) / 0.06);
          opacity = 1 - t;
          xOffset = targetLeft - (80 * t);
        }

        phase3GridRef.current.style.opacity = String(opacity);
        phase3GridRef.current.style.transform = `translate3d(${xOffset}px, 0, 0)`;
        phase3GridRef.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';

        // ── Child Rearrangement Logic ──
        let swapT = 0;
        if (progress >= 0.52 && progress < 0.60) {
          swapT = easeOutCubic((progress - 0.52) / 0.08);
        } else if (progress >= 0.60) {
          swapT = 1;
        }

        if (circleGraphicRef.current && pillGraphicRef.current && squareGraphicRef.current) {
          const isLg = vw >= 1024;

          // Base positions (matching Tailwind classes)
          const basePillX = isLg ? -192 : -144; // -48rem vs -36rem
          const basePillY = isLg ? -48 : -32;   // -12rem vs -8rem
          const baseSqX = isLg ? -256 : -192;   // -64rem vs -48rem
          const baseSqY = isLg ? 128 : 96;      // 32rem vs 24rem

          // Target positions for the swap
          const targetCircleX = baseSqX;
          const targetCircleY = baseSqY;
          const targetCircleR = -15;

          const targetSqX = 0;
          const targetSqY = 0;
          const targetSqR = 10;

          const targetPillX = basePillX - 64;
          const targetPillY = basePillY - 80;
          const targetPillR = -20;

          // Interpolated values
          const circleX = targetCircleX * swapT;
          const circleY = targetCircleY * swapT;
          const circleR = targetCircleR * swapT;

          const pillX = basePillX + ((targetPillX - basePillX) * swapT);
          const pillY = basePillY + ((targetPillY - basePillY) * swapT);
          const pillR = 12 + ((targetPillR - 12) * swapT);

          const sqX = baseSqX + ((targetSqX - baseSqX) * swapT);
          const sqY = baseSqY + ((targetSqY - baseSqY) * swapT);
          const sqR = -6 + ((targetSqR - (-6)) * swapT);

          // Only apply inline styles during and after the transfer to preserve hover states beforehand
          if (progress > 0.50) {
            circleGraphicRef.current.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) rotate(${circleR}deg)`;
            pillGraphicRef.current.style.transform = `translate3d(${pillX}px, ${pillY}px, 0) rotate(${pillR}deg)`;
            squareGraphicRef.current.style.transform = `translate3d(${sqX}px, ${sqY}px, 0) rotate(${sqR}deg)`;
          } else {
            circleGraphicRef.current.style.transform = '';
            pillGraphicRef.current.style.transform = '';
            squareGraphicRef.current.style.transform = '';
          }
        }
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

      // Animate the Recovery Artifacts simultaneously with deployment text
      if (recoveryArtifactsRef.current) {
        // Standard fade/slide in
        const { opacity, transform } = calculatePhase(rawProgress, 0.65, 0.68, 0.75, 0.78, 'slide-from-right');

        // Delay the fan out until after the slide-in finishes (0.68)
        let localT = 0;
        if (rawProgress >= 0.68 && rawProgress <= 0.76) {
          const tRaw = (rawProgress - 0.68) / 0.08;
          // Professional easeOutQuart for incredibly smooth settling
          localT = 1 - Math.pow(1 - tRaw, 4);
        } else if (rawProgress > 0.76) {
          localT = 1;
        }

        recoveryArtifactsRef.current.style.opacity = String(opacity);
        recoveryArtifactsRef.current.style.transform = transform;
        recoveryArtifactsRef.current.style.visibility = opacity === 0 ? 'hidden' : 'visible';

        // Premium Fan-out Animation!
        const card1 = recoveryArtifactsRef.current.querySelector('#prem-card-1') as HTMLElement;
        const card2 = recoveryArtifactsRef.current.querySelector('#prem-card-2') as HTMLElement;
        const card3 = recoveryArtifactsRef.current.querySelector('#prem-card-3') as HTMLElement;
        const glow = recoveryArtifactsRef.current.querySelector('#prem-glow') as HTMLElement;

        if (card1 && card2 && card3 && glow) {
          // Set deep origin for a perfect, natural arc swing (like holding cards in a hand)
          card1.style.transformOrigin = '50% 150%';
          card2.style.transformOrigin = '50% 150%';
          card3.style.transformOrigin = '50% 150%';

          // Glow expands softly
          glow.style.transform = `translate(-50%, -50%) scale(${1 + localT * 0.5})`;
          glow.style.opacity = String(0.1 + (0.2 * localT));

          // Card 1 swings left along the deep arc, tilting slightly back
          const rot1 = -15 * localT;
          card1.style.transform = `rotateZ(${rot1}deg) rotateY(-5deg) translateZ(-40px)`;

          // Card 2 swings right along the deep arc, tilting slightly back
          const rot2 = 15 * localT;
          card2.style.transform = `rotateZ(${rot2}deg) rotateY(5deg) translateZ(-40px)`;

          // Card 3 moves forward and up slightly to emphasize depth
          card3.style.transform = `translateY(${-15 * localT}px) translateZ(50px) scale(${1 + (0.02 * localT)})`;

          // Ensure proper layering
          card1.style.zIndex = '10';
          card2.style.zIndex = '10';
          card3.style.zIndex = '30';
        }
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

      {/* ── Initial CanSat Labels — Left ── */}
      <div
        ref={leftLabelsRef}
        className="absolute inset-0 w-full h-full transition-none"
        style={{ opacity: 1 }}
      >
        <div className="absolute left-[3%] min-[400px]:left-[5%] md:left-[12%] top-[13%] md:top-[30%] flex items-center gap-1.5 md:gap-3 w-[32%] md:w-max">
          <div className="text-right shrink-0">
            <p className="font-orbitron text-[9px] min-[400px]:text-[10px] md:text-base lg:text-lg font-bold text-gray-900 uppercase tracking-wider leading-none md:leading-tight">Avionics Bay</p>
            <p className="font-mono text-[6px] min-[400px]:text-[7px] md:text-xs text-gray-500 mt-1 md:mt-1">ESP32 Dual-Core OBC</p>
          </div>
          <div className="flex-1 md:flex-none md:w-16 h-[1px] bg-gray-400/50 shrink-0" />
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 shrink-0 rounded-full bg-[#2563EB]" style={{ boxShadow: '0 0 8px #2563EB60' }} />
        </div>

        <div className="absolute left-[3%] min-[400px]:left-[5%] md:left-[12%] top-[35%] md:top-[58%] flex items-center gap-1.5 md:gap-3 w-[32%] md:w-max">
          <div className="text-right shrink-0">
            <p className="font-orbitron text-[9px] min-[400px]:text-[10px] md:text-base lg:text-lg font-bold text-gray-900 uppercase tracking-wider leading-none md:leading-tight">Recovery System</p>
            <p className="font-mono text-[6px] min-[400px]:text-[7px] md:text-xs text-gray-500 mt-1 md:mt-1">Auto-Rotation Descent</p>
          </div>
          <div className="flex-1 md:flex-none md:w-16 h-[1px] bg-gray-400/50 shrink-0" />
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 shrink-0 rounded-full bg-[#2563EB]" style={{ boxShadow: '0 0 8px #2563EB60' }} />
        </div>
      </div>

      {/* ── Initial CanSat Labels — Right ── */}
      <div
        ref={rightLabelsRef}
        className="absolute inset-0 w-full h-full transition-none"
        style={{ opacity: 1 }}
      >
        <div className="absolute right-[3%] min-[400px]:right-[5%] md:right-[12%] top-[13%] md:top-[30%] flex items-center justify-end gap-1.5 md:gap-3 w-[32%] md:w-max">
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 shrink-0 rounded-full bg-[#2563EB]" style={{ boxShadow: '0 0 8px #2563EB60' }} />
          <div className="flex-1 md:flex-none md:w-16 h-[1px] bg-gray-400/50 shrink-0" />
          <div className="text-left shrink-0">
            <p className="font-orbitron text-[9px] min-[400px]:text-[10px] md:text-base lg:text-lg font-bold text-gray-900 uppercase tracking-wider leading-none md:leading-tight">Sensor Array</p>
            <p className="font-mono text-[6px] min-[400px]:text-[7px] md:text-xs text-gray-500 mt-1 md:mt-1">BMP280 + MPU6050 IMU</p>
          </div>
        </div>

        <div className="absolute right-[3%] min-[400px]:right-[5%] md:right-[12%] top-[35%] md:top-[58%] flex items-center justify-end gap-1.5 md:gap-3 w-[32%] md:w-max">
          <div className="w-1.5 md:w-2 h-1.5 md:h-2 shrink-0 rounded-full bg-[#2563EB]" style={{ boxShadow: '0 0 8px #2563EB60' }} />
          <div className="flex-1 md:flex-none md:w-16 h-[1px] bg-gray-400/50 shrink-0" />
          <div className="text-left shrink-0">
            <p className="font-orbitron text-[9px] min-[400px]:text-[10px] md:text-base lg:text-lg font-bold text-gray-900 uppercase tracking-wider leading-none md:leading-tight">UHF Telemetry</p>
            <p className="font-mono text-[6px] min-[400px]:text-[7px] md:text-xs text-gray-500 mt-1 md:mt-1">433 MHz Downlink</p>
          </div>
        </div>
      </div>

      {/* ── Phase 1: Hero Title ── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24"
      >
        <div
          ref={phase1Ref}
          className="w-full lg:w-[45%] max-md:bg-white/40 max-md:backdrop-blur-md max-md:p-8 max-md:rounded-3xl max-md:border max-md:border-white/50 max-md:shadow-xl transition-all"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
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

        {/* Right Side Image Grid */}
        <div className="hidden md:flex w-full lg:w-[45%] gap-4 justify-end relative h-max">
          {/* Column 1 */}
          <div className="flex flex-col gap-4 mt-12">
            <div ref={gridImg1Ref} className="pointer-events-auto relative" style={{ opacity: 0, visibility: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
                alt="Earth from Space"
                className="w-48 lg:w-56 h-64 lg:h-72 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500"
                style={{ opacity: 'calc(1 - var(--crossfade, 0))' }}
              />
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                alt="Avionics Circuit"
                className="w-48 lg:w-56 h-64 lg:h-72 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500 absolute inset-0"
                style={{ opacity: 'var(--crossfade, 0)' }}
              />
            </div>
            <div ref={gridImg2Ref} className="pointer-events-auto relative" style={{ opacity: 0, visibility: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop"
                alt="Rocket Launch"
                className="w-48 lg:w-56 h-48 lg:h-56 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500"
                style={{ opacity: 'calc(1 - var(--crossfade, 0))' }}
              />
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop"
                alt="Mechanical Engineering"
                className="w-48 lg:w-56 h-48 lg:h-56 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500 absolute inset-0"
                style={{ opacity: 'var(--crossfade, 0)' }}
              />
            </div>
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-4 -mt-4">
            <div ref={gridImg3Ref} className="pointer-events-auto relative" style={{ opacity: 0, visibility: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=800&auto=format&fit=crop"
                alt="Satellite"
                className="w-48 lg:w-56 h-48 lg:h-56 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500"
                style={{ opacity: 'calc(1 - var(--crossfade, 0))' }}
              />
              <img
                src="https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?q=80&w=800&auto=format&fit=crop"
                alt="Code and Systems"
                className="w-48 lg:w-56 h-48 lg:h-56 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500 absolute inset-0"
                style={{ opacity: 'var(--crossfade, 0)' }}
              />
            </div>
            <div ref={gridImg4Ref} className="pointer-events-auto relative" style={{ opacity: 0, visibility: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop"
                alt="Astronaut"
                className="w-48 lg:w-56 h-64 lg:h-72 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500"
                style={{ opacity: 'calc(1 - var(--crossfade, 0))' }}
              />
              <img
                src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=800&auto=format&fit=crop"
                alt="Hardware Assembly"
                className="w-48 lg:w-56 h-64 lg:h-72 object-cover rounded-2xl shadow-2xl border border-white/20 hover:scale-[1.02] transition-transform duration-500 absolute inset-0"
                style={{ opacity: 'var(--crossfade, 0)' }}
              />
            </div>
          </div>
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
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col items-start justify-center px-6 md:px-12 lg:px-24 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="w-full lg:w-[38%] max-md:bg-white/40 max-md:backdrop-blur-md max-md:p-8 max-md:rounded-3xl max-md:border max-md:border-white/50 max-md:shadow-xl transition-all pointer-events-auto">
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

      <div
        ref={phase3GridRef}
        className="absolute bottom-0 right-0 w-full h-[50dvh] md:inset-0 md:h-full flex flex-col items-center md:items-end justify-center px-6 md:px-12 lg:px-24 pointer-events-none"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        {/* Phase 3 Right Side - Crazy Scattered Geometric Layout */}
        <div className="hidden md:block w-full lg:w-[45%] relative h-[400px] lg:h-[550px] pointer-events-auto">

          {/* Anchor point pushed to the extreme right edge */}
          <div className="absolute top-1/2 right-4 lg:right-12 transform -translate-y-1/2 flex items-center justify-center">

            {/* Main Circular Image */}
            <div ref={circleGraphicRef} className="absolute w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] border-2 border-white/20 transform hover:scale-105 transition-all duration-500 z-10 group bg-black">

              {/* Background Image (Fills the full circle) */}
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
                alt="Earth Orbit"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
              />

              {/* Foreground Image (Microchip) with mix-blend-multiply to drop the white background */}
              <img
                src="https://images.unsplash.com/photo-1592505295051-54b9db3073e5?q=80&w=800&auto=format&fit=crop"
                alt="Microchip"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700 z-10"
              />

              {/* Cyberpunk rotating ring */}
              <div className="absolute inset-2 rounded-full border border-dashed border-telemetry-cyan/50 animate-[spin_20s_linear_infinite] pointer-events-none z-30" />
              <div className="absolute inset-4 rounded-full border border-dashed border-white/30 animate-[spin_15s_linear_infinite_reverse] pointer-events-none z-30" />
            </div>

            {/* Tall Pill Shape (Fanned out to the left) */}
            <div ref={pillGraphicRef} className="absolute w-40 h-64 lg:w-48 lg:h-80 rounded-[4rem] overflow-hidden shadow-2xl border border-white/30 transform -translate-x-36 lg:-translate-x-48 -translate-y-8 lg:-translate-y-12 rotate-12 hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 z-0 group">
              <img
                src="https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800&auto=format&fit=crop"
                alt="Sensor Array"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Tilted Floating Square (Fanned out further left) */}
            <div ref={squareGraphicRef} className="absolute w-48 h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden shadow-2xl border border-telemetry-cyan/40 transform -translate-x-48 lg:-translate-x-64 translate-y-24 lg:translate-y-32 -rotate-6 hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 z-20 group">
              <img
                src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop"
                alt="Electronics"
                className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-telemetry-cyan/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating UI Data Card 1 */}
            <div className="absolute w-40 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex flex-col items-center justify-center transform -translate-x-56 lg:-translate-x-72 -translate-y-20 lg:-translate-y-32 hover:scale-110 hover:bg-white/20 transition-all duration-500 z-30 shadow-xl">
              <span className="text-telemetry-cyan font-mono text-[9px] tracking-[0.2em] uppercase mb-1">Status Link</span>
              <span className="text-white font-orbitron text-xs tracking-wider">NOMINAL</span>
            </div>

            {/* Floating UI Data Card 2 */}
            <div className="absolute w-32 h-12 bg-gray-900/60 backdrop-blur-md rounded-xl border border-telemetry-cyan/30 flex items-center justify-center transform -translate-x-4 lg:-translate-x-8 translate-y-36 lg:translate-y-48 hover:scale-110 transition-all duration-500 z-30 shadow-2xl">
              <span className="text-telemetry-cyan font-mono text-[10px] tracking-widest">IMU_SYNC</span>
            </div>

          </div>
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
            FLIGHT<br />COMPUTING
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
            {'>'} CANSAT_STATUS: NOMINAL<br />
            {'>'} INITIALIZING DOWNLINK... [OK]<br />
            {'>'} AWAITING LAUNCH COMMAND
          </div>
        </div>
      </div>

      {/* ── Phase 5.5: Scroll Typewriter Fill (Left Side) ── */}
      <div
        ref={deploymentRef}
        className="absolute bottom-0 left-0 w-full h-[50dvh] md:inset-y-0 md:h-full md:w-[45%] px-6 md:px-16 lg:px-24 flex items-center justify-start pointer-events-none transition-all z-10"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <h2
          ref={textFillRef}
          className="font-mono text-3xl md:text-5xl lg:text-[4rem] font-black uppercase tracking-tight leading-[1.1] text-left"
        >
          {/* Text injected via JS */}
        </h2>
      </div>

      {/* ── Phase 5.5: Premium Recovery Artifacts (Right Side) ── */}
      <div
        ref={recoveryArtifactsRef}
        className="absolute bottom-0 right-0 w-full md:w-[50%] h-[50dvh] md:h-full flex items-center justify-center pointer-events-none transition-all z-20"
        style={{ opacity: 0, visibility: 'hidden', perspective: '1200px' }}
      >
        <div className="relative w-56 h-80 md:w-64 md:h-[22rem] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

          {/* Ambient Premium Glow */}
          <div id="prem-glow" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white opacity-10 blur-[60px] rounded-full" />

          {/* Card 1: Left Fanned (Image) */}
          <div id="prem-card-1" className="absolute inset-0 bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-end p-6">
            <img src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800&auto=format&fit=crop" alt="Aerospace Recovery" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-8 h-[1px] bg-white/40 mb-3" />
              <p className="font-mono text-[9px] text-white/60 tracking-[0.2em] uppercase">System_01</p>
              <p className="font-orbitron text-lg font-bold text-white tracking-widest uppercase">Parachute</p>
            </div>
          </div>

          {/* Card 2: Right Fanned (Data / Tech) */}
          <div id="prem-card-2" className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-6 flex flex-col justify-between">
            <div className="w-full flex justify-between items-start">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <p className="font-mono text-[9px] text-white/50 tracking-[0.3em] uppercase">Telemetry</p>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border-[1px] border-white/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-[1px] border-dashed border-white/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-16 h-16 border-[1px] border-white/5 rounded-full" />
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 relative z-10">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[8px] text-white/40">LATITUDE</span>
                <span className="font-mono text-[10px] text-white/90">23.8103 N</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] text-white/40">LONGITUDE</span>
                <span className="font-mono text-[10px] text-white/90">90.4125 E</span>
              </div>
            </div>
          </div>

          {/* Card 3: Center Front (Premium Glass) */}
          <div id="prem-card-3" className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] p-6 flex flex-col items-center justify-center">
            <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Abstract minimal graphic in center */}
            <div className="absolute top-8 w-12 h-12 flex flex-col items-center justify-between opacity-50">
              <div className="w-[1px] h-4 bg-white" />
              <div className="w-2 h-2 rounded-full border border-white" />
              <div className="w-[1px] h-4 bg-white" />
            </div>

            <p className="font-orbitron text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 tracking-[0.3em] rotate-[-90deg] mt-8">
              RECOVERY
            </p>

            <div className="absolute bottom-8 font-mono text-[8px] tracking-[0.4em] text-white/40 uppercase">
              Active Descent
            </div>
          </div>

        </div>
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
            Mission<br />Archive
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
            The<br />Crew
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

      {/* ── Phase 8: Sponsors Marquee ── */}
      <div
        ref={phase8Ref}
        className="absolute bottom-24 left-1/2 flex flex-col items-center justify-center transition-all z-20 w-[100vw]"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="flex flex-col items-center mb-6">
          <span className="font-mono text-[10px] text-gray-400 tracking-[0.4em] uppercase mb-4">
            MISSION PARTNERS
          </span>
        </div>

        {/* Marquee Section */}
        <div className="relative w-full overflow-hidden py-4 pointer-events-auto">
          {/* Gradient Fades for edges */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#eef2f5] to-transparent z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#eef2f5] to-transparent z-10" />

          {/* Marquee Track */}
          <div className="flex whitespace-nowrap animate-marquee w-max items-center gap-16 md:gap-24 px-8">
            {/* Double the array to create seamless loop */}
            {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 text-gray-400 hover:text-[#2563EB] transition-colors duration-300 group cursor-pointer"
              >
                <div className="text-gray-400 group-hover:text-[#2563EB] transition-colors duration-300">
                  {sponsor.icon}
                </div>
                <span className="font-orbitron text-2xl md:text-3xl font-bold tracking-wider">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

    </div>
  );
};
