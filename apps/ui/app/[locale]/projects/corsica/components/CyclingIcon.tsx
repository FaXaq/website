'use client';

import React from 'react';

import { theme } from '@/components/ui/theme';

export default function CyclingIcon({ color = theme.colors['corsica-olive'] }: { color?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20.4118" cy="57.5882" r="18.4118" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
      <circle cx="79.9412" cy="57.5882" r="18.4118" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
      <path d="M40.6657 32.0608L20.5062 55.9432C19.9574 56.5933 20.4195 57.5882 21.2703 57.5882H49.8641C50.1587 57.5882 50.4383 57.4584 50.6283 57.2333L70.7878 33.3509C71.3366 32.7008 70.8744 31.7059 70.0236 31.7059H41.4298C41.1353 31.7059 40.8557 31.8357 40.6657 32.0608Z" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
      <path d="M38.5294 22.6471L50.1765 57.5882" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
      <path d="M68.2941 22.6471L79.9411 57.5882" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M46.2941 23.9412C46.2941 23.9412 45.7426 23.022 45.1487 22.7111C45.0535 22.6613 44.9452 22.6471 44.8377 22.6471H32.9419C32.7867 22.6471 32.6336 22.6109 32.4947 22.5415L31.4117 22" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M62.4706 22.6471H74.7647C76.0588 22.6471 78.6471 23.1647 78.6471 25.2353C78.6471 27.3059 76.0588 27.3922 74.7647 27.1765" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
