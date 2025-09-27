'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated';
  className?: string;
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const baseClasses = 'glass-card p-6 transition-all duration-300';
  const variantClasses = {
    default: 'hover:bg-opacity-30',
    elevated: 'hover:bg-opacity-40 hover:shadow-xl hover:shadow-accent/20'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
