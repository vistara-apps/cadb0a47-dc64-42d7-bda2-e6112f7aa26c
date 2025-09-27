'use client';

import { useAccount } from 'wagmi';
import { CreatorProfile } from '@/components/CreatorProfile';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-fg mb-2">Connect Your Wallet</h1>
        <p className="text-text-secondary mb-6">
          Connect your wallet to view and manage your creator profile.
        </p>
        <button className="px-6 py-3 bg-accent text-bg font-bold rounded-lg hover:bg-accent-hover transition-colors">
          Connect Wallet
        </button>
      </div>
    );
  }

  return <CreatorProfile address={address} />;
}

