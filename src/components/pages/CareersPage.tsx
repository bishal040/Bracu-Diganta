import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Check, ChevronDown, UploadCloud, Clock, Rocket, Users, Cpu, Trophy, BookOpen, AlertCircle, X, FileText } from 'lucide-react';
import { useToast } from '../ui/ToastProvider';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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

const TECHNICAL_SKILLS_CATEGORIES = [
  {
    title: '1. Embedded Systems',
    subsystem: 'Embedded Systems Subsystem',
    skills: [
      'C/C++, Python (firmware)',
      'Arduino IDE, PlatformIO, STM32CubeIDE (firmware)',
      'KiCad/EasyEDA/Altium Designer (PCB Design)',
      'Proteus (circuit simulation)'
    ]
  },
  {
    title: '2. Mechanical Systems',
    subsystem: 'Mechanical Subsystem',
    skills: [
      'SolidWorks/Fusion 360',
      'ANSYS Mechanical',
      'ANSYS Fluent (CFD)'
    ]
  },
  {
    title: '3. Communication & Data Handling',
    subsystem: 'Communications & Data Subsystem',
    skills: [
      'LoRa, XBee, ESP-NOW',
      'CST Studio/HFSS (Antenna Design)',
      'MATLAB'
    ]
  },
  {
    title: '4. Software',
    subsystem: 'Computational Intelligence Subsystem',
    skills: [
      'Python, C++, JavaScript',
      'Git & GitHub',
      'MATLAB (Software)',
      'OpenCV (Basic)',
      'Linux (Basic)'
    ]
  }
];

const SUBSECTIONS: Record<string, string[]> = {
  'Embedded Systems Subsystem': ['Hardware Design', 'Firmware Development'],
  'Mechanical Subsystem': ['Physics & Analysis', 'CAD & Manufacturing'],
  'Computational Intelligence Subsystem': ['Artificial Intelligence & Machine Learning', 'Ground Station Software', 'Web & Application Development'],
  'Outreach Division': ['Outreach', 'Partnerships', 'Collaborations', 'Sponsorships'],
  'Public Relations Division (Branding)': ['Public Relations', 'Media', 'Marketing']
};

const DEPARTMENTS = [
  'CSE', 'EEE', 'ECE', 'BBA', 'Other'
];

const SEMESTERS = [
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'
];

// Recruitment deadline — change this date to control the countdown
const RECRUITMENT_DEADLINE = new Date('2026-08-15T23:59:59+06:00');

const WHY_JOIN_BENEFITS = [
  {
    icon: Rocket,
    title: 'Real Missions',
    description: 'Work on actual aerospace projects — from CanSats to rocketry — competing at international events.',
    accent: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  {
    icon: Users,
    title: 'Elite Community',
    description: 'Collaborate with 50+ passionate engineers, designers, and strategists across multiple disciplines.',
    accent: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200'
  },
  {
    icon: Cpu,
    title: 'Hands-On Learning',
    description: 'Gain practical skills in embedded systems, AI/ML, CAD design, and cutting-edge space tech.',
    accent: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200'
  },
  {
    icon: Trophy,
    title: 'Compete Globally',
    description: 'Represent BRACU at international competitions like TEKNOFEST, European CanSat, and more.',
    accent: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200'
  },
  {
    icon: BookOpen,
    title: 'Research & Publish',
    description: 'Contribute to aerospace research papers and build an impressive academic portfolio.',
    accent: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
];

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', required = true, placeholder = '' }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={`field-${name}`} className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <input id={`field-${name}`} type={type} name={name} value={value} onChange={onChange} required={required} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none transition-all" placeholder={placeholder} />
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, required = true, placeholder = 'Select...' }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={`field-${name}`} className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <div className="relative">
      <select id={`field-${name}`} name={name} value={value} onChange={onChange} required={required} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none appearance-none cursor-pointer transition-all">
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={20} />
      </div>
    </div>
  </div>
);

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  hint?: string;
  minWords?: number;
  maxWords?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, value, onChange, required = true, placeholder = '', rows = 4, hint = '', minWords, maxWords }) => {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const showCounter = minWords !== undefined || maxWords !== undefined;

  let counterColor = 'text-slate-400';
  let counterBg = 'bg-slate-100';
  if (showCounter) {
    if (maxWords && wordCount > maxWords) {
      counterColor = 'text-rose-600';
      counterBg = 'bg-rose-50';
    } else if (minWords && wordCount < minWords) {
      counterColor = 'text-amber-600';
      counterBg = 'bg-amber-50';
    } else if (minWords && maxWords && wordCount >= minWords && wordCount <= maxWords) {
      counterColor = 'text-emerald-600';
      counterBg = 'bg-emerald-50';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`field-${name}`} className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2 flex items-center justify-between">
        <span>{label} {required && <span className="text-blue-500">*</span>}</span>
        {hint && <span className="text-slate-400 text-[9px] normal-case tracking-normal font-medium">{hint}</span>}
      </label>
      <textarea id={`field-${name}`} name={name} value={value} onChange={onChange} required={required} rows={rows} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4 text-sm lg:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white outline-none resize-none transition-all" placeholder={placeholder} />
      {showCounter && (
        <div className={`flex items-center gap-1.5 ml-2 transition-all duration-300`}>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${counterBg} ${counterColor} transition-all duration-300`}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          {minWords && maxWords && (
            <span className="text-[9px] text-slate-400 font-medium">
              ({minWords}–{maxWords} recommended)
            </span>
          )}
          {maxWords && wordCount > maxWords && (
            <span className="text-[9px] text-rose-500 font-semibold flex items-center gap-1">
              <AlertCircle size={10} /> Over limit
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ── Countdown Timer Hook ──
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = targetDate.getTime() - Date.now();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, timeLeft]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: timeLeft <= 0 };
};

// ── Countdown Banner Component ──
const CountdownBanner: React.FC = () => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(RECRUITMENT_DEADLINE);

  if (isExpired) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-12 md:mb-16">
        <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 md:p-14 border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Orbital ring decorations */}
          <div className="absolute -top-20 -right-20 w-64 h-64 border border-slate-200/60 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 border border-blue-100 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-slate-100 rounded-full pointer-events-none opacity-40" />

          <div className="relative z-10 text-center">
            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.4em] text-slate-400 uppercase font-bold">
                Mission Status: Standby
              </span>
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
            </div>

            {/* Icon */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-200 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-slate-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Clock size={28} className="text-slate-400" />
                </div>
              </div>
            </div>

            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-3">
              Recruitment <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500">Closed</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-lg mx-auto mb-8">
              The application window for Recruitment 2026 has ended. Thank you for your interest in BRACU Diganta — stay connected for the next recruitment cycle!
            </p>

            {/* Terminal-style status */}
            <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 mb-8">
              <div className="font-mono text-[10px] sm:text-xs text-slate-400 text-left">
                <span className="text-blue-600">{'>'}</span> RECRUITMENT_STATUS: <span className="text-slate-600 font-semibold">CLOSED</span><br />
                <span className="text-blue-600">{'>'}</span> NEXT_CYCLE: <span className="text-slate-600 font-semibold">TBD</span><br />
                <span className="text-blue-600">{'>'}</span> AWAITING_NEW_MISSION...
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://www.facebook.com/bracu.diganta" target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-orbitron font-bold text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5">
                Follow Us on Facebook
              </a>
              <a href="/#/" className="px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-orbitron font-bold text-sm uppercase tracking-widest rounded-xl transition-all duration-300 border border-slate-200">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeBlocks = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Min' },
    { value: seconds, label: 'Sec' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 md:mb-16">
      <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-10 border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Orbital ring decorations */}
        <div className="absolute -top-24 -right-24 w-72 h-72 border border-blue-100 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 border border-slate-100 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-dashed border-blue-50 rounded-full pointer-events-none animate-[spin_60s_linear_infinite]" />

        {/* Subtle blue glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-cyan-500/5 rounded-full blur-[60px]" />

        <div className="relative z-10">
          {/* Status bar */}
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] text-blue-600 uppercase font-bold">
              Applications Closing In
            </span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </div>

          {/* Countdown blocks */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
            {timeBlocks.map((block, idx) => (
              <React.Fragment key={block.label}>
                <div className="flex flex-col items-center">
                  <div className="relative bg-slate-50 border-2 border-slate-200 rounded-2xl sm:rounded-[1.25rem] w-16 h-16 sm:w-20 sm:h-20 md:w-[5.5rem] md:h-[5.5rem] flex items-center justify-center shadow-sm group hover:border-blue-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all duration-300">
                    <span className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tabular-nums group-hover:text-blue-600 transition-colors duration-300">
                      {String(block.value).padStart(2, '0')}
                    </span>
                    {/* Top reflection */}
                    <div className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase mt-2 font-bold">{block.label}</span>
                </div>
                {idx < timeBlocks.length - 1 && (
                  <div className="flex flex-col gap-1.5 mb-5 sm:mb-6">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Deadline line */}
          <div className="flex items-center justify-center gap-3 mt-5 sm:mt-6">
            <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-slate-200" />
            <p className="text-xs sm:text-sm md:text-base font-mono text-slate-400 tracking-wider">
              DEADLINE: {RECRUITMENT_DEADLINE.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()} • {RECRUITMENT_DEADLINE.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Why Join Us Section ──
const WhyJoinSection: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full mb-16 md:mb-20">
      <div className="text-center mb-8 md:mb-12 relative">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <span className="w-8 h-px bg-blue-600/30" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.4em] text-blue-600 uppercase font-bold">
            Why Diganta?
          </span>
          <span className="w-8 h-px bg-blue-600/30" />
        </div>
        <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">
          More Than a Club
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Join a team where ambition meets execution. Experience hands-on engineering and represent BRACU on the global stage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {/* First row: 3 cards on lg, 2+1 on sm */}
        {WHY_JOIN_BENEFITS.map((benefit, idx) => {
          const Icon = benefit.icon;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={benefit.title}
              className={`group relative bg-white rounded-2xl sm:rounded-[2rem] border-2 transition-all duration-500 p-8 sm:p-10 cursor-default overflow-hidden ${isHovered
                ? 'border-blue-300 shadow-[0_20px_50px_rgba(37,99,235,0.12)] -translate-y-1'
                : 'border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-blue-200'
                } ${idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Subtle background tech pattern on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500`} style={{
                backgroundImage: 'radial-gradient(circle, rgba(37,99,235,1) 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-[1.25rem] ${benefit.bg} border ${benefit.border} flex items-center justify-center mb-6 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]`}>
                  <Icon size={28} className={benefit.accent} strokeWidth={2.5} />
                </div>
                <h3 className="font-orbitron text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {benefit.description}
                </p>
              </div>

              {/* Corner accent line */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className={`absolute top-0 right-0 w-8 h-8 ${benefit.bg} border-b ${benefit.border} border-l rounded-bl-[1.25rem] -translate-y-full translate-x-full group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 delay-100`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LOCAL_STORAGE_KEY = 'diganta_recruitment_form_draft';

const defaultFormData = {
  universityEmail: '',
  fullName: '',
  studentId: '',
  personalEmail: '',
  department: '',
  departmentOther: '',
  currentSemester: '',
  completedCredits: '',
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
  technicalSkills: [] as string[],
  technicalSkillsOtherMap: {} as Record<string, string>,
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
  const localStorageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isExpired: isRecruitmentClosed } = useCountdown(RECRUITMENT_DEADLINE);

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

  // Debounced localStorage save (300ms)
  useEffect(() => {
    if (localStorageTimerRef.current) {
      clearTimeout(localStorageTimerRef.current);
    }
    localStorageTimerRef.current = setTimeout(() => {
      const { cvFile, ...rest } = formData;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rest));
    }, 300);
    return () => {
      if (localStorageTimerRef.current) {
        clearTimeout(localStorageTimerRef.current);
      }
    };
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof defaultFormData) => {
      const newData = { ...prev, [name]: value };
      if (name === 'firstPreference') newData.firstPreferenceSubsection = '';
      if (name === 'secondPreference') newData.secondPreferenceSubsection = '';
      return newData;
    });
  };

  const handleCheckboxChange = (field: 'softwareTools' | 'comfortableTasks' | 'technicalSkills', value: string) => {
    setFormData((prev: typeof defaultFormData) => {
      const list = prev[field];
      if (list.includes(value)) {
        return { ...prev, [field]: list.filter((item: string) => item !== value) };
      } else {
        return { ...prev, [field]: [...list, value] };
      }
    });
  };

  const handleTechnicalOtherChange = (category: string, value: string) => {
    setFormData((prev: typeof defaultFormData) => ({
      ...prev,
      technicalSkillsOtherMap: {
        ...prev.technicalSkillsOtherMap,
        [category]: value
      }
    }));
  };

  const validateFile = useCallback((file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      showToast(`Invalid file type: ${ext}. Accepted: PDF, DOC, DOCX, JPG, PNG.`, 'error');
      return false;
    }

    if (file.type && !allowedTypes.includes(file.type)) {
      showToast(`Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG.`, 'error');
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      showToast(`File too large (${sizeMB} MB). Maximum allowed: ${MAX_FILE_SIZE_MB} MB.`, 'error');
      return false;
    }

    return true;
  }, [showToast]);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && !validateFile(file)) {
      return;
    }
    setFormData((prev: typeof defaultFormData) => ({ ...prev, cvFile: file }));
  }, [validateFile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      showToast('Please fill out all required fields correctly.', 'error');
      const firstInvalid = e.currentTarget.querySelector(':invalid') as HTMLElement;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Additional CV validation before submit
    if (formData.cvFile && !validateFile(formData.cvFile)) {
      return;
    }

    setFormStatus('sending');

    try {
      const submitData = { ...formData };

      // Merge 'Other' fields
      if (submitData.department === 'Other' && submitData.departmentOther) {
        submitData.department = `Other: ${submitData.departmentOther}`;
      }
      if (submitData.softwareTools.includes('Other') && submitData.softwareToolsOther) {
        submitData.softwareTools = submitData.softwareTools.map((t: string) => t === 'Other' ? `Other: ${submitData.softwareToolsOther}` : t);
      }
      if (submitData.comfortableTasks.includes('Other') && submitData.comfortableTasksOther) {
        submitData.comfortableTasks = submitData.comfortableTasks.map((t: string) => t === 'Other' ? `Other: ${submitData.comfortableTasksOther}` : t);
      }
      submitData.technicalSkills = submitData.technicalSkills.map((t: string) => {
        if (t.startsWith('Other (') && submitData.technicalSkillsOtherMap[t]) {
          return `${t}: ${submitData.technicalSkillsOtherMap[t]}`;
        }
        return t;
      });

      const formPayload = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (key === 'cvFile' && value instanceof File) {
          formPayload.append('cvFile', value);
        } else if (key === 'softwareTools' || key === 'comfortableTasks' || key === 'technicalSkills') {
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
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.2) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="font-mono text-sm sm:text-base md:text-lg tracking-[0.3em] text-blue-600 uppercase font-bold">Recruitment 2026</span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </div>
          <h1 className="font-orbitron font-black text-4xl sm:text-5xl md:text-7xl text-slate-900 uppercase tracking-tighter mb-4 md:mb-6">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Diganta</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-600 font-medium leading-relaxed px-4">
            We are looking for passionate engineers, developers, and visionaries to help us push the boundaries of collegiate aerospace.
          </p>
        </div>

        {/* Countdown Banner */}
        <CountdownBanner />

        {isRecruitmentClosed ? (
          /* Closed state is fully handled by CountdownBanner above */
          null
        ) : (
          <>
            {/* Application Form */}
            <div className="w-full mb-24 max-w-5xl mx-auto">

              <form className="flex flex-col gap-6 sm:gap-8" onSubmit={handleSubmit} noValidate>

                {/* Section A */}
                <div className="space-y-6 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                    <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">A</span> Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Jane Doe" />
                    <InputField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. 21101001" />
                    <InputField label="University Email" name="universityEmail" value={formData.universityEmail} onChange={handleChange} type="email" placeholder="jane.doe@g.bracu.ac.bd" />
                    <InputField label="Personal Email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} type="email" placeholder="jane@example.com" />
                    <SelectField label="Department" name="department" value={formData.department} onChange={handleChange} options={DEPARTMENTS} placeholder="Select your department..." />
                    {formData.department === 'Other' && (
                      <InputField label="Specify Department" name="departmentOther" value={formData.departmentOther} onChange={handleChange} placeholder="Please specify your department..." />
                    )}
                    <SelectField label="Current Semester" name="currentSemester" value={formData.currentSemester} onChange={handleChange} options={SEMESTERS} placeholder="Select your semester..." />
                    <InputField label="Completed Credit" name="completedCredits" value={formData.completedCredits} onChange={handleChange} type="number" placeholder="e.g. 45" />
                  </div>
                </div>

                {/* Section B */}
                <div className="space-y-6 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                    <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">B</span> Application Preference
                  </h2>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">Which team are you applying for? <span className="text-blue-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Technical', 'Non-Technical'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFormData((prev: typeof defaultFormData) => ({ ...prev, teamType: type, firstPreference: '', secondPreference: '', firstPreferenceSubsection: '', secondPreferenceSubsection: '' }));
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
                          <label htmlFor="field-firstPreference" className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">Preferred {formData.teamType === 'Technical' ? 'Subsystem' : 'Division'} <span className="text-blue-500">*</span></label>
                          <div className="relative">
                            <select id="field-firstPreference" name="firstPreference" value={formData.firstPreference} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
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
                            <label htmlFor="field-firstPreferenceSubsection" className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">Specific Field <span className="text-blue-500">*</span></label>
                            <div className="relative">
                              <select id="field-firstPreferenceSubsection" name="firstPreferenceSubsection" value={formData.firstPreferenceSubsection} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
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
                          <label htmlFor="field-secondPreference" className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">Second Preference <span className="text-blue-500">*</span></label>
                          <div className="relative">
                            <select id="field-secondPreference" name="secondPreference" value={formData.secondPreference} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
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
                            <label htmlFor="field-secondPreferenceSubsection" className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">Specific Field <span className="text-blue-500">*</span></label>
                            <div className="relative">
                              <select id="field-secondPreferenceSubsection" name="secondPreferenceSubsection" value={formData.secondPreferenceSubsection} onChange={handleChange} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3 text-sm lg:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none appearance-none cursor-pointer">
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
                <div className="space-y-6 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                    <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">C</span> General Questions
                  </h2>
                  <TextAreaField label="Why do you want to join Diganta?" name="whyDiganta" value={formData.whyDiganta} onChange={handleChange} hint="80-120 words" minWords={80} maxWords={120} />
                  <TextAreaField label="What aspects of the division you selected interest you the most and why?" name="aspectsOfInterest" value={formData.aspectsOfInterest} onChange={handleChange} hint="80-120 words" minWords={80} maxWords={120} />
                  <TextAreaField label="Are you currently involved in any club, lab or organization? If yes, please mention the organization and your role." name="clubInvolvement" value={formData.clubInvolvement} onChange={handleChange} required={false} rows={2} />
                </div>

                {/* Section D (Technical) */}
                {formData.teamType === 'Technical' && (
                  <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">D</span> Technical Details
                    </h2>

                    <div className="flex flex-col gap-3">
                      <label className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">What technical skills or tools are you comfortable using? (Select all that apply)</label>

                      <div className="flex flex-col gap-6 mt-2">
                        {TECHNICAL_SKILLS_CATEGORIES.filter(c =>
                          c.subsystem === formData.firstPreference ||
                          c.subsystem === formData.secondPreference
                        ).map(category => (
                          <div key={category.title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                            <h3 className="font-orbitron text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide mb-3">{category.title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {category.skills.map(skill => (
                                <label key={skill} className="flex items-start gap-3 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.technicalSkills.includes(skill) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                                    {formData.technicalSkills.includes(skill) && <Check size={14} className="text-white" />}
                                  </div>
                                  <span className="text-sm sm:text-base font-semibold text-slate-700 leading-tight pt-[2px]">{skill}</span>
                                  <input type="checkbox" className="sr-only" checked={formData.technicalSkills.includes(skill)} onChange={() => handleCheckboxChange('technicalSkills', skill)} />
                                </label>
                              ))}

                              <label key="Other" className="flex items-start gap-3 cursor-pointer group mt-2 col-span-1 sm:col-span-2">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${formData.technicalSkills.includes('Other (' + category.title + ')') ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                                  {formData.technicalSkills.includes('Other (' + category.title + ')') && <Check size={14} className="text-white" />}
                                </div>
                                <span className="text-sm sm:text-base font-semibold text-slate-700 leading-tight pt-[2px]">Other (Please specify)</span>
                                <input type="checkbox" className="sr-only" checked={formData.technicalSkills.includes('Other (' + category.title + ')')} onChange={() => handleCheckboxChange('technicalSkills', 'Other (' + category.title + ')')} />
                              </label>
                              {formData.technicalSkills.includes('Other (' + category.title + ')') && (
                                <div className="col-span-1 sm:col-span-2 mb-1">
                                  <input type="text" value={formData.technicalSkillsOtherMap['Other (' + category.title + ')'] || ''} onChange={(e) => handleTechnicalOtherChange('Other (' + category.title + ')', e.target.value)} placeholder="Please specify..." className="mt-1 w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-sm sm:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Section D (Non-Technical) */}
                {formData.teamType === 'Non-Technical' && (
                  <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">D</span> Non-Technical Details
                    </h2>

                    <div className="flex flex-col gap-3">
                      <label className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">What software or tools are you comfortable using?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                        {SOFTWARE_TOOLS.map(tool => (
                          <label key={tool} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.softwareTools.includes(tool) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                              {formData.softwareTools.includes(tool) && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-slate-700">{tool}</span>
                            <input type="checkbox" className="sr-only" checked={formData.softwareTools.includes(tool)} onChange={() => handleCheckboxChange('softwareTools', tool)} />
                          </label>
                        ))}
                      </div>
                      {formData.softwareTools.includes('Other') && (
                        <input type="text" name="softwareToolsOther" value={formData.softwareToolsOther} onChange={handleChange} placeholder="Please specify..." className="mt-2 w-full max-w-sm bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm sm:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none" />
                      )}
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <label className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">Which tasks would you be most comfortable taking responsibility for? (Select all that apply)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                        {TASKS.map(task => (
                          <label key={task} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${formData.comfortableTasks.includes(task) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                              {formData.comfortableTasks.includes(task) && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-slate-700">{task}</span>
                            <input type="checkbox" className="sr-only" checked={formData.comfortableTasks.includes(task)} onChange={() => handleCheckboxChange('comfortableTasks', task)} />
                          </label>
                        ))}
                      </div>
                      {formData.comfortableTasks.includes('Other') && (
                        <input type="text" name="comfortableTasksOther" value={formData.comfortableTasksOther} onChange={handleChange} placeholder="Please specify..." className="mt-2 w-full max-w-sm bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm sm:text-base font-semibold text-slate-900 focus:border-blue-500 outline-none" />
                      )}
                    </div>

                  </div>
                )}

                {/* Section E / Shared */}
                {formData.teamType && (
                  <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-300 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                      <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm shadow-sm">E</span> Qualifications
                    </h2>

                    <TextAreaField label="What skills or strengths do you currently have that would help you contribute to the division you selected?" name="skillsOrStrengths" value={formData.skillsOrStrengths} onChange={handleChange} hint="80-120 words" minWords={80} maxWords={120} />
                    <TextAreaField label="Briefly describe up to three experiences, projects or achievements that are most relevant to the division you selected." name="relevantExperiences" value={formData.relevantExperiences} onChange={handleChange} hint="150-200 words total" minWords={150} maxWords={200} />
                    <TextAreaField label="What do you hope to learn or gain from your experience at Diganta?" name="hopeToLearn" value={formData.hopeToLearn} onChange={handleChange} hint="80-120 words" rows={3} minWords={80} maxWords={120} />

                    <div className="flex flex-col gap-2">
                      <label className="text-sm sm:text-base font-bold text-slate-600 uppercase tracking-wider ml-2">
                        CV / Resume <span className="text-blue-500">*</span>
                      </label>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleFileChange(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`relative w-full border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                          }`}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            handleFileChange(file);
                          }}
                          className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${formData.cvFile ? 'hidden' : ''}`}
                          required={!formData.cvFile}
                        />
                        {formData.cvFile ? (
                          <div className="flex items-center gap-4 bg-white border-2 border-green-100 p-4 rounded-2xl shadow-sm w-full max-w-md mx-auto animate-in slide-in-from-bottom-2 fade-in duration-300">
                            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                              <FileText size={24} className="animate-in zoom-in duration-300 delay-100" />
                            </div>
                            <div className="flex flex-col flex-grow min-w-0 text-left">
                              <span className="font-bold text-sm text-slate-800 truncate">{formData.cvFile.name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {((formData.cvFile.size || 0) / 1024 / 1024).toFixed(2)} MB
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                                  <Check size={10} strokeWidth={3} /> Uploaded
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFormData((prev: typeof defaultFormData) => ({ ...prev, cvFile: null }));
                              }}
                              className="relative z-10 p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors pointer-events-auto shrink-0"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-slate-500 gap-2 pointer-events-none">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isDragging ? 'bg-blue-600 text-white shadow-lg' : 'bg-white shadow-sm text-blue-500'}`}>
                              <UploadCloud size={28} />
                            </div>
                            <span className="font-bold text-sm md:text-base text-slate-700">Click or drag and drop to upload</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400">PDF, DOC, DOCX, JPG, PNG (Max {MAX_FILE_SIZE_MB}MB)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <InputField label="Portfolio Link (Optional)" name="portfolioLinks" value={formData.portfolioLinks} onChange={handleChange} required={false} />
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
          </>
        )}
      </div>
    </div>
  );
};
