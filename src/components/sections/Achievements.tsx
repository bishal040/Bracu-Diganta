import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal, Award, Star, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: 'Missions Launched', value: 6, suffix: '+', icon: <Rocket size={18} /> },
  { label: 'Data Points', value: 1.2, suffix: 'M', icon: <Star size={18} /> },
  { label: 'Engineering Hours', value: 8500, suffix: '+', icon: <Trophy size={18} /> },
  { label: 'Team Members', value: 35, suffix: '', icon: <Medal size={18} /> },
];

const AWARDS = [
  {
    year: '2023',
    title: 'National CanSat Competition',
    position: '1st Place',
    icon: <Trophy size={24} />,
    accentColor: '#F59E0B',
    accentBg: 'bg-amber-50',
  },
  {
    year: '2023',
    title: 'Best Telemetry Design',
    position: 'Winner',
    icon: <Award size={24} />,
    accentColor: '#2563EB',
    accentBg: 'bg-blue-50',
  },
  {
    year: '2022',
    title: 'Space Innovation Challenge',
    position: 'Runner Up',
    icon: <Medal size={24} />,
    accentColor: '#E11D48',
    accentBg: 'bg-rose-50',
  },
];

/* ── Animated Counter ── */
const Counter: React.FC<{ target: number; suffix: string; decimals?: number }> = ({
  target,
  suffix,
  decimals = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        if (hasRun.current) return;
        hasRun.current = true;
        gsap.fromTo(
          ref.current,
          { innerText: '0' },
          {
            innerText: target,
            duration: 2.2,
            ease: 'power2.out',
            snap: { innerText: decimals > 0 ? 0.1 : 1 },
            onUpdate() {
              if (ref.current) {
                ref.current.textContent =
                  Number(ref.current.innerText).toFixed(decimals) + suffix;
              }
            },
          }
        );
      },
    });
  }, [target, suffix, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
};

export const Achievements: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ach-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
      gsap.fromTo(
        '.ach-stat',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ach-stats-row', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '.ach-award',
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ach-awards-grid', start: 'top 78%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="achievements" ref={sectionRef} className="py-24 md:py-32 relative z-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* ── Header ── */}
        <div className="ach-header mb-16 md:mb-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-mono tracking-[0.4em] text-[#2563EB] uppercase mb-4">
            <span className="w-8 h-[1px] bg-[#2563EB]" />
            04 // Achievements
            <span className="w-8 h-[1px] bg-[#2563EB]" />
          </span>
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gray-900 tracking-tight uppercase">
            Mission Milestones
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed mt-6">
            From our first prototype to national-level competition wins — every milestone
            pushes us closer to the horizon.
          </p>
          <div className="w-16 h-[3px] bg-[#2563EB] mt-8" />
        </div>

        {/* ── Stats Row ── */}
        <div className="ach-stats-row grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="ach-stat group bg-[#eef2f5] hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg p-6 md:p-8 rounded-2xl text-center transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-[#eef2f5] flex items-center justify-center mx-auto mb-4 text-[#2563EB] transition-colors duration-500">
                {stat.icon}
              </div>
              <div className="font-orbitron text-3xl md:text-4xl font-black text-gray-900 mb-2">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </div>
              <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-gray-500 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Awards Grid ── */}
        <div className="ach-awards-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {AWARDS.map((award, i) => (
            <div
              key={i}
              className="ach-award group relative bg-white border border-gray-200 hover:border-transparent p-8 md:p-10 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${award.accentColor}12 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${award.accentBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  style={{ color: award.accentColor }}
                >
                  {award.icon}
                </div>

                {/* Year */}
                <span className="font-mono text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-3">
                  {award.year}
                </span>

                {/* Title */}
                <h3 className="font-orbitron text-lg md:text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  {award.title}
                </h3>

                {/* Position badge */}
                <span
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    color: award.accentColor,
                    backgroundColor: `${award.accentColor}15`,
                    border: `1px solid ${award.accentColor}30`,
                  }}
                >
                  {award.position}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
