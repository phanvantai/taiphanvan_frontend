import { BlogPost, FormattedPost, PostsResponse, formatBlogPost } from '@/models/BlogPost';

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

    // Transform API response to match FormattedPost interface using the formatBlogPost helper
    return data.posts.map(post => formatBlogPost(post));
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

    const post: BlogPost = await response.json();
    return formatBlogPost(post);
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

// formatDate function is now imported from @/models/BlogPost