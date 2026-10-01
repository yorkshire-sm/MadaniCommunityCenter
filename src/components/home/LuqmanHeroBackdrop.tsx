import React from 'react';

export const LuqmanHeroBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {/* Base deep atmospheric photographic background with warm gradients */}
      <div className="absolute inset-0 bg-[#162117]" />

      {/* Atmospheric SVG illustration recreating the congregation/students in assembly under arched windows */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-85"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="warmAmberVignette" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0E1710" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#1B261A" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#3E2611" stopOpacity="0.85" />
            <stop offset="95%" stopColor="#5C3612" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2F1C0B" stopOpacity="0.98" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="40%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#D97706" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1A2417" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="windowLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Ambient interior classroom hall architecture with large high windows */}
        <rect width="1600" height="900" fill="#182319" />

        {/* Background window frames from Luqman classroom */}
        <g opacity="0.3" stroke="#CBD5E1" strokeWidth="2">
          <rect x="50" y="40" width="220" height="240" fill="url(#windowLight)" />
          <line x1="160" y1="40" x2="160" y2="280" />
          <line x1="50" y1="120" x2="270" y2="120" />
          <line x1="50" y1="200" x2="270" y2="200" />

          <rect x="320" y="40" width="220" height="240" fill="url(#windowLight)" />
          <line x1="430" y1="40" x2="430" y2="280" />
          <line x1="320" y1="120" x2="540" y2="120" />
          <line x1="320" y1="200" x2="540" y2="200" />

          <rect x="590" y="40" width="220" height="240" fill="url(#windowLight)" />
          <line x1="700" y1="40" x2="700" y2="280" />
          <line x1="590" y1="120" x2="810" y2="120" />
          <line x1="590" y1="200" x2="810" y2="200" />

          <rect x="860" y="40" width="220" height="240" fill="url(#windowLight)" />
          <line x1="970" y1="40" x2="970" y2="280" />
          <line x1="860" y1="120" x2="1080" y2="120" />
          <line x1="860" y1="200" x2="1080" y2="200" />

          <rect x="1130" y="40" width="220" height="240" fill="url(#windowLight)" />
          <line x1="1240" y1="40" x2="1240" y2="280" />
          <line x1="1130" y1="120" x2="1350" y2="120" />
          <line x1="1130" y1="200" x2="1350" y2="200" />

          <rect x="1400" y="40" width="180" height="240" fill="url(#windowLight)" />
          <line x1="1400" y1="120" x2="1580" y2="120" />
          <line x1="1400" y1="200" x2="1580" y2="200" />
        </g>

        {/* Rows of gathered students and attendees in assembly */}
        <g fill="#1F2A21" opacity="0.6">
          {[120, 220, 310, 420, 520, 610, 710, 810, 920, 1020, 1120, 1220, 1330, 1440].map((x, i) => (
            <g key={`back-${i}`}>
              <ellipse cx={x} cy={165 + (i % 3) * 6} rx="26" ry="34" />
              <path d={`M ${x - 38} ${200 + (i % 3) * 6} Q ${x} 185 ${x + 38} ${200 + (i % 3) * 6} L ${x + 48} 440 L ${x - 48} 440 Z`} />
            </g>
          ))}
        </g>

        {/* Mid row of students with white caps and head coverings */}
        <g opacity="0.85">
          {[80, 170, 270, 370, 480, 580, 690, 790, 900, 1010, 1120, 1240, 1360, 1480].map((x, i) => {
            const isWhiteCap = i % 2 === 0;
            return (
              <g key={`mid-${i}`}>
                <ellipse
                  cx={x}
                  cy={240 + (i % 2) * 12}
                  rx="30"
                  ry="38"
                  fill={isWhiteCap ? '#F3F4F6' : '#233024'}
                />
                <path
                  d={`M ${x - 44} ${280 + (i % 2) * 12} Q ${x} 265 ${x + 44} ${280 + (i % 2) * 12} L ${x + 58} 600 L ${x - 58} 600 Z`}
                  fill={i % 3 === 0 ? '#132115' : '#1C271E'}
                />
              </g>
            );
          })}
        </g>

        {/* Prominent foreground figures with white head coverings */}
        <g opacity="0.95">
          {/* Left tall student with white headscarf */}
          <ellipse cx="140" cy="330" rx="42" ry="58" fill="#F8FAFC" />
          <path d="M 90 380 Q 140 350 190 380 L 210 900 L 70 900 Z" fill="#132417" />

          {/* Foreground sister with flowing white scarf */}
          <ellipse cx="320" cy="350" rx="46" ry="62" fill="#F8FAFC" />
          <path d="M 260 405 Q 320 375 380 405 L 410 900 L 230 900 Z" fill="#1A261C" />

          {/* Child in white head covering in mid-center */}
          <ellipse cx="590" cy="510" rx="34" ry="46" fill="#F8FAFC" />
          <path d="M 545 550 Q 590 530 635 550 L 660 900 L 520 900 Z" fill="#152018" />

          {/* Student in center dark blazer */}
          <ellipse cx="730" cy="370" rx="40" ry="54" fill="#202C22" />
          <path d="M 680 415 Q 730 395 780 415 L 810 900 L 650 900 Z" fill="#101C12" />

          {/* Girl with white hijab */}
          <ellipse cx="910" cy="420" rx="44" ry="58" fill="#F8FAFC" />
          <path d="M 850 470 Q 910 445 970 470 L 1000 900 L 820 900 Z" fill="#1E281F" />

          {/* Right edge attendees */}
          <ellipse cx="1140" cy="350" rx="44" ry="56" fill="#243025" />
          <path d="M 1080 395 Q 1140 375 1200 395 L 1230 900 L 1050 900 Z" fill="#17241A" />

          <ellipse cx="1320" cy="340" rx="46" ry="60" fill="#F8FAFC" />
          <path d="M 1260 390 Q 1320 365 1380 390 L 1420 900 L 1220 900 Z" fill="#111F14" />

          <ellipse cx="1480" cy="360" rx="42" ry="54" fill="#202A21" />
          <path d="M 1430 405 Q 1480 385 1530 405 L 1570 900 L 1390 900 Z" fill="#162218" />
        </g>

        {/* Ambient warm lighting glow */}
        <rect width="1600" height="900" fill="url(#sunGlow)" />

        {/* Warm amber bottom vignette gradient */}
        <rect width="1600" height="900" fill="url(#warmAmberVignette)" />
      </svg>

      {/* Additional CSS gradient scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#201306]/95 via-[#1A1810]/60 to-[#0C150E]/80" />
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
    </div>
  );
};
