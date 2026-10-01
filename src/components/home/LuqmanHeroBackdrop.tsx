import React from 'react';
import heroLuqmanImage from '../../assets/images/hero-luqman.jpg';

export const LuqmanHeroBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {/* Base deep atmospheric dark forest background */}
      <div className="absolute inset-0 bg-[#121E14]" />

      {/* The actual Luqman Academy hero photograph with reduced opacity as requested */}
      <img
        src={heroLuqmanImage}
        alt="Students and community in assembly hall"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 sm:opacity-35 mix-blend-luminosity filter contrast-125"
        referrerPolicy="no-referrer"
      />

      {/* Subtle warm amber and gold radial lighting */}
      <div className="absolute inset-0 bg-radial from-[#C59B27]/25 via-transparent to-black/60 pointer-events-none" />

      {/* Primary directional readability gradient overlay (darker towards right where text sits) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C150E]/85 via-[#121E14]/70 to-[#0C150E]/95" />

      {/* Vertical vignette gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C150E]/98 via-transparent to-[#0A120B]/80" />
    </div>
  );
};
