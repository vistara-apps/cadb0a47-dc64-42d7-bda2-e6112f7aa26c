'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { AssetCard } from '@/components/AssetCard';
import { PurchaseModal } from '@/components/PurchaseModal';

interface Asset {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  price: string;
  creator: string;
  assetType: 'image' | 'video' | 'audio';
  isTokenized: boolean;
}

export default function MarketplacePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAssets: Asset[] = [
      {
        id: 'asset_1',
        name: 'Neon Cityscape',
        description: 'A vibrant cyberpunk city at night with neon lights and flying cars',
        thumbnailUrl: '/assets/neon-city.jpg',
        price: '0.05',
        creator: 'CyberArtist',
        assetType: 'image',
        isTokenized: true,
      },
      {
        id: 'asset_2',
        name: 'Synthwave Track',
        description: 'Retro synthwave music perfect for gaming and cyberpunk aesthetics',
        thumbnailUrl: '/assets/synthwave.jpg',
        price: '0.03',
        creator: 'SynthMaster',
        assetType: 'audio',
        isTokenized: true,
      },
      {
        id: 'asset_3',
        name: 'AI Generated Video',
        description: 'Short video clip of futuristic technology and AI interactions',
        thumbnailUrl: '/assets/ai-video.jpg',
        price: '0.08',
        creator: 'FutureVision',
        assetType: 'video',
        isTokenized: true,
      },
      {
        id: 'asset_4',
        name: 'Abstract Digital Art',
        description: 'Algorithmic art piece with fractal patterns and vibrant colors',
        thumbnailUrl: '/assets/abstract.jpg',
        price: '0.04',
        creator: 'DigitalDreamer',
        assetType: 'image',
        isTokenized: true,
      },
    ];

    setAssets(mockAssets);
    setFilteredAssets(mockAssets);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = assets;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by asset type
    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.assetType === selectedType);
    }

    setFilteredAssets(filtered);
  }, [assets, searchQuery, selectedType]);

  const handlePurchase = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsPurchaseModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    // Refresh assets or update UI
    console.log('Purchase successful');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-12 bg-surface rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-surface rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-fg mb-4">PixelForge Marketplace</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Discover and purchase unique AI-generated assets, templates, and media from creators worldwide.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search assets, creators, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Types' },
              { key: 'image', label: 'Images' },
              { key: 'video', label: 'Videos' },
              { key: 'audio', label: 'Audio' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={selectedType === key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(key as any)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex border border-accent border-opacity-30 rounded">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex justify-between items-center">
        <p className="text-text-secondary">
          {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length > 0 ? (
        <div className={`
          grid gap-6
          ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
          }
        `}>
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              variant="marketplace"
              onPurchase={() => handlePurchase(asset)}
              onView={(id) => console.log('View asset:', id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-fg mb-2">No Assets Found</h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Purchase Modal */}
      {selectedAsset && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          asset={selectedAsset}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}

