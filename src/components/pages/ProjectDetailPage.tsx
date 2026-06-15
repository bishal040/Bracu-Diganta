import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, CheckCircle2, Activity, ShieldAlert } from 'lucide-react';
import { missionsData } from '../../data/missions';

gsap.registerPlugin(ScrollTrigger);

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  const project = missionsData.find((m) => m.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!project || !project.details || !pageRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Hero Parallax
      gsap.to('.hero-image', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // 2. Scrollytelling Text Reveal
      gsap.fromTo('.reveal-text',
        { opacity: 0.2, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.narrative-section',
            start: 'top 70%',
            end: 'center center',
            scrub: true
          }
        }
      );

      // 3. Horizontal Scroll for Specs & Gallery
      if (horizontalSectionRef.current && horizontalContainerRef.current) {
        const container = horizontalContainerRef.current;
        gsap.to(container, {
          x: () => -(container.scrollWidth - window.innerWidth) + "px",
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + container.scrollWidth
          }
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [project]);

  if (!project || !project.details) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900">
        <ShieldAlert size={48} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="font-orbitron text-4xl font-bold uppercase tracking-widest mb-4">Mission Data Corrupted</h1>
        <p className="font-mono text-slate-500 mb-8">Unable to locate files for project designation: {slug}</p>
        <button onClick={() => navigate('/missions')} className="px-6 py-3 border border-slate-300 hover:bg-slate-900 hover:text-white transition-colors rounded-full font-mono text-xs uppercase tracking-widest">
          Return to Archive
        </button>
      </div>
    );
  }

  // Helper to split text for reveal effect
  const words = project.details.overview.split(' ');

  return (
    <div ref={pageRef} className="bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden relative">

      {/* Background Orbs - Light Mode */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-24 left-6 md:left-12 z-50">
        <button
          onClick={() => navigate('/missions')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white backdrop-blur-xl border border-slate-200 hover:border-blue-300 rounded-full text-slate-700 hover:text-blue-600 transition-all shadow-lg hover:shadow-xl group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest font-semibold">Mission Archive</span>
        </button>
      </nav>

      {/* Hero Section: 100vh Parallax */}
      <section className="hero-section relative h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white">
          <img src={project.image} alt={project.title} className="hero-image w-full h-[130%] object-cover -top-[15%] absolute opacity-90" />
          {/* Lighter gradient for hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-slate-50" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-mono text-blue-700 border border-blue-200 px-5 py-2 rounded-full tracking-[0.3em] uppercase backdrop-blur-md bg-white/80 shadow-sm font-bold">
              {project.category}
            </span>
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${project.statusColor.replace('text-', 'bg-')} animate-pulse`} />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-800 font-bold">{project.status}</span>
            </div>
          </div>

          <h1 className="font-orbitron text-5xl md:text-7xl lg:text-[9rem] font-black uppercase tracking-tighter leading-none mb-6 drop-shadow-xl text-slate-900">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Stats Section: Overlapping the hero transition */}
      <section className="relative z-20 max-w-screen-2xl mx-auto px-6 md:px-12 -mt-32 md:-mt-40 mb-24 md:mb-40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {project.stats.map((stat, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-xl border border-slate-200/60 p-8 rounded-3xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group">
              <div className="text-[10px] font-mono text-blue-600 tracking-widest uppercase mb-4 font-bold">{stat.label}</div>
              <div className="font-orbitron text-3xl md:text-5xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative Section: Cinematic Text Reveal */}
      <section className="narrative-section py-20 px-6 md:px-12 lg:px-32 bg-transparent mb-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-blue-600 font-mono text-xs tracking-[0.3em] uppercase mb-12 flex items-center gap-4 font-bold">
            <span className="w-12 h-[2px] bg-blue-600"></span> Primary Objective
          </h2>
          <h3 className="font-orbitron text-3xl md:text-5xl lg:text-6xl leading-[1.2] mb-32 max-w-5xl text-slate-900 font-bold">
            {project.details.objective}
          </h3>

          <div className="max-w-5xl ml-auto border-l-4 border-blue-100 pl-8 md:pl-16 relative">
            <div className="absolute top-0 left-[-13px] w-6 h-6 bg-blue-50 rounded-full border-4 border-blue-200" />
            <h2 className="text-slate-500 font-mono text-xs tracking-[0.3em] uppercase mb-12 font-bold">Technical Overview</h2>
            <p className="text-2xl md:text-4xl lg:text-4xl leading-[1.6] font-light flex flex-wrap gap-x-3 gap-y-2 text-slate-700">
              {words.map((word, idx) => (
                <span key={idx} className="reveal-text inline-block">{word}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Section: Architecture & Gallery */}
      <section ref={horizontalSectionRef} className="h-screen w-full bg-slate-100 text-slate-900 overflow-hidden relative flex items-center z-10 border-t border-slate-200 shadow-inner">
        <div className="absolute bottom-12 left-6 md:bottom-20 md:left-24 z-10 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-sm">
          <Activity className="text-blue-600 animate-pulse" />
          <h2 className="font-mono text-xs tracking-[0.3em] uppercase font-bold text-slate-800">System Architecture & Visual Data</h2>
        </div>

        <div ref={horizontalContainerRef} className="flex items-center gap-12 md:gap-24 px-6 md:px-24 h-[70vh] md:h-[65vh] mt-12 md:mt-0">

          {/* Tech Specs Cards */}
          {project.details.technicalSpecs.map((spec, idx) => (
            <div key={idx} className="w-[85vw] md:w-[480px] h-full flex-shrink-0 bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-center hover:border-blue-300 transition-all duration-500 shadow-xl hover:shadow-2xl group">
              <h4 className="font-mono text-xs text-blue-600 tracking-widest uppercase font-bold mb-12 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 mr-4 border border-blue-100">
                  {idx + 1}
                </span>
                {spec.category}
              </h4>
              <ul className="flex flex-col gap-8">
                {spec.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-5">
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-1" />
                    <span className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Divider */}
          <div className="w-[2px] h-1/2 bg-gradient-to-b from-transparent via-slate-300 to-transparent flex-shrink-0 mx-6 md:mx-12" />

          {/* Gallery Images */}
          {project.details.gallery.map((img, idx) => (
            <div key={`img-${idx}`} className="w-[90vw] md:w-[70vw] lg:w-[1000px] h-full flex-shrink-0 rounded-[2.5rem] overflow-hidden group border border-slate-200 shadow-xl bg-white p-3">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img src={img} alt={`Gallery Image ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}

          {/* End padding block to ensure scroll completion */}
          <div className="w-[10vw] flex-shrink-0" />
        </div>
      </section>

      {/* Footer Transition Space */}
      <div className="h-32 bg-slate-100" />
    </div>
  );
};
