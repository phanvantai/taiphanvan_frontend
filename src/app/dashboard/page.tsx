"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Icon from '@/components/Icon';
import './dashboard.css';
import { DashboardStat, getDashboardData, DashboardData } from '@/lib/api/dashboardService';
import { BlogPost } from '@/models/BlogPost';
import { User } from '@/models/User';

type TabType = 'overview' | 'posts' | 'comments' | 'analytics';

// Dashboard component
export default function DashboardPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        stats: [],
        recentPosts: []
    });

    // Use a ref to track if data has already been fetched
    const dataFetchedRef = useRef(false);

    // Use a ref to track if the component is mounted
    const isMountedRef = useRef(true);

    // Use a ref to store the fetch promise to prevent duplicate calls
    const fetchPromiseRef = useRef<Promise<void> | null>(null);

    // Use useCallback to memorize the fetch function
    const fetchDashboardData = useCallback(async () => {
        // Don't fetch if not mounted
        if (!isMountedRef.current) return;

        // Don't fetch if user is not authenticated
        if (!user) return;

        // If a fetch is already in progress, return that promise
        if (fetchPromiseRef.current) {
            return fetchPromiseRef.current;
        }

        // Set loading state only if we don't have data yet
        if (!dataFetchedRef.current) {
            setLoading(true);
        }

        setError(null);

        // Create the fetch promise
        fetchPromiseRef.current = (async () => {
            try {
                // Get dashboard data (this will use cache if available)
                const data = await getDashboardData();

                // Only update state if component is still mounted
                if (isMountedRef.current) {
                    setDashboardData(data);
                    setLoading(false);
                    dataFetchedRef.current = true;
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);

                // Only update state if component is still mounted
                if (isMountedRef.current) {
                    setError('Failed to load dashboard data. Please try again later.');
                    setLoading(false);
                }
            } finally {
                // Clear the promise ref
                fetchPromiseRef.current = null;
            }
        })();

        return fetchPromiseRef.current;
    }, [user]);

    useEffect(() => {
        // Set the mounted ref to true
        isMountedRef.current = true;

        // Only fetch data if we don't have it yet or if the user changes
        if (user && !dataFetchedRef.current) {
            fetchDashboardData();
        }

        // Cleanup function
        return () => {
            // Set the mounted ref to false to prevent state updates after unmount
            isMountedRef.current = false;
        };
    }, [user, fetchDashboardData]);

    return (
        <div className="dashboard">
            <DashboardHeader user={user} />
            <DashboardNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            {error && (
                <div className="error-state">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchDashboardData()}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            )}
            <DashboardContent
                activeTab={activeTab}
                loading={loading}
                stats={dashboardData.stats}
                recentPosts={dashboardData.recentPosts}
            />
        </div>
    );
}

// Separate components for better organization

type DashboardHeaderProps = {
    user: User | null;
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
                        <Icon name="plus" size={20} />
                    </span>
                    New Post
                </Link>
            </div>
        </div>
    );
}

type DashboardNavigationProps = {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
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

type IconType = 'grid' | 'file' | 'message' | 'chart';

type NavTabProps = {
    icon: IconType;
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
            <Icon name={icon} size={18} />
            {label}
        </button>
    );
}

type DashboardContentProps = {
    activeTab: TabType;
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
                <Icon name={stat.icon} size={24} />
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
                        <Icon name="search" size={18} />
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