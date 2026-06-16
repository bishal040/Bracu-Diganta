import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { TeamMember } from '../../data/team';

interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onClose }) => {
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (member) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [member]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-8">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-white overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm border border-slate-100"
            >
              <X size={20} />
            </button>

            {/* Left side: Large Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
              <img 
                src={member.image} 
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
              
              {/* Floating Badge over image */}
              <div className="absolute bottom-4 left-4 flex gap-2 items-center bg-white/20 border border-white/30 backdrop-blur-md px-3 py-1.5 rounded shadow-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] text-white tracking-widest uppercase font-bold">
                  {member.role || "CREW MEMBER"}
                </span>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col overflow-y-auto">
              <span className="inline-block font-mono text-xs text-blue-600 font-bold tracking-[0.2em] uppercase mb-2">
                {member.role}
              </span>
              
              <h2 className="font-orbitron font-black text-3xl md:text-5xl text-slate-900 uppercase leading-tight mb-8">
                {member.name}
              </h2>

              <div className="flex-1">
                {member.quote ? (
                  <div className="mb-8 relative">
                    <span className="absolute -top-6 -left-4 text-6xl text-blue-100 font-serif leading-none select-none">"</span>
                    <p className="relative z-10 text-slate-700 text-lg md:text-xl italic leading-relaxed font-medium">
                      {member.quote}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic mb-8">No specific transmission recorded for this crew member.</p>
                )}
              </div>

              {/* Social Connect */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                  Initialize Comm Link
                </h4>
                <div className="flex gap-4">
                  {member.linkedin ? (
                    <a href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 font-bold text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg> LinkedIn
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100 font-bold text-sm cursor-not-allowed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg> Offline
                    </div>
                  )}
                  {member.facebook ? (
                    <a href={member.facebook.startsWith('http') ? member.facebook : `https://${member.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors border border-blue-100 font-bold text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> Facebook
                    </a>
                  ) : null}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
