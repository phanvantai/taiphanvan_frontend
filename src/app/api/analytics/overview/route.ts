import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsOverview } from '@/lib/analytics/google-analytics-server';

// Set your GA4 property ID in an environment variable
const GA4_PROPERTY_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!GA4_PROPERTY_ID || !startDate || !endDate) {
        return NextResponse.json({ error: 'Missing GA4 property ID or date range' }, { status: 400 });
    }

    try {
        const data = await getAnalyticsOverview({
            propertyId: GA4_PROPERTY_ID,
            startDate,
            endDate
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch analytics data', details: (error as Error).message }, { status: 500 });
    }
}
