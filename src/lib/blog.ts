import { BlogPost, FormattedPost, PostsResponse, formatBlogPost } from '@/models/BlogPost';
import { apiClient } from '@/lib/api/apiClient';

/**
 * Fetch posts from the API
 */
export async function fetchPosts(limit: number = 3, status: string = 'published'): Promise<FormattedPost[]> {
  try {
    const response = await apiClient.get<PostsResponse>('/posts', {
      params: { limit, status },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    // Transform API response to match FormattedPost interface using the formatBlogPost helper
    return response.data.posts.map(post => formatBlogPost(post));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Return empty array on error
  }
}

/**
 * Get all blog posts with summary information
 */
export async function getAllPosts(): Promise<FormattedPost[]> {
  return fetchPosts(100); // Get all posts with a high limit
}

/**
 * Get featured posts (most recent posts)
 */
export async function getFeaturedPosts(count: number = 3): Promise<FormattedPost[]> {
  return fetchPosts(count);
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<FormattedPost | null> {
  try {
    const response = await apiClient.get<BlogPost>(`/posts/slug/${slug}`, {
      next: { revalidate: 60 }
    });

    return formatBlogPost(response.data);
  } catch (error) {
    // Check if it's an ApiError with 404 status
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null;
    }

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