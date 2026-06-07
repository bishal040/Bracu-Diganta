import React from 'react';
import { Activity, Radio, Cpu, Award } from 'lucide-react';

const NEWS_UPDATES = [
  { 
    id: 1, 
    day: '24',
    month: 'OCT',
    year: '2024',
    category: 'COMPETITION', 
    title: 'National CanSat Champions', 
    desc: 'Bracu-Diganta secures 1st place overall, demonstrating unprecedented telemetry accuracy and perfect payload recovery.',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1600&auto=format&fit=crop',
  },
  { 
    id: 2, 
    day: '12',
    month: 'SEP',
    year: '2024',
    category: 'ENGINEERING', 
    title: 'Next-Gen Avionics Tested', 
    desc: 'Successfully integrated our proprietary flight computer featuring dual-redundant sensors and a long-range LoRa module.',
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
  },
  { 
    id: 3, 
    day: '05',
    month: 'AUG',
    year: '2024',
    category: 'LAUNCH LOG', 
    title: 'Sub-Orbital Flight Alpha', 
    desc: 'Atmospheric deployment executed perfectly at 10,000 ft. Parachutes deployed nominally with 100% data retention.',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
  },
  { 
    id: 4, 
    day: '18',
    month: 'JUN',
    year: '2024',
    category: 'COMMUNITY', 
    title: 'Global Aerospace Summit', 
    desc: 'Our leads presented Diganta’s modular rocket architecture to international researchers, earning the prestigious Innovation Award.',
    icon: Radio,
    image: 'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=1600&auto=format&fit=crop',
  }
];

export const Achievements: React.FC = () => {
  return (
    <section 
      id="achievements" 
      className="py-24 md:py-32 bg-white dark:bg-black border-t border-black/10 dark:border-white/20 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-20 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase font-bold">
                Mission Log
              </span>
            </div>
            <h2 className="font-sans text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase">
              Flight History
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-md text-xs font-mono leading-relaxed uppercase tracking-widest border-l border-black/20 dark:border-white/20 pl-4">
            Chronological record of operations, technical milestones, and competition performance metrics.
          </p>
        </div>

        {/* Vertical Timeline List */}
        <div className="flex flex-col gap-16 md:gap-24 relative">
          {/* Vertical tracking line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 hidden md:block" />

          {NEWS_UPDATES.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16 relative z-10`}
            >
              
              {/* Timeline dot */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-black border border-black dark:border-white items-center justify-center z-20">
                <div className="w-1 h-1 bg-black dark:bg-white" />
              </div>

              {/* Image Column */}
              <div className={`w-full md:w-1/2 relative bg-white dark:bg-black border border-black/10 dark:border-white/10 overflow-hidden aspect-video group ${index % 2 !== 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay z-10" />
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale opacity-80 dark:opacity-60 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" 
                />
                <div className="absolute top-4 left-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/20 dark:border-white/20 px-3 py-1 flex items-center gap-2 z-20">
                   <item.icon size={12} className="text-black dark:text-white" />
                   <span className="text-black dark:text-white font-mono text-[10px] tracking-[0.2em] uppercase font-bold">{item.category}</span>
                </div>
              </div>

              {/* Content Column */}
              <div className={`w-full md:w-1/2 flex flex-col justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm p-8 border border-black/10 dark:border-white/10 ${index % 2 !== 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                
                {/* Date */}
                <div className="flex items-end gap-4 mb-8 pb-4 border-b border-black/10 dark:border-white/10">
                   <span className="font-mono text-5xl md:text-6xl font-light text-black dark:text-white leading-none tracking-tighter">
                     {item.day}
                   </span>
                   <div className="flex flex-col pb-1">
                     <span className="font-mono text-xl md:text-2xl text-black dark:text-white tracking-widest uppercase font-bold leading-none">{item.month}</span>
                     <span className="font-mono text-[10px] text-slate-500 tracking-[0.3em] mt-2">{item.year}</span>
                   </div>
                </div>

                <h3 className="font-black text-2xl text-black dark:text-white uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-xs font-mono leading-relaxed mb-8">
                  {item.desc}
                </p>

                {/* Tech Specs */}
                <div className="grid grid-cols-2 gap-6 bg-black/5 dark:bg-white/5 p-4 border border-black/10 dark:border-white/10">
                   <div>
                     <span className="block font-mono text-[10px] text-slate-500 tracking-widest mb-1 uppercase">System Status</span>
                     <span className="font-mono font-bold text-xs text-black dark:text-white flex items-center gap-2 uppercase tracking-widest">
                       <span className="w-1.5 h-1.5 bg-black dark:bg-white animate-pulse" />
                       NOMINAL
                     </span>
                   </div>
                   <div>
                     <span className="block font-mono text-[10px] text-slate-500 tracking-widest mb-1 uppercase">Record ID</span>
                     <span className="font-mono font-bold text-xs text-black dark:text-white uppercase tracking-widest">SYS-{item.id}X9</span>
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
