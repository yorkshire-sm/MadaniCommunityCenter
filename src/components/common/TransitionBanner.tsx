import React, { useState } from 'react';
import { Calendar, X, ArrowRight } from 'lucide-react';

interface TransitionBannerProps {
  onLearnMore?: () => void;
}

export const TransitionBanner: React.FC<TransitionBannerProps> = ({ onLearnMore }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#07192F] text-slate-200 border-b border-[#143A66] py-2 px-3 sm:px-6 text-xs z-50 relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink truncate">
          <Calendar className="h-3.5 w-3.5 text-[#00A896] shrink-0" aria-hidden="true" />
          <span className="truncate text-[11px] sm:text-xs">
            <strong className="text-[#00A896] font-semibold">Madani Community Center:</strong> <span className="hidden xs:inline sm:inline">Online room &amp; hall bookings are now open in Sheffield.</span><span className="xs:hidden sm:hidden">Online bookings are open.</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="text-[#00A896] hover:text-white font-medium flex items-center gap-1 transition-colors underline-offset-2 hover:underline cursor-pointer text-[11px] sm:text-xs whitespace-nowrap"
            >
              <span>Book</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
