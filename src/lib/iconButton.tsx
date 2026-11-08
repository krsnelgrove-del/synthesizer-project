import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'active' | 'ghost' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
    'aria-label': string;
}

export const IconButton = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: IconButtonProps) => {
  
  const variantStyles = {
    /* Standard card button (e.g., panel action buttons) */
    default: 'bg-synth-card border border-synth-border text-synth-text hover:bg-synth-card-hover hover:border-synth-violet transition-all shadow-sm',
    
    /* Selected/Active tool state with violet accent & glow */
    active: 'bg-synth-violet text-white shadow-[0_0_12px_rgba(92,91,229,0.5)] border border-transparent',
    
    /* Transparent background for sidebars and toolbars */
    ghost: 'bg-transparent text-synth-muted hover:text-synth-text hover:bg-synth-card-hover transition-colors border border-transparent',
    
    /* Input-style subtle background (e.g., inside compact controls) */
    subtle: 'bg-synth-input border border-synth-border text-synth-secondary hover:text-synth-text hover:border-synth-violet transition-colors',
  };

  const sizeStyles = {
    sm: 'w-8 h-8 rounded-lg text-sm',
    md: 'w-10 h-10 rounded-xl text-base',
    lg: 'w-12 h-12 rounded-2xl text-lg',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center select-none shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-synth-violet cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};