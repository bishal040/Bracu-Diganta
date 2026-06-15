import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { missionsData } from '../../data/missions';
import { MagneticButton } from '../ui/MagneticButton';

export const MissionsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Header */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="text-blue-600" size={20} />
            <span className="text-xs font-mono tracking-[0.4em] text-blue-600 uppercase font-bold">
              Global Operations
            </span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
            Mission <br />
            <span className="text-slate-300">
              Archive
            </span>
          </h1>
        </div>
        
        <MagneticButton className="w-max inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer bg-slate-50 px-6 py-3 rounded-full border border-slate-200 shadow-sm">
          <div onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs tracking-widest uppercase font-semibold">Return to Base</span>
          </div>
        </MagneticButton>
      </div>

      {/* Main Editorial List */}
      <div className="pb-32">
        {missionsData.map((mission, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <section 
              key={mission.id} 
              onClick={() => mission.route && navigate(mission.route)}
              className={`py-24 md:py-40 px-6 md:px-12 border-b border-slate-100 group transition-colors duration-500 ${mission.route ? 'cursor-pointer hover:bg-slate-50' : ''}`}
            >
              <div className={`max-w-[1400px] mx-auto flex flex-col gap-16 lg:gap-32 ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                
                {/* Image Block */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5] w-full overflow-hidden bg-slate-100 relative">
                    <img 
                      src={mission.image} 
                      alt={mission.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                    
                    {/* Status Badge floating on image */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 flex items-center gap-2 shadow-sm border border-slate-200/50">
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${mission.statusColor}`} />
                      <span className={`text-[10px] font-mono tracking-widest uppercase font-bold ${mission.statusColor}`}>
                        {mission.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Subtle Mission ID Watermark behind image */}
                  <div className={`absolute -bottom-10 ${isReversed ? '-left-10' : '-right-10'} font-orbitron text-[8rem] md:text-[14rem] font-black text-slate-50 leading-none pointer-events-none select-none -z-10 tracking-tighter`}>
                    0{index + 1}
                  </div>
                </div>

                {/* Text Block */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="mb-8">
                    <span className="font-mono text-xs text-blue-600 tracking-[0.3em] font-bold uppercase border-b-2 border-blue-600 pb-2">
                      {mission.category}
                    </span>
                  </div>
                  
                  <h2 className="font-orbitron text-4xl md:text-6xl font-black text-slate-900 uppercase leading-[0.9] mb-8 tracking-tighter group-hover:text-blue-600 transition-colors duration-300">
                    {mission.title}
                  </h2>
                  
                  <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl leading-relaxed font-light">
                    {mission.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-16 pt-10 border-t border-slate-100 max-w-lg">
                    {mission.stats.map((stat, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-2">{stat.label}</span>
                        <span className="font-orbitron text-2xl text-slate-900 font-bold group-hover:text-blue-600 transition-colors duration-300">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {mission.route && (
                    <button 
                      className="w-max inline-flex items-center gap-4 bg-transparent text-slate-900 border-2 border-slate-900 px-8 py-4 font-mono text-xs tracking-widest uppercase font-bold group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300"
                    >
                      <span>Initiate Protocol</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
                
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
};

