import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next/types';
import BlogPostCard from '@/components/BlogPostCard';
import ShareButtons from '@/components/ShareButtons';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { markdownToHtml } from '@/lib/markdown';

// This generates metadata for each blog post dynamically
export async function generateMetadata({
    params
}: {
    params: { slug: string }
}): Promise<Metadata> {
    // Create a local copy of the params to ensure it's properly resolved
    const resolvedParams = await Promise.resolve(params);
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
        return {
            title: 'Post Not Found'
        };
    }

    return {
        title: `${post.title} | Tai Phan Van`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: ['Tai Phan Van'],
            tags: post.tags
        }
    };
}

// Define the page component
export default async function BlogPostPage(props: {
    params: { slug: string }
}) {
    // Create a local copy of the params to ensure it's properly resolved
    const params = await Promise.resolve(props.params);
    const { slug } = params;

    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Get related posts based on tags
    const relatedPosts = await getRelatedPosts(slug, 3);

    // Convert markdown content to HTML using our markdown utility
    const contentHtml = await markdownToHtml(post.content);

    // Get the canonical URL for this post
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taiphanvan.dev';
    const canonicalUrl = `${baseUrl}/blog/${slug}`;

    return (
        <article className="blog-post-container">
            <Link href="/blog" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                ← Back to all posts
            </Link>

            <header className="blog-post-header">
                <div className="blog-post-meta">
                    <span>
                        <i className="far fa-calendar"></i>
                        {post.date}
                    </span>
                    <span>
                        <i className="fas fa-tag"></i>
                        {post.tags.map((tag, index) => (
                            <span key={tag}>
                                <Link
                                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                                    style={{ color: 'var(--text-muted-color)' }}
                                >
                                    {tag}
                                </Link>
                                {index < post.tags.length - 1 ? ', ' : ''}
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