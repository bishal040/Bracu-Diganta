import React from 'react';
import * as Icons from 'lucide-react';
import sponsorsJson from './sponsors.json';

export type SponsorColor = 'blue' | 'indigo' | 'cyan' | 'violet' | 'slate';
export type SponsorShape = 'square' | 'circle' | 'diamond';

export interface SponsorData {
  id: string;
  name: string;
  logoUrl?: string;
  iconName: keyof typeof Icons;
  color: SponsorColor;
  shape: SponsorShape;
}

export interface MappedSponsor extends SponsorData {
  icon: React.ReactNode;
}

const typedSponsorsJson = sponsorsJson as SponsorData[];

export const sponsorsData: MappedSponsor[] = typedSponsorsJson.map((sponsor) => {
  const IconComponent = Icons[sponsor.iconName] as React.ElementType;
  
  return {
    ...sponsor,
    icon: IconComponent ? <IconComponent size={32} strokeWidth={1.5} /> : <Icons.Globe size={32} strokeWidth={1.5} />
  };
});
