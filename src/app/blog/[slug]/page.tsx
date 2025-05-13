import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next/types';
import BlogPostCard from '@/components/BlogPostCard';
import ShareButtons from '@/components/ShareButtons';
import SmartImage from '@/components/SmartImage';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { markdownToHtml } from '@/lib/markdown';
import '@/components/blog-post-card.css'; // Import the CSS for meta styling

// This generates metadata for each blog post dynamically
export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>
    }
): Promise<Metadata> {
    const params = await props.params;
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
            tags: post.tags,
            images: post.coverImage ? [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: `Cover image for ${post.title}`
                }
            ] : []
        },
        twitter: {
            card: post.coverImage ? 'summary_large_image' : 'summary',
            title: post.title,
            description: post.excerpt,
            images: post.coverImage ? [post.coverImage] : []
        }
    };
}

// Define the page component
export default async function BlogPostPage(props: {
    params: Promise<{ slug: string }>
}) {
    // Create a local copy of the params to ensure it's properly resolved
    const params = await Promise.resolve((await props.params));
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

            {/* Cover image */}
            {post.coverImage && (
                <div className="blog-post-cover" style={{
                    marginBottom: '2rem',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%',
                    height: '400px'
                }}>
                    <SmartImage
                        src={post.coverImage}
                        alt={`Cover image for ${post.title}`}
                        fill={true}
                        priority={true}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            )}

            <header className="blog-post-header">
                <div className="blog-post-meta">
                    <span className="meta-item">
                        <i className="far fa-calendar meta-icon"></i>
                        <span className="meta-text">{post.date}</span>
                    </span>
                    <span className="meta-item">
                        <i className="fas fa-tag meta-icon"></i>
                        <span className="meta-text">
                            {post.tags.map((tag, index) => (
                                <span key={tag} style={{ marginRight: '4px' }}>
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