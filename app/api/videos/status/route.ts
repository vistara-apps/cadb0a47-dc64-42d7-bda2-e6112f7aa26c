import { NextRequest, NextResponse } from 'next/server';
import { videoDB } from '@/lib/database';
import { checkVideoGenerationStatus } from '@/lib/video-generation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const status = await checkVideoGenerationStatus(jobId);

    if (!status) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Update video record if completed
    if (status.status === 'completed' && status.videoUrl) {
      // Find video by job ID (this is a simplification - in real app you'd store jobId in video record)
      const videos = Object.values(videoDB.getAll());
      const video = videos.find(v => v.status === 'generating');

      if (video) {
        videoDB.update(video.id, {
          status: 'complete',
          generatedFileUrl: status.videoUrl,
          thumbnailUrl: status.thumbnailUrl,
        });
      }
    } else if (status.status === 'failed') {
      // Find and update failed video
      const videos = Object.values(videoDB.getAll());
      const video = videos.find(v => v.status === 'generating');

      if (video) {
        videoDB.update(video.id, {
          status: 'failed',
        });
      }
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking video status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

