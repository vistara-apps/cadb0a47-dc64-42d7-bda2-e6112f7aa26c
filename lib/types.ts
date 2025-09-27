export interface User {
  userId: string;
  walletAddress: string;
  username: string;
  profilePicUrl?: string;
  bio?: string;
  createdAt: Date;
}

export interface Asset {
  assetId: string;
  creatorId: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
  assetType: 'image' | 'video' | 'audio';
  isTokenized: boolean;
  tokenId?: string;
  tokenContractAddress?: string;
  price: string;
  royaltyPercentage: number;
  createdAt: Date;
}

export interface Video {
  videoId: string;
  userId: string;
  templateId: string;
  prompt: string;
  generatedFileUrl?: string;
  thumbnailUrl?: string;
  status: 'generating' | 'complete' | 'failed';
  createdAt: Date;
  usedAssetIds: string[];
}

export interface Template {
  templateId: string;
  creatorId: string;
  name: string;
  description: string;
  previewUrl: string;
  layoutConfig: Record<string, any>;
  isTokenized: boolean;
  tokenId?: string;
  tokenContractAddress?: string;
  price: string;
  royaltyPercentage: number;
  createdAt: Date;
}

export interface Transaction {
  transactionId: string;
  assetId: string;
  buyerId: string;
  sellerId: string;
  amount: string;
  timestamp: Date;
  transactionType: 'sale' | 'mint' | 'royalty';
}

export interface VideoGenerationData {
  prompt: string;
  template: string;
  assets: string[];
  duration: number;
}
