export interface MissionStat {
  label: string;
  value: string;
}

export interface MissionDetail {
  objective: string;
  overview: string;
  gallery: string[];
  technicalSpecs: { category: string; details: string[] }[];
}

export interface MissionData {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  status: string;
  statusColor: string;
  date: string;
  stats: MissionStat[];
  route?: string; // Optional dedicated route for the mission
  details?: MissionDetail;
}

export const missionsData: MissionData[] = [
  {
    id: 1,
    slug: 'cansat-v1',
    title: 'Cansat V1.0',
    category: 'Competition Payload',
    description: 'Our first iteration of the miniaturized satellite. Successfully demonstrated basic telemetry gathering and safe descent operations.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    status: 'Mission Complete',
    statusColor: 'text-emerald-400',
    date: 'Spring 2021',
    stats: [
      { label: 'Apogee', value: '1,500 ft' },
      { label: 'Descent', value: '12 m/s' }
    ]
  },
  {
    id: 2,
    slug: 'cansat-v2',
    title: 'Cansat V2.0',
    category: 'Competition Payload',
    description: 'Second generation payload featuring an improved auto-rotation mechanism and enhanced sensor suite for atmospheric data collection.',
    image: 'https://images.unsplash.com/photo-1541881329562-b91a539b7843?q=80&w=2070&auto=format&fit=crop',
    status: 'Mission Complete',
    statusColor: 'text-emerald-400',
    date: 'Spring 2022',
    stats: [
      { label: 'Apogee', value: '2,000 ft' },
      { label: 'Descent', value: '15 m/s' }
    ]
  },
  {
    id: 3,
    slug: 'cansat-v3',
    title: 'Cansat V3.0',
    category: 'Competition Payload',
    description: 'Introduced autonomous trajectory correction and real-time machine learning inference during high-velocity descent.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    status: 'Mission Complete',
    statusColor: 'text-emerald-400',
    date: 'Spring 2023',
    stats: [
      { label: 'Apogee', value: '2,200 ft' },
      { label: 'Descent', value: '14 m/s' }
    ]
  },
  {
    id: 4,
    slug: 'cansat-v4',
    title: 'Cansat V4.0',
    category: 'Competition Payload',
    description: 'Our most advanced deployed model to date. Featured dual-core flight computing and 30km maximum range telemetry downlink.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    status: 'Mission Complete',
    statusColor: 'text-emerald-400',
    date: 'Spring 2024',
    stats: [
      { label: 'Apogee', value: '2,350 ft' },
      { label: 'Descent', value: '14 m/s' }
    ],
    route: '/project/cansat-2024'
  },
  {
    id: 5,
    slug: 'cansat-v5',
    title: 'Cansat V5.0',
    category: 'Competition Payload',
    description: 'The next evolution of our CanSat platform. Currently in active development with new groundbreaking features.',
    image: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop',
    status: 'Coming Soon',
    statusColor: 'text-amber-400',
    date: 'Spring 2025',
    stats: [
      { label: 'Target Alt', value: '3,000 ft' },
      { label: 'Status', value: 'In Design' }
    ]
  }
];
