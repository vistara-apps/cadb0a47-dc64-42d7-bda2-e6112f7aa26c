'use client';

import { useState } from 'react';
import { Zap, Video, ShoppingBag, Users, TrendingUp, Sparkles } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { CreateVideoForm } from './components/CreateVideoForm';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { Modal } from './components/Modal';

interface VideoGenerationData {
  prompt: string;
  template: string;
  assets: string[];
  duration: number;
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<'home' | 'create' | 'marketplace' | 'profile'>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleVideoGeneration = async (data: VideoGenerationData) => {
    console.log('Generating video with data:', data);
    // Implement video generation logic
    // This would typically call an AI video generation API
    
    // Mock generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsCreateModalOpen(false);
    // Show success message or redirect to generated video
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'create':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-glow mb-4">Create Your Video</h1>
              <p className="text-text-secondary text-lg">Transform your ideas into stunning videos with AI</p>
            </div>
            <CreateVideoForm onGenerate={handleVideoGeneration} />
          </div>
        );
      
      case 'marketplace':
        return <MarketplaceGrid />;
      
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-glow mb-4">Your Profile</h1>
              <p className="text-text-secondary text-lg">Manage your creations and assets</p>
            </div>
            {/* Profile content would go here */}
            <Card>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-fg mb-2">Profile Coming Soon</h3>
                <p className="text-text-secondary">Connect your wallet to access your profile</p>
              </div>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Zap className="w-16 h-16 text-accent animate-pulse" />
                <h1 className="text-6xl font-bold text-glow">PixelForge</h1>
              </div>
              
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Forge stunning videos with AI and own your media on the blockchain. 
                Create, tokenize, and monetize your digital assets in the decentralized future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-8"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Create Video
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setActiveSection('marketplace')}
                  className="px-8"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explore Marketplace
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card variant="elevated" className="text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">1,234</div>
                  <div className="text-text-secondary">Videos Created</div>
                </div>
              </Card>
              
              <Card variant="elevated" className="text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">567</div>
                  <div className="text-text-secondary">NFTs Minted</div>
                </div>
              </Card>
              
              <Card variant="elevated" className="text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">89</div>
                  <div className="text-text-secondary">Active Creators</div>
                </div>
              </Card>
              
              <Card variant="elevated" className="text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-accent">12.5 ETH</div>
                  <div className="text-text-secondary">Total Volume</div>
                </div>
              </Card>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="elevated" className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-accent rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-fg">AI Video Generation</h3>
                <p className="text-text-secondary">
                  Create professional videos from text prompts using cutting-edge AI technology
                </p>
              </Card>
              
              <Card variant="elevated" className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-accent rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-fg">NFT Marketplace</h3>
                <p className="text-text-secondary">
                  Buy, sell, and trade tokenized video assets with transparent blockchain ownership
                </p>
              </Card>
              
              <Card variant="elevated" className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-accent rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-fg">Creator Royalties</h3>
                <p className="text-text-secondary">
                  Earn ongoing royalties from your creations with smart contract automation
                </p>
              </Card>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-4">
              <Button 
                variant="secondary"
                onClick={() => setActiveSection('create')}
              >
                Start Creating
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveSection('marketplace')}
              >
                Browse Assets
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <AppShell variant="glass">
      {/* Navigation */}
      <div className="mb-8">
        <nav className="flex justify-center space-x-1 glass-card p-2 max-w-md mx-auto">
          {[
            { key: 'home', label: 'Home', icon: Zap },
            { key: 'create', label: 'Create', icon: Video },
            { key: 'marketplace', label: 'Market', icon: ShoppingBag },
            { key: 'profile', label: 'Profile', icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as any)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded transition-all duration-200
                ${activeSection === key 
                  ? 'bg-accent text-bg font-bold' 
                  : 'text-text-secondary hover:text-accent hover:bg-accent hover:bg-opacity-20'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {renderContent()}

      {/* Create Video Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Video"
      >
        <CreateVideoForm onGenerate={handleVideoGeneration} />
      </Modal>
    </AppShell>
  );
}
