'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'default';
}

export function Modal({ isOpen, onClose, title, children, variant = 'default' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-accent border-opacity-30">
            <h2 className="text-xl font-bold text-fg">{title}</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-accent transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
