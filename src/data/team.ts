export interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote?: string;
  linkedin?: string;
  facebook?: string;
}

export interface TeamYearData {
  year: string;
  supervisors: TeamMember[];
  advisors: TeamMember[];
  teamLeads: TeamMember[];
  subTeamLeads: TeamMember[];
  teamMembers: TeamMember[];
}

export const teamData: TeamYearData[] = [
  {
    year: '2024',
    supervisors: [
      { 
        name: 'Dr. John Doe', 
        role: 'Supervisor', 
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
        quote: "Guidance is the fuel of innovation.",
      }
    ],
    advisors: [
      { 
        name: 'Dr. Jane Smith', 
        role: 'Advisor', 
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
        quote: "Pushing boundaries is what we do best.",
      }
    ],
    teamLeads: [
      { 
        name: 'Alex Johnson', 
        role: 'Team Lead', 
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop',
        quote: "Command requires absolute precision.",
      }
    ],
    subTeamLeads: [
      { 
        name: 'Sarah Lee', 
        role: 'Avionics Sub-Lead', 
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
      },
      { 
        name: 'Michael Chen', 
        role: 'Structures Sub-Lead', 
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
      },
      { 
        name: 'Emily Davis', 
        role: 'Recovery Sub-Lead', 
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
      }
    ],
    teamMembers: [
      { 
        name: 'David Wilson', 
        role: 'Team Member', 
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
      },
      { 
        name: 'Jessica Brown', 
        role: 'Team Member', 
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
      },
      {
        name: 'Chris Evans',
        role: 'Team Member',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop'
      }
    ]
  },
  {
    year: '2023',
    supervisors: [
      { 
        name: 'Dr. Alan Grant', 
        role: 'Supervisor', 
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop',
      }
    ],
    advisors: [],
    teamLeads: [
      { 
        name: 'Robert Fox', 
        role: 'Team Lead', 
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
      }
    ],
    subTeamLeads: [
      { 
        name: 'Wade Warren', 
        role: 'Avionics Sub-Lead', 
        image: 'https://images.unsplash.com/photo-1566492031523-0c464e8e04b4?q=80&w=1974&auto=format&fit=crop',
      },
      { 
        name: 'Esther Howard', 
        role: 'Structures Sub-Lead', 
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf08c?q=80&w=1974&auto=format&fit=crop',
      }
    ],
    teamMembers: []
  }
];
