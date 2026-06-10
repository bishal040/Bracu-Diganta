import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SequenceSection } from '../SequenceSection';

export const CansatPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to top when this page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#fafbfc] overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Absolute floating controls bar */}
      <div className="fixed top-24 left-6 md:left-12 z-50 flex items-center justify-between w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] pointer-events-none">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200 rounded-full text-slate-700 hover:text-slate-900 transition-all shadow-sm group pointer-events-auto"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Back to Archive</span>
        </button>

        {/* Version Dropdown */}
        <div className="relative pointer-events-auto" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 px-5 py-2.5 backdrop-blur-md border rounded-full transition-all shadow-sm group ${isDropdownOpen ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700 hover:text-slate-900'}`}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">CANSAT v2.4</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-3 right-0 w-48 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl flex flex-col"
              >
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Select Iteration</span>
                </div>
                
                <button 
                  onClick={() => setIsDropdownOpen(false)}
                  className="px-4 py-3.5 text-left flex items-center justify-between group bg-white"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-900 font-bold group-hover:text-blue-600 transition-colors">v2.4 (Current)</span>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                </button>

                <button 
                  onClick={() => navigate('/coming-soon')}
                  className="px-4 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors border-t border-slate-100 font-bold"
                >
                  v1.0 (Legacy)
                </button>
                
                <button 
                  onClick={() => navigate('/coming-soon')}
                  className="px-4 py-3.5 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors border-t border-slate-100 font-bold"
                >
                  Prototype Build
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* The original Sequence Section handles its own pinning and scrolling */}
      <SequenceSection />
      
      {/* Additional Project Details could go here if needed */}
      <div className="relative z-20 bg-white border-t border-slate-200 py-32 px-6 md:px-12 flex flex-col items-center text-center">
        <h2 className="font-orbitron text-4xl md:text-6xl text-slate-900 font-bold uppercase mb-6">Mission Complete</h2>
        <p className="text-slate-500 max-w-2xl text-sm md:text-base leading-relaxed">
          The CANSAT 2024 mission successfully demonstrated our custom telemetry architecture and descent prediction algorithms, paving the way for future high-altitude endeavors.
        </p>
      </div>
      
    </div>
  );
};
