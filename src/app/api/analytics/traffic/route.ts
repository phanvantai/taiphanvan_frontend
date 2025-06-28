import { NextResponse } from 'next/server';

// TODO: Replace with real Google Analytics API integration
export async function GET() {
    // Simulated data for traffic sources
    return NextResponse.json([
        { source: 'Google', medium: 'organic', sessions: 2000, percentage: 60 },
        { source: 'Twitter', medium: 'social', sessions: 800, percentage: 24 },
        { source: 'Direct', medium: 'none', sessions: 500, percentage: 16 }
    ]);
}
