import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';

const IMAGES = [
  "https://i.ibb.co.com/8DKLyHWS/Whats-App-Image-2026-06-17-at-01-47-35-1.jpg",
  "https://i.ibb.co.com/WvJvYjYj/Whats-App-Image-2026-06-17-at-01-47-35-2.jpg",
  "https://i.ibb.co.com/prbVZ8sb/Whats-App-Image-2026-06-17-at-01-47-35.jpg",
  "https://i.ibb.co.com/KxThc0hN/Whats-App-Image-2026-06-17-at-01-47-36-1.jpg"
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
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${idx === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-video'
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
