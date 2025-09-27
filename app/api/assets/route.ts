import { NextRequest, NextResponse } from 'next/server';
import { assetDB, type Asset } from '@/lib/database';
import { authService } from '@/lib/auth';
import { uploadToStorage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const assetType = searchParams.get('assetType');

    let assets: Asset[];

    if (creatorId) {
      assets = assetDB.getByCreator(creatorId);
    } else {
      assets = Object.values(assetDB.getAll());
    }

    // Filter by asset type if specified
    if (assetType) {
      assets = assets.filter(asset => asset.assetType === assetType);
    }

    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const assetType = formData.get('assetType') as 'image' | 'video' | 'audio';
    const royaltyPercentage = parseInt(formData.get('royaltyPercentage') as string) || 500; // Default 5%
    const file = formData.get('file') as File;

    if (!name || !description || !assetType || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate royalty percentage
    if (royaltyPercentage < 0 || royaltyPercentage > 10000) {
      return NextResponse.json({ error: 'Invalid royalty percentage' }, { status: 400 });
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to IPFS
    const storageResult = await uploadToStorage(fileBuffer, 'ipfs');

    // Create thumbnail URL (mock for now)
    const thumbnailUrl = assetType === 'image' ? storageResult.url : `/thumbnails/${assetType}.jpg`;

    // Create asset in database
    const asset = assetDB.create({
      creatorId: currentUser.id,
      name,
      description,
      fileUrl: storageResult.url,
      thumbnailUrl,
      assetType,
      isTokenized: false, // Will be tokenized separately
      royaltyPercentage,
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

