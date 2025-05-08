// API response interfaces
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover: string;
  status: string;
  user_id: number;
  user: {
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
  };
  tags: {
    id: number;
    name: string;
    posts: null;
  }[];
  created_at: string;
  updated_at: string;
}

// Formatted post type for display in components
export interface FormattedPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[]; // Changed from categories to tags
  coverImage: string;
  content: string;
}

export interface PostsResponse {
  meta: {
    lastPage: number;
    limit: number;
    page: number;
    total: number;
  };
  posts: Post[];
}

/**
 * Fetch posts from the API
 */
export async function fetchPosts(limit: number = 3, status: string = 'published'): Promise<FormattedPost[]> {
  try {
    // Use environment variable for API URL instead of hardcoded localhost
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9876/api';

    const response = await fetch(
      `${API_URL}/posts?limit=${limit}&status=${status}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data: PostsResponse = await response.json();

    // Transform API response to match FormattedPost interface
    return data.posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...', // Use excerpt or truncated content
      date: formatDate(post.created_at),
      slug: post.slug,
      tags: post.tags.map(tag => {
        // Clean up tag names (they appear to have JSON formatting in them)
        const cleanName = tag.name.replace(/[\[\]"]/g, '');
        return cleanName;
      }),
      coverImage: post.cover,
      content: post.content // Include content field
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Return empty array on error
  }
}

/**
 * Get all blog posts with summary information
 */
export async function getAllPosts(): Promise<FormattedPost[]> {
  // Now fetch from the API instead of using mock data
  return fetchPosts(100); // Get all posts with a high limit
}

/**
 * Get featured posts (most recent posts)
 */
export async function getFeaturedPosts(count: number = 3): Promise<FormattedPost[]> {
  const posts = await fetchPosts(count);
  return posts;
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<FormattedPost | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9876/api';

    const response = await fetch(
      `${API_URL}/posts/slug/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const post: Post = await response.json();

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...', // Use excerpt or truncated content
      date: formatDate(post.created_at),
      slug: post.slug,
      tags: post.tags.map(tag => {
        // Clean up tag names (they appear to have JSON formatting in them)
        const cleanName = tag.name.replace(/[\[\]"]/g, '');
        return cleanName;
      }),
      coverImage: post.cover,
      content: post.content
    };
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get related posts based on tags (excluding the current post)
 */
export async function getRelatedPosts(slug: string, count: number = 3): Promise<FormattedPost[]> {
  try {
    const currentPost = await getPostBySlug(slug);
    if (!currentPost || !currentPost.tags || currentPost.tags.length === 0) {
      return [];
    }

    // Get all posts
    const allPosts = await getAllPosts();

    // Filter related posts based on matching tags
    const relatedPosts = allPosts
      .filter(post => {
        // Exclude current post
        if (post.slug === slug) return false;

        // Check if any tags match
        return post.tags.some(tag =>
          currentPost.tags.includes(tag)
        );
      })
      .slice(0, count);

    return relatedPosts;
  } catch (error) {
    console.error(`Error fetching related posts for slug ${slug}:`, error);
    return [];
  }
}

/**
 * Get all unique tags from blog posts
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const tags = new Set<string>();

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tags.add(tag);
      });
    });

    return Array.from(tags).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
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