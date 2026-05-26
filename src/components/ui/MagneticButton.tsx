import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  strength = 0.2, 
  className = '', 
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      x: position.x,
      y: position.y,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, [position]);

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center px-8 py-3 rounded-full overflow-hidden transition-colors duration-300 ${className}`}
      {...props}
    >
      <span className="relative z-10 font-aeonik font-medium tracking-wide text-sm uppercase">
        {children}
      </span>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
