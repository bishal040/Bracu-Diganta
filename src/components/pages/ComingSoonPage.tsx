import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Hexagon } from 'lucide-react';

export const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900 px-6">

      {/* Architectural Background Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full border-x border-slate-200 max-w-[100rem] mx-auto flex justify-between opacity-50">
          <div className="w-[1px] h-full bg-slate-200" />
          <div className="w-[1px] h-full bg-slate-200" />
          <div className="w-[1px] h-full bg-slate-200" />
          <div className="w-[1px] h-full bg-slate-200" />
        </div>

        {/* Subtle Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] flex items-center justify-center">
          <Hexagon className="w-[80vw] h-[80vw] stroke-[0.5]" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white border border-slate-200 shadow-2xl p-12 md:p-24 flex flex-col items-center text-center">

        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 px-4 py-2 border border-blue-200 bg-blue-50 text-blue-600 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold mb-12"
        >
          <Lock size={14} />
          <span>Section Under Construction</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-orbitron text-5xl md:text-8xl text-slate-900 font-black tracking-tighter uppercase leading-[0.9] mb-8"
        >
          Coming<br />
          <span className="text-slate-300">Soon</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-serif text-lg md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-16"
        >
          We are currently preparing this module for deployment. Applications, telemetry, and updates will be available in a future transmission.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm font-bold tracking-[0.2em] text-slate-900 uppercase bg-transparent overflow-hidden border-2 border-slate-900 hover:text-white transition-colors duration-500"
          >
            {/* Hover Fill */}
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] -z-10" />
            <span className="flex items-center gap-3">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to Previous Sector
            </span>
          </button>
        </motion.div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-900 m-4" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-900 m-4" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-900 m-4" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-900 m-4" />
      </div>

    </div>
  );
};
