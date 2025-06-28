import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

/**
 * Google Analytics Data API v1beta client
 * This requires a service account and proper credentials setup.
 */
const analyticsData = google.analyticsdata('v1beta');

export async function getAnalyticsOverview({
    propertyId,
    startDate,
    endDate
}: {
    propertyId: string;
    startDate: string;
    endDate: string;
}) {
    // Authenticate using GOOGLE_APPLICATION_CREDENTIALS env var
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });
    const authClient = await auth.getClient();

    // Query the Analytics Data API
    const [current, previous] = await Promise.all([
        analyticsData.properties.runReport({
            property: `properties/${propertyId}`,
            auth: authClient as OAuth2Client,
            requestBody: {
                dateRanges: [{ startDate, endDate }],
                metrics: [
                    { name: 'screenPageViews' },
                    { name: 'totalUsers' },
                    { name: 'sessions' },
                    { name: 'bounceRate' },
                    { name: 'averageSessionDuration' }
                ]
            }
        }),
        analyticsData.properties.runReport({
            property: `properties/${propertyId}`,
            auth: authClient as OAuth2Client,
            requestBody: {
                dateRanges: [{
                    startDate: getPreviousPeriod(startDate, endDate).startDate,
                    endDate: getPreviousPeriod(startDate, endDate).endDate
                }],
                metrics: [
                    { name: 'screenPageViews' },
                    { name: 'totalUsers' },
                    { name: 'sessions' }
                ]
            }
        })
    ]);

    function isMetricRow(row: unknown): row is { metricValues: { value: string }[] } {
        return typeof row === 'object' && row !== null && 'metricValues' in row;
    }
    const getMetric = (row: unknown, idx: number) =>
        isMetricRow(row) ? Number(row.metricValues?.[idx]?.value || 0) : 0;
    const currentRow = current.data.rows?.[0];
    const previousRow = previous.data.rows?.[0];

    return {
        pageViews: getMetric(currentRow, 0),
        uniqueUsers: getMetric(currentRow, 1),
        sessions: getMetric(currentRow, 2),
        bounceRate: getMetric(currentRow, 3),
        avgSessionDuration: getMetric(currentRow, 4),
        previousPeriodComparison: {
            pageViews: getMetric(previousRow, 0),
            uniqueUsers: getMetric(previousRow, 1),
            sessions: getMetric(previousRow, 2)
        }
    };
}

function getPreviousPeriod(start: string, end: string) {
    // Assumes YYYY-MM-DD format
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const prevEnd = new Date(startDate.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - diff);
    const toStr = (d: Date) => d.toISOString().split('T')[0];
    return { startDate: toStr(prevStart), endDate: toStr(prevEnd) };
}
