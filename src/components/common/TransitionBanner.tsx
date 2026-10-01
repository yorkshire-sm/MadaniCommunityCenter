import React, { useState } from 'react';
import { Info, X, ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

interface TransitionBannerProps {
  onLearnMore?: () => void;
}

export const TransitionBanner: React.FC<TransitionBannerProps> = ({ onLearnMore }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#0E1810] text-stone-200 border-b border-[#213525] py-2 px-4 sm:px-6 text-xs z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <Info className="h-3.5 w-3.5 text-[#B8C053] shrink-0" aria-hidden="true" />
          <span className="truncate">
            <strong className="text-[#B8C053] font-semibold">Madani Community Centre:</strong> The building on Tinsley Park Road (formerly Luqman Academy) is now a multi-purpose Dawat-e-Islami education & community centre.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="text-[#B8C053] hover:text-white font-medium flex items-center gap-1 transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              <span>Learn more</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
