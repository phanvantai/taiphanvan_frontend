import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import BlogPostCard from '@/components/BlogPostCard';
import ShareButtons from '@/components/ShareButtons';
import { getPostBySlug, getPostContent, getRelatedPosts, formatDate } from '@/lib/blog';

// Define the correct params type for Next.js App Router
interface BlogPostPageProps {
    params: {
        slug: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

// This generates metadata for each blog post dynamically
export async function generateMetadata({
    params
}: BlogPostPageProps): Promise<Metadata> {
    const post = getPostBySlug(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found'
        };
    }

    return {
        title: `${post.title} | My Personal Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: ['Your Name'],
            tags: post.categories
        }
    };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = getPostBySlug(params.slug);
    const postContent = getPostContent(params.slug);

    if (!post || !postContent) {
        notFound();
    }

    // Get related posts based on categories
    const relatedPosts = getRelatedPosts(params.slug, 3);

    // In a real app, you would process markdown here or use a library like MDX
    const contentHtml = postContent.content
        .split('\n')
        .map(line => {
            if (line.startsWith('# ')) {
                return `<h1 class="blog-post-content h1">${line.replace('# ', '')}</h1>`;
            } else if (line.startsWith('## ')) {
                return `<h2 class="blog-post-content h2">${line.replace('## ', '')}</h2>`;
            } else if (line.startsWith('- ')) {
                return `<li class="blog-post-content li">${line.replace('- ', '')}</li>`;
            } else if (line.startsWith('\`\`\`')) {
                return line.includes('bash')
                    ? '<pre class="blog-post-content pre"><code>'
                    : '</code></pre>';
            } else if (line.trim() === '') {
                return '<br/>';
            } else {
                return `<p class="blog-post-content p">${line}</p>`;
            }
        })
        .join('');

    // Get the canonical URL for this post
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://myblog.com';
    const canonicalUrl = `${baseUrl}/blog/${params.slug}`;

    return (
        <article className="blog-post-container">
            <Link href="/blog" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                ← Back to all posts
            </Link>

            <header className="blog-post-header">
                <div className="blog-post-meta">
                    <span>
                        <i className="far fa-calendar"></i>
                        {formatDate(post.date)}
                    </span>
                    <span>
                        <i className="fas fa-folder"></i>
                        {post.categories.map((category, index) => (
                            <span key={category}>
                                <Link
                                    href={`/blog?category=${encodeURIComponent(category)}`}
                                    style={{ color: 'var(--text-muted-color)' }}
                                >
                                    {category}
                                </Link>
                                {index < post.categories.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </span>
                </div>
                <h1 className="blog-post-title" style={{
                    fontSize: '2.5rem',
                    marginTop: '1rem',
                    marginBottom: '2rem'
                }}>{post.title}</h1>
            </header>

            <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Share section */}
            <div className="share-buttons">
                <span>Share this post:</span>
                <ShareButtons title={post.title} url={canonicalUrl} />
            </div>

            {/* Related posts section */}
            {relatedPosts.length > 0 && (
                <div style={{ marginTop: '4rem' }}>
                    <h2 className="section-title">Related Posts</h2>
                    <div className="blog-grid">
                        {relatedPosts.map(relatedPost => (
                            <BlogPostCard key={relatedPost.id} post={relatedPost} />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}