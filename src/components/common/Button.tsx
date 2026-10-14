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
    // Official Logo Royal/Ocean Blue primary
    primary:
      'bg-[#0077C8] text-white hover:bg-[#0069B4] border border-[#0069B4] shadow-sm focus-visible:outline-[#0077C8]',
    // Official Logo Deep Navy dark
    dark:
      'bg-[#0B2545] text-white hover:bg-[#07192F] border border-[#07192F] shadow-sm focus-visible:outline-[#0B2545]',
    // Secondary light ice blue tint
    secondary:
      'bg-[#F0F7FF] text-[#0B2545] hover:bg-[#E0F0FE] border border-[#BAE6FD] focus-visible:outline-[#0077C8]',
    // Outline on light surface
    outline:
      'bg-transparent text-slate-800 hover:bg-slate-100 border border-slate-300 focus-visible:outline-[#0B2545]',
    // Outline on dark hero
    'outline-white':
      'bg-transparent text-white hover:bg-white/10 border border-white/60 focus-visible:outline-white',
    text: 'bg-transparent text-[#0B2545] hover:text-[#0077C8] underline-offset-4 hover:underline p-0 min-h-0',
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
