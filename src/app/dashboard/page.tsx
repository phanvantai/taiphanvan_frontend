"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import './dashboard.css';

// Define strong TypeScript types
type DashboardStat = {
    title: string;
    value: string | number;
    icon: 'file-text' | 'eye' | 'message-circle' | 'clock';
    color: string;
};

type BlogPost = {
    id: string;
    title: string;
    publishedAt: string;
    excerpt: string;
    slug: string;
    status: 'published' | 'draft';
    views: number;
    comments: number;
};

// Dashboard component
export default function DashboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'comments' | 'analytics'>('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        // Fetch dashboard data from API
        const fetchDashboardData = async () => {
            setLoading(true);

            try {
                // In a real app, you would fetch this data from your API
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                setStats([
                    {
                        title: 'Total Posts',
                        value: 12,
                        icon: 'file-text',
                        color: 'bg-indigo-50 text-indigo-500'
                    },
                    {
                        title: 'Total Views',
                        value: '5.2K',
                        icon: 'eye',
                        color: 'bg-blue-50 text-blue-500'
                    },
                    {
                        title: 'Comments',
                        value: 48,
                        icon: 'message-circle',
                        color: 'bg-green-50 text-green-500'
                    },
                    {
                        title: 'Avg. Time on Page',
                        value: '2m 35s',
                        icon: 'clock',
                        color: 'bg-amber-50 text-amber-500'
                    }
                ]);

                setRecentPosts([
                    {
                        id: '1',
                        title: 'Getting Started with Next.js 14',
                        publishedAt: '2025-05-01T12:00:00Z',
                        excerpt: 'Learn how to build modern web applications with Next.js 14 and TypeScript',
                        slug: 'getting-started-with-nextjs',
                        status: 'published',
                        views: 1245,
                        comments: 23
                    },
                    {
                        title: 'CSS Variables in Modern Web Development',
                        publishedAt: '2025-04-15T10:30:00Z',
                        excerpt: 'How to leverage CSS custom properties to create maintainable stylesheets',
                        slug: 'css-variables-modern-web-development',
                        status: 'published',
                        views: 954,
                        comments: 12,
                        id: '2'
                    },
                    {
                        id: '3',
                        title: 'The Rise of AI in Software Development',
                        publishedAt: '2025-04-02T15:45:00Z',
                        excerpt: 'Exploring how AI is changing the landscape of software development',
                        slug: 'rise-of-ai-software-development',
                        status: 'draft',
                        views: 0,
                        comments: 0
                    }
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard">
            <DashboardHeader user={user} />
            <DashboardNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <DashboardContent
                activeTab={activeTab}
                loading={loading}
                stats={stats}
                recentPosts={recentPosts}
            />
        </div>
    );
}

// Separate components for better organization

type DashboardHeaderProps = {
    user: {
        id?: number;
        username?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        profileImage?: string;
        bio?: string;
    } | null;  // Using type definition matching the AuthContext's User type
};

function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <div className="dashboard-header">
            <div className="welcome-section">
                <h1 className="dashboard-title">
                    Welcome back, {user?.firstName || user?.username || 'User'}!
                </h1>
                <p className="dashboard-subtitle">
                    Here&apos;s what&apos;s happening with your blog today.
                </p>
            </div>
            <div className="dashboard-actions">
                <Link href="/blog/create" className="create-post-button">
                    <span className="create-post-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </span>
                    New Post
                </Link>
            </div>
        </div>
    );
}

type DashboardNavigationProps = {
    activeTab: 'overview' | 'posts' | 'comments' | 'analytics';
    onTabChange: (tab: 'overview' | 'posts' | 'comments' | 'analytics') => void;
};

function DashboardNavigation({ activeTab, onTabChange }: DashboardNavigationProps) {
    return (
        <div className="dashboard-nav">
            <NavTab
                icon="grid"
                label="Overview"
                isActive={activeTab === 'overview'}
                onClick={() => onTabChange('overview')}
            />
            <NavTab
                icon="file"
                label="Posts"
                isActive={activeTab === 'posts'}
                onClick={() => onTabChange('posts')}
            />
            <NavTab
                icon="message"
                label="Comments"
                isActive={activeTab === 'comments'}
                onClick={() => onTabChange('comments')}
            />
            <NavTab
                icon="chart"
                label="Analytics"
                isActive={activeTab === 'analytics'}
                onClick={() => onTabChange('analytics')}
            />
        </div>
    );
}

type NavTabProps = {
    icon: 'grid' | 'file' | 'message' | 'chart';
    label: string;
    isActive: boolean;
    onClick: () => void;
};

function NavTab({ icon, label, isActive, onClick }: NavTabProps) {
    return (
        <button
            className={`nav-tab ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {icon === 'grid' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            )}
            {icon === 'file' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )}
            {icon === 'message' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            )}
            {icon === 'chart' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            )}
            {label}
        </button>
    );
}

type DashboardContentProps = {
    activeTab: 'overview' | 'posts' | 'comments' | 'analytics';
    loading: boolean;
    stats: DashboardStat[];
    recentPosts: BlogPost[];
};

function DashboardContent({ activeTab, loading, stats, recentPosts }: DashboardContentProps) {
    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="dashboard-content">
            {activeTab === 'overview' && (
                <OverviewTab stats={stats} recentPosts={recentPosts} />
            )}
            {activeTab === 'posts' && (
                <PostsTab />
            )}
            {activeTab === 'comments' && (
                <CommentsTab />
            )}
            {activeTab === 'analytics' && (
                <AnalyticsTab />
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
        </div>
    );
}

type OverviewTabProps = {
    stats: DashboardStat[];
    recentPosts: BlogPost[];
};

function OverviewTab({ stats, recentPosts }: OverviewTabProps) {
    return (
        <div className="tab-content">
            <StatsSection stats={stats} />
            <RecentPostsSection posts={recentPosts} />
        </div>
    );
}

type StatsSectionProps = {
    stats: DashboardStat[];
};

function StatsSection({ stats }: StatsSectionProps) {
    return (
        <div className="stats-section">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>
        </div>
    );
}

type StatCardProps = {
    stat: DashboardStat;
};

function StatCard({ stat }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {stat.icon === 'file-text' && (
                        <>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </>
                    )}
                    {stat.icon === 'eye' && (
                        <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </>
                    )}
                    {stat.icon === 'message-circle' && (
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    )}
                    {stat.icon === 'clock' && (
                        <>
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </>
                    )}
                </svg>
            </div>
            <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
            </div>
        </div>
    );
}

type RecentPostsSectionProps = {
    posts: BlogPost[];
};

function RecentPostsSection({ posts }: RecentPostsSectionProps) {
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
    post: BlogPost;
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    {post.status === 'published' && (
                        <>
                            <div className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>{post.views.toLocaleString()}</span>
                            </div>

                            <div className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>{post.comments}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="post-actions">
                <Link href={`/blog/edit/${post.slug}`} className="action-button edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                </Link>

                {post.status === 'published' ? (
                    <Link href={`/blog/${post.slug}`} className="action-button view">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                    </Link>
                ) : (
                    <button className="action-button publish">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2v16h-20v-16h20z"></path>
                            <path d="M22 18H2a10 10 0 0 0 10 10 10 10 0 0 0 10-10z"></path>
                        </svg>
                        Publish
                    </button>
                )}
            </div>
        </div>
    );
}

function PostsTab() {
    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>All Posts</h2>
                <p>Manage all your blog posts</p>
            </div>
            <div className="posts-manager">
                <div className="filters-bar">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search posts..." />
                    </div>
                    <div className="filter-options">
                        <select className="status-filter">
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                        <select className="sort-filter">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                <PlaceholderContent
                    icon="file"
                    title="Post Management Coming Soon"
                    description="This section will let you manage all your blog posts, including filtering, searching, and bulk actions."
                    actionText="Create New Post"
                    actionLink="/blog/create"
                />
            </div>
        </div>
    );
}

function CommentsTab() {
    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Comments</h2>
                <p>Manage comments on your blog posts</p>
            </div>
            <PlaceholderContent
                icon="message"
                title="Comment Management Coming Soon"
                description="This section will let you view, moderate, and respond to comments on your blog posts."
            />
        </div>
    );
}

function AnalyticsTab() {
    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Analytics</h2>
                <p>View blog performance metrics</p>
            </div>
            <PlaceholderContent
                icon="chart"
                title="Analytics Coming Soon"
                description="This section will provide detailed analytics about your blog's performance, including page views, reader demographics, and engagement metrics."
            />
        </div>
    );
}

type PlaceholderContentProps = {
    icon: 'file' | 'message' | 'chart';
    title: string;
    description: string;
    actionText?: string;
    actionLink?: string;
};

function PlaceholderContent({ icon, title, description, actionText, actionLink }: PlaceholderContentProps) {
    return (
        <div className="content-placeholder">
            <div className="placeholder-icon">
                {icon === 'file' && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                )}
                {icon === 'message' && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
                {icon === 'chart' && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                )}
            </div>
            <h3 className="placeholder-title">{title}</h3>
            <p className="placeholder-description">{description}</p>
            {actionText && actionLink && (
                <Link href={actionLink} className="placeholder-action">
                    {actionText}
                </Link>
            )}
        </div>
    );
}