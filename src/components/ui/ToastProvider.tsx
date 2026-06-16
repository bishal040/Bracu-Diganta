import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-4 pointer-events-none items-center">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ y: -150, opacity: 0, scale: 0.5, rotateX: 90 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                rotateX: 0,
                filter: [
                  'hue-rotate(0deg) blur(0px)', 
                  'hue-rotate(90deg) blur(5px)', 
                  'hue-rotate(-90deg) blur(2px)', 
                  'hue-rotate(0deg) blur(0px)'
                ]
              }}
              exit={{ y: -150, opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
                mass: 1.2,
              }}
              className="pointer-events-auto flex items-center justify-center"
            >
              {/* Sci-Fi Wrapper */}
              <div
                className={`relative flex items-center gap-6 px-8 py-5 min-w-[450px] backdrop-blur-3xl border-y-2 border-x-[8px] 
                ${toast.type === 'success' ? 'bg-cyan-950/90 border-cyan-400 text-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.6)]' : ''}
                ${toast.type === 'error' ? 'bg-red-950/80 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
                ${toast.type === 'info' ? 'bg-slate-900/80 border-slate-400 text-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.3)]' : ''}
                `}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}
              >
                {/* Subtle animated scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-full w-full opacity-50 pointer-events-none animate-pulse" />

                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 animate-ping opacity-50 bg-current rounded-full" />
                  {toast.type === 'success' && <CheckCircle className="w-8 h-8 relative z-10" />}
                  {toast.type === 'error' && <AlertTriangle className="w-8 h-8 relative z-10" />}
                  {toast.type === 'info' && <div className="w-6 h-6 rounded-full border-2 border-current animate-spin" />}
                </div>

                <div className="flex-1 font-orbitron text-base tracking-widest uppercase font-bold drop-shadow-[0_0_8px_currentColor]">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                  >
                    {toast.message.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Decorative corner brackets */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
