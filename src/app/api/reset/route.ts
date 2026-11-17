import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await resetDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to reset database:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
