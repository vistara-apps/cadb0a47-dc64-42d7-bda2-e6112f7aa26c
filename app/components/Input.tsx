'use client';

import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'withIcon';
  icon?: ReactNode;
  label?: string;
  error?: string;
}

export function Input({ 
  variant = 'default', 
  icon, 
  label, 
  error, 
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-fg">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && variant === 'withIcon' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent">
            {icon}
          </div>
        )}
        
        <input
          className={`
            cyber-input w-full
            ${variant === 'withIcon' ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
