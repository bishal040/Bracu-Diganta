import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Target, Activity, ShieldAlert } from 'lucide-react';
import { missionsData } from '../../data/missions';
import { MagneticButton } from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const TelemetryTerminal = () => {
  const [lines, setLines] = React.useState<string[]>(['> INITIATING HANDSHAKE...']);
  
  React.useEffect(() => {
    const logs = [
      '> ESTABLISHING UPLINK...',
      '> UPLINK SECURED. PING: 24ms',
      '> SENSOR ARRAY: NOMINAL',
      '> GYRO CALIBRATION: OK',
      '> AWAITING COMMAND...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if(i < logs.length) {
        setLines(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 bg-blue-50/50 border border-blue-200/50 rounded-lg p-4 font-mono text-[10px] text-blue-600 h-32 overflow-hidden relative shadow-[0_0_20px_rgba(37,99,235,0.05)]">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
      <div className="flex flex-col gap-1.5 relative z-0">
        {lines.map((line, idx) => (
          <div key={idx} className="opacity-80">{line}</div>
        ))}
        <div className="w-2 h-3 bg-blue-500 animate-ping mt-1" />
      </div>
    </div>
  );
};

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const project = missionsData.find((m) => m.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!project || !project.details || !pageRef.current) return;

    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(
        '.hero-element',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
      );

      // Scroll Animations for content
      gsap.fromTo(
        '.reveal-section',
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [project]);

  if (!project || !project.details) {
    return (
      <div className="min-h-screen bg-[#eef2f5] flex flex-col items-center justify-center text-gray-900">
        <ShieldAlert size={48} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="font-orbitron text-4xl font-bold uppercase tracking-widest mb-4">Mission Data Corrupted</h1>
        <p className="font-mono text-gray-600 mb-8">Unable to locate files for project designation: {slug}</p>
        <button onClick={() => navigate('/missions')} className="px-6 py-3 border border-gray-300 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors rounded-full font-mono text-xs uppercase tracking-widest">
          Return to Archive
        </button>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#eef2f5] text-gray-900 selection:bg-[#2563EB] selection:text-white">
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative w-full h-[80vh] md:h-[90vh] flex items-end pb-24 px-6 md:px-12 overflow-hidden">
        {/* Absolute Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#eef2f5] via-[#eef2f5]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f5]/90 via-[#eef2f5]/40 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>

        {/* Floating Back Button */}
        <div className="absolute top-32 left-6 md:left-12 z-50">
          <MagneticButton className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 hover:bg-gray-900 hover:text-white backdrop-blur-md border border-gray-300 rounded-full text-gray-800 transition-all group cursor-pointer">
            <div onClick={() => navigate('/missions')} className="flex items-center gap-2">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">Mission Archive</span>
            </div>
          </MagneticButton>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="hero-element flex items-center gap-4 mb-6">
            <div className="px-3 py-1.5 bg-[#2563EB]/20 border border-[#2563EB]/50 text-[#2563EB] rounded-full flex items-center gap-2">
              <Target size={12} />
              <span className="font-mono text-[9px] tracking-widest uppercase font-bold">{project.category}</span>
            </div>
            <div className="px-3 py-1.5 bg-white/80 border border-white/40 text-gray-900 rounded-full flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${project.statusColor} animate-pulse`} />
              <span className="font-mono text-[9px] tracking-widest uppercase font-bold">{project.status}</span>
            </div>
          </div>
          
          <h1 className="hero-element font-orbitron text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-gray-900 uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
            {project.title}
          </h1>

          <div className="hero-element grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mt-12 border-t border-gray-300 pt-8">
            {project.stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">{stat.label}</div>
                <div className="font-orbitron text-xl text-gray-900 font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div ref={contentRef} className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Briefing */}
        <div className="lg:col-span-6">
          <div className="reveal-section mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#2563EB]" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#2563EB] uppercase font-bold">
                Mission Objective
              </span>
            </div>
            <h2 className="font-orbitron text-2xl md:text-3xl text-gray-900 font-bold leading-snug">
              {project.details.objective}
            </h2>
          </div>

          <div className="reveal-section mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-gray-300" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-gray-600 uppercase font-bold">
                Technical Overview
              </span>
            </div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed font-sans font-light">
              {project.details.overview}
            </p>
          </div>

          {/* Gallery Images */}
          <div className="reveal-section grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
            {project.details.gallery.map((img, idx) => (
              <div key={idx} className={`relative rounded-2xl overflow-hidden group ${idx === 2 ? 'md:col-span-2' : ''}`}>
                <div className="aspect-[4/3] w-full">
                  <img 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Telemetry & Tech Specs */}
        <div className="lg:col-span-6">
          <div className="reveal-section sticky top-32">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              {/* Scanline overlay for screen effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 z-0" />
              
              {/* Subtle grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:1rem_1rem] z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Activity className="text-[#2563EB] animate-pulse" size={24} />
                    <h3 className="font-orbitron text-xl font-bold text-gray-900 uppercase tracking-wider">
                      Live Telemetry
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                    <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-bold">Active</span>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  {project.details.technicalSpecs.map((spec, idx) => (
                    <div key={idx} className="relative">
                      <h4 className="font-mono text-[10px] text-[#2563EB] tracking-widest uppercase font-bold mb-4 flex items-center gap-2">
                        <span className="text-gray-400">[{String(idx + 1).padStart(2, '0')}]</span> {spec.category}
                      </h4>
                      <ul className="flex flex-col gap-3 pl-6 border-l border-gray-200 relative">
                        {/* Animated scanning line on hover */}
                        <div className="absolute left-0 top-0 w-[1px] h-0 bg-[#2563EB] shadow-[0_0_10px_#2563EB] group-hover:h-full transition-all duration-1000 ease-in-out" />
                        
                        {spec.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-center gap-3 group/item">
                            <div className="w-1.5 h-1.5 bg-gray-300 group-hover/item:bg-[#2563EB] group-hover/item:shadow-[0_0_8px_#2563EB] transition-all rounded-sm" />
                            <span className="text-gray-700 font-mono text-xs uppercase leading-relaxed group-hover/item:text-[#2563EB] transition-colors">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Terminal Window */}
                <TelemetryTerminal />

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
