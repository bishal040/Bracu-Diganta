import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NEWS_UPDATES } from '../../data/timeline';

gsap.registerPlugin(ScrollTrigger);

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.tl-card').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Animate the vertical line drawing
      gsap.fromTo('.tl-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top 30%',
            end: 'bottom 70%',
            scrub: 1,
          }
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#f8fafc] pt-24 pb-20">

      {/* Subtle grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0" />

      {/* Hero Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 mb-16 md:mb-24">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/')}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-4 py-1.5 rounded-full mb-5">
            <Calendar size={13} className="text-blue-600" />
            <span className="text-blue-700 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
              {NEWS_UPDATES.length} Milestones
            </span>
          </div>

          <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase leading-[0.95] mb-5">
            Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"> Journey</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl leading-relaxed">
            From Bangladesh's first nano-satellite to global aerospace competitions — every milestone that shaped BRACU Diganta.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">

        {/* Vertical line (center on desktop, left on mobile) */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 z-0">
          <div className="tl-line w-full h-full bg-gradient-to-b from-blue-400 via-blue-500 to-cyan-400 origin-top" />
        </div>

        <div className="relative z-10 space-y-12 md:space-y-20">
          {NEWS_UPDATES.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={item.id}
                className={`tl-card relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Center dot */}
                <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20">
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color} shadow-lg`} />
                    <div className={`absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-br ${item.color} animate-ping opacity-30`} />
                    <div className="absolute -inset-2 w-8 h-8 rounded-full border-2 border-blue-200/50" />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[calc(50%-3rem)] ${isEven ? 'md:pr-0 md:mr-auto' : 'md:pl-0 md:ml-auto'} pl-14 md:pl-0`}>
                  <div className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-1">

                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-15 mix-blend-multiply`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Category badge on image */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/50 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                        <item.icon size={13} className="text-blue-600" />
                        <span className="text-slate-800 font-mono text-[9px] tracking-[0.2em] uppercase font-bold">{item.category}</span>
                      </div>

                      {/* Year overlay */}
                      <div className="absolute bottom-4 right-4">
                        <span className="font-orbitron text-5xl font-black text-white/20 leading-none">{item.year}</span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="p-5 md:p-6">
                      {/* Date */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`h-[2px] w-8 bg-gradient-to-r ${item.color} rounded-full`} />
                        <span className="font-mono text-xs text-slate-400 tracking-widest font-semibold">
                          {item.day} {item.month} {item.year}
                        </span>
                      </div>

                      <h3 className="font-orbitron text-lg md:text-xl font-bold text-slate-900 uppercase tracking-tight mb-3 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>

                      {/* Bottom bar */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">Verified</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 tracking-widest">SYS-{item.id}X9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* End marker */}
        <div className="relative flex justify-start md:justify-center mt-16">
          <div className="ml-[13px] md:ml-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MapPin size={18} className="text-white" />
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="font-orbitron text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
            And the journey continues...
          </p>
        </div>
      </div>
    </div>
  );
};
