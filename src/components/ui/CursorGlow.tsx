import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Initially hide until first move
    gsap.set(glow, { opacity: 0 });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to(glow, { opacity: 1, duration: 0.5 });
        isVisible = true;
      }
      
      // Center the 200px glow div on the cursor
      gsap.to(glow, {
        x: e.clientX - 100,
        y: e.clientY - 100,
        duration: 0.8,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div 
      ref={glowRef}
      className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none z-[9999]"
      style={{
        background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, rgba(0,229,255,0) 70%)',
        mixBlendMode: 'screen',
        willChange: 'transform'
      }}
    />
  );
};
