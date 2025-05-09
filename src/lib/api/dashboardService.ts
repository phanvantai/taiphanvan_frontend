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

    /**
     * Create a new DashboardService instance
     * @param postsServiceInstance Posts service instance
     */
    constructor(postsServiceInstance = postsService) {
        this.postsService = postsServiceInstance;
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
     * Fetch all dashboard data
     * This method aggregates multiple API calls needed for the dashboard
     * @returns Promise with dashboard data
     */
    async getDashboardData(): Promise<DashboardData> {
        try {
            // 1. Fetch recent posts
            const postsData = await this.postsService.getUserPosts(1, 5);

            // 2. Add frontend calculated stats (in a real app, these would come from an API)
            const postsWithStats = this.addPlaceholderStats(postsData.posts);

            // 3. Generate dashboard stats
            const stats = this.generateStats(postsData.meta.total);

            return {
                stats,
                recentPosts: postsWithStats
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }
}

// Create and export a default instance
export const dashboardService = new DashboardService();

// Export individual functions for backward compatibility
export const getDashboardData = dashboardService.getDashboardData.bind(dashboardService);