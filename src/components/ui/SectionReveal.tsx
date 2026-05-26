import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({ children, id, className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    gsap.fromTo(contentRef.current,
      { 
        y: 60, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section id={id} ref={sectionRef} className={`w-full min-h-screen py-24 px-6 md:px-12 lg:px-24 flex flex-col justify-center ${className}`}>
      <div ref={contentRef} className="w-full max-w-7xl mx-auto will-change-transform will-change-opacity">
        {children}
      </div>
    </section>
  );
};
