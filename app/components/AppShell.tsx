'use client';

import { ReactNode } from 'react';
import { Zap, User, ShoppingBag, Video, Settings2 } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const shellClass = variant === 'glass' ? 'glass-card' : 'bg-surface';

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className={`${shellClass} border-b border-accent border-opacity-30 p-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-accent animate-pulse" />
              <h1 className="text-2xl font-bold text-glow">PixelForge</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#create" className="text-fg hover:text-accent transition-colors duration-200">Create</a>
            <a href="#marketplace" className="text-fg hover:text-accent transition-colors duration-200">Marketplace</a>
            <a href="#profile" className="text-fg hover:text-accent transition-colors duration-200">Profile</a>
          </nav>

          <Wallet>
            <ConnectWallet>
              <div className="flex items-center space-x-2 cyber-button">
                <Avatar className="w-6 h-6" />
                <Name />
              </div>
            </ConnectWallet>
          </Wallet>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-accent border-opacity-30 p-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1 text-fg hover:text-accent transition-colors duration-200">
            <Video className="w-6 h-6" />
            <span className="text-xs">Create</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-fg hover:text-accent transition-colors duration-200">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs">Market</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-fg hover:text-accent transition-colors duration-200">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-fg hover:text-accent transition-colors duration-200">
            <Settings2 className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
