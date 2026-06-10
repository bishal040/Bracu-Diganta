import React, { useEffect, useState, RefObject } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Props {
  parentRef: RefObject<HTMLElement>;
}

export const MouseCrosshair: React.FC<Props> = ({ parentRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Create motion values for the mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply a very slight spring physics for a smooth, high-tech feel
  const smoothX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const smoothY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      // Calculate position strictly relative to the container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseX.set(x);
      mouseY.set(y);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    parent.addEventListener('mousemove', handleMouseMove as EventListener);
    parent.addEventListener('mouseleave', handleMouseLeave);
    parent.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove as EventListener);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      parent.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, parentRef]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-[50] overflow-hidden hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Vertical Line */}
      <motion.div 
        className="absolute top-0 bottom-0 w-[1px] bg-blue-500/20"
        style={{ left: smoothX }}
      />
      
      {/* Horizontal Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-blue-500/20"
        style={{ top: smoothY }}
      />

      {/* The glowing intersection square */}
      <motion.div 
        className="absolute w-4 h-4 border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.4)] backdrop-blur-sm"
        style={{ 
          left: smoothX, 
          top: smoothY,
          x: "-50%",
          y: "-50%",
          backgroundColor: "rgba(37, 99, 235, 0.05)"
        }}
      >
        {/* Tiny center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-blue-500 rounded-full" />
      </motion.div>
    </motion.div>
  );
};
