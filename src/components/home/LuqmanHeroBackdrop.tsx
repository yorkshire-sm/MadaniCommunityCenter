import React from 'react';
import heroLuqmanImage from '../../assets/images/hero-luqman.jpg';

export const LuqmanHeroBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {/* Base background */}
      <div className="absolute inset-0 bg-[#142016]" />

      {/* The actual Luqman Academy hero photograph - vivid, clear, and visible */}
      <img
        src={heroLuqmanImage}
        alt="Students and community in assembly hall"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-75 sm:opacity-85 filter brightness-100 contrast-105"
        referrerPolicy="no-referrer"
      />

      {/* Soft directional scrim: light on the left (so you can clearly see the gathering and hall), gently deepening on the right just behind the text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/50 to-[#0A140D]/85" />

      {/* Subtle vertical blend at bottom scoop and top navigation */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A11] via-transparent to-black/40" />
    </div>
  );
};
