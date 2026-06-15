import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { ArrowRight } from 'lucide-react';

const NEWS_ITEMS = [
  {
    date: "OCTOBER 15, 2024",
    title: "Diganta Mark IV Successfully Passes Pre-Flight Integration Tests",
    excerpt: "The latest iteration of our CanSat architecture has cleared all environmental vacuum and thermal testing at the national facility."
  },
  {
    date: "SEPTEMBER 02, 2024",
    title: "BRACU Diganta Recruits 15 New Members for Fall Intake",
    excerpt: "Following a rigorous selection process, we welcome the next generation of engineers to our aerodynamics, software, and structures divisions."
  },
  {
    date: "JULY 28, 2024",
    title: "Research Paper Accepted at International Aerospace Conference",
    excerpt: "Our ground station team's paper on 'Low-Cost High-Altitude Telemetry Recovery' will be presented in Geneva this winter."
  }
];

export const News: React.FC = () => {
  return (
    <SectionReveal id="news" className="relative">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-telemetry-cyan" />
            <span className="text-telemetry-cyan font-mono tracking-widest text-sm uppercase">Updates</span>
            <div className="h-[2px] w-8 bg-telemetry-cyan" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight text-center">Latest News</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ITEMS.map((item, idx) => (
            <GlassmorphismCard key={idx} className="group flex flex-col justify-between cursor-pointer p-6">
              <div>
                <span className="text-telemetry-cyan font-mono text-xs tracking-wider mb-2 block">{item.date}</span>
                <h3 className="text-lg font-bold mb-3 leading-snug group-hover:text-telemetry-cyan transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.excerpt}</p>
              </div>

              <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-900 transition-colors uppercase text-xs tracking-widest font-bold">
                Read Article
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hover top border gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-telemetry-cyan to-mission-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
