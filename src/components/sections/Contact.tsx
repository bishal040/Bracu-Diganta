import React from 'react';
import { SectionReveal } from '../ui/SectionReveal';
import { MagneticButton } from '../ui/MagneticButton';
import { Mail, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <SectionReveal id="contact" className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Establish Link</h2>
          <p className="text-lg text-gray-500 mt-4 max-w-lg">
            Whether you're interested in joining the team, sponsoring a mission, or collaborating on research.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                <Mail className="text-[#2563EB]" size={20} />
              </div>
              <div>
                <h4 className="font-mono text-xs tracking-widest uppercase text-gray-400 mb-1">Transmission</h4>
                <a href="mailto:hello@bracudiganta.com" className="text-lg font-bold text-gray-900 hover:text-[#2563EB] transition-colors">hello@bracudiganta.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                <MapPin className="text-[#2563EB]" size={20} />
              </div>
              <div>
                <h4 className="font-mono text-xs tracking-widest uppercase text-gray-400 mb-1">Coordinates</h4>
                <p className="text-lg font-medium text-gray-900">
                  BRAC University, Mohakhali Campus<br/>
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-400 pl-4">Identification</label>
                <input 
                  type="text" 
                  placeholder="Name or Organization" 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all text-sm"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-400 pl-4">Return Channel</label>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all text-sm"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-400 pl-4">Payload</label>
                <textarea 
                  placeholder="Message details..." 
                  rows={4}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all resize-none text-sm"
                />
              </div>
              
              <div className="mt-2">
                <MagneticButton className="w-full bg-[#2563EB] text-white hover:bg-gray-900 !rounded-xl py-3.5 shadow-md hover:shadow-lg text-sm font-semibold">
                  Transmit Message
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};
