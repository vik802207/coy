import { NextResponse } from 'next/server';
import { getFeedProfiles } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profiles = await getFeedProfiles();
    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error('Failed to get feed profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
