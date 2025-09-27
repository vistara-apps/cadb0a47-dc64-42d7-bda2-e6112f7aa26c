import { uploadToIPFS, getIPFSUrl, fetchFromIPFS } from './ipfs';
import { uploadToArweave, getArweaveUrl, fetchFromArweave } from './arweave';

export type StorageType = 'ipfs' | 'arweave';

export interface StorageResult {
  cid: string;
  url: string;
  type: StorageType;
}

export async function uploadToStorage(
  data: string | Buffer | Uint8Array,
  type: StorageType = 'ipfs'
): Promise<StorageResult> {
  try {
    let cid: string;
    let url: string;

    if (type === 'arweave') {
      cid = await uploadToArweave(data);
      url = getArweaveUrl(cid);
    } else {
      cid = await uploadToIPFS(data);
      url = getIPFSUrl(cid);
    }

    return {
      cid,
      url,
      type,
    };
  } catch (error) {
    console.error(`Failed to upload to ${type}:`, error);
    throw new Error(`Failed to upload to ${type}`);
  }
}

export async function uploadJSONToStorage(
  jsonData: any,
  type: StorageType = 'ipfs'
): Promise<StorageResult> {
  const jsonString = JSON.stringify(jsonData);
  const buffer = Buffer.from(jsonString, 'utf8');
  return uploadToStorage(buffer, type);
}

export async function fetchFromStorage(cid: string, type: StorageType = 'ipfs'): Promise<any> {
  try {
    if (type === 'arweave') {
      return await fetchFromArweave(cid);
    } else {
      return await fetchFromIPFS(cid);
    }
  } catch (error) {
    console.error(`Failed to fetch from ${type}:`, error);
    throw error;
  }
}

export function getStorageUrl(cid: string, type: StorageType = 'ipfs'): string {
  if (type === 'arweave') {
    return getArweaveUrl(cid);
  } else {
    return getIPFSUrl(cid);
  }
}

// Utility function to determine storage type from URL
export function getStorageTypeFromUrl(url: string): StorageType {
  if (url.includes('arweave.net')) {
    return 'arweave';
  }
  return 'ipfs';
}

// Extract CID from storage URL
export function extractCIDFromUrl(url: string): string {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

