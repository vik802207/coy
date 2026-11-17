import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/db';
import { SwipeDirection } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, direction } = body as { profileId?: string; direction?: SwipeDirection };

    if (!profileId || typeof profileId !== 'string') {
      return NextResponse.json(
        { success: false, matched: false, error: 'Valid profileId is required' },
        { status: 400 }
      );
    }

    if (!direction || (direction !== 'like' && direction !== 'pass')) {
      return NextResponse.json(
        { success: false, matched: false, error: 'Direction must be "like" or "pass"' },
        { status: 400 }
      );
    }

    const result = await recordSwipe(profileId, direction);

    if (!result.success) {
      const status = result.error === 'Profile not found' ? 404 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to record swipe:', error);
    return NextResponse.json(
      { success: false, matched: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
