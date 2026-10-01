import React from 'react';

interface MadaniLogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'full';
}

export const MadaniLogo: React.FC<MadaniLogoProps> = ({
  className = 'w-full h-full',
  size,
  variant = 'emblem',
}) => {
  return (
    <svg
      viewBox={variant === 'full' ? '0 0 500 500' : '10 2 80 84'}
      className={className}
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Madani Community Centre Logo"
    >
      <defs>
        {/* Rich Metallic Gold Gradient for Crescent & Book Pages */}
        <linearGradient id="mGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3D379" />
          <stop offset="45%" stopColor="#C69C28" />
          <stop offset="100%" stopColor="#956E13" />
        </linearGradient>

        {/* Deep Emerald Forest Green Gradient for Dome & Central Figure */}
        <linearGradient id="mEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#176346" />
          <stop offset="60%" stopColor="#0D4B34" />
          <stop offset="100%" stopColor="#083625" />
        </linearGradient>

        {/* Vibrant Olive Green for Supporting Community Figures */}
        <linearGradient id="mOliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7EBA65" />
          <stop offset="100%" stopColor="#4A8336" />
        </linearGradient>
      </defs>

      {/* 1. Gold Crescent Moon on Pinnacle */}
      <path
        d="M55.5 12.5 C55.5 16 52.8 19 49 19 C48 19 47.1 18.8 46.2 18.4 C49.2 17.2 51.2 14.3 51.2 11.2 C51.2 9.6 50.6 8.2 49.5 7 C53.3 7.8 55.5 9.8 55.5 12.5 Z"
        fill="url(#mGoldGrad)"
      />

      {/* 2. Architectural Dome / Arch Frame */}
      <path
        d="M50 19.5 
           C51 22, 57 28, 66 35 
           C75 42, 76 52, 76 66 
           L70.5 66 
           C70.5 53, 69 45, 62 39 
           C56 34, 51 28, 50 24 
           C49 28, 44 34, 38 39 
           C31 45, 29.5 53, 29.5 66 
           L24 66 
           C24 52, 25 42, 34 35 
           C43 28, 49 22, 50 19.5 Z"
        fill="url(#mEmeraldGrad)"
      />

      {/* 3. Central Figure (Leader / Student) */}
      <circle cx="50" cy="41" r="5.2" fill="url(#mEmeraldGrad)" />
      <path
        d="M50 67 
           C49 61, 46.5 53, 39 44 
           C43.5 48.5, 47 53, 48 58 
           C48.8 54.5, 49.5 50.5, 50 48 
           C50.5 50.5, 51.2 54.5, 52 58 
           C53 53, 56.5 48.5, 61 44 
           C53.5 53, 51 61, 50 67 Z"
        fill="url(#mEmeraldGrad)"
      />

      {/* 4. Left Supporting Figure */}
      <circle cx="36" cy="46" r="3.9" fill="url(#mOliveGrad)" />
      <path
        d="M48 67.5 
           C45 64, 40 58.5, 29.5 49 
           C29 53, 32.5 60, 40 62.8 
           C43.5 64.2, 46.5 66, 48 67.5 Z"
        fill="url(#mOliveGrad)"
      />

      {/* 5. Right Supporting Figure */}
      <circle cx="64" cy="46" r="3.9" fill="url(#mOliveGrad)" />
      <path
        d="M52 67.5 
           C55 64, 60 58.5, 70.5 49 
           C71 53, 67.5 60, 60 62.8 
           C56.5 64.2, 53.5 66, 52 67.5 Z"
        fill="url(#mOliveGrad)"
      />

      {/* 6. Open Book (Upper Golden Pages) */}
      <path
        d="M50 68 
           C54 65.5, 65 61.5, 77 65 
           C72.5 69, 62 72.5, 52.2 74.5 
           C50.8 74.8, 49.2 74.8, 47.8 74.5 
           C38 72.5, 27.5 69, 23 65 
           C35 61.5, 46 65.5, 50 68 Z"
        fill="url(#mGoldGrad)"
      />

      {/* 7. Open Book (Lower Emerald Base & Spine) */}
      <path
        d="M50 73.5 
           C55.5 70.5, 69.5 67, 81.5 71.5 
           C75 76.5, 62.5 80.5, 50 82 
           C37.5 80.5, 25 76.5, 18.5 71.5 
           C30.5 67, 44.5 70.5, 50 73.5 Z"
        fill="url(#mEmeraldGrad)"
      />
    </svg>
  );
};
