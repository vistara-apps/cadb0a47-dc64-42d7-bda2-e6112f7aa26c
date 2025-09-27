import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num < 0.001) {
    return `${(num * 1000000).toFixed(0)} μETH`;
  }
  if (num < 1) {
    return `${(num * 1000).toFixed(0)} mETH`;
  }
  return `${num.toFixed(3)} ETH`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

export function validateVideoPrompt(prompt: string): string | null {
  if (!prompt.trim()) {
    return 'Prompt is required';
  }
  
  if (prompt.length > 500) {
    return 'Prompt must be less than 500 characters';
  }
  
  // Check for inappropriate content (basic check)
  const inappropriateWords = ['explicit', 'nsfw', 'adult'];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const word of inappropriateWords) {
    if (lowerPrompt.includes(word)) {
      return 'Prompt contains inappropriate content';
    }
  }
  
  return null;
}

export function generateAssetId(): string {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateVideoId(): string {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function parseEthereumAmount(amount: string): number {
  try {
    return parseFloat(amount);
  } catch {
    return 0;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
