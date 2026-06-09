import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { teamData, getFlattenedCrewData, type TeamYearData, type TeamMember as TeamMemberType } from '../../data/team';
import { TeamMemberModal } from '../ui/TeamMemberModal';

const sciFiClip = 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)';

// Reusable CrewCard tailored for the Page
const PageCrewCard = ({ member, index, onClick }: { member: ReturnType<typeof getFlattenedCrewData>[0], index: number, onClick: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    onClick={onClick}
    className={`crew-card ${member.col} ${member.height} relative group cursor-pointer`}
  >
    <div className="absolute inset-0 bg-blue-200 group-hover:bg-blue-400 transition-colors duration-500 z-0" style={{ clipPath: sciFiClip }} />
    <div className="absolute inset-[1px] bg-white z-10 overflow-hidden" style={{ clipPath: sciFiClip }}>
      <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none transition-all duration-500 group-hover:from-black/70 group-hover:via-black/30" />
      <div className="absolute top-4 left-4 flex gap-2 items-center z-20 bg-white/10 border border-white/20 backdrop-blur-md px-2 py-1 rounded shadow-sm">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
        <span className="font-mono text-[9px] md:text-[10px] text-white tracking-widest uppercase font-bold">{member.tier}</span>
      </div>
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <ArrowUpRight className="w-5 h-5 text-white drop-shadow-sm" />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end transition-all duration-300 transform group-hover:-translate-y-2">
        <span className="block font-mono text-[10px] md:text-xs text-blue-300 font-bold tracking-[0.2em] uppercase mb-1">{member.role}</span>
        <h3 className="font-orbitron font-black text-2xl md:text-3xl text-white uppercase tracking-wider mb-2">{member.name}</h3>
      </div>
    </div>
  </motion.div>
);

export const TeamPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>(teamData[0].year);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeData: TeamYearData = teamData.find(d => d.year === selectedYear) || teamData[0];
  const activeCrewList = getFlattenedCrewData(activeData);

  return (
    <div className="min-h-screen bg-[#eef2f5] pt-32 pb-24 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply" />
      </div>

      <div className="relative max-w-[90rem] mx-auto px-6 md:px-8 z-10">
        
        {/* Navigation & Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-mono text-xs tracking-widest uppercase mb-8 transition-colors">
              <ArrowLeft size={16} /> Return to Base
            </Link>
            <div className="flex gap-1 mb-4">
              <div className="w-2 h-2 bg-blue-600" />
              <div className="w-2 h-2 bg-blue-400" />
              <div className="w-2 h-2 bg-blue-200" />
            </div>
            <h1 className="font-orbitron text-5xl md:text-7xl text-slate-900 font-black tracking-widest uppercase drop-shadow-sm mb-2">
              Mission Roster
            </h1>
            <p className="font-mono text-sm md:text-base text-slate-500 uppercase tracking-widest max-w-xl">
              // Historical database of personnel deployed on Diganta Aerospace missions. Select a year to query the archive.
            </p>
          </div>

          {/* Custom Dropdown Selector */}
          <div className="relative z-50 shrink-0" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-4 w-[240px] px-6 py-4 bg-white border border-blue-200 shadow-sm rounded-xl hover:border-blue-400 transition-colors"
            >
              <div className="flex flex-col items-start">
                <span className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-widest">Active Database</span>
                <span className="font-orbitron text-xl font-bold text-slate-900">{selectedYear} Crew</span>
              </div>
              <ChevronDown className={`text-blue-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-[240px] bg-white border border-blue-100 rounded-xl shadow-xl overflow-hidden py-2"
                >
                  {teamData.map((data) => (
                    <button
                      key={data.year}
                      onClick={() => {
                        setSelectedYear(data.year);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 font-orbitron font-bold transition-colors ${selectedYear === data.year ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      {data.year} Crew
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* The Bento Grid Container */}
        {/* We use key={selectedYear} to force React to completely unmount and remount the grid when the year changes, instantly re-triggering the entry animations! */}
        <div key={selectedYear} className="grid grid-cols-12 gap-4 md:gap-6 pb-24">
          {activeCrewList.length > 0 ? (
            activeCrewList.map((member, i) => (
              <PageCrewCard key={`${selectedYear}-${i}`} member={member} index={i} onClick={() => setSelectedMember(member)} />
            ))
          ) : (
            <div className="col-span-12 py-32 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-sm text-slate-400 uppercase tracking-widest border border-slate-200 px-6 py-3 rounded-full bg-white/50">
                // Database Entry Missing or Classified
              </span>
            </div>
          )}
        </div>

      </div>
      
      {/* Central Modal Dialog */}
      <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
};
