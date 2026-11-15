import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'main';
  variant?: 'default' | 'panel' | 'card' | 'flex';
}

export const Container = ({
  children,
  className,
  as: Component = 'div',
  variant = 'default',
  ...props
}: ContainerProps) => {
  
  const variantStyles = {
    default: 'text-synth-text inset-0',
    panel: 'bg-synth-panel p-2',       
    card: 'bg-synth-card p-2',        
    flex: 'flex items-center gap-2',
  };

  return (
    <Component
      className={twMerge(
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};