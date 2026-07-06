import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagneticButton } from '../ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export const Overview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
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
    <section id="overview" ref={sectionRef} className="pt-20 pb-4 md:pb-6 relative z-10 bg-[#eef2f5] overflow-hidden h-full flex flex-col justify-center">

      {/* Massive Background Text */}
      <div className="hidden md:flex absolute -top-12 left-1/2 -translate-x-1/2 w-full overflow-hidden justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="font-orbitron font-black text-[18vw] leading-none whitespace-nowrap text-gray-900 tracking-tighter">
          DIGANTA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full flex-1 flex flex-col justify-center">

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 lg:gap-6 items-stretch">

          {/* Left Column: About Us + Vision/Mission */}
          <div className="lg:col-span-5 flex flex-col reveal-elem">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-gray-900 leading-[1.1] mb-2 md:mb-3 uppercase tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
                  About Us
                </span>
              </h2>

              <div className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 max-w-md space-y-1.5">
                <p>
                  BRACU Diganta is a student-led initiative under LaSSET (Laboratory of Space System Engineering & Technology) at department of EEE, BSRM School of Engineering, BRAC University, advancing space education in Bangladesh by designing and building small satellite through system engineering.
                </p>
                <p>
                  We provide hands-on experience in real-world satellite missions. Through our custom Learning Kit, we empower students with practical knowledge in embedded systems across universities and STEM programs.
                </p>
              </div>

              <MagneticButton
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `${import.meta.env.BASE_URL}Diganta Portfolio 2026.pdf`;
                  link.download = 'Diganta Portfolio 2026.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all group"
              >
                Download Portfolio
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </MagneticButton>
            </div>

            {/* Vision & Mission */}
            <div className="mt-3 md:mt-4 flex flex-col gap-2.5">
              <div className="bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl p-3 md:p-4 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-orbitron font-bold text-gray-900 uppercase tracking-widest text-xs mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full group-hover:scale-150 transition-transform" />
                  Vision
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  By 2030, we aim to spread space education across every corner of Bangladesh and build a new generation of space researchers.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-gray-200/60 rounded-xl p-3 md:p-4 hover:shadow-[0_10px_30px_rgba(6,182,212,0.08)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-orbitron font-bold text-gray-900 uppercase tracking-widest text-xs mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform" />
                  Mission
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  To make space science accessible across Bangladesh through hands-on training, outreach, and interactive events—empowering youth to lead in research and innovation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Major Announcement & News Card */}
          <div className="lg:col-span-7 reveal-elem">
            <div className="relative w-full h-full min-h-[220px] sm:min-h-[260px] md:min-h-[320px] lg:min-h-0 bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group flex flex-col justify-end p-4 md:p-6 lg:p-8">

              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: 'url("https://i.ibb.co.com/FNmvLvB/IMG-4654.jpg")' }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/10 opacity-90 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Content Overlay */}
              <div className="relative z-10 w-full mt-auto">

                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <div className="bg-[#2563EB]/80 backdrop-blur-md border border-[#2563EB] px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-[9px] md:text-[10px] font-mono tracking-widest uppercase font-semibold">Latest Announcement</span>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-orbitron font-bold text-white mb-2 uppercase leading-[1.1]">
                  Advances to PDR Stage <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    TEKNOFEST 2026
                  </span>
                </h3>

                <p className="text-gray-300 text-[11px] md:text-xs leading-relaxed mb-3 max-w-md">
                  BRACU Diganta has advanced to the Project Design Review (PDR) stage of TEKNOFEST 2026, preparing to present its CanSat mission through an online evaluation interview.
                </p>

                <MagneticButton
                  onClick={() => navigate('/news/teknofest-2026')}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-white px-4 py-2 rounded-full text-xs font-semibold transition-all w-full sm:w-auto"
                >
                  Read Full Story
                  <ArrowUpRight size={14} />
                </MagneticButton>

              </div>
            </div>
          </div>

        </div>

        {/* Animated Sponsors Marquee */}
        <div className="mt-4 md:mt-auto pt-4 md:pt-8 border-t border-gray-300/50 w-full overflow-hidden relative shrink-0">
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#eef2f5] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#eef2f5] to-transparent z-10" />
          
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex items-center gap-8 md:gap-24 w-max pr-8 md:pr-24"
          >
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="text-base sm:text-lg md:text-2xl font-orbitron font-bold text-gray-400 uppercase tracking-widest">BRAC University</div>
                <div className="text-base sm:text-lg md:text-2xl font-orbitron font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
                  Aerospace Corp
                </div>
                <div className="text-base sm:text-lg md:text-2xl font-orbitron font-bold text-gray-400 uppercase tracking-widest">Orbital Dynamics</div>
                <div className="text-base sm:text-lg md:text-2xl font-orbitron font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500" />
                  Quantum Systems
                </div>
                <div className="text-base sm:text-lg md:text-2xl font-orbitron font-bold text-gray-400 uppercase tracking-widest">Nexus Labs</div>
                <div className="text-base sm:text-lg md:text-2xl font-orbitron font-bold text-gray-400 uppercase tracking-widest">Stellar Engineering</div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
