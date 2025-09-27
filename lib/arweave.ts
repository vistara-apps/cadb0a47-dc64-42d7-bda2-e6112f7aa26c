import Arweave from 'arweave';

const ARWEAVE_GATEWAY = 'https://arweave.net/';

let arweave: Arweave | null = null;

export function getArweaveClient(): Arweave {
  if (!arweave && typeof window === 'undefined') {
    // Only initialize on server side
    arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
  }

  if (!arweave) {
    throw new Error('Arweave client not available');
  }

  return arweave;
}

export async function uploadToArweave(
  data: string | Buffer | Uint8Array,
  key?: any
): Promise<string> {
  const client = getArweaveClient();

  try {
    let transaction;

    if (key) {
      // Use provided key for signing
      transaction = await client.createTransaction({ data }, key);
      await arweave!.transactions.sign(transaction, key);
    } else {
      // Create unsigned transaction (will need to be signed by user)
      transaction = await client.createTransaction({ data });
    }

    // For demo purposes, we'll use a mock transaction ID
    // In production, you'd need proper Arweave key management
    const mockTxId = `arweave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return mockTxId;
  } catch (error) {
    console.error('Failed to upload to Arweave:', error);
    throw new Error('Failed to upload file to Arweave');
  }
}

export async function uploadJSONToArweave(jsonData: any, key?: any): Promise<string> {
  const jsonString = JSON.stringify(jsonData);
  const data = Buffer.from(jsonString, 'utf8');
  return uploadToArweave(data, key);
}

export function getArweaveUrl(txId: string): string {
  return `${ARWEAVE_GATEWAY}${txId}`;
}

export async function fetchFromArweave(txId: string): Promise<any> {
  try {
    const url = getArweaveUrl(txId);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Arweave: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from Arweave:', error);
    throw error;
  }
}

// Mock function for demo - in production you'd need proper key management
export async function getArweaveKey(): Promise<any> {
  // This is a mock - in production you'd load from environment or wallet
  throw new Error('Arweave key management not implemented for demo');
}

