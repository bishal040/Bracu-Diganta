import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { teamData, type TeamYearData, type TeamMember as TeamMemberType } from '../../data/team';
import { TeamMemberModal } from '../ui/TeamMemberModal';

// Highly Creative Editorial Crew Card
const PageCrewCard = ({ member, index, onClick }: { member: TeamMemberType, index: number, onClick: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="group cursor-pointer flex flex-col w-full"
    >
      <div className="relative w-full aspect-[4/5] mb-6">
        {/* Decorative Offset Block for Creative Depth */}
        <div className="absolute inset-0 bg-blue-50/80 transform translate-x-3 translate-y-3 rounded-2xl group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 ease-out" />
        
        {/* Main Image Container */}
        <div className="absolute inset-0 overflow-hidden bg-slate-200 rounded-2xl border-[4px] border-white shadow-sm z-10">
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover object-center grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out" 
          />
        </div>

        {/* Creative Floating Action Button */}
        <div className="absolute -bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30">
            <ArrowRight className="w-5 h-5 text-white -rotate-45" />
          </div>
        </div>
      </div>

      {/* Elegant Text Structure */}
      <div className="flex flex-col z-10 pl-1">
        <h3 className="font-orbitron font-bold text-2xl md:text-3xl text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors duration-300 mb-1 leading-none">
          {member.name}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">{member.role}</span>
          <div className="w-8 h-[2px] bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
        </div>
      </div>
    </motion.div>
  );
};

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
  
  const hierarchySections = [
    { title: 'Supervisors', data: activeData.supervisors },
    { title: 'Advisors', data: activeData.advisors },
    { title: 'Team Leads', data: activeData.teamLeads },
    { title: 'Sub-Team Leads', data: activeData.subTeamLeads },
    { title: 'Team Members', data: activeData.teamMembers }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-32 pb-24 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Giant vertical text watermark */}
        <div className="absolute top-[20%] right-[5%] origin-bottom-right -rotate-90 opacity-[0.02]">
          <span className="font-orbitron font-black text-[180px] leading-none text-slate-900">DIGANTA</span>
        </div>
        
        {/* Scattered abstract geometric lines */}
        <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#0f172a" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      <div className="relative max-w-[90rem] mx-auto px-6 md:px-12 z-10">
        
        {/* Bold Editorial Header */}
        <div className="mb-16 md:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-2 border-slate-900 pb-10 md:pb-12">
          <div className="max-w-4xl">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-mono text-[10px] tracking-[0.2em] uppercase mb-8 transition-colors group">
              <span className="w-6 h-[1px] bg-slate-400 group-hover:bg-blue-600 transition-colors" />
              Return to Base
            </Link>
            <h1 className="font-orbitron text-5xl md:text-[90px] text-slate-900 font-black tracking-tighter uppercase leading-[0.85] mb-6 relative">
              <span className="relative z-10">Mission</span><br/>
              <span className="text-slate-300 relative z-10 ml-0 md:ml-16">Roster</span>
              {/* Creative floating accent shape */}
              <div className="absolute -z-10 top-1/2 left-16 w-24 h-24 bg-blue-100 rounded-full mix-blend-multiply blur-xl animate-pulse" />
            </h1>
            <p className="font-serif text-lg md:text-xl text-slate-600 leading-relaxed font-light ml-0 md:ml-16 max-w-xl">
              An architectural view of the minds engineering the future of space exploration.
            </p>
          </div>

          {/* Bold Dropdown */}
          <div className="relative z-50 shrink-0 w-full lg:w-[300px]" ref={dropdownRef}>
            <p className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-2">Select Deployment Year</p>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full px-0 py-3 border-b-[2px] border-slate-900 hover:border-blue-600 transition-colors group"
            >
              <span className="font-orbitron text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{selectedYear}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                <ChevronDown className={`text-slate-900 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full right-0 w-full bg-white border border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] mt-4 z-50 flex flex-col"
                >
                  {teamData.map((data) => (
                    <button
                      key={data.year}
                      onClick={() => {
                        setSelectedYear(data.year);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-6 py-4 font-orbitron text-xl font-bold transition-all border-b border-slate-100 last:border-0 ${selectedYear === data.year ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-8'}`}
                    >
                      {data.year}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Sections Based on Hierarchy */}
        <div key={selectedYear}>
          {hierarchySections.some(section => section.data.length > 0) ? (
            hierarchySections.map((section, sectionIdx) => (
              section.data.length > 0 && (
                <div key={section.title} className="relative mb-20 md:mb-24 group/section">
                  
                  {/* Creative Massive Watermark Text Behind Section */}
                  <div className="absolute top-[-30px] left-[-10px] md:top-[-60px] md:left-[-20px] z-0 overflow-hidden pointer-events-none select-none opacity-[0.03]">
                    <h2 className="font-orbitron text-[80px] md:text-[150px] font-black tracking-tighter leading-none whitespace-nowrap text-slate-900">
                      0{sectionIdx + 1}
                    </h2>
                  </div>

                  {/* Section Heading */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-4 mb-10 md:mb-14">
                    <h2 className="font-orbitron text-3xl md:text-5xl text-slate-900 font-bold uppercase tracking-tighter">
                      {section.title}
                    </h2>
                    <div className="hidden md:block flex-1 h-[2px] bg-slate-900 mb-2 ml-4 opacity-10"></div>
                    <span className="font-mono text-xs text-blue-600 font-bold uppercase tracking-[0.2em] md:mb-2">
                      // TIER 0{sectionIdx + 1}
                    </span>
                  </div>

                  {/* Creative Grid Layering */}
                  <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
                    {section.data.map((member, i) => (
                      <PageCrewCard key={i} member={member} index={i} onClick={() => setSelectedMember(member)} />
                    ))}
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-sm text-slate-400 uppercase tracking-widest px-8 py-4 border-2 border-dashed border-slate-200">
                Data Classified or Unavailable
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
