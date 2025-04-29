import { BlogPost } from '@/components/BlogPostCard';

// Mock data for blog posts - in a real app this would come from a CMS or database
const blogPostsData: BlogPost[] = [
    {
        id: 1,
        title: "Getting Started with Next.js",
        excerpt: "Learn how to build modern web applications with Next.js and React.",
        date: "April 28, 2025",
        slug: "getting-started-with-nextjs",
        categories: ["Development", "Next.js"],
        coverImage: "/images/blog/nextjs-cover.jpg"
    },
    {
        id: 2,
        title: "Styling with Tailwind CSS",
        excerpt: "Discover how to create beautiful, responsive designs with Tailwind CSS.",
        date: "April 25, 2025",
        slug: "styling-with-tailwind-css",
        categories: ["Design", "CSS"],
        coverImage: "/images/blog/tailwind-cover.jpg"
    },
    {
        id: 3,
        title: "Optimizing for SEO",
        excerpt: "Tips and tricks to make your blog more discoverable by search engines.",
        date: "April 20, 2025",
        slug: "optimizing-for-seo",
        categories: ["SEO", "Marketing"],
        coverImage: "/images/blog/seo-cover.jpg"
    },
    {
        id: 4,
        title: "Working with TypeScript",
        excerpt: "How TypeScript improves your development experience and code quality.",
        date: "April 15, 2025",
        slug: "working-with-typescript",
        categories: ["Development", "TypeScript"],
        coverImage: "/images/blog/typescript-cover.jpg"
    },
    {
        id: 5,
        title: "Building Accessible Websites",
        excerpt: "Best practices for creating web experiences that everyone can use.",
        date: "April 10, 2025",
        slug: "building-accessible-websites",
        categories: ["Accessibility", "Design"],
        coverImage: "/images/blog/accessibility-cover.jpg"
    },
    {
        id: 6,
        title: "Responsive Design Principles",
        excerpt: "Creating websites that work well on any device size.",
        date: "April 5, 2025",
        slug: "responsive-design-principles",
        categories: ["Design", "CSS", "Mobile"],
        coverImage: "/images/blog/responsive-cover.jpg"
    }
];

// Detailed content for blog posts - in a real app this would also come from a CMS
interface BlogPostContent {
    title: string;
    date: string;
    content: string;
    categories: string[];
}

const blogPostsContent: Record<string, BlogPostContent> = {
    'getting-started-with-nextjs': {
        title: "Getting Started with Next.js",
        date: "April 28, 2025",
        content: `
      # Getting Started with Next.js

      Next.js is a powerful React framework that makes it easy to build server-rendered 
      applications, static websites, and more.

      ## Why Next.js?

      Next.js provides a great developer experience with features like:

      - Server-side rendering for improved SEO and performance
      - Static site generation for blazing-fast websites
      - Automatic code splitting for efficient loading
      - Built-in CSS and Sass support
      - API routes for backend functionality
      - Fast refresh for quick iterations

      ## Setting Up a Project

      Creating a new Next.js project is as simple as running:

      \`\`\`bash
      npx create-next-app@latest my-app
      \`\`\`

      This will set up a new project with all the necessary configurations.

      ## Basic Routing

      Next.js has a file-system based router. Files in the \`app\` directory automatically 
      become routes. For example:

      - \`app/page.tsx\` → \`/\`
      - \`app/about/page.tsx\` → \`/about\`
      - \`app/blog/[slug]/page.tsx\` → \`/blog/:slug\`

      ## Conclusion

      Next.js is an excellent choice for building modern web applications. Its features 
      make it easy to create performant, SEO-friendly websites with a great developer 
      experience.
    `,
        categories: ["Development", "Next.js"]
    },
    'styling-with-tailwind-css': {
        title: "Styling with Tailwind CSS",
        date: "April 25, 2025",
        content: `
      # Styling with Tailwind CSS

      Tailwind CSS is a utility-first CSS framework that allows you to build custom designs 
      without leaving your HTML.

      ## Why Tailwind?

      Tailwind provides several advantages:

      - No more naming CSS classes
      - Consistent design system
      - Responsive design made easy
      - Dark mode with minimal effort
      - Highly customizable

      ## Getting Started

      To add Tailwind to your Next.js project:

      \`\`\`bash
      npm install -D tailwindcss postcss autoprefixer
      npx tailwindcss init -p
      \`\`\`

      ## Example Usage

      Instead of writing custom CSS:

      \`\`\`css
      .button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        background-color: blue;
        color: white;
      }
      \`\`\`

      With Tailwind, you can add classes directly to your HTML:

      \`\`\`html
      <button class="px-4 py-2 rounded bg-blue-500 text-white">
        Click me
      </button>
      \`\`\`

      ## Conclusion

      Tailwind CSS offers a different approach to styling that can significantly speed up 
      your development process while keeping your designs consistent.
    `,
        categories: ["Design", "CSS"]
    }
};

/**
 * Get all blog posts with summary information
 */
export function getAllPosts(): BlogPost[] {
    // In a real app, this would fetch from an API or database
    return blogPostsData;
}

/**
 * Get featured posts (most recent posts)
 */
export function getFeaturedPosts(count: number = 3): BlogPost[] {
    return getAllPosts().slice(0, count);
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
    return getAllPosts().find(post => post.slug === slug);
}

/**
 * Get detailed post content by slug
 */
export function getPostContent(slug: string): BlogPostContent | undefined {
    return blogPostsContent[slug];
}

/**
 * Get related posts based on categories (excluding the current post)
 */
export function getRelatedPosts(slug: string, count: number = 3): BlogPost[] {
    const currentPost = getPostBySlug(slug);
    if (!currentPost) return [];

    const relatedPosts = getAllPosts()
        .filter(post => {
            // Exclude current post
            if (post.slug === slug) return false;

            // Check if any categories match
            return post.categories.some(category =>
                currentPost.categories.includes(category)
            );
        })
        .slice(0, count);

    return relatedPosts;
}

/**
 * Get all unique categories from blog posts
 */
export function getAllCategories(): string[] {
    const categories = new Set<string>();

    getAllPosts().forEach(post => {
        post.categories.forEach(category => {
            categories.add(category);
        });
    });

    return Array.from(categories).sort();
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