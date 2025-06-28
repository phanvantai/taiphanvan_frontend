"use client";

import { useEffect, useState } from "react";
import { AnalyticsCard, VisitorChart, PopularPosts, TrafficSources, RealTimeUsers } from './components';
import { fetchAnalyticsOverview, fetchPopularPosts, fetchTrafficSources, fetchRealTimeData, getDateRanges, formatAnalyticsNumber, calculatePercentageChange } from '@/lib/analytics/dashboard-api';
import type { AnalyticsOverview, PopularPost, TrafficSource, RealTimeData } from '@/lib/analytics/dashboard-api';

export default function AnalyticsPage() {
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [overviewError, setOverviewError] = useState("");
    const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState("");
    const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
    const [trafficLoading, setTrafficLoading] = useState(true);
    const [trafficError, setTrafficError] = useState("");
    const [realTime, setRealTime] = useState<RealTimeData | null>(null);
    const [realTimeLoading, setRealTimeLoading] = useState(true);
    const [realTimeError, setRealTimeError] = useState("");
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    // Date range helpers
    const dateRanges = getDateRanges();

    // Fetch all data
    useEffect(() => {
        const getRange = () => {
            if (timeRange === '7d') return dateRanges.last7Days;
            if (timeRange === '90d') return dateRanges.last90Days;
            return dateRanges.last30Days;
        };
        setOverviewLoading(true);
        setOverviewError("");
        fetchAnalyticsOverview(getRange())
            .then(setOverview)
            .catch(e => setOverviewError(e.message))
            .finally(() => setOverviewLoading(false));

        setPostsLoading(true);
        setPostsError("");
        fetchPopularPosts(getRange(), 10)
            .then(setPopularPosts)
            .catch(e => setPostsError(e.message))
            .finally(() => setPostsLoading(false));

        setTrafficLoading(true);
        setTrafficError("");
        fetchTrafficSources(getRange())
            .then(setTrafficSources)
            .catch(e => setTrafficError(e.message))
            .finally(() => setTrafficLoading(false));
    }, [timeRange, dateRanges.last7Days, dateRanges.last30Days, dateRanges.last90Days]);

    useEffect(() => {
        setRealTimeLoading(true);
        setRealTimeError("");
        fetchRealTimeData()
            .then(setRealTime)
            .catch(e => setRealTimeError(e.message))
            .finally(() => setRealTimeLoading(false));
    }, []);

    // Overview metrics config
    const overviewCards = overview ? [
        {
            title: "Page Views",
            value: formatAnalyticsNumber(overview.pageViews),
            previousValue: formatAnalyticsNumber(overview.previousPeriodComparison.pageViews),
            trend: overview.pageViews > overview.previousPeriodComparison.pageViews ? 'up' : overview.pageViews < overview.previousPeriodComparison.pageViews ? 'down' : 'neutral' as const,
            trendPercentage: calculatePercentageChange(overview.pageViews, overview.previousPeriodComparison.pageViews),
            icon: "👁️"
        },
        {
            title: "Users",
            value: formatAnalyticsNumber(overview.uniqueUsers),
            previousValue: formatAnalyticsNumber(overview.previousPeriodComparison.uniqueUsers),
            trend: overview.uniqueUsers > overview.previousPeriodComparison.uniqueUsers ? 'up' : overview.uniqueUsers < overview.previousPeriodComparison.uniqueUsers ? 'down' : 'neutral' as const,
            trendPercentage: calculatePercentageChange(overview.uniqueUsers, overview.previousPeriodComparison.uniqueUsers),
            icon: "🧑‍🤝‍🧑"
        },
        {
            title: "Sessions",
            value: formatAnalyticsNumber(overview.sessions),
            previousValue: formatAnalyticsNumber(overview.previousPeriodComparison.sessions),
            trend: overview.sessions > overview.previousPeriodComparison.sessions ? 'up' : overview.sessions < overview.previousPeriodComparison.sessions ? 'down' : 'neutral' as const,
            trendPercentage: calculatePercentageChange(overview.sessions, overview.previousPeriodComparison.sessions),
            icon: "💻"
        },
        {
            title: "Bounce Rate",
            value: overview.bounceRate.toFixed(1) + '%',
            icon: "🏃",
            description: "Lower is better"
        },
        {
            title: "Avg. Session Duration",
            value: (overview.avgSessionDuration / 60).toFixed(2) + ' min',
            icon: "⏱️"
        }
    ] : [];

    return (
        <div className="dashboard">
            {/* Optionally add DashboardHeader and DashboardNavigation here if needed */}
            <div className="dashboard-content">
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Analytics</h2>
                        <p>View blog performance metrics</p>
                    </div>
                    {/* Overview Cards */}
                    <div className="overview-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {overviewCards.map(card => (
                            <AnalyticsCard
                                key={card.title}
                                {...card}
                                isLoading={overviewLoading}
                                error={overviewError}
                                trend={card.trend as 'up' | 'down' | 'neutral'}
                            />
                        ))}
                    </div>
                    {/* Time Range Selector */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label htmlFor="time-range">Date Range:</label>
                        <select id="time-range" value={timeRange} onChange={e => setTimeRange(e.target.value as '7d' | '30d' | '90d')}>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                    </div>
                    {/* Charts and Lists */}
                    <div className="dashboard-widgets" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <VisitorChart timeRange={timeRange} onTimeRangeChange={setTimeRange} isLoading={overviewLoading} />
                        <RealTimeUsers data={realTime || undefined} isLoading={realTimeLoading} error={realTimeError} />
                    </div>
                    <div className="dashboard-widgets" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <PopularPosts posts={popularPosts} isLoading={postsLoading} error={postsError} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                        <TrafficSources sources={trafficSources} isLoading={trafficLoading} error={trafficError} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
                    </div>
                </div>
            </div>
        </div>
    );
}