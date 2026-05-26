import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { MagneticButton } from '../ui/MagneticButton';

const TIERS = [
  {
    name: "SILVER",
    amount: "$500+",
    accent: "text-gray-500",
    accentBg: "bg-gray-100",
    perks: ["Logo on website", "Social media shoutout", "Quarterly newsletter"]
  },
  {
    name: "GOLD",
    amount: "$2,500+",
    accent: "text-[#F59E0B]",
    accentBg: "bg-[#FEF3C7]",
    featured: true,
    perks: ["Logo on flight hardware", "Logo on team apparel", "Invitations to launch events", "Dedicated tech talk session"]
  },
  {
    name: "PLATINUM",
    amount: "$5,000+",
    accent: "text-[#2563EB]",
    accentBg: "bg-[#EFF6FF]",
    perks: ["Title sponsor for specific mission", "Premium logo placement on everything", "Access to engineering data", "VIP Launch access", "Custom partnership initiatives"]
  }
];

export const SponsorUs: React.FC = () => {
  return (
    <SectionReveal id="sponsor" className="relative">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-8 bg-[#E11D48]" />
            <span className="text-[#E11D48] font-mono tracking-widest text-sm uppercase">Partnerships</span>
            <div className="h-[2px] w-8 bg-[#E11D48]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Support The Mission</h2>
        </div>
        
        <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-16">
          Building spacecraft requires capital, materials, and mentorship. By partnering with BRACU Diganta, 
          you invest in the next generation of engineers.
        </p>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier, idx) => (
            <GlassmorphismCard 
              key={idx} 
              className={`flex flex-col h-full ${tier.featured ? 'ring-2 ring-[#F59E0B]/40 shadow-lg' : ''}`}
            >
              {/* Tier header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-4 ${tier.accent} ${tier.accentBg}`}>
                  {tier.name}
                </div>
                <div className="text-4xl font-black text-gray-900">{tier.amount}</div>
              </div>
              
              {/* Perks */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <span className={`mr-3 mt-0.5 ${tier.accent}`}>✦</span>
                    {perk}
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <MagneticButton className={`w-full !rounded-xl py-3 text-sm font-semibold tracking-wide ${
                tier.featured 
                  ? 'bg-[#2563EB] text-white hover:bg-gray-900 shadow-md' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}>
                Become a Partner
              </MagneticButton>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
