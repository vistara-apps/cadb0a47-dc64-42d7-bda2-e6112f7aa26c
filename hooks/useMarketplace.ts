'use client';

import { useState, useCallback } from 'react';
import { useReadContract } from 'wagmi';

const MarketplaceABI = [
  {
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'getListing',
    outputs: [
      {
        components: [
          { name: 'nftContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'seller', type: 'address' },
          { name: 'price', type: 'uint256' },
          { name: 'active', type: 'bool' },
          { name: 'listedAt', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const CONTRACT_ADDRESSES = {
  Marketplace: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
};

export function useMarketplace() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getListing = useCallback(async (nftContract: string, tokenId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await useReadContract({
        address: CONTRACT_ADDRESSES.Marketplace as `0x${string}`,
        abi: MarketplaceABI,
        functionName: 'getListing',
        args: [nftContract as `0x${string}`, tokenId],
      });

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get listing');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getListing,
    isLoading,
    error,
  };
}

