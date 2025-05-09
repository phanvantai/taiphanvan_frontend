# API Services

This directory contains the API services for the application. These services provide a clean and testable interface for interacting with the backend API.

## Structure

- `apiClient.ts` - Base API client with common functionality
- `postsService.ts` - Service for blog posts API endpoints
- `dashboardService.ts` - Service for dashboard API endpoints
- `index.ts` - Exports all API services and utilities
- `testUtils.ts` - Utilities for testing API services

## Usage

### Basic Usage

```typescript
import { postsService, dashboardService } from '@/lib/api';

// Get user posts
const posts = await postsService.getUserPosts(1, 10);

// Get dashboard data
const dashboardData = await dashboardService.getDashboardData();
```

### Error Handling

```typescript
import { postsService, ApiError, AuthenticationError } from '@/lib/api';

try {
  const post = await postsService.getPostById(123);
  // Handle successful response
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle authentication error
    console.error('Authentication required:', error.message);
  } else if (error instanceof ApiError) {
    // Handle API error
    console.error(`API error (${error.status}):`, error.message);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

## Testing

The API services are designed to be easily testable. Here's an example of how to test them:

```typescript
import { postsService } from '@/lib/api';
import { MockApiClient, createMockBlogPost, createMockPostsResponse } from '@/lib/api/testUtils';

describe('Posts Service', () => {
  // Create a mock API client
  const mockApiClient = new MockApiClient();
  
  // Create a posts service instance with the mock client
  const postsServiceWithMock = new PostsService(mockApiClient);
  
  beforeEach(() => {
    // Reset mock responses before each test
    mockApiClient.resetMocks();
  });
  
  it('should get user posts', async () => {
    // Set up mock response
    const mockPosts = [createMockBlogPost(), createMockBlogPost({ id: 2 })];
    const mockResponse = createMockPostsResponse(mockPosts, { total: 2 });
    
    mockApiClient.setMockResponse('GET', '/posts/me', mockResponse);
    
    // Call the method
    const result = await postsServiceWithMock.getUserPosts(1, 10);
    
    // Assert the result
    expect(result.posts.length).toBe(2);
    expect(result.meta.total).toBe(2);
  });
  
  it('should create a post', async () => {
    // Set up mock response
    const newPost = createMockBlogPost();
    mockApiClient.setMockResponse('POST', '/posts', { post: newPost });
    
    // Call the method
    const result = await postsServiceWithMock.createPost({
      title: 'New Post',
      content: 'Post content'
    });
    
    // Assert the result
    expect(result.id).toBe(newPost.id);
    expect(result.title).toBe(newPost.title);
  });
});
```

## Best Practices

1. **Use the service classes** instead of direct API calls
2. **Handle errors properly** using the provided error classes
3. **Write tests** for your API interactions
4. **Keep services organized** by domain/feature
5. **Use TypeScript types** for request and response data
