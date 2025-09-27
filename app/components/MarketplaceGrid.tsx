'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { AssetCard } from './AssetCard';
import { Input } from './Input';
import { Button } from './Button';

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

export function MarketplaceGrid() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAssets: Asset[] = [
      {
        id: '1',
        name: 'Cyberpunk City Loop',
        description: 'High-quality cyberpunk cityscape with neon lights and rain effects',
        thumbnailUrl: '/assets/cyberpunk-city.jpg',
        price: '0.05',
        creator: 'NeonArtist',
        isTokenized: true,
        assetType: 'video'
      },
      {
        id: '2',
        name: 'Synthwave Beats',
        description: 'Retro synthwave music track perfect for gaming videos',
        thumbnailUrl: '/assets/synthwave.jpg',
        price: '0.02',
        creator: 'SynthMaster',
        isTokenized: true,
        assetType: 'audio'
      },
      {
        id: '3',
        name: 'Holographic UI Elements',
        description: 'Futuristic UI elements and transitions for sci-fi content',
        thumbnailUrl: '/assets/holographic-ui.jpg',
        price: '0.03',
        creator: 'UIForge',
        isTokenized: false,
        assetType: 'image'
      },
      {
        id: '4',
        name: 'Neon Particle Effects',
        description: 'Animated particle effects with customizable colors',
        thumbnailUrl: '/assets/particles.jpg',
        price: '0.04',
        creator: 'EffectsMaster',
        isTokenized: true,
        assetType: 'video'
      }
    ];

    setTimeout(() => {
      setAssets(mockAssets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || asset.assetType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handlePurchase = async (assetId: string) => {
    // Implement purchase logic
    console.log('Purchasing asset:', assetId);
  };

  const handleView = (assetId: string) => {
    // Implement view logic
    console.log('Viewing asset:', assetId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card p-4">
                <div className="aspect-video bg-surface rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface rounded w-3/4"></div>
                  <div className="h-3 bg-surface rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-fg">Marketplace</h2>
        </div>
        
        <div className="text-text-secondary">
          {filteredAssets.length} assets found
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="withIcon"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-accent" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="cyber-input"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            variant="marketplace"
            onPurchase={handlePurchase}
            onView={handleView}
          />
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-secondary mb-4">No assets found</div>
          <Button variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
