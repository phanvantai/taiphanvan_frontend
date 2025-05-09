/**
 * BlogPost Model
 * 
 * This file defines the BlogPost model and related interfaces for use throughout the application.
 * It serves as the single source of truth for the blog post data structure.
 */

import { BlogTag, cleanTagName } from './BlogTag';

// For backward compatibility
export type BlogPostTag = BlogTag;

/**
 * Represents a user who authors blog posts
 */
export interface BlogPostUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    bio: string;
    role: string;
    profile_image: string;
    created_at: string;
    updated_at: string;
}

/**
 * Represents the metadata of a blog post
 */
export interface BlogPostMetadata {
    title: string;
    slug: string;
    excerpt: string;
    cover: string;
    date?: string; // For compatibility with existing code
    coverImage?: string; // For compatibility with existing code
    tags: BlogTag[];
    status: 'published' | 'draft';
    publish_at?: string; // Date when the post should be published if scheduled
}

/**
 * Represents the content of a blog post
 */
export interface BlogPostContent {
    content: string;
}

/**
 * Represents a complete blog post
 */
export interface BlogPost extends BlogPostMetadata, BlogPostContent {
    id: number;
    user_id: number;
    user: BlogPostUser;
    created_at: string;
    updated_at: string;
    // Optional fields for frontend calculations
    views?: number;
    comments?: number;
}

/**
 * Represents a formatted blog post for display in components
 */
export interface FormattedPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    tags: string[]; // Array of tag names
    coverImage: string;
    content: string;
}

/**
 * Represents the response from the API when fetching posts
 */
export interface PostsResponse {
    meta: {
        lastPage: number;
        limit: number;
        page: number;
        total: number;
    };
    posts: BlogPost[];
    status: string;
}

/**
 * Format a date string nicely
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

/**
 * Convert a BlogPost to a FormattedPost
 */
export function formatBlogPost(post: BlogPost): FormattedPost {
    return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...', // Use excerpt or truncated content
        date: formatDate(post.created_at),
        slug: post.slug,
        tags: post.tags.map(tag => {
            // Clean up tag names using the utility function from BlogTag
            return cleanTagName(tag.name);
        }),
        coverImage: post.cover || post.coverImage || '',
        content: post.content
    };
}