import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation, Share2, Check } from 'lucide-react';

interface GoogleMapInteractiveProps {
  className?: string;
  heightClass?: string;
  showCardHeader?: boolean;
}

export const GoogleMapInteractive: React.FC<GoogleMapInteractiveProps> = ({
  className = '',
  heightClass = 'h-[360px] sm:h-[440px]',
  showCardHeader = true,
}) => {
  const [copied, setCopied] = useState(false);

  // Exact Google Maps place link provided by the user
  const mapPlaceUrl = "https://www.google.com/maps/place/Madani+Community+Center/@53.3974483,-1.418529,17z/data=!3m1!4b1!4m6!3m5!1s0x487977f260864137:0xa8da2b647132fa87!8m2!3d53.3974483!4d-1.418529!16s%2Fg%2F11kmrw06cb";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=53.3974483,-1.418529";
  // Interactive embed URL targeting exact coordinates with center label
  const embedUrl = "https://maps.google.com/maps?q=53.3974483,-1.418529+(Madani+Community+Center)&t=&z=17&ie=UTF8&iwloc=B&output=embed";

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mapPlaceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`rounded-2xl border border-stone-200/90 bg-white shadow-xs overflow-hidden ${className}`}>
      {showCardHeader && (
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#182B1C] text-[#B8C053] flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#182B1C] font-serif-brand">
                Madani Community Center
              </h4>
              <p className="text-xs text-stone-600">
                Tinsley Park Road, Sheffield, S9 5DL · South Yorkshire
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#B8C053] text-[#18260D] hover:bg-[#A5AD3F] transition-colors shadow-2xs"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Copy Google Maps Link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-stone-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Interactive Google Map iframe */}
      <div className={`relative w-full ${heightClass} bg-stone-100`}>
        <iframe
          title="Madani Community Center Interactive Google Map"
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-2">
          <a
            href={mapPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-[#182B1C] hover:bg-white border border-stone-300 shadow-md backdrop-blur-xs transition-all hover:scale-[1.02]"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="h-3 w-3 text-[#B8C053]" />
          </a>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2.5 bg-[#FAF9F5] border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Coordinates: <strong>53.3974° N, 1.4185° W</strong></span>
        </span>
        <span className="font-mono text-stone-400">
          Ref: 0x487977f260864137:0xa8da2b647132fa87
        </span>
      </div>
    </div>
  );
};
