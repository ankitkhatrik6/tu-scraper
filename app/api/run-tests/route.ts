import { NextResponse } from 'next/server';
import { runAllTests } from '@/tests/runner';

export async function POST() {
  const startTime = Date.now();
  try {
    const report = await runAllTests();
    return NextResponse.json({
      success: true,
      totalDurationMs: Date.now() - startTime,
      ...report,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
