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
    /**
     * Get posts for the authenticated user
     * @param page Page number
     * @param limit Number of posts per page
     * @returns Promise with the posts response
     */
    async getUserPosts(page: number = 1, limit: number = 5): Promise<PostsApiResponse> {
        const response = await apiClient.get<PostsApiResponse>('/posts/me', {
            params: { page, limit },
            requiresAuth: true
        });

        return response.data;
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
export const getUserPosts = postsService.getUserPosts.bind(postsService);
export const getPostById = postsService.getPostById.bind(postsService);
export const createPost = postsService.createPost.bind(postsService);
export const updatePost = postsService.updatePost.bind(postsService);
export const deletePost = postsService.deletePost.bind(postsService);