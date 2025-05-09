import Link from 'next/link';
import Icon from '@/components/Icon';
import { BlogPost } from '@/models/BlogPost';

type RecentPostsSectionProps = {
    posts: BlogPost[];
};

export default function RecentPostsSection({ posts }: RecentPostsSectionProps) {
    return (
        <div className="recent-posts-section">
            <div className="section-header">
                <h2 className="section-title">Recent Posts</h2>
                <Link href="/dashboard/posts" className="view-all-link">
                    View All
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </Link>
            </div>

            <div className="posts-list">
                {posts.map(post => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

type PostItemProps = {
    post: BlogPost & {
        views?: number;
        comments?: number;
    };
};

function PostItem({ post }: PostItemProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="post-item">
            <div className="post-status">
                <span className={`status-dot ${post.status === 'published' ? 'published' : 'draft'}`}></span>
                <span className="status-text">{post.status === 'published' ? 'Published' : 'Draft'}</span>
            </div>

            <div className="post-main">
                <h3 className="post-title">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>
                <p className="post-excerpt">{post.excerpt}</p>

                <div className="post-meta">
                    <div className="meta-item">
                        <Icon name="calendar" size={16} />
                        <span>{formatDate(post.created_at)}</span>
                    </div>

                    {post.status === 'published' && (
                        <>
                            <div className="meta-item">
                                <Icon name="eye" size={16} />
                                <span>{post.views?.toLocaleString() || '0'}</span>
                            </div>

                            <div className="meta-item">
                                <Icon name="message" size={16} />
                                <span>{post.comments || '0'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="post-actions">
                <Link href={`/blog/edit/${post.slug}`} className="action-button edit">
                    <Icon name="edit" size={16} />
                    Edit
                </Link>

                {post.status === 'published' ? (
                    <Link href={`/blog/${post.slug}`} className="action-button view">
                        <Icon name="view" size={16} />
                        View
                    </Link>
                ) : (
                    <button className="action-button publish">
                        <Icon name="publish" size={16} />
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}