export const APP_CONFIG = {
  name: 'PixelForge',
  tagline: 'Forge stunning videos with AI and own your media on the blockchain',
  version: '1.0.0',
} as const;

export const BLOCKCHAIN_CONFIG = {
  chainId: 8453, // Base mainnet
  chainName: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
} as const;

export const VIDEO_GENERATION_CONFIG = {
  maxDuration: 60, // seconds
  minDuration: 5,   // seconds
  maxPromptLength: 500,
  supportedFormats: ['mp4', 'webm'],
  maxFileSize: 100 * 1024 * 1024, // 100MB
} as const;

export const ASSET_CONFIG = {
  supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  supportedVideoFormats: ['mp4', 'webm', 'mov'],
  supportedAudioFormats: ['mp3', 'wav', 'ogg'],
  maxFileSize: 50 * 1024 * 1024, // 50MB
} as const;

export const MARKETPLACE_CONFIG = {
  minPrice: '0.001', // ETH
  maxPrice: '1000',  // ETH
  defaultRoyalty: 5, // 5%
  maxRoyalty: 20,    // 20%
} as const;

export const TEMPLATES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Dark futuristic theme with neon accents',
    category: 'sci-fi',
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    description: 'Urban nightscape with vibrant neon lighting',
    category: 'urban',
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    description: 'Abstract digital art style with glitch effects',
    category: 'abstract',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Gaming-focused template with HUD elements',
    category: 'gaming',
  },
] as const;
