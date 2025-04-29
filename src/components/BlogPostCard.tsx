import Link from 'next/link';
import Image from 'next/image';

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
            <article className="blog-post" style={{ padding: '1.5rem' }}>
                <div className="blog-post-meta">
                    <span>
                        <i className="far fa-calendar"></i>
                        {post.date}
                    </span>
                    {post.categories.length > 0 && (
                        <span>
                            <i className="fas fa-tag"></i>
                            {post.categories[0]}
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
                    <Image
                        src={post.coverImage}
                        alt={`Cover image for ${post.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background-alt-color">
                        <i className="fas fa-image fa-3x" style={{ color: 'var(--text-muted-color)' }}></i>
                    </div>
                )}
            </div>
            <div className="blog-post-content">
                <div className="blog-post-meta">
                    <span>
                        <i className="far fa-calendar"></i>
                        {post.date}
                    </span>
                    {post.categories.length > 0 && (
                        <span>
                            <i className="fas fa-tag"></i>
                            {post.categories[0]}
                            {post.categories.length > 1 && ` +${post.categories.length - 1}`}
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