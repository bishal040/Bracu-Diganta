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
    slug: 'cansat-2024',
    title: 'CANSAT 2024',
    category: 'Competition Payload',
    description: 'Design and deployment of a miniaturized satellite within a soda can format. The payload autonomously gathered atmospheric pressure, temperature, and GPS coordinates during its descent via an active auto-rotation mechanism.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    status: 'Mission Complete',
    statusColor: 'text-emerald-400',
    date: 'Spring 2024',
    stats: [
      { label: 'Apogee', value: '2,350 ft' },
      { label: 'Descent', value: '14 m/s' }
    ],
    route: '/project/cansat-2024' // Uses the custom sequence page
  },
  {
    id: 2,
    slug: 'aether',
    title: 'PROJECT AETHER',
    category: 'Research Avionics',
    description: 'Next-generation flight computing cluster featuring machine learning algorithms for real-time descent trajectory prediction and autonomous correction mechanisms.',
    image: 'https://images.unsplash.com/photo-1541881329562-b91a539b7843?q=80&w=2070&auto=format&fit=crop',
    status: 'In Development',
    statusColor: 'text-amber-400',
    date: 'Fall 2024',
    stats: [
      { label: 'Compute', value: 'Dual STM32' },
      { label: 'Telemetry', value: '915 MHz' }
    ],
    route: '/project/aether',
    details: {
      objective: 'To develop a fully autonomous flight computer capable of real-time trajectory correction and advanced machine-learning powered telemetry analysis during high-velocity descent.',
      overview: 'Project AETHER represents a leap forward in our avionics capabilities. By moving away from off-the-shelf flight controllers, our team has engineered a custom dual-core STM32 processing cluster. This allows for simultaneous low-latency sensor fusion and complex trajectory prediction without computational bottlenecks. The system is designed to survive extreme G-forces and sudden temperature fluctuations inherent to upper-atmospheric deployments.',
      gallery: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop'
      ],
      technicalSpecs: [
        {
          category: 'Processing Power',
          details: ['Dual STM32H7 Microcontrollers', '480MHz Core Clock', 'Hardware Floating Point Unit', 'Redundant Watchdog Timers']
        },
        {
          category: 'Sensor Suite',
          details: ['9-DOF IMU (ICM-20948)', 'High-Precision Barometer (MS5611)', 'RTK GPS Module', 'Thermocouple Array']
        },
        {
          category: 'Communications',
          details: ['915 MHz LoRa Transceiver', '30km Maximum Range', '250 kbps Telemetry Downlink', 'AES-256 Encryption']
        }
      ]
    }
  },
  {
    id: 3,
    slug: 'strato-node',
    title: 'STRATO NODE',
    category: 'High-Altitude Balloon',
    description: 'High-altitude balloon mission designed to test extreme cold weather operations of our new battery management system and long-range LoRaWAN communication module.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    status: 'Awaiting Launch',
    statusColor: 'text-cyan-400',
    date: 'Spring 2025',
    stats: [
      { label: 'Target Alt', value: '90K ft' },
      { label: 'Duration', value: '4 Hours' }
    ],
    route: '/project/strato-node',
    details: {
      objective: 'Deploy a high-altitude data collection node to the stratosphere (approx 90,000 feet) to capture atmospheric data and validate our newly engineered thermal management systems.',
      overview: 'Strato Node is an ambitious endeavor to reach the edge of space using a meteorological balloon. The payload experiences temperatures plummeting to -60°C and near-vacuum conditions. Our primary goal is to test a proprietary active-heating battery enclosure and a highly directional LoRaWAN antenna array designed to maintain a continuous data link with ground control over a 100+ kilometer radius.',
      gallery: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop'
      ],
      technicalSpecs: [
        {
          category: 'Payload Structure',
          details: ['Carbon Fiber / Aerogel Composite', 'Weight: < 1.5 kg', 'Radar Reflector Equipped', 'Active Thermal Heating Pads']
        },
        {
          category: 'Power Management',
          details: ['Lithium Thionyl Chloride (Li-SOCl2) Cells', 'Multi-layer Thermal Insulation', 'Redundant Power Buses', 'Smart Load Shedding']
        },
        {
          category: 'Recovery System',
          details: ['Dual-Deploy Parachute System', 'Iridium Satellite Tracker', 'Audible Descent Siren', 'High-Visibility Orange Coating']
        }
      ]
    }
  }
];
