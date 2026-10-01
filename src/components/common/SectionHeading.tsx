import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  description,
  centered = false,
  className = '',
  dark = false,
}) => {
  return (
    <div
      className={`space-y-2.5 ${
        centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'
      } ${className}`}
    >
      {kicker && (
        <p className="text-xs font-bold tracking-widest uppercase text-[#B8C053] flex items-center gap-2">
          {centered && <span className="h-px w-6 bg-[#B8C053]" aria-hidden="true" />}
          <span>{kicker}</span>
          <span className="h-px w-6 bg-[#B8C053]" aria-hidden="true" />
        </p>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-serif-brand font-bold tracking-tight leading-tight ${
          dark ? 'text-white' : 'text-[#182B1C]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-base leading-relaxed font-normal ${
            dark ? 'text-stone-300' : 'text-stone-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
