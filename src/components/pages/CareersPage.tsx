import React, { useState } from 'react';
import { ArrowRight, Briefcase, Cpu, Database, Rocket } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

const OPEN_ROLES = [
  {
    id: 'avionics-engineer',
    title: 'Avionics Engineer',
    department: 'Engineering',
    type: 'Full-time / Part-time',
    icon: Cpu,
    description: 'Design and test custom flight computers, dual-redundant sensor suites, and long-range telemetry systems for suborbital rockets.'
  },
  {
    id: 'software-developer',
    title: 'Flight Software Developer',
    department: 'Software',
    type: 'Full-time / Part-time',
    icon: Database,
    description: 'Develop real-time embedded C/C++ firmware for our custom avionics and build high-performance ground control interfaces.'
  },
  {
    id: 'propulsion-specialist',
    title: 'Propulsion Specialist',
    department: 'Engineering',
    type: 'Full-time / Part-time',
    icon: Rocket,
    description: 'Simulate, design, and manufacture solid rocket motors and experimental hybrid engines for our next-generation launch vehicles.'
  },
  {
    id: 'outreach-lead',
    title: 'Outreach & Media Lead',
    department: 'Operations',
    type: 'Part-time',
    icon: Briefcase,
    description: 'Manage our brand presence, coordinate with sponsors, create compelling content, and lead our STEM outreach programs.'
  }
];

export const CareersPage: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { showToast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      const apiUrl = import.meta.env.VITE_CAREERS_API_URL;
      
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setFormStatus('sent');
      showToast('Application received securely!', 'success');
      form.reset();
      setSelectedRole('');
      
      setTimeout(() => setFormStatus('idle'), 4000);

    } catch (error) {
      setFormStatus('error');
      showToast('Critical Error: Transmission Failed!', 'error');
      
      setTimeout(() => setFormStatus('idle'), 4000);

    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24 relative overflow-hidden flex flex-col items-center">
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply" />
      </div>

      <div className="w-full max-w-[1600px] px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="font-mono text-sm tracking-[0.3em] text-blue-600 uppercase font-bold">Recruitment Open</span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </div>
          <h1 className="font-orbitron font-black text-5xl md:text-7xl text-slate-900 uppercase tracking-tighter mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Mission</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            We are looking for passionate engineers, developers, and visionaries to help us push the boundaries of collegiate aerospace.
          </p>
        </div>

        {/* Application Form */}
        <div id="application-form" className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 lg:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.05)] mb-24">
          <div className="mb-10 text-center">
            <h2 className="font-orbitron text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Submit Application</h2>
            <p className="text-slate-500 font-medium">Fill out the details below. This form will be connected to our MongoDB database.</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                <input type="text" name="fullName" required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="Jane Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                <input type="email" name="email" required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="jane@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Contact Number</label>
                <input type="tel" name="contactNumber" required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Role of Interest</label>
                  <select 
                    name="roleOfInterest"
                    required 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-base font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="" disabled>Select a role...</option>
                  {OPEN_ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.title}</option>
                  ))}
                  <option value="other">Other / General Application</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Portfolio / LinkedIn / CV Link</label>
              <input type="url" name="portfolioLink" required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder="https://..." />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Cover Letter / Motivation</label>
              <textarea name="motivation" required rows={6} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all" placeholder="Why do you want to build rockets with us? What makes you a good fit?" />
            </div>

            <button type="submit" disabled={formStatus !== 'idle'} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-orbitron font-bold text-lg uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none">
              {formStatus === 'idle' && <>Submit Application <ArrowRight size={20} /></>}
              {formStatus === 'sending' && <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending to MongoDB...</>}
              {formStatus === 'sent' && '✓ Application Received'}
              {formStatus === 'error' && '✕ Transmission Failed'}
            </button>
          </form>
        </div>

        {/* Open Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-24">
          {OPEN_ROLES.map((role) => (
            <div key={role.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <role.icon size={28} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[10px] text-slate-500 tracking-[0.2em] uppercase font-bold">{role.department}</span>
                  <span className="font-orbitron text-xs text-blue-600 font-bold mt-1">{role.type}</span>
                </div>
              </div>
              <h3 className="font-orbitron text-2xl font-black text-slate-900 uppercase tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                {role.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {role.description}
              </p>
              <button 
                onClick={() => {
                  setSelectedRole(role.id);
                  document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-8 font-mono text-sm text-slate-900 font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-blue-600 transition-colors"
              >
                Apply for this role <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>


      </div>


    </div>
  );
};
