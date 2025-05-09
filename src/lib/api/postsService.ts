/**
 * Posts API Service
 * 
 * This module provides methods for interacting with the posts API endpoints.
 * It uses the base API client for making HTTP requests.
 */

import { apiClient } from './apiClient';
import { BlogPost, PostsResponse } from '@/models/BlogPost';

// Re-export the PostsResponse type as PostsApiResponse for backward compatibility
export type PostsApiResponse = PostsResponse;

/**
 * Posts API service class
 */
export class PostsService {
    // Cache for user posts
    private userPostsCache: {
        [key: string]: {
            data: PostsApiResponse;
            timestamp: number;
        }
    } = {};

    // Cache lifetime in milliseconds (2 minutes)
    private cacheLifetime = 120000;

    // Track in-progress requests to prevent duplicates
    private pendingRequests: {
        [key: string]: Promise<PostsApiResponse>
    } = {};

    /**
     * Get posts for the authenticated user
     * @param page Page number
     * @param limit Number of posts per page
     * @param forceRefresh Force refresh the data even if cache is valid
     * @returns Promise with the posts response
     */
    async getUserPosts(page: number = 1, limit: number = 5, forceRefresh = false): Promise<PostsApiResponse> {
        // Create a cache key based on the parameters
        const cacheKey = `posts_me_${page}_${limit}`;

        // Check if we have a valid cached response
        if (!forceRefresh &&
            this.userPostsCache[cacheKey] &&
            Date.now() - this.userPostsCache[cacheKey].timestamp < this.cacheLifetime) {
            console.log(`Using cached user posts for page ${page}, limit ${limit}`);
            return this.userPostsCache[cacheKey].data;
        }

        // Check if there's already a request in progress for this data
        if (await this.pendingRequests[cacheKey]) {
            console.log(`Request already in progress for user posts page ${page}, limit ${limit}`);
            return this.pendingRequests[cacheKey];
        }

        // Create a new request
        try {
            console.log(`Fetching user posts for page ${page}, limit ${limit}`);

            // Store the promise to prevent duplicate requests
            this.pendingRequests[cacheKey] = (async () => {
                try {
                    const response = await apiClient.get<PostsApiResponse>('/posts/me', {
                        params: { page, limit },
                        requiresAuth: true
                    });

                    // Cache the successful response
                    this.userPostsCache[cacheKey] = {
                        data: response.data,
                        timestamp: Date.now()
                    };

                    return response.data;
                } finally {
                    // Clean up the pending request
                    delete this.pendingRequests[cacheKey];
                }
            })();

            return this.pendingRequests[cacheKey];
        } catch (error) {
            // If we have cached data, return it on error
            if (this.userPostsCache[cacheKey]) {
                console.log(`Error fetching user posts, using cached data`);
                return this.userPostsCache[cacheKey].data;
            }
            throw error;
        }
    }

    /**
     * Get a single post by ID
     * @param id Post ID
     * @returns Promise with the post
     */
    async getPostById(id: number): Promise<BlogPost> {
        const response = await apiClient.get<{ post: BlogPost }>(`/posts/${id}`, {
            requiresAuth: true
        });

        return response.data.post;
    }

    /**
     * Create a new post
     * @param postData Post data
     * @returns Promise with the created post
     */
    async createPost(postData: Partial<BlogPost>): Promise<BlogPost> {
        const response = await apiClient.post<{ post: BlogPost }>('/posts', postData, {
            requiresAuth: true
        });

        return response.data.post;
    }

    /**
     * Update an existing post
     * @param id Post ID
     * @param postData Post data
     * @returns Promise with the updated post
     */
    async updatePost(id: number, postData: Partial<BlogPost>): Promise<BlogPost> {
        const response = await apiClient.put<{ post: BlogPost }>(`/posts/${id}`, postData, {
            requiresAuth: true
        });

        return response.data.post;
    }

    /**
     * Delete a post
     * @param id Post ID
     * @returns Promise with success status
     */
    async deletePost(id: number): Promise<{ success: boolean }> {
        await apiClient.delete<{ success: boolean }>(`/posts/${id}`, {
            requiresAuth: true
        });

        return { success: true };
    }
}

// Create and export a default instance
export const postsService = new PostsService();

// Export individual functions for backward compatibility
export const getUserPosts = (page: number = 1, limit: number = 5, forceRefresh = false) =>
    postsService.getUserPosts(page, limit, forceRefresh);
export const getPostById = postsService.getPostById.bind(postsService);
export const createPost = postsService.createPost.bind(postsService);
export const updatePost = postsService.updatePost.bind(postsService);
export const deletePost = postsService.deletePost.bind(postsService);