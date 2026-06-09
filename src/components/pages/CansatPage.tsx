import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SequenceSection } from '../SequenceSection';

export const CansatPage: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when this page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#eef2f5] overflow-x-hidden">
      
      {/* Absolute floating back button */}
      <div className="fixed top-24 left-6 md:left-12 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-lg group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest font-semibold">Back to Mission Archive</span>
        </button>
      </div>

      {/* The original Sequence Section handles its own pinning and scrolling */}
      <SequenceSection />
      
      {/* Additional Project Details could go here if needed */}
      <div className="relative z-20 bg-gray-900 py-24 px-6 md:px-12 flex flex-col items-center text-center">
        <h2 className="font-orbitron text-4xl md:text-6xl text-white font-bold uppercase mb-6">Mission Complete</h2>
        <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
          The CANSAT 2024 mission successfully demonstrated our custom telemetry architecture and descent prediction algorithms, paving the way for future high-altitude endeavors.
        </p>
      </div>
      
    </div>
  );
};
