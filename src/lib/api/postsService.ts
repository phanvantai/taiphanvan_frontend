/**
 * Posts API Service
 * 
 * This module provides methods for interacting with the posts API endpoints.
 * It uses the base API client for making HTTP requests.
 */

import { apiClient } from './apiClient';
import { BlogPost, PostsResponse } from '@/models/BlogPost';
import { BlogTagMinimal, getTagNames } from '@/models/BlogTag';

// Define a type for creating posts that allows BlogTagMinimal
export interface CreatePostData extends Omit<Partial<BlogPost>, 'tags'> {
    tags?: BlogTagMinimal[];
    publish_at?: string;
}

// Define a type for updating posts that allows BlogTagMinimal
export interface UpdatePostData extends Omit<Partial<BlogPost>, 'tags'> {
    tags?: BlogTagMinimal[];
}

// Define a type for updating posts that allows BlogTagMinimal
export interface UpdatePostData extends Omit<Partial<BlogPost>, 'tags'> {
    tags?: BlogTagMinimal[];
}

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
     * Get a single post by slug
     * @param slug Post slug
     * @returns Promise with the post
     */
    async getPostBySlug(slug: string): Promise<BlogPost | null> {
        try {
            console.log(`Fetching post with slug: ${slug} from API`);
            const response = await apiClient.get<BlogPost | { post: BlogPost }>(`/posts/slug/${slug}`, {
                requiresAuth: true
            });

            console.log('API response received:', response.data);

            // Handle different response formats
            let post: BlogPost | null = null;

            if (!response.data) {
                console.error('API response data is empty');
                return null;
            }

            // Case 1: Response is directly the post object (has id, title, etc.)
            if ('id' in response.data && 'title' in response.data) {
                console.log('Response is directly the post object');
                post = response.data as BlogPost;
            }
            // Case 2: Response has a post property
            else if ('post' in response.data && response.data.post.id) {
                console.log('Response has post nested in "post" property');
                post = response.data.post as BlogPost;
            }
            // Case 3: Unknown format
            else {
                console.error('Unknown API response format:', response.data);
                return null;
            }

            console.log('Processed post data:', post);
            return post;
        } catch (error) {
            console.error('Error in getPostBySlug:', error);
            return null; // Return null instead of throwing to prevent component crashes
        }
    }

    /**
     * Create a new post
     * @param postData Post data
     * @param publishImmediately Whether to publish immediately (defaults to false, creating a draft)
     * @returns Promise with the created post
     */
    async createPost(postData: CreatePostData, publishImmediately: boolean = false): Promise<BlogPost> {
        // Format the request data according to API expectations
        const requestData = {
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            cover: postData.cover || '',
            // Set status based on parameter, defaulting to draft
            status: publishImmediately ? 'published' : 'draft',
            // Format tags as expected by the API using the utility function
            tags: postData.tags ? getTagNames(postData.tags) : []
        };

        // Only add publish_at if status is published and it's provided
        if (publishImmediately && postData.publish_at) {
            Object.assign(requestData, { publish_at: postData.publish_at });
        }

        const response = await apiClient.post<BlogPost>('/posts', requestData, {
            requiresAuth: true
        });

        return response.data;
    }

    /**
     * Update an existing post
     * @param id Post ID
     * @param postData Post data
     * @returns Promise with the updated post
     */
    async updatePost(id: number, postData: Partial<BlogPost> | UpdatePostData): Promise<BlogPost> {
        // Create a new request object for the API
        const apiRequestData: Record<string, string | string[] | undefined> = {
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            cover: postData.cover,
            status: postData.status
        };

        // Only include defined properties
        Object.keys(apiRequestData).forEach(key => {
            if (apiRequestData[key] === undefined) {
                delete apiRequestData[key];
            }
        });

        // Handle tags separately - convert to string array for API
        if ('tags' in postData && Array.isArray(postData.tags)) {
            apiRequestData.tags = getTagNames(postData.tags);
        }

        const response = await apiClient.put<{ post: BlogPost }>(`/posts/${id}`, apiRequestData, {
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
export const getPostBySlug = postsService.getPostBySlug.bind(postsService);
export const createPost = postsService.createPost.bind(postsService);
export const updatePost = postsService.updatePost.bind(postsService);
export const deletePost = postsService.deletePost.bind(postsService);