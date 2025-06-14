/**
 * Dashboard Analytics API Client
 * Handles communication with Google Analytics Reporting API for dashboard data
 */

export interface AnalyticsOverview {
    pageViews: number;
    uniqueUsers: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    previousPeriodComparison: {
        pageViews: number;
        uniqueUsers: number;
        sessions: number;
    };
}

export interface PopularPost {
    slug: string;
    title: string;
    views: number;
    engagement: number;
}

export interface TrafficSource {
    source: string;
    medium: string;
    sessions: number;
    percentage: number;
}

export interface RealTimeData {
    activeUsers: number;
    activePages: Array<{
        page: string;
        users: number;
    }>;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

/**
 * Fetch analytics overview data
 */
export const fetchAnalyticsOverview = async (dateRange: DateRange): Promise<AnalyticsOverview> => {
    try {
        const response = await fetch(`/api/analytics/overview?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);

        if (!response.ok) {
            throw new Error(`Analytics API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching analytics overview:', error);
        throw error;
    }
};

/**
 * Fetch popular posts data
 */
export const fetchPopularPosts = async (dateRange: DateRange, limit = 10): Promise<PopularPost[]> => {
    try {
        const response = await fetch(`/api/analytics/posts?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Popular posts API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching popular posts:', error);
        throw error;
    }
};

/**
 * Fetch traffic sources data
 */
export const fetchTrafficSources = async (dateRange: DateRange): Promise<TrafficSource[]> => {
    try {
        const response = await fetch(`/api/analytics/traffic?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);

        if (!response.ok) {
            throw new Error(`Traffic sources API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching traffic sources:', error);
        throw error;
    }
};

/**
 * Fetch real-time analytics data
 */
export const fetchRealTimeData = async (): Promise<RealTimeData> => {
    try {
        const response = await fetch('/api/analytics/realtime');

        if (!response.ok) {
            throw new Error(`Real-time API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching real-time data:', error);
        throw error;
    }
};

/**
 * Utility function to get default date ranges
 */
export const getDateRanges = () => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return {
        last7Days: {
            startDate: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(today)
        },
        last30Days: {
            startDate: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(today)
        },
        last90Days: {
            startDate: formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(today)
        },
        thisMonth: {
            startDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
            endDate: formatDate(today)
        },
        lastMonth: {
            startDate: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
            endDate: formatDate(new Date(today.getFullYear(), today.getMonth(), 0))
        }
    };
};

/**
 * Format numbers for display
 */
export const formatAnalyticsNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};
