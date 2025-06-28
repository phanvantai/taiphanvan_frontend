import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with real Google Analytics API integration
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Simulated data for popular posts
    return NextResponse.json([
        { slug: 'post-1', title: 'First Post', views: 1200, engagement: 80 },
        { slug: 'post-2', title: 'Second Post', views: 900, engagement: 70 },
        { slug: 'post-3', title: 'Third Post', views: 800, engagement: 65 }
    ].slice(0, limit));
}
