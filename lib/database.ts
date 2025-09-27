// Simple file-based database for demo purposes
// In production, replace with PostgreSQL, MongoDB, or similar

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const ASSETS_FILE = path.join(DB_PATH, 'assets.json');
const VIDEOS_FILE = path.join(DB_PATH, 'videos.json');
const TRANSACTIONS_FILE = path.join(DB_PATH, 'transactions.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath: string, defaultData: any = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initializeFile(USERS_FILE, {});
initializeFile(ASSETS_FILE, {});
initializeFile(VIDEOS_FILE, {});
initializeFile(TRANSACTIONS_FILE, []);

export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  profilePicUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
  assetType: 'image' | 'video' | 'audio';
  isTokenized: boolean;
  tokenId?: string;
  tokenContractAddress?: string;
  price?: number;
  royaltyPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  userId: string;
  templateId?: string;
  prompt: string;
  generatedFileUrl?: string;
  thumbnailUrl?: string;
  status: 'pending' | 'generating' | 'complete' | 'failed';
  createdAt: string;
  updatedAt: string;
  usedAssetIds: string[];
}

export interface Transaction {
  id: string;
  assetId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  timestamp: string;
  transactionType: 'sale' | 'mint' | 'royalty';
  transactionHash?: string;
}

// Generic database operations
function readJSONFile<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {} as T;
  }
}

function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// User operations
export const userDB = {
  getAll: (): Record<string, User> => readJSONFile(USERS_FILE),
  getById: (id: string): User | null => {
    const users = readJSONFile<Record<string, User>>(USERS_FILE);
    return users[id] || null;
  },
  getByWallet: (walletAddress: string): User | null => {
    const users = readJSONFile<Record<string, User>>(USERS_FILE);
    return Object.values(users).find(user => user.walletAddress === walletAddress) || null;
  },
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = readJSONFile<Record<string, User>>(USERS_FILE);
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
    };

    users[id] = newUser;
    writeJSONFile(USERS_FILE, users);
    return newUser;
  },
  update: (id: string, updates: Partial<User>): User | null => {
    const users = readJSONFile<Record<string, User>>(USERS_FILE);
    if (!users[id]) return null;

    users[id] = {
      ...users[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeJSONFile(USERS_FILE, users);
    return users[id];
  },
};

// Asset operations
export const assetDB = {
  getAll: (): Record<string, Asset> => readJSONFile(ASSETS_FILE),
  getById: (id: string): Asset | null => {
    const assets = readJSONFile<Record<string, Asset>>(ASSETS_FILE);
    return assets[id] || null;
  },
  getByCreator: (creatorId: string): Asset[] => {
    const assets = readJSONFile<Record<string, Asset>>(ASSETS_FILE);
    return Object.values(assets).filter(asset => asset.creatorId === creatorId);
  },
  create: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Asset => {
    const assets = readJSONFile<Record<string, Asset>>(ASSETS_FILE);
    const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newAsset: Asset = {
      ...asset,
      id,
      createdAt: now,
      updatedAt: now,
    };

    assets[id] = newAsset;
    writeJSONFile(ASSETS_FILE, assets);
    return newAsset;
  },
  update: (id: string, updates: Partial<Asset>): Asset | null => {
    const assets = readJSONFile<Record<string, Asset>>(ASSETS_FILE);
    if (!assets[id]) return null;

    assets[id] = {
      ...assets[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeJSONFile(ASSETS_FILE, assets);
    return assets[id];
  },
};

// Video operations
export const videoDB = {
  getAll: (): Record<string, Video> => readJSONFile(VIDEOS_FILE),
  getById: (id: string): Video | null => {
    const videos = readJSONFile<Record<string, Video>>(VIDEOS_FILE);
    return videos[id] || null;
  },
  getByUser: (userId: string): Video[] => {
    const videos = readJSONFile<Record<string, Video>>(VIDEOS_FILE);
    return Object.values(videos).filter(video => video.userId === userId);
  },
  create: (video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Video => {
    const videos = readJSONFile<Record<string, Video>>(VIDEOS_FILE);
    const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newVideo: Video = {
      ...video,
      id,
      createdAt: now,
      updatedAt: now,
    };

    videos[id] = newVideo;
    writeJSONFile(VIDEOS_FILE, videos);
    return newVideo;
  },
  update: (id: string, updates: Partial<Video>): Video | null => {
    const videos = readJSONFile<Record<string, Video>>(VIDEOS_FILE);
    if (!videos[id]) return null;

    videos[id] = {
      ...videos[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeJSONFile(VIDEOS_FILE, videos);
    return videos[id];
  },
};

// Transaction operations
export const transactionDB = {
  getAll: (): Transaction[] => readJSONFile(TRANSACTIONS_FILE),
  getById: (id: string): Transaction | null => {
    const transactions = readJSONFile<Transaction[]>(TRANSACTIONS_FILE);
    return transactions.find(tx => tx.id === id) || null;
  },
  getByAsset: (assetId: string): Transaction[] => {
    const transactions = readJSONFile<Transaction[]>(TRANSACTIONS_FILE);
    return transactions.filter(tx => tx.assetId === assetId);
  },
  getByUser: (userId: string): Transaction[] => {
    const transactions = readJSONFile<Transaction[]>(TRANSACTIONS_FILE);
    return transactions.filter(tx => tx.buyerId === userId || tx.sellerId === userId);
  },
  create: (transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
    const transactions = readJSONFile<Transaction[]>(TRANSACTIONS_FILE);
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newTransaction: Transaction = {
      ...transaction,
      id,
      timestamp: now,
    };

    transactions.push(newTransaction);
    writeJSONFile(TRANSACTIONS_FILE, transactions);
    return newTransaction;
  },
};

