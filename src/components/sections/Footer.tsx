import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-12 px-6 md:px-12 lg:px-24 border-t border-gray-200/50 bg-white relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-telemetry-cyan rounded-full"></span>
          <span className="font-aeonik font-bold text-lg tracking-tight">BRACU Diganta</span>
        </div>
        
        <div className="text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} BRACU Diganta. Reaching for the stars.
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="text-gray-500 hover:text-telemetry-cyan transition-colors text-sm uppercase tracking-widest font-mono">Facebook</a>
          <a href="#" className="text-gray-500 hover:text-telemetry-cyan transition-colors text-sm uppercase tracking-widest font-mono">LinkedIn</a>
          <a href="#" className="text-gray-500 hover:text-telemetry-cyan transition-colors text-sm uppercase tracking-widest font-mono">Instagram</a>
        </div>

      </div>
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gray-100 backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-telemetry-cyan hover:text-white hover:border-transparent transition-colors z-40 group"
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
};
