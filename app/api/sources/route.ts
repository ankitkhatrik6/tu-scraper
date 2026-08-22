import { NextResponse } from 'next/server';
import { SOURCES, SOURCE_METADATA } from '@/src/index';

export async function GET() {
  return NextResponse.json({
    sources: SOURCES,
    metadata: SOURCE_METADATA,
  });
}
