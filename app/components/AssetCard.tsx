'use client';

import { useState } from 'react';
import { Play, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface Asset {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  price: string;
  creator: string;
  isTokenized: boolean;
  assetType: 'image' | 'video' | 'audio';
}

interface AssetCardProps {
  asset: Asset;
  variant?: 'marketplace' | 'profile';
  onPurchase?: (assetId: string) => void;
  onView?: (assetId: string) => void;
}

export function AssetCard({ 
  asset, 
  variant = 'marketplace', 
  onPurchase, 
  onView 
}: AssetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!onPurchase) return;
    setIsLoading(true);
    try {
      await onPurchase(asset.id);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetIcon = () => {
    switch (asset.assetType) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'audio':
        return <Play className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="asset-card group">
      {/* Thumbnail */}
      <div className="relative aspect-video mb-4 overflow-hidden neon-border">
        <img
          src={asset.thumbnailUrl || '/placeholder-video.jpg'}
          alt={asset.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onView?.(asset.id)}
            className="cyber-button text-sm px-4 py-2"
          >
            {getAssetIcon()}
            <span className="ml-2">Preview</span>
          </button>
        </div>

        {/* Asset Type Badge */}
        <div className="absolute top-2 left-2 bg-accent text-bg px-2 py-1 text-xs font-bold uppercase">
          {asset.assetType}
        </div>

        {/* Tokenized Badge */}
        {asset.isTokenized && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs font-bold uppercase">
            NFT
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-fg text-lg truncate">{asset.name}</h3>
          <p className="text-text-secondary text-sm line-clamp-2">{asset.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">by {asset.creator}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1 rounded transition-colors duration-200 ${
                isLiked ? 'text-red-400' : 'text-text-secondary hover:text-accent'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-accent border-opacity-30">
          <div className="text-accent font-bold text-lg">
            {asset.price} ETH
          </div>
          
          {variant === 'marketplace' && (
            <Button
              size="sm"
              onClick={handlePurchase}
              loading={isLoading}
              className="text-xs"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Buy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
