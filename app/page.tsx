'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, Video, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function HomePage() {
  const features = [
    {
      icon: Video,
      title: 'AI Video Generation',
      description: 'Create professional videos from text prompts using advanced AI technology.',
    },
    {
      icon: ShoppingCart,
      title: 'Decentralized Marketplace',
      description: 'Buy and sell tokenized media assets with true ownership on the blockchain.',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable provenance and smart contract enforcement for all transactions.',
    },
    {
      icon: Users,
      title: 'Creator Economy',
      description: 'Empower creators with fair royalties and direct monetization opportunities.',
    },
  ];

  const stats = [
    { label: 'Videos Generated', value: '10,000+' },
    { label: 'Active Creators', value: '2,500+' },
    { label: 'Total Volume', value: '500 ETH' },
    { label: 'Assets Tokenized', value: '50,000+' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-accent rounded-full flex items-center justify-center mx-auto mb-8">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-fg mb-6">
            Forge Stunning Videos with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-accent bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Transform your ideas into professional videos using cutting-edge AI technology.
            Own your media on the blockchain with true decentralized ownership.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">{stat.value}</div>
              <div className="text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-fg mb-4">Why Choose PixelForge?</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Experience the future of video creation with blockchain-powered ownership and AI-driven innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} variant="elevated" className="text-center">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-bg" />
                </div>
                <h3 className="text-lg font-bold text-fg mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-fg mb-4">How It Works</h2>
          <p className="text-xl text-text-secondary">
            Get started with PixelForge in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-bg">
              1
            </div>
            <h3 className="text-xl font-bold text-fg mb-4">Connect Your Wallet</h3>
            <p className="text-text-secondary">
              Link your crypto wallet to access the platform and manage your digital assets securely.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-bg">
              2
            </div>
            <h3 className="text-xl font-bold text-fg mb-4">Create or Buy</h3>
            <p className="text-text-secondary">
              Generate AI videos with custom prompts or purchase tokenized assets from the marketplace.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-bg">
              3
            </div>
            <h3 className="text-xl font-bold text-fg mb-4">Own & Monetize</h3>
            <p className="text-text-secondary">
              Tokenize your creations as NFTs and earn royalties from secondary sales on the blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <Card variant="elevated" className="text-center">
          <div className="max-w-2xl mx-auto">
            <TrendingUp className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-fg mb-4">Ready to Start Creating?</h2>
            <p className="text-xl text-text-secondary mb-8">
              Join thousands of creators already building the future of digital media.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="px-8 py-4">
                  Create Your First Video
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="px-8 py-4">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

