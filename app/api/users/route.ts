import { NextRequest, NextResponse } from 'next/server';
import { userDB, type User } from '@/lib/database';
import { authService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (walletAddress) {
      const user = userDB.getByWallet(walletAddress);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Return current authenticated user
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, username, profilePicUrl, bio } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Authenticate or create user
    const user = await authService.authenticateWithWallet(walletAddress);

    // Update profile if additional data provided
    if (username || profilePicUrl || bio) {
      await authService.updateProfile({
        username: username || user.username,
        profilePicUrl: profilePicUrl || user.profilePicUrl,
        bio: bio || user.bio,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { username, profilePicUrl, bio } = body;

    const updatedUser = await authService.updateProfile({
      username: username || currentUser.username,
      profilePicUrl: profilePicUrl || currentUser.profilePicUrl,
      bio: bio || currentUser.bio,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

