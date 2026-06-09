export interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote?: string;
  linkedin?: string;
  facebook?: string;
  col?: string;
  height?: string;
  tier?: string;
}

export interface TeamYearData {
  year: string;
  advisors: TeamMember[];
  lead: TeamMember;
  core: TeamMember[];
  alumni: TeamMember[];
}

export const teamData: TeamYearData[] = [
  {
    year: '2024',
    advisors: [
      { 
        name: 'Dr. John Doe', 
        role: 'Faculty Advisor', 
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
        quote: "Guidance is the fuel of innovation.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
      { 
        name: 'Dr. Jane Smith', 
        role: 'Aerospace Consultant', 
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
        quote: "Pushing boundaries is what we do best.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
    ],
    lead: { 
      name: 'Alex Johnson', 
      role: 'Team Lead', 
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop',
      quote: "Command requires absolute precision.",
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com"
    },
    core: [
      { 
        name: 'Sarah Lee', 
        role: 'Lead Avionics', 
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
        quote: "Wiring the future, one circuit at a time.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
      { 
        name: 'Michael Chen', 
        role: 'Structures Head', 
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
        quote: "Structural integrity is non-negotiable.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
      { 
        name: 'Emily Davis', 
        role: 'Recovery Systems', 
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        quote: "Ensuring a safe return to Earth.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
    ],
    alumni: [
      { 
        name: 'David Wilson', 
        role: 'Former Team Lead', 
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        quote: "A legacy of aerospace excellence.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
      { 
        name: 'Jessica Brown', 
        role: 'Propulsion', 
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
        quote: "Propelling ideas into orbit.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
    ]
  },
  {
    year: '2023',
    advisors: [
      { 
        name: 'Dr. Alan Grant', 
        role: 'Faculty Advisor', 
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop',
        quote: "Experience is the best teacher.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
    ],
    lead: { 
      name: 'Robert Fox', 
      role: 'Team Lead', 
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
      quote: "Leadership is taking responsibility.",
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com"
    },
    core: [
      { 
        name: 'Wade Warren', 
        role: 'Lead Avionics', 
        image: 'https://images.unsplash.com/photo-1566492031523-0c464e8e04b4?q=80&w=1974&auto=format&fit=crop',
        quote: "Data is beautiful.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
      { 
        name: 'Esther Howard', 
        role: 'Structures Head', 
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf08c?q=80&w=1974&auto=format&fit=crop',
        quote: "Form follows function.",
        linkedin: "https://linkedin.com",
        facebook: "https://facebook.com"
      },
    ],
    alumni: []
  }
];

export const getFlattenedCrewData = (yearData: TeamYearData) => {
  return [
    ...(yearData.advisors[0] ? [{ ...yearData.advisors[0], col: 'col-span-12 md:col-span-6 lg:col-span-6', height: 'h-[300px]', tier: 'LVL-5 // ADVISOR' }] : []),
    ...(yearData.advisors[1] ? [{ ...yearData.advisors[1], col: 'col-span-12 md:col-span-6 lg:col-span-6', height: 'h-[300px]', tier: 'LVL-5 // ADVISOR' }] : []),
    ...(yearData.lead ? [{ ...yearData.lead, col: 'col-span-12 md:col-span-12 lg:col-span-4', height: 'h-[400px]', tier: 'LVL-4 // COMMAND' }] : []),
    ...(yearData.core[0] ? [{ ...yearData.core[0], col: 'col-span-12 md:col-span-6 lg:col-span-4',  height: 'h-[400px]', tier: 'LVL-3 // CORE' }] : []),
    ...(yearData.core[1] ? [{ ...yearData.core[1], col: 'col-span-12 md:col-span-6 lg:col-span-4',  height: 'h-[400px]', tier: 'LVL-3 // CORE' }] : []),
    ...(yearData.core[2] ? [{ ...yearData.core[2], col: 'col-span-12 md:col-span-12 lg:col-span-6', height: 'h-[300px]', tier: 'LVL-3 // CORE' }] : []),
    ...(yearData.alumni[0] ? [{ ...yearData.alumni[0], col: 'col-span-12 md:col-span-6 lg:col-span-3',  height: 'h-[300px]', tier: 'LVL-X // ALUMNI' }] : []),
    ...(yearData.alumni[1] ? [{ ...yearData.alumni[1], col: 'col-span-12 md:col-span-6 lg:col-span-3',  height: 'h-[300px]', tier: 'LVL-X // ALUMNI' }] : []),
  ];
};
