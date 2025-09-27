import { NextRequest, NextResponse } from 'next/server';
import { videoDB, type Video } from '@/lib/database';
import { authService } from '@/lib/auth';
import { startVideoGeneration, checkVideoGenerationStatus } from '@/lib/video-generation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const videoId = searchParams.get('id');

    if (videoId) {
      const video = videoDB.getById(videoId);
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json(video);
    }

    let videos: Video[];

    if (userId) {
      videos = videoDB.getByUser(userId);
    } else {
      videos = Object.values(videoDB.getAll());
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, templateId, duration, usedAssetIds } = body;

    if (!prompt || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create video record
    const video = videoDB.create({
      userId: currentUser.id,
      templateId,
      prompt,
      status: 'pending',
      usedAssetIds: usedAssetIds || [],
    });

    // Start video generation
    const generationResult = await startVideoGeneration({
      prompt,
      templateId,
      duration,
      assets: usedAssetIds || [],
      userId: currentUser.id,
    });

    // Update video with job ID
    videoDB.update(video.id, {
      status: 'generating',
    });

    return NextResponse.json({
      video,
      jobId: generationResult.jobId,
      estimatedTime: generationResult.estimatedTime,
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

