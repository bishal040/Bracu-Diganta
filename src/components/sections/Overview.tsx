import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Rocket, Cpu, ShieldCheck, Download, ChevronRight, Zap, Satellite } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/* ── Animated Counter ── */
const AnimatedCounter: React.FC<{ end: number; suffix?: string; label: string; duration?: number }> = ({
  end, suffix = '', label, duration = 2
}) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!countRef.current) return;
    const el = countRef.current;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: end,
          duration,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            el.textContent = Math.floor(Number(el.innerText)) + suffix;
          }
        });
      }
    });
  }, [end, suffix, duration]);

  return (
    <div className="text-center group">
      <span
        ref={countRef}
        className="block font-orbitron text-3xl md:text-5xl font-black text-gray-900 tabular-nums"
      >
        0{suffix}
      </span>
      <span className="text-xs md:text-sm font-mono tracking-[0.3em] text-gray-500 uppercase mt-2 block">
        {label}
      </span>
    </div>
  );
};

/* ── Subsystem Card ── */
const SubsystemCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  glowColor: string;
  index: number;
}> = ({ icon, title, description, accentColor, glowColor, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="overview-card relative bg-white/50 backdrop-blur-xl border border-gray-200/60 p-7 md:p-8 rounded-3xl overflow-hidden group cursor-default transition-all duration-500 hover:border-transparent hover:shadow-2xl"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Radial glow that follows mouse */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 60%)`
        }}
      />

      {/* Subtle animated border glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${accentColor}40, 0 0 30px ${accentColor}15`
        }}
      />

      <div className="relative z-10">
        {/* Icon with animated ring */}
        <div className="relative w-12 h-12 mb-6">
          <div
            className="absolute inset-0 rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            style={{ backgroundColor: `${accentColor}15` }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: accentColor }}>
            {icon}
          </div>
          {/* Orbiting dot */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              backgroundColor: accentColor,
              top: '-3px',
              right: '-3px',
              boxShadow: `0 0 6px ${accentColor}`,
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
        </div>

        <h4 className="font-orbitron text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide group-hover:tracking-wider transition-all duration-500">
          {title}
        </h4>

        <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
          {description}
        </p>

        {/* Bottom accent line that expands on hover */}
        <div className="mt-6 h-[2px] w-8 group-hover:w-full transition-all duration-700 ease-out rounded-full" style={{ backgroundColor: accentColor }} />
      </div>
    </div>
  );
};

/* ── Decorative Orbital Ring SVG ── */
const OrbitalDecoration: React.FC = () => (
  <div className="absolute -right-32 -top-32 w-[500px] h-[500px] opacity-[0.04] pointer-events-none hidden md:block">
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="200" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="4 8" />
      <circle cx="250" cy="250" r="150" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="2 6" />
      <circle cx="250" cy="250" r="100" stroke="#2563EB" strokeWidth="0.5" />
      <circle cx="250" cy="50" r="4" fill="#2563EB">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 250 250"
          to="360 250 250"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="250" cy="100" r="3" fill="#2563EB">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 250 250"
          to="-360 250 250"
          dur="30s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export const Overview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        '.overview-header',
        { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
          duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Stats counter row
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-row', start: 'top 80%' },
        }
      );

      // Cards stagger
      gsap.fromTo(
        '.overview-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.overview-grid', start: 'top 75%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={sectionRef} className="py-24 md:py-32 relative z-10 bg-[#eef2f5] overflow-hidden">
      <OrbitalDecoration />

      <div className="max-w-7xl mx-auto px-6 md:px-8" ref={containerRef}>

        {/* ── Section Header ── */}
        <div className="overview-header mb-16 md:mb-20 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase mb-4">
            <span className="w-8 h-[1px] bg-[#2563EB]" />
            01 // Overview
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight uppercase leading-[0.95]">
            What is
            <span className="block mt-1 md:mt-2 bg-gradient-to-r from-[#2563EB] to-cyan-500 bg-clip-text text-transparent">
              Diganta?
            </span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-6 max-w-xl">
            Pioneering accessible aerospace research, one CanSat at a time. We're a student-led team pushing the
            boundaries of atmospheric science and orbital mechanics.
          </p>
        </div>

        {/* ── Stats Counter Row ── */}
        <div className="stats-row grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20 py-10 px-6 md:px-10 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="stat-item"><AnimatedCounter end={6} suffix="+" label="Missions" /></div>
          <div className="stat-item"><AnimatedCounter end={32} suffix="" label="Team Members" /></div>
          <div className="stat-item"><AnimatedCounter end={15} suffix="K" label="Alt. Reached (ft)" /></div>
          <div className="stat-item"><AnimatedCounter end={98} suffix="%" label="Recovery Rate" /></div>
        </div>

        {/* ── Main Bento Grid ── */}
        <div className="overview-grid grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          {/* Mission & Vision - Hero Card */}
          <div className="overview-card md:col-span-2 relative bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:bg-white/80 transition-all duration-500 overflow-hidden">
            {/* Decorative grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100/80 rounded-2xl flex items-center justify-center">
                  <Target className="text-[#2563EB]" size={24} />
                </div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#2563EB]/60 uppercase border border-[#2563EB]/20 px-3 py-1 rounded-full">
                  Core Mission
                </span>
              </div>
              <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-4 uppercase">Mission &amp; Vision</h3>
              <p className="text-gray-600 leading-relaxed max-w-xl text-sm md:text-base">
                To pioneer accessible aerospace research and democratize space technology by developing low-cost, high-reliability modular satellites. We envision a future where student-led initiatives drive the next generation of atmospheric data collection and orbital mechanics.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex items-center gap-2 text-[#2563EB] font-medium text-sm font-mono uppercase tracking-wider group-hover:gap-4 transition-all duration-500">
              <span>Learn about our strategic roadmap</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>

          {/* Portfolio Download - Dark card */}
          <div className="overview-card bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0 transition-transform duration-[3000ms] ease-out group-hover:scale-150 group-hover:rotate-12"
                style={{
                  background: 'radial-gradient(circle at 20% 80%, #2563EB30 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d430 0%, transparent 50%)'
                }}
              />
            </div>

            {/* Floating satellite icon */}
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <Satellite size={80} className="text-white" style={{ animation: 'float 6s ease-in-out infinite' }} />
            </div>

            <div className="relative z-10">
              <h3 className="font-orbitron text-2xl font-bold text-white mb-3 uppercase">Portfolio</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Download our comprehensive mission documentation, subsystem breakdown, and technical whitepapers.
              </p>
            </div>
            <div className="relative z-10">
              <MagneticButton className="w-full bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-2 py-4">
                <Download size={18} />
                <span className="font-semibold tracking-wide text-sm">Download PDF</span>
              </MagneticButton>
            </div>
          </div>

          {/* ── Subsystem Cards ── */}
          <SubsystemCard
            icon={<Cpu size={22} />}
            title="Avionics & Computing"
            description="Custom-built flight computers featuring ESP32 dual-core processors, redundant IMUs, and high-gain UHF telemetry systems."
            accentColor="#0891b2"
            glowColor="#0891b215"
            index={0}
          />
          <SubsystemCard
            icon={<Rocket size={22} />}
            title="Recovery Systems"
            description="Active aerodynamics utilizing auto-rotation blades and precision-deployed parafoils for controlled, targeted descent."
            accentColor="#6366f1"
            glowColor="#6366f115"
            index={1}
          />
          <SubsystemCard
            icon={<ShieldCheck size={22} />}
            title="Structure & Payload"
            description="Ultra-lightweight, 3D-printed modular chassis designed to withstand high G-forces while housing delicate atmospheric sensors."
            accentColor="#059669"
            glowColor="#05966915"
            index={2}
          />
        </div>
      </div>

      {/* Float keyframe for satellite */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
};
