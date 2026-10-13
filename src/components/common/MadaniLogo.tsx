import React from 'react';

interface MadaniLogoProps {
  className?: string;
  size?: number;
  variant?: 'emblem' | 'full';
  monochrome?: boolean;
}

export const MadaniLogo: React.FC<MadaniLogoProps> = ({
  className = 'w-full h-full',
  size,
  variant = 'emblem',
  monochrome = false,
}) => {
  // Brand color palette extracted directly from the official logo
  const navy = monochrome ? 'currentColor' : '#0B2545';
  const royalBlue = monochrome ? 'currentColor' : '#0077C8';
  const teal = monochrome ? 'currentColor' : '#00A896';
  const facetDark = monochrome ? 'currentColor' : '#09315D';

  return (
    <svg
      viewBox={variant === 'full' ? '0 0 500 520' : '90 15 320 360'}
      className={className}
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Madani Community Center Official Logo"
    >
      <defs>
        {/* Subtle Blue & Teal Shading Gradients */}
        <linearGradient id="logoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0069B4" />
        </linearGradient>

        <linearGradient id="logoTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#02B19E" />
          <stop offset="100%" stopColor="#009688" />
        </linearGradient>

        <linearGradient id="logoFacetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0A2D54" />
          <stop offset="100%" stopColor="#061F3C" />
        </linearGradient>
      </defs>

      {/* ========================================================
          1. CRESCENT MOON AT APEX
          ======================================================== */}
      <path
        d="M260 30 
           C242 30, 228 44, 228 62 
           C228 80, 242 94, 260 94 
           C250 88, 244 76, 244 62 
           C244 48, 250 36, 260 30 Z"
        fill={navy}
      />

      {/* ========================================================
          2. ISLAMIC DOME & ARCH FRAMEWORK (DEEP NAVY)
          ======================================================== */}
      {/* Outer Arch Contour */}
      <path
        d="M250 88 
           C258 102, 290 128, 326 156 
           C360 182, 368 214, 368 250 
           L368 360 L338 360 
           L338 250 
           C338 220, 330 196, 305 174 
           C278 150, 256 130, 250 118 
           C244 130, 222 150, 195 174 
           C170 196, 162 220, 162 250 
           L162 360 L132 360 
           L132 250 
           C132 214, 140 182, 174 156 
           C210 128, 242 102, 250 88 Z"
        fill={navy}
      />

      {/* Decorative Outer Side Pillars / Buttresses */}
      <path
        d="M125 210 L145 210 L145 360 L125 360 Z"
        fill={navy}
      />
      <path
        d="M355 210 L375 210 L375 360 L355 360 Z"
        fill={navy}
      />
      {/* Inner Trim Pillars */}
      <path
        d="M156 235 L164 235 L164 360 L156 360 Z"
        fill="#FFFFFF"
      />
      <path
        d="M336 235 L344 235 L344 360 L336 360 Z"
        fill="#FFFFFF"
      />

      {/* ========================================================
          3. THREE COMMUNITY FIGURES (LEARNING & BELONGING)
          ======================================================== */}
      {/* Central Figure (Deep Navy) */}
      <circle cx="250" cy="158" r="9" fill={navy} />
      <path
        d="M250 172 
           C255 176, 268 188, 275 204 
           L262 208 
           C256 197, 252 190, 250 188 
           C248 190, 244 197, 238 208 
           L225 204 
           C232 188, 245 176, 250 172 Z"
        fill={navy}
      />

      {/* Left Figure (Vibrant Teal) */}
      <circle cx="218" cy="174" r="8" fill={teal} />
      <path
        d="M218 186 
           C212 190, 204 196, 204 204 
           C215 204, 228 208, 240 220 
           L245 214 
           C236 200, 226 190, 218 186 Z"
        fill={teal}
      />

      {/* Right Figure (Royal Blue) */}
      <circle cx="282" cy="174" r="8" fill={royalBlue} />
      <path
        d="M282 186 
           C288 190, 296 196, 296 204 
           C285 204, 272 208, 260 220 
           L255 214 
           C264 200, 274 190, 282 186 Z"
        fill={royalBlue}
      />

      {/* ========================================================
          4. OPEN BOOK PAGES (EDUCATION & WISDOM)
          ======================================================== */}
      {/* Top Page Layer (Deep Navy) */}
      <path
        d="M250 236 
           C232 225, 202 216, 175 220 
           C174 228, 176 235, 180 240 
           C205 234, 230 238, 250 248 
           C270 238, 295 234, 320 240 
           C324 235, 326 228, 325 220 
           C298 216, 268 225, 250 236 Z"
        fill={navy}
      />

      {/* Lower Blue Left Wing / Page */}
      <path
        d="M250 245 
           C230 234, 200 232, 172 238 
           L172 245 
           C200 238, 230 242, 250 254 
           Z"
        fill={royalBlue}
      />

      {/* Lower Blue Right Wing / Page */}
      <path
        d="M250 245 
           C270 234, 300 232, 328 238 
           L328 245 
           C300 238, 270 242, 250 254 
           Z"
        fill={navy}
      />

      {/* Center Spine */}
      <path
        d="M248 244 L252 244 L252 258 L248 258 Z"
        fill={navy}
      />

      {/* ========================================================
          5. THE GEOMETRIC "M" ICON
          ======================================================== */}
      {/* Left Vertical Stem & Diagonal Wing (Royal Blue) */}
      <path
        d="M174 248 
           L204 248 
           L204 360 
           L174 360 Z"
        fill="url(#logoBlueGrad)"
      />
      <path
        d="M204 248 
           L250 338 
           L250 310 
           L222 256 
           L238 256 
           L204 248 Z"
        fill="url(#logoBlueGrad)"
      />
      {/* Triangular Left Infill */}
      <polygon
        points="204,248 250,338 204,360"
        fill={royalBlue}
      />

      {/* Center Fold Facet Shadow (Deep Navy / Indigo) */}
      <polygon
        points="250,292 268,318 250,338 232,318"
        fill={facetDark}
      />

      {/* Right Vertical Stem & Diagonal Wing (Vibrant Teal) */}
      <path
        d="M296 248 
           L326 248 
           L326 360 
           L296 360 Z"
        fill="url(#logoTealGrad)"
      />
      <path
        d="M296 248 
           L250 338 
           L250 310 
           L278 256 
           L262 256 
           L296 248 Z"
        fill="url(#logoTealGrad)"
      />
      {/* Triangular Right Infill */}
      <polygon
        points="296,248 250,338 296,360"
        fill={teal}
      />

      {/* ========================================================
          6. FULL VARIANT TYPOGRAPHY (IF VARIANT === 'FULL')
          ======================================================== */}
      {variant === 'full' && (
        <g>
          {/* Main Title: MADANI */}
          <text
            x="250"
            y="418"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="52"
            fontWeight="800"
            letterSpacing="2"
            fill={navy}
          >
            MADANI
          </text>

          {/* Sub-Title: COMMUNITY CENTER */}
          <text
            x="250"
            y="452"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="21"
            fontWeight="700"
            letterSpacing="4"
            fill={navy}
          >
            COMMUNITY CENTER
          </text>

          {/* Motto: -- LEARN | CONNECT | BELONG -- */}
          <text
            x="250"
            y="480"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontSize="12.5"
            fontWeight="600"
            letterSpacing="2.5"
            fill={navy}
          >
            -- LEARN | CONNECT | BELONG --
          </text>
        </g>
      )}
    </svg>
  );
};
