'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';

// Contract ABIs (simplified for demo)
const AssetNFTABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'assetType', type: 'string' },
      { name: 'ipfsHash', type: 'string' },
      { name: 'royaltyPercentage', type: 'uint256' }
    ],
    name: 'mintAsset',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getAsset',
    outputs: [
      {
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'assetType', type: 'string' },
          { name: 'ipfsHash', type: 'string' },
          { name: 'royaltyPercentage', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'isListed', type: 'bool' },
          { name: 'price', type: 'uint256' }
        ],
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const MarketplaceABI = [
  {
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'price', type: 'uint256' }
    ],
    name: 'listItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'buyItem',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];

// Contract addresses (these would be deployed contract addresses)
const CONTRACT_ADDRESSES = {
  AssetNFT: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
  Marketplace: '0x0000000000000000000000000000000000000000', // Replace with actual deployed address
};

export function useNFT() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract: mintAsset, isPending: isMinting } = useWriteContract();
  const { writeContract: listItem, isPending: isListing } = useWriteContract();
  const { writeContract: buyItem, isPending: isBuying } = useWriteContract();

  const mintNFT = useCallback(async (
    name: string,
    description: string,
    assetType: string,
    ipfsHash: string,
    royaltyPercentage: number
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await mintAsset({
        address: CONTRACT_ADDRESSES.AssetNFT as `0x${string}`,
        abi: AssetNFTABI,
        functionName: 'mintAsset',
        args: [name, description, assetType, ipfsHash, royaltyPercentage],
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Minting failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, mintAsset]);

  const listNFT = useCallback(async (
    nftContract: string,
    tokenId: number,
    price: string
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const priceInWei = parseEther(price);

      const result = await listItem({
        address: CONTRACT_ADDRESSES.Marketplace as `0x${string}`,
        abi: MarketplaceABI,
        functionName: 'listItem',
        args: [nftContract as `0x${string}`, tokenId, priceInWei],
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Listing failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, listItem]);

  const buyNFT = useCallback(async (
    nftContract: string,
    tokenId: number,
    price: string
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const priceInWei = parseEther(price);

      const result = await buyItem({
        address: CONTRACT_ADDRESSES.Marketplace as `0x${string}`,
        abi: MarketplaceABI,
        functionName: 'buyItem',
        args: [nftContract as `0x${string}`, tokenId],
        value: priceInWei,
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [address, buyItem]);

  return {
    mintNFT,
    listNFT,
    buyNFT,
    isLoading: isLoading || isMinting || isListing || isBuying,
    error,
  };
}

export function useAssetNFT(tokenId?: number) {
  const { data: asset, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.AssetNFT as `0x${string}`,
    abi: AssetNFTABI,
    functionName: 'getAsset',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });

  return {
    asset,
    isLoading,
  };
}

