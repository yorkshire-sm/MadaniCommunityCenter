import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'dark' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asLink?: boolean;
  href?: string;
  external?: boolean;
  roundedPill?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  iconPosition = 'right',
  className = '',
  asLink = false,
  href = '#',
  external = false,
  roundedPill = true,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] cursor-pointer';

  const radiusStyles = roundedPill ? 'rounded-full' : 'rounded-xl';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-6 py-2.5 gap-2 min-h-[42px]',
    lg: 'text-base px-8 py-3.5 gap-2.5 min-h-[48px]',
  }[size];

  const variantStyles = {
    // Chartreuse / Olive-Gold primary matching Luqman Academy site
    primary:
      'bg-[#B8C053] text-[#18260D] hover:bg-[#A5AD3F] border border-[#9CA436] shadow-sm focus-visible:outline-[#B8C053]',
    // Deep forest dark green
    dark:
      'bg-[#182B1C] text-white hover:bg-[#101E13] border border-[#101E13] shadow-sm focus-visible:outline-[#182B1C]',
    // Secondary light olive tint
    secondary:
      'bg-[#F0F4E8] text-[#182B1C] hover:bg-[#E3EACF] border border-[#D5E0C2] focus-visible:outline-[#B8C053]',
    // Outline on light surface
    outline:
      'bg-transparent text-stone-800 hover:bg-stone-100 border border-stone-300 focus-visible:outline-stone-900',
    // Outline on dark hero (matching "Find Us" from Luqman Academy header)
    'outline-white':
      'bg-transparent text-white hover:bg-white/10 border border-white/60 focus-visible:outline-white',
    text: 'bg-transparent text-[#182B1C] hover:text-[#B8C053] underline-offset-4 hover:underline p-0 min-h-0',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseStyles} ${radiusStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`;

  if (asLink) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
