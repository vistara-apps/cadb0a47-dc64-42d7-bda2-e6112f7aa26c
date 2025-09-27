import { create } from 'ipfs-http-client';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
const IPFS_API_URL = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001/api/v0';

let ipfs: any = null;

export function getIPFSClient() {
  if (!ipfs && typeof window === 'undefined') {
    // Only initialize on server side
    try {
      ipfs = create({ url: IPFS_API_URL });
    } catch (error) {
      console.warn('Failed to initialize IPFS client:', error);
    }
  }
  return ipfs;
}

export async function uploadToIPFS(data: string | Buffer | Uint8Array): Promise<string> {
  const client = getIPFSClient();
  if (!client) {
    throw new Error('IPFS client not available');
  }

  try {
    const result = await client.add(data);
    return result.cid.toString();
  } catch (error) {
    console.error('Failed to upload to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export async function uploadJSONToIPFS(jsonData: any): Promise<string> {
  const jsonString = JSON.stringify(jsonData);
  const buffer = Buffer.from(jsonString);
  return uploadToIPFS(buffer);
}

export function getIPFSUrl(cid: string): string {
  return `${IPFS_GATEWAY}${cid}`;
}

export async function fetchFromIPFS(cid: string): Promise<any> {
  try {
    const response = await fetch(getIPFSUrl(cid));
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from IPFS:', error);
    throw error;
  }
}

export async function pinToIPFS(cid: string): Promise<void> {
  const client = getIPFSClient();
  if (!client) {
    throw new Error('IPFS client not available');
  }

  try {
    await client.pin.add(cid);
  } catch (error) {
    console.error('Failed to pin to IPFS:', error);
    throw new Error('Failed to pin file to IPFS');
  }
}

