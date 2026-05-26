import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';

const IMAGES = [
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2008&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop"
];

export const Media: React.FC = () => {
  return (
    <SectionReveal id="media" className="relative">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-gray-400" />
            <span className="text-gray-500 font-mono tracking-widest text-sm uppercase">Gallery</span>
            <div className="h-[2px] w-8 bg-gray-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Mission Logs</h2>
        </div>
        
        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMAGES.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                idx === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-video'
              }`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={img} 
                alt={`Mission Media ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
