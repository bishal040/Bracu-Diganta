import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Orbit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const MinimalStat: React.FC<{ end: number; suffix?: string; label: string }> = ({ end, suffix = '', label }) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!countRef.current) return;
    const el = countRef.current;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        const counter = { val: 0 };
        gsap.to(counter, {
          val: end,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(counter.val).toString();
          }
        });
      }
    });
  }, [end]);

  return (
    <div className="flex flex-col items-start group">
      <div className="flex items-center mb-2">
        <span
          ref={countRef}
          className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tabular-nums group-hover:text-[#2563EB] transition-colors duration-300 leading-none tracking-tighter"
        >
          0
        </span>
        <span className="font-orbitron text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors duration-300 leading-none tracking-tighter">
          {suffix}
        </span>
      </div>
      <span className="text-[10px] md:text-xs font-mono tracking-widest text-gray-500 uppercase max-w-[140px] leading-tight font-semibold group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </div>
  );
};

export const Overview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Reveal animation
      gsap.fromTo(
        '.reveal-elem',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );



    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={sectionRef} className="py-8 lg:py-24 relative z-10 bg-[#eef2f5] overflow-hidden h-full flex items-center">
      
      {/* Massive Background Text */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full overflow-hidden flex justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="font-orbitron font-black text-[18vw] leading-none whitespace-nowrap text-gray-900 tracking-tighter">
          DIGANTA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full mt-4 md:mt-12">
        
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Narrative & Stats */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full reveal-elem">
            <div>
              <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-gray-900 leading-[1.1] mb-3 md:mb-6 uppercase tracking-tight">
                Pioneering <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
                  The Exosphere
                </span>
              </h2>
              
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-10 max-w-md">
                We are a student-led engineering team dedicated to democratizing space technology. By developing low-cost, high-reliability modular CanSats, we push the boundaries of atmospheric science and orbital mechanics.
              </p>
              
              <MagneticButton className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 md:px-8 md:py-4 rounded-full text-sm font-semibold transition-all group">
                Download Portfolio
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </MagneticButton>
            </div>

            {/* 2x2 Grid for the Stats */}
            <div className="mt-6 md:mt-8 grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-8">
              <MinimalStat end={6} suffix="+" label="Successful Missions" />
              <MinimalStat end={32} label="Active Engineers" />
              <MinimalStat end={15} suffix="K" label="Altitude Reached (ft)" />
              <MinimalStat end={98} suffix="%" label="Recovery Rate" />
            </div>
          </div>

          {/* Right Column: Major Announcement & News Card */}
          <div className="lg:col-span-7 reveal-elem">
            <div className="relative w-full min-h-[400px] sm:aspect-[4/5] md:min-h-0 md:aspect-square bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col justify-end p-6 md:p-12">
              
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop")' }}
              />
              
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/10 opacity-90 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Content Overlay */}
              <div className="relative z-10 w-full mt-auto pt-16">
                
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className="bg-[#2563EB]/80 backdrop-blur-md border border-[#2563EB] px-3 py-1.5 rounded-2xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-[10px] font-mono tracking-widest uppercase font-semibold">Latest Announcement</span>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-orbitron font-bold text-white mb-3 md:mb-4 uppercase leading-[1.1]">
                  Diganta Selected for <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    CANSAT 2026
                  </span>
                </h3>
                
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 max-w-md">
                  We are thrilled to announce that Team Diganta has officially qualified for the International CanSat Competition. Our latest modular payload design scored in the top 5% of global submissions.
                </p>

                {/* Glassmorphism Button */}
                <MagneticButton 
                  onClick={() => navigate('/news/cansat-2026')} 
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-white px-6 py-3 rounded-full text-sm font-semibold transition-all w-full sm:w-auto"
                >
                  Read Full Story
                  <ArrowUpRight size={16} />
                </MagneticButton>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
