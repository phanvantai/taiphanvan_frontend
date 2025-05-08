import Link from 'next/link';
import Image from 'next/image';
import './blog-post-card.css'; // Add a new CSS file for specific BlogPostCard styles

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    categories: string[];
    coverImage?: string;
}

interface BlogPostCardProps {
    post: BlogPost;
    variant?: 'default' | 'compact';
}

export default function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
    if (variant === 'compact') {
        return (
            <article className="blog-post" style={{ padding: '1.0rem' }}>
                <div className="blog-post-meta">
                    <span className="meta-item">
                        <i className="far fa-calendar meta-icon"></i>
                        <span className="meta-text">{post.date}</span>
                    </span>
                    {post.categories.length > 0 && (
                        <span className="meta-item">
                            <i className="fas fa-tag meta-icon"></i>
                            <span className="meta-text">{post.categories[0]}</span>
                        </span>
                    )}
                </div>
                <h3 className="blog-post-title">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>
            </article>
        );
    }

    return (
        <article className="blog-post">
            <div className="blog-post-image">
                {post.coverImage ? (
                    <div className="image-container">
                        <Image
                            src={post.coverImage}
                            alt={`Cover image for ${post.title}`}
                            width={400}
                            height={250}
                            className="blog-image"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background-alt-color">
                        <i className="fas fa-image fa-3x" style={{ color: 'var(--text-muted-color)' }}></i>
                    </div>
                )}
            </div>
            <div className="blog-post-content">
                <div className="blog-post-meta">
                    <span className="meta-item">
                        <i className="far fa-calendar meta-icon"></i>
                        <span className="meta-text">{post.date}</span>
                    </span>
                    {post.categories.length > 0 && (
                        <span className="meta-item">
                            <i className="fas fa-tag meta-icon"></i>
                            <span className="meta-text">
                                {post.categories[0]}
                                {post.categories.length > 1 && ` +${post.categories.length - 1}`}
                            </span>
                        </span>
                    )}
                </div>
                <h3 className="blog-post-title">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>
                <p className="blog-post-excerpt">{post.excerpt}</p>
                <Link
                    href={`/blog/${post.slug}`}
                    className="btn btn-secondary"
                >
                    Read more
                </Link>
            </div>
        </article>
    );
}