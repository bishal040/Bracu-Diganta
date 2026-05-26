import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({ 
  children, 
  className = '',
  hoverEffect = true 
}) => {
  return (
    <div className={`glass-card p-8 ${hoverEffect ? 'hover:-translate-y-2 transition-transform duration-500' : ''} ${className}`}>
      {children}
    </div>
  );
};
