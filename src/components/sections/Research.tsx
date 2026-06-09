import React from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Cpu, Printer, Radio, Wifi, Database, Activity } from 'lucide-react';

const PremiumCard = ({ children, className = '', glowColor = "rgba(255, 255, 255, 0.8)" }: { children: React.ReactNode, className?: string, glowColor?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`relative flex flex-col group overflow-hidden rounded-[2rem] bg-white/70 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md ${className}`}
    >
      {/* Background radial spotlight that follows the mouse */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${smoothX}px ${smoothY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />
      {/* A sharp glowing border that follows the mouse */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${smoothX}px ${smoothY}px,
              rgba(37,99,235,0.1),
              transparent 40%
            )
          `,
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`,
          maskImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' rx='32' ry='32' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Inner subtle noise texture for realism */}
      <div className="absolute inset-0 opacity-[0.015] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      <div className="relative z-10 h-full p-8 md:p-10 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

export const Research: React.FC = () => {
  return (
    <section id="research" className="relative py-32 bg-[#eef2f5] overflow-hidden text-slate-900">
      
      {/* Center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-blue-600" />
            <span className="text-blue-600 font-mono tracking-widest text-sm uppercase font-bold">Focus Areas</span>
            <div className="h-[2px] w-8 bg-blue-600" />
          </div>
          <h2 className="text-5xl md:text-6xl font-orbitron font-black text-slate-900 uppercase tracking-tighter leading-[1.1] mb-6">
            Engineering The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Next Frontier</span>
          </h2>
          <p className="max-w-2xl text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
            We operate at the bleeding edge of aerospace engineering, developing proprietary systems designed to survive the most hostile environments.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Feature 1: Large Top Left */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8"
          >
            <PremiumCard className="h-full min-h-[400px]">
              <div className="flex justify-between items-start mb-auto">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Cpu size={36} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">Sys.01</span>
              </div>
              <div className="mt-12">
                <h3 className="font-orbitron text-3xl font-bold text-slate-900 mb-4">Flight Computers</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                  Custom-fabricated PCB architecture utilizing dual-core STM32 processors. Engineered for extreme fault tolerance and nanosecond-precision sensor polling during high-G launch phases.
                </p>
              </div>
            </PremiumCard>
          </motion.div>

          {/* Feature 2: Tall Top Right */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4"
          >
            <PremiumCard className="h-full min-h-[400px]">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 w-fit mb-8">
                <Printer size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-orbitron text-2xl font-bold text-slate-900 mb-4 mt-auto">Additive<br/>Manufacturing</h3>
              <p className="text-slate-600 leading-relaxed">
                Developing screwless, high-impact chassis structures using Carbon Fiber PETG. Our topologies are algorithmically optimized to withstand extreme atmospheric sheer.
              </p>
            </PremiumCard>
          </motion.div>

          {/* Feature 3: Bottom Left */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-5"
          >
            <PremiumCard className="h-full min-h-[350px]">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 w-fit mb-8">
                <Radio size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-orbitron text-2xl font-bold text-slate-900 mb-4 mt-auto">Telemetry & RF</h3>
              <p className="text-slate-600 leading-relaxed">
                Proprietary long-range LoRaWAN communication protocols ensuring continuous, uncorrupted real-time data streaming back to our ground systems.
              </p>
            </PremiumCard>
          </motion.div>

          {/* Feature 4: Bottom Right (Wide) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-7"
          >
            <PremiumCard className="h-full min-h-[350px]">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 flex flex-col">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 w-fit mb-8">
                    <Wifi size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-orbitron text-2xl font-bold text-slate-900 mb-4 mt-auto">Ground Station UI</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Next-generation mission control interfaces. Visualizing complex telemetry arrays—including real-time GPS coordinates, barometric pressure, and 3D orientation.
                  </p>
                </div>
                
                {/* Minimalist Dashboard Decoration */}
                <div className="hidden lg:flex w-48 shrink-0 flex-col gap-3 justify-end">
                  <div className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center px-4 shadow-inner">
                    <Activity className="text-emerald-500 animate-pulse mr-3" size={16} />
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  <div className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center px-4 shadow-inner">
                    <Database className="text-blue-500 mr-3" size={16} />
                    <div className="font-mono text-xs text-slate-500">TX/RX: STABLE</div>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
