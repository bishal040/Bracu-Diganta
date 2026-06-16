import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, AlertTriangle, Wifi, X } from 'lucide-react';

interface MissionToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

// Tiny star particle component
const Particle: React.FC<{ delay: number; isSuccess: boolean }> = ({ delay, isSuccess }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      background: isSuccess
        ? `hsl(${210 + Math.random() * 30}, 100%, ${60 + Math.random() * 30}%)`
        : `hsl(${0 + Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [0, -(20 + Math.random() * 40)],
      x: [(Math.random() - 0.5) * 30],
    }}
    transition={{
      duration: 1.5 + Math.random(),
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
    }}
  />
);

export const MissionToast: React.FC<MissionToastProps> = ({
  show,
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(100);
  const [timestamp] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  });

  const stableOnClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        stableOnClose();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [show, duration, stableOnClose]);

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={
            isSuccess
              ? { opacity: 0, y: 80, x: '-50%', scale: 0.8, rotateX: 30 }
              : { opacity: 0, x: '-50%', y: 0, scale: 1.1, filter: 'blur(8px)' }
          }
          animate={
            isSuccess
              ? {
                  opacity: 1,
                  y: 0,
                  x: '-50%',
                  scale: 1,
                  rotateX: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    mass: 0.8,
                  },
                }
              : {
                  opacity: 1,
                  x: ['-50%', '-48%', '-52%', '-49%', '-51%', '-50%'],
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.5,
                    x: { duration: 0.4, times: [0, 0.15, 0.3, 0.5, 0.7, 1] },
                  },
                }
          }
          exit={
            isSuccess
              ? {
                  opacity: 0,
                  y: -30,
                  x: '-50%',
                  scale: 0.9,
                  filter: 'blur(6px)',
                  transition: { duration: 0.35, ease: 'easeIn' },
                }
              : {
                  opacity: 0,
                  x: '-50%',
                  scale: 0.95,
                  filter: 'brightness(2) blur(4px)',
                  transition: { duration: 0.25 },
                }
          }
          className="fixed bottom-8 left-1/2 z-[9999] w-[92vw] max-w-[520px]"
          style={{ perspective: '800px' }}
        >
          {/* Main toast container */}
          <div
            className={`relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-2xl ${
              isSuccess
                ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-blue-950/95 border-blue-500/40 shadow-blue-500/20'
                : 'bg-gradient-to-br from-slate-900/95 via-red-950/90 to-slate-900/95 border-rose-500/40 shadow-rose-500/20'
            }`}
          >
            {/* Animated glow border */}
            <motion.div
              className={`absolute inset-0 rounded-2xl pointer-events-none ${
                isSuccess
                  ? 'shadow-[inset_0_0_30px_rgba(59,130,246,0.15)]'
                  : 'shadow-[inset_0_0_30px_rgba(244,63,94,0.15)]'
              }`}
              animate={
                isSuccess
                  ? { boxShadow: ['inset 0 0 30px rgba(59,130,246,0.1)', 'inset 0 0 50px rgba(59,130,246,0.25)', 'inset 0 0 30px rgba(59,130,246,0.1)'] }
                  : { boxShadow: ['inset 0 0 30px rgba(244,63,94,0.1)', 'inset 0 0 50px rgba(244,63,94,0.3)', 'inset 0 0 30px rgba(244,63,94,0.1)'] }
              }
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Scanline sweep effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-[0.07]">
              <motion.div
                className={`w-full h-[2px] absolute ${isSuccess ? 'bg-blue-300' : 'bg-rose-300'}`}
                animate={{ top: ['-5%', '110%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Dot matrix background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-2xl"
              style={{
                backgroundImage: `radial-gradient(circle, ${isSuccess ? '#60a5fa' : '#f43f5e'} 0.5px, transparent 0.5px)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Particle effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(8)].map((_, i) => (
                <Particle key={i} delay={i * 0.3} isSuccess={isSuccess} />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4 p-5 pr-12">
              {/* Icon with animation */}
              <div className="shrink-0 mt-0.5">
                {isSuccess ? (
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Rocket exhaust glow */}
                    <motion.div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full blur-md"
                      style={{ background: 'linear-gradient(to bottom, rgba(251,191,36,0.6), rgba(234,88,12,0.3), transparent)' }}
                      animate={{ opacity: [0.4, 0.8, 0.4], scaleY: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Rocket size={22} className="text-white -rotate-45" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                      <AlertTriangle size={22} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Text content */}
              <div className="flex flex-col gap-1.5 min-w-0">
                {/* Status header */}
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
                    {isSuccess ? 'MISSION.CONTROL — LINK ESTABLISHED' : 'ALERT.SYSTEM — ANOMALY DETECTED'}
                  </span>
                </div>

                {/* Main message */}
                <motion.p
                  className={`font-orbitron text-sm font-bold tracking-wide ${
                    isSuccess ? 'text-blue-100' : 'text-rose-100'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {message}
                </motion.p>

                {/* Timestamp & signal indicator */}
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-mono text-[9px] text-slate-500">
                    T+{timestamp}
                  </span>
                  <div className="flex items-center gap-1">
                    <Wifi size={10} className={isSuccess ? 'text-emerald-500' : 'text-rose-500'} />
                    <span className={`font-mono text-[9px] font-bold ${isSuccess ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isSuccess ? 'SIGNAL OK' : 'SIGNAL LOST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
              >
                <X size={14} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Fuel gauge progress bar */}
            <div className="relative h-[3px] w-full bg-slate-800/60">
              <motion.div
                className={`h-full ${
                  isSuccess
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500'
                    : 'bg-gradient-to-r from-rose-600 via-orange-500 to-rose-500'
                }`}
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
              {/* Glow at the progress tip */}
              <motion.div
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm ${
                  isSuccess ? 'bg-cyan-400' : 'bg-rose-400'
                }`}
                style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>

            {/* HUD corner brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none">
              <div className={`absolute top-0 left-0 w-full h-[2px] ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
              <div className={`absolute top-0 left-0 w-[2px] h-full ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
            </div>
            <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none">
              <div className={`absolute top-0 right-0 w-full h-[2px] ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
              <div className={`absolute top-0 right-0 w-[2px] h-full ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
            </div>
            <div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none">
              <div className={`absolute bottom-0 left-0 w-full h-[2px] ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
              <div className={`absolute bottom-0 left-0 w-[2px] h-full ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none">
              <div className={`absolute bottom-0 right-0 w-full h-[2px] ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
              <div className={`absolute bottom-0 right-0 w-[2px] h-full ${isSuccess ? 'bg-blue-500/50' : 'bg-rose-500/50'}`} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
