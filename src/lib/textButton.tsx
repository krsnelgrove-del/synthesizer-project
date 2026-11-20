import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    as?: 'button';
    variant?: 'default' | 'accent' | 'secondary' | 'danger' | 'ghost' | 'disabled';
}

export const TextButton = ({
  children,
  className,
  as: Component = 'button',
  variant = 'default',
  disabled,
  ...props
}: ThemedButtonProps) => {
  
  const variantStyles = {
    default: 'bg-synth-card border border-synth-border text-synth-text hover:bg-synth-card-hover transition-colors rounded-lg px-4 py-2 text-sm font-medium',
    
    accent: 'btn-accent rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2',
    
    secondary: 'bg-synth-input border border-synth-border text-synth-text hover:border-synth-violet transition-colors rounded-lg px-3 py-1.5 text-xs font-medium',
    
    danger: 'bg-synth-card border border-synth-border text-synth-text hover:bg-synth-card-hover transition-colors rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2',
    
    ghost: 'text-synth-muted hover:text-synth-text hover:bg-synth-card-hover transition-colors rounded-xl p-2.5 flex items-center justify-center',
    
    disabled: 'bg-synth-card opacity-40 cursor-not-allowed border border-synth-border text-synth-muted rounded-lg px-4 py-2 text-sm font-medium',
  };

  return (
    <Component
      disabled={disabled || variant === 'disabled'}
      className={twMerge(
        'inline-flex items-center justify-center select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-synth-violet',
        variant === 'disabled' ? variantStyles.disabled : variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};