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
  management?: TeamMember[];
  teamLeads: TeamMember[];
  subTeamLeads: TeamMember[];
  teamMembers: TeamMember[];
}

import teamDataJson from './team.json';

export const teamData: TeamYearData[] = teamDataJson as TeamYearData[];
// Trigger HMR
