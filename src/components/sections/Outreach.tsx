import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

export const Outreach: React.FC = () => {
  return (
    <SectionReveal id="outreach" className="relative">
      <div className="relative z-10 w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-gray-400" />
            <span className="text-gray-500 font-mono tracking-widest text-sm uppercase">Community</span>
            <div className="h-[2px] w-8 bg-gray-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Inspiring The Next Generation</h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that the future of aerospace engineering in Bangladesh depends on accessible STEM education today.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Through our community outreach programs, we conduct workshops at local schools, host rocketry camps, and provide mentorship to high school students interested in space sciences.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <GlassmorphismCard className="!p-8 text-center">
              <div className="text-4xl font-black text-[#2563EB] mb-2">500+</div>
              <div className="text-sm text-gray-500 font-mono uppercase tracking-wider">Students Reached</div>
            </GlassmorphismCard>
            <GlassmorphismCard className="!p-8 text-center">
              <div className="text-4xl font-black text-[#2563EB] mb-2">12</div>
              <div className="text-sm text-gray-500 font-mono uppercase tracking-wider">Workshops Hosted</div>
            </GlassmorphismCard>
            <GlassmorphismCard className="!p-8 text-center">
              <div className="text-4xl font-black text-[#2563EB] mb-2">8</div>
              <div className="text-sm text-gray-500 font-mono uppercase tracking-wider">Schools Visited</div>
            </GlassmorphismCard>
            <GlassmorphismCard className="!p-8 text-center">
              <div className="text-4xl font-black text-[#2563EB] mb-2">3</div>
              <div className="text-sm text-gray-500 font-mono uppercase tracking-wider">Rocketry Camps</div>
            </GlassmorphismCard>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};
