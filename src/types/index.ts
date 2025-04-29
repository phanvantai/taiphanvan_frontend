// Define blog-related types for use throughout the application

export interface BlogPostMetadata {
    title: string;
    date: string;
    excerpt: string;
    slug: string;
    coverImage?: string;
    categories: string[];
}

export interface BlogPostContent {
    content: string;
}

export interface BlogPost extends BlogPostMetadata {
    id: number;
    content?: string;
}

export interface CategoryCount {
    name: string;
    count: number;
}

export interface SiteConfig {
    title: string;
    description: string;
    language: string;
    siteUrl: string;
    author: {
        name: string;
        email: string;
        twitter?: string;
        github?: string;
        linkedin?: string;
    };
    postsPerPage: number;
}