"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardData, DashboardData } from '@/lib/api/dashboardService';
import DashboardHeader from '../components/DashboardHeader';
import DashboardNavigation from '../components/DashboardNavigation';
import LoadingState from '../components/LoadingState';
import StatsSection from '../components/StatsSection';
import RecentPostsSection from '../components/RecentPostsSection';

export default function OverviewPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        stats: [],
        recentPosts: []
    });

    // Use a ref to track if data has already been fetched
    const dataFetchedRef = useRef(false);

    // Use a ref to track if the component is mounted
    const isMountedRef = useRef(true);

    // Use a ref to store the fetch promise to prevent duplicate calls
    const fetchPromiseRef = useRef<Promise<void> | null>(null);

    // Use useCallback to memorize the fetch function
    const fetchDashboardData = useCallback(async () => {
        // Don't fetch if not mounted
        if (!isMountedRef.current) return;

        // Don't fetch if user is not authenticated
        if (!user) return;

        // If a fetch is already in progress, return that promise
        if (fetchPromiseRef.current) {
            return fetchPromiseRef.current;
        }

        // Set loading state only if we don't have data yet
        if (!dataFetchedRef.current) {
            setLoading(true);
        }

        setError(null);

        // Create the fetch promise
        fetchPromiseRef.current = (async () => {
            try {
                // Get dashboard data (this will use cache if available)
                const data = await getDashboardData();

                // Only update state if component is still mounted
                if (isMountedRef.current) {
                    setDashboardData(data);
                    setLoading(false);
                    dataFetchedRef.current = true;
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);

                // Only update state if component is still mounted
                if (isMountedRef.current) {
                    setError('Failed to load dashboard data. Please try again later.');
                    setLoading(false);
                }
            } finally {
                // Clear the promise ref
                fetchPromiseRef.current = null;
            }
        })();

        return fetchPromiseRef.current;
    }, [user]);

    useEffect(() => {
        // Set the mounted ref to true
        isMountedRef.current = true;

        // Only fetch data if we don't have it yet or if the user changes
        if (user && !dataFetchedRef.current) {
            fetchDashboardData();
        }

        // Cleanup function
        return () => {
            // Set the mounted ref to false to prevent state updates after unmount
            isMountedRef.current = false;
        };
    }, [user, fetchDashboardData]);

    return (
        <div className="dashboard">
            <DashboardHeader user={user} />
            <DashboardNavigation activeTab="overview" />
            {error && (
                <div className="error-state">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchDashboardData()}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            )}
            {loading ? (
                <LoadingState />
            ) : (
                <div className="dashboard-content">
                    <div className="tab-content">
                        <StatsSection stats={dashboardData.stats} />
                        <RecentPostsSection posts={dashboardData.recentPosts} />
                    </div>
                </div>
            )}
        </div>
    );
}