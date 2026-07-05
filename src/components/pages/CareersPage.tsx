import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Check, ChevronDown, UploadCloud, FileCheck } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

const TECH_SUBSYSTEMS = [
  'Embedded Systems Subsystem',
  'Communications & Data Subsystem',
  'Mechanical Subsystem',
  'Computational Intelligence Subsystem'
];

const NON_TECH_DIVISIONS = [
  'Outreach Division',
  'Public Relations Division (Branding)'
];

const SOFTWARE_TOOLS = [
  'Canva',
  'Adobe Photoshop/Illustrator',
  'CapCut/Premiere Pro',
  'Other'
];

const TASKS = [
  'Writing content',
  'Graphic design',
  'Social media management',
  'Photography/Videography',
  'Sponsorship & outreach',
  'Research',
  'Documentation',
  'Other'
];

const SUBSECTIONS: Record<string, string[]> = {
  'Embedded Systems Subsystem': ['Hardware Design', 'Firmware Development'],
  'Mechanical Subsystem': ['Physics & Analysis', 'CAD & Manufacturing'],
  'Computational Intelligence Subsystem': ['Artificial Intelligence & Machine Learning', 'Ground Station Software', 'Web & Application Development'],
  'Outreach Division': ['Outreach', 'Partnerships', 'Collaborations', 'Sponsorships'],
  'Public Relations Division (Branding)': ['Public Relations', 'Media', 'Marketing']
};

const InputField = ({ label, name, value, onChange, type = 'text', required = true, placeholder = '' }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder={placeholder} />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, required = true, placeholder = '', rows = 4, hint = '' }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 flex items-center justify-between">
      <span>{label} {required && <span className="text-blue-500">*</span>}</span>
      {hint && <span className="text-slate-400 text-[9px] normal-case tracking-normal font-medium">{hint}</span>}
    </label>
    <textarea name={name} value={value} onChange={onChange} required={required} rows={rows} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all" placeholder={placeholder} />
  </div>
);

const LOCAL_STORAGE_KEY = 'diganta_recruitment_form_draft';

const defaultFormData = {
  universityEmail: '',
  fullName: '',
  studentId: '',
  personalEmail: '',
  department: '',
  currentSemester: '',
  teamType: '', // Technical | Non-Technical
  firstPreference: '',
  firstPreferenceSubsection: '',
  secondPreference: '',
  secondPreferenceSubsection: '',
  whyDiganta: '',
  aspectsOfInterest: '',
  clubInvolvement: '',
  softwareTools: [] as string[],
  softwareToolsOther: '',
  comfortableTasks: [] as string[],
  comfortableTasksOther: '',
  portfolioLinks: '',
  skillsOrStrengths: '',
  relevantExperiences: '',
  hopeToLearn: '',
  cvFile: null as File | null
};

export const CareersPage: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...defaultFormData, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse form draft from localStorage', e);
    }
    return defaultFormData;
  });

  useEffect(() => {
    const { cvFile, ...rest } = formData;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rest));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'firstPreference') newData.firstPreferenceSubsection = '';
      if (name === 'secondPreference') newData.secondPreferenceSubsection = '';
      return newData;
    });
  };

  const handleCheckboxChange = (field: 'softwareTools' | 'comfortableTasks', value: string) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(value)) {
        return { ...prev, [field]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...list, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      showToast('Please fill out all required fields correctly.', 'error');
      const firstInvalid = e.currentTarget.querySelector(':invalid') as HTMLElement;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setFormStatus('sending');
    
    try {
      const submitData = { ...formData };
      
      // Merge 'Other' fields
      if (submitData.softwareTools.includes('Other') && submitData.softwareToolsOther) {
        submitData.softwareTools = submitData.softwareTools.map(t => t === 'Other' ? `Other: ${submitData.softwareToolsOther}` : t);
      }
      if (submitData.comfortableTasks.includes('Other') && submitData.comfortableTasksOther) {
        submitData.comfortableTasks = submitData.comfortableTasks.map(t => t === 'Other' ? `Other: ${submitData.comfortableTasksOther}` : t);
      }

      const formPayload = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (key === 'cvFile' && value instanceof File) {
          formPayload.append('cvFile', value);
        } else if (key === 'softwareTools' || key === 'comfortableTasks') {
          formPayload.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined && key !== 'cvFile') {
          formPayload.append(key, (value as string).toString());
        }
      });

      const apiUrl = import.meta.env.VITE_CAREERS_API_URL;
      
      if (apiUrl) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formPayload
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
      
      setTimeout(() => {
        setFormStatus('idle');
        setFormData(defaultFormData);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 4000);

    } catch (error) {
      setFormStatus('error');
      showToast('Critical Error: Transmission Failed!', 'error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };



  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24 relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply" />
      </div>

      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] sm:text-sm tracking-[0.3em] text-blue-600 uppercase font-bold">Recruitment 2026</span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </div>
          <h1 className="font-orbitron font-black text-4xl sm:text-5xl md:text-7xl text-slate-900 uppercase tracking-tighter mb-4 md:mb-6">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Diganta</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-600 font-medium leading-relaxed px-4">
            We are looking for passionate engineers, developers, and visionaries to help us push the boundaries of collegiate aerospace.
          </p>
        </div>

        {/* Application Form */}
        <div className="w-full bg-white border border-slate-200 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 lg:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.05)] mb-24">
          
          <form className="flex flex-col gap-10" onSubmit={handleSubmit} noValidate>
            
            {/* Section A */}
            <div className="space-y-6">
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">A</span> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Jane Doe" />
                <InputField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. 21101001" />
                <InputField label="University Email" name="universityEmail" value={formData.universityEmail} onChange={handleChange} type="email" placeholder="jane.doe@g.bracu.ac.bd" />
                <InputField label="Personal Email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} type="email" placeholder="jane@example.com" />
                <InputField label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. CSE, EEE, MCE" />
                <InputField label="Current Semester" name="currentSemester" value={formData.currentSemester} onChange={handleChange} placeholder="e.g. 5th" />
              </div>
            </div>

            {/* Section B */}
            <div className="space-y-6">
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">B</span> Application Preference
              </h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Which team are you applying for? <span className="text-blue-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Technical', 'Non-Technical'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, teamType: type, firstPreference: '', secondPreference: '' }));
                      }}
                      className={`py-4 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-300 border-2 ${formData.teamType === type ? 'bg-blue-600 border-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] scale-[1.02]' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-slate-100 hover:text-blue-500'}`}
                    >
                      {type} Team
                    </button>
                  ))}
                </div>
              </div>

              {formData.teamType && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Preferred {formData.teamType === 'Technical' ? 'Subsystem' : 'Division'} <span className="text-blue-500">*</span></label>
                      <div className="relative">
                        <select name="firstPreference" value={formData.firstPreference} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
                          <option value="" disabled>Select primary choice...</option>
                          {(formData.teamType === 'Technical' ? TECH_SUBSYSTEMS : NON_TECH_DIVISIONS).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>
                    {formData.firstPreference && SUBSECTIONS[formData.firstPreference] && (
                      <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
                        <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Specific Field <span className="text-blue-500">*</span></label>
                        <div className="relative">
                          <select name="firstPreferenceSubsection" value={formData.firstPreferenceSubsection} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
                            <option value="" disabled>Select specific field...</option>
                            {SUBSECTIONS[formData.firstPreference].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={20} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Second Preference <span className="text-blue-500">*</span></label>
                      <div className="relative">
                        <select name="secondPreference" value={formData.secondPreference} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
                          <option value="" disabled>Select secondary choice...</option>
                          {(formData.teamType === 'Technical' ? TECH_SUBSYSTEMS : NON_TECH_DIVISIONS).map(opt => (
                            <option key={opt} value={opt} disabled={opt === formData.firstPreference}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>
                    {formData.secondPreference && SUBSECTIONS[formData.secondPreference] && (
                      <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
                        <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Specific Field <span className="text-blue-500">*</span></label>
                        <div className="relative">
                          <select name="secondPreferenceSubsection" value={formData.secondPreferenceSubsection} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
                            <option value="" disabled>Select specific field...</option>
                            {SUBSECTIONS[formData.secondPreference].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown size={20} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section C */}
            <div className="space-y-6">
              <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">C</span> General Questions
              </h2>
              <TextAreaField label="Why do you want to join Diganta?" name="whyDiganta" value={formData.whyDiganta} onChange={handleChange} hint="80-120 words" />
              <TextAreaField label="What aspects of the division you selected interest you the most and why?" name="aspectsOfInterest" value={formData.aspectsOfInterest} onChange={handleChange} hint="80-120 words" />
              <TextAreaField label="Are you currently involved in any club, lab or organization? If yes, please mention the organization and your role." name="clubInvolvement" value={formData.clubInvolvement} onChange={handleChange} required={false} rows={2} />
            </div>

            {/* Section D (Non-Technical) */}
            {formData.teamType === 'Non-Technical' && (
              <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300">
                <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">D</span> Non-Technical Details
                </h2>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">What software or tools are you comfortable using?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                    {SOFTWARE_TOOLS.map(tool => (
                      <label key={tool} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.softwareTools.includes(tool) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                          {formData.softwareTools.includes(tool) && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{tool}</span>
                        <input type="checkbox" className="hidden" checked={formData.softwareTools.includes(tool)} onChange={() => handleCheckboxChange('softwareTools', tool)} />
                      </label>
                    ))}
                  </div>
                  {formData.softwareTools.includes('Other') && (
                    <input type="text" name="softwareToolsOther" value={formData.softwareToolsOther} onChange={handleChange} placeholder="Please specify..." className="mt-2 w-full max-w-sm bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none" />
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">Which tasks would you be most comfortable taking responsibility for? (Select all that apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                    {TASKS.map(task => (
                      <label key={task} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.comfortableTasks.includes(task) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                          {formData.comfortableTasks.includes(task) && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{task}</span>
                        <input type="checkbox" className="hidden" checked={formData.comfortableTasks.includes(task)} onChange={() => handleCheckboxChange('comfortableTasks', task)} />
                      </label>
                    ))}
                  </div>
                  {formData.comfortableTasks.includes('Other') && (
                    <input type="text" name="comfortableTasksOther" value={formData.comfortableTasksOther} onChange={handleChange} placeholder="Please specify..." className="mt-2 w-full max-w-sm bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none" />
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <TextAreaField label="Please share links to any relevant work (writing samples, designs, social media pages, event photos, certificates, etc.)." name="portfolioLinks" value={formData.portfolioLinks} onChange={handleChange} required={false} hint="Optional" rows={3} />
                </div>
              </div>
            )}

            {/* Section E / Shared */}
            {formData.teamType && (
              <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300">
                <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm">{formData.teamType === 'Technical' ? 'D' : 'E'}</span> Qualifications
                </h2>
                
                <TextAreaField label="What skills or strengths do you currently have that would help you contribute to the division you selected?" name="skillsOrStrengths" value={formData.skillsOrStrengths} onChange={handleChange} hint="80-120 words" />
                <TextAreaField label="Briefly describe up to three experiences, projects or achievements that are most relevant to the division you selected." name="relevantExperiences" value={formData.relevantExperiences} onChange={handleChange} hint="150-200 words total" />
                <TextAreaField label="What do you hope to learn or gain from your experience at Diganta?" name="hopeToLearn" value={formData.hopeToLearn} onChange={handleChange} hint="80-120 words" rows={3} />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">
                    CV / Resume <span className="text-blue-500">*</span>
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        setFormData(prev => ({ ...prev, cvFile: e.dataTransfer.files[0] }));
                      }
                    }}
                    className={`relative w-full border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all duration-300 ${
                      isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setFormData(prev => ({ ...prev, cvFile: file }));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!formData.cvFile}
                    />
                    {formData.cvFile ? (
                      <div className="flex flex-col items-center gap-3 text-blue-600 pointer-events-none animate-in zoom-in-95 fade-in duration-300 w-full max-w-sm mx-auto">
                        <div className="relative flex items-center justify-center mb-1">
                          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s' }} />
                          <div className="relative w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <Check size={28} className="animate-in zoom-in duration-300 delay-150" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-blue-100 shadow-sm mt-2">
                          <span className="font-bold text-sm text-center text-slate-800 line-clamp-1">{formData.cvFile.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {((formData.cvFile.size || 0) / 1024 / 1024).toFixed(2)} MB • Ready
                          </span>
                        </div>
                        <span 
                          className="text-[10px] font-bold text-rose-500 bg-rose-50 px-4 py-2 rounded-full uppercase tracking-widest mt-1 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm" 
                          onClick={() => setFormData(prev => ({ ...prev, cvFile: null }))}
                        >
                          Remove File
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 gap-2 pointer-events-none">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isDragging ? 'bg-blue-600 text-white shadow-lg' : 'bg-white shadow-sm text-blue-500'}`}>
                          <UploadCloud size={28} />
                        </div>
                        <span className="font-bold text-sm md:text-base text-slate-700">Click or drag and drop to upload</span>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-400">PDF, DOC, DOCX, JPG, PNG (Max 5MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={formStatus !== 'idle' || !formData.teamType} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-orbitron font-bold text-lg uppercase tracking-widest py-4 sm:py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none">
              {formStatus === 'idle' && <>Submit Application <ChevronRight size={24} /></>}
              {formStatus === 'sending' && <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Transmitting...</>}
              {formStatus === 'sent' && '✓ Application Secured'}
              {formStatus === 'error' && '✕ Transmission Failed'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
