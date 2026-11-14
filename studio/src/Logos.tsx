import type { ReactNode } from 'react';

/** Invented emblems for the made-up example organisations. Drawn on a 48 by 48 grid. */
const EMBLEMS: Record<string, { label: string; art: ReactNode }> = {
  'harbourside-food-rescue': {
    label: 'Harbourside Food Rescue',
    art: <>
      <circle cx="24" cy="24" r="24" fill="#215f66"/>
      <path d="M13 24c0-5 5-8.5 11-8.5s11 3.5 11 8.5v3H13z" fill="#f2dfb8"/>
      <path d="M19 19.5l1.6 4M24 18.5v4.5M29 19.5l-1.6 4" stroke="#c59a52" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M10 32c2.3-2 4.7-2 7 0s4.7 2 7 0 4.7-2 7 0 4.7 2 7 0" fill="none" stroke="#9fd3d0" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M13 37c2.2-1.7 4.5-1.7 6.7 0s4.5 1.7 6.7 0 4.5-1.7 6.6 0" fill="none" stroke="#9fd3d0" strokeWidth="1.6" strokeLinecap="round" opacity=".7"/>
    </>,
  },
  'northgate-food-bank': {
    label: 'Northgate Community Food Bank',
    art: <>
      <rect width="48" height="48" rx="11" fill="#d4772a"/>
      <path d="M11 23L24 12l13 11" fill="none" stroke="#fff6ea" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 27h19a9.5 9.5 0 0 1-19 0z" fill="#fff6ea"/>
      <path d="M21 22.5c0-1.7 1.4-3 3-3s3 1.3 3 3" fill="none" stroke="#fff6ea" strokeWidth="1.8" strokeLinecap="round"/>
    </>,
  },
  'second-round-reuse': {
    label: 'Second Round Reuse Shop',
    art: <>
      <circle cx="24" cy="24" r="24" fill="#4c7a3b"/>
      <path d="M14.5 21.5A10 10 0 0 1 32 17" fill="none" stroke="#eef5d8" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M33.5 13.5l-1.2 4.4-4.4-1.1" fill="none" stroke="#eef5d8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M33.5 26.5A10 10 0 0 1 16 31" fill="none" stroke="#eef5d8" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M14.5 34.5l1.2-4.4 4.4 1.1" fill="none" stroke="#eef5d8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="24" r="2.6" fill="#e9b44c"/>
    </>,
  },
  'ridgeline-predator-free': {
    label: 'Ridgeline Predator Free',
    art: <>
      <rect width="48" height="48" rx="24" fill="#26402f"/>
      <path d="M5 35l10-11 6 5 8-11 14 17z" fill="#5f8a5a"/>
      <path d="M5 35l10-11 6 5 8-11 14 17" fill="none" stroke="#b9d6a3" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M27.5 12.5c2.4-.9 4.6-.4 6 1.4l3.5-.4-2.7 1.7c-.3 2.5-2.4 4-5 3.9l-2.4 2.2.5-3c-1.5-1.3-1.5-3.8.1-5.8z" fill="#f2e7c9"/>
      <circle cx="31.6" cy="14.6" r=".8" fill="#26402f"/>
    </>,
  },
  'riverbank-juniors': {
    label: 'Riverbank Juniors Football Club',
    art: <>
      <path d="M24 2l19 6v14c0 12-8.5 20-19 24C13.5 42 5 34 5 22V8z" fill="#28407a"/>
      <path d="M8.5 28c3-2.4 6-2.4 9 0s6 2.4 9 0 6-2.4 9 0 3 1.6 4.5 1" fill="none" stroke="#8fc3ec" strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="24" cy="17" r="7" fill="#fbfaf5"/>
      <path d="M24 13.3l3.2 2.3-1.2 3.7h-4l-1.2-3.7z" fill="#28407a"/>
      <path d="M24 10v3.3M27.2 15.6l3.3-1M26 19.3l2 3M22 19.3l-2 3M20.8 15.6l-3.3-1" stroke="#28407a" strokeWidth="1.1"/>
    </>,
  },
  'elm-street-hall': {
    label: 'Elm Street Community Hall',
    art: <>
      <rect width="48" height="48" rx="11" fill="#7c2f3c"/>
      <path d="M9 22L24 11l15 11" fill="none" stroke="#f7e9e0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 21v15h22V21" fill="none" stroke="#f7e9e0" strokeWidth="2.4" strokeLinejoin="round"/>
      <path d="M21 36v-7a3 3 0 0 1 6 0v7" fill="#f7e9e0"/>
      <path d="M24 23.5c-2.5-1.5-2.6-4.4 0-6.3 2.6 1.9 2.5 4.8 0 6.3zM24 23.5v2" fill="#e9b44c" stroke="#e9b44c" strokeWidth=".8" strokeLinecap="round"/>
    </>,
  },
};

/** An organisation's emblem, or a dashed placeholder for one the future builder brings. */
export function OrgLogo({ id, size = 48, className }: { id: string; size?: number; className?: string }) {
  const emblem = EMBLEMS[id];
  if (!emblem) {
    return <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 3.2"/>
      <path d="M24 16v16M16 24h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>;
  }
  return <svg className={className} width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={`${emblem.label} logo`}>{emblem.art}</svg>;
}
