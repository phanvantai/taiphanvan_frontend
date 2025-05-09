/**
 * Dashboard API Service
 * 
 * This module provides methods for interacting with the dashboard API endpoints.
 * It uses the posts service for fetching post data.
 */

import { postsService } from './postsService';
import { BlogPost } from '@/models/BlogPost';

/**
 * Dashboard stats interface
 */
export interface DashboardStat {
    title: string;
    value: string | number;
    icon: 'file-text' | 'eye' | 'message-circle' | 'clock';
    color: string;
}

/**
 * Dashboard data interface
 */
export interface DashboardData {
    stats: DashboardStat[];
    recentPosts: BlogPost[];
}

/**
 * Dashboard API service class
 */
export class DashboardService {
    private postsService: typeof postsService;
    private cache: {
        dashboardData: DashboardData | null;
        timestamp: number;
    };
    private cacheLifetime = 60000; // Cache lifetime in milliseconds (1 minute)

    /**
     * Create a new DashboardService instance
     * @param postsServiceInstance Posts service instance
     */
    constructor(postsServiceInstance = postsService) {
        this.postsService = postsServiceInstance;
        this.cache = {
            dashboardData: null,
            timestamp: 0
        };
    }

    /**
     * Generate dashboard stats based on posts data
     * @param totalPosts Total number of posts
     * @returns Array of dashboard stats
     */
    private generateStats(totalPosts: number): DashboardStat[] {
        return [
            {
                title: 'Total Posts',
                value: totalPosts,
                icon: 'file-text',
                color: 'bg-indigo-50 text-indigo-500'
            },
            {
                title: 'Total Views',
                value: '5.2K',
                icon: 'eye',
                color: 'bg-blue-50 text-blue-500'
            },
            {
                title: 'Comments',
                value: 48,
                icon: 'message-circle',
                color: 'bg-green-50 text-green-500'
            },
            {
                title: 'Avg. Time on Page',
                value: '2m 35s',
                icon: 'clock',
                color: 'bg-amber-50 text-amber-500'
            }
        ];
    }

    /**
     * Add placeholder stats to posts
     * In a real app, these would come from the API
     * @param posts Array of blog posts
     * @returns Posts with added stats
     */
    private addPlaceholderStats(posts: BlogPost[]): BlogPost[] {
        return posts.map(post => ({
            ...post,
            views: Math.floor(Math.random() * 1000) + 100, // Random placeholder
            comments: Math.floor(Math.random() * 20) // Random placeholder
        }));
    }

    /**
     * Check if the cache is valid
     * @returns True if cache is valid, false otherwise
     */
    private isCacheValid(): boolean {
        return (
            this.cache.dashboardData !== null &&
            Date.now() - this.cache.timestamp < this.cacheLifetime
        );
    }

    // Track if a request is in progress to prevent duplicate calls
    private requestInProgress: boolean = false;
    private requestPromise: Promise<DashboardData> | null = null;

    /**
     * Fetch all dashboard data
     * This method aggregates multiple API calls needed for the dashboard
     * @param forceRefresh Force refresh the data even if cache is valid
     * @returns Promise with dashboard data
     */
    async getDashboardData(forceRefresh = false): Promise<DashboardData> {
        // Return cached data if available and not forcing refresh
        if (!forceRefresh && this.isCacheValid()) {
            console.log('Using cached dashboard data');
            return this.cache.dashboardData!;
        }

        // If there's already a request in progress, return that promise
        // This prevents multiple simultaneous API calls
        if (this.requestInProgress && this.requestPromise) {
            console.log('Request already in progress, returning existing promise');
            return this.requestPromise;
        }

        // Set flag to indicate a request is in progress
        this.requestInProgress = true;

        // Create the promise for this request
        this.requestPromise = (async () => {
            try {
                console.log('Fetching fresh dashboard data');

                // If we have cached data but it's expired, use it as fallback
                // in case the API request fails
                const fallbackData = this.cache.dashboardData;

                try {
                    // 1. Fetch recent posts
                    const postsData = await this.postsService.getUserPosts(1, 5);

                    // 2. Add frontend calculated stats (in a real app, these would come from an API)
                    const postsWithStats = this.addPlaceholderStats(postsData.posts);

                    // 3. Generate dashboard stats
                    const stats = this.generateStats(postsData.meta.total);

                    // 4. Create the dashboard data
                    const dashboardData = {
                        stats,
                        recentPosts: postsWithStats
                    };

                    // 5. Update the cache
                    this.cache = {
                        dashboardData,
                        timestamp: Date.now()
                    };

                    return dashboardData;
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);

                    // If we have fallback data, use it instead of failing
                    if (fallbackData) {
                        console.log('Using fallback data due to API error');
                        return fallbackData;
                    }

                    // If no fallback data, create empty dashboard data
                    return {
                        stats: this.generateStats(0),
                        recentPosts: []
                    };
                }
            } finally {
                // Reset the request flag when done
                this.requestInProgress = false;
                this.requestPromise = null;
            }
        })();

        return this.requestPromise;
    }
}

// Create and export a default instance
export const dashboardService = new DashboardService();

// Export individual functions for backward compatibility
export const getDashboardData = (forceRefresh = false) => dashboardService.getDashboardData(forceRefresh);