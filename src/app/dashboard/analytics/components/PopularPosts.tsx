/**
 * Popular Posts Component
 * Displays top performing blog posts with engagement metrics
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PopularPost {
    slug: string;
    title: string;
    views: number;
    engagement: number;
    publishDate?: string;
    readTime?: number;
    category?: string;
}

interface PopularPostsProps {
    posts?: PopularPost[];
    isLoading?: boolean;
    error?: string;
    limit?: number;
    timeRange?: '7d' | '30d' | '90d';
    onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
    className?: string;
}

export const PopularPosts: React.FC<PopularPostsProps> = ({
    posts = [],
    isLoading = false,
    error,
    limit = 10,
    timeRange = '30d',
    onTimeRangeChange,
    className = ''
}) => {
    const [sortBy, setSortBy] = useState<'views' | 'engagement'>('views');

    // Generate sample data if none provided
    const samplePosts: PopularPost[] = [
        {
            slug: 'getting-started-with-nextjs',
            title: 'Getting Started with Next.js: A Complete Guide',
            views: 1245,
            engagement: 8.5,
            publishDate: '2024-06-01',
            readTime: 8,
            category: 'Development'
        },
        {
            slug: 'typescript-best-practices',
            title: 'TypeScript Best Practices for Modern Web Development',
            views: 892,
            engagement: 7.2,
            publishDate: '2024-06-05',
            readTime: 12,
            category: 'TypeScript'
        },
        {
            slug: 'react-performance-optimization',
            title: 'React Performance Optimization Techniques',
            views: 756,
            engagement: 9.1,
            publishDate: '2024-06-10',
            readTime: 15,
            category: 'React'
        },
        {
            slug: 'css-grid-mastery',
            title: 'Mastering CSS Grid: Advanced Layout Techniques',
            views: 634,
            engagement: 6.8,
            publishDate: '2024-06-08',
            readTime: 10,
            category: 'CSS'
        },
        {
            slug: 'api-design-principles',
            title: 'RESTful API Design Principles and Best Practices',
            views: 523,
            engagement: 7.9,
            publishDate: '2024-06-12',
            readTime: 14,
            category: 'API'
        }
    ];

    const displayPosts = posts.length > 0 ? posts : samplePosts;
    const sortedPosts = [...displayPosts].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, limit);

    const formatViews = (views: number): string => {
        if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'k';
        }
        return views.toString();
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getEngagementColor = (engagement: number): string => {
        if (engagement >= 8) return '#10b981'; // green
        if (engagement >= 6) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    if (error) {
        return (
            <div className={`popular-posts error ${className}`}>
                <div className="posts-header">
                    <h3>Popular Posts</h3>
                </div>
                <div className="error-content">
                    <span className="error-icon">📄</span>
                    <p>Unable to load popular posts</p>
                    <small>{error}</small>
                </div>
                <style jsx>{`
          .popular-posts.error {
            border: 1px solid #fee2e2;
            background: #fef2f2;
            min-height: 200px;
          }
          .error-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            color: #dc2626;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className={`popular-posts ${className}`}>
            <div className="posts-header">
                <h3>Popular Posts</h3>
                <div className="posts-controls">
                    <div className="sort-selector">
                        <button
                            className={sortBy === 'views' ? 'active' : ''}
                            onClick={() => setSortBy('views')}
                        >
                            By Views
                        </button>
                        <button
                            className={sortBy === 'engagement' ? 'active' : ''}
                            onClick={() => setSortBy('engagement')}
                        >
                            By Engagement
                        </button>
                    </div>

                    {onTimeRangeChange && (
                        <select
                            value={timeRange}
                            onChange={(e) => onTimeRangeChange(e.target.value as '7d' | '30d' | '90d')}
                            className="time-range-selector"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                    )}
                </div>
            </div>

            <div className="posts-content">
                {isLoading ? (
                    <div className="loading-posts">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="loading-post-item">
                                <div className="loading-rank"></div>
                                <div className="loading-content">
                                    <div className="loading-title"></div>
                                    <div className="loading-meta"></div>
                                </div>
                                <div className="loading-stats"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="posts-list">
                        {sortedPosts.map((post, index) => (
                            <div key={post.slug} className="post-item">
                                <div className="post-rank">
                                    #{index + 1}
                                </div>

                                <div className="post-content">
                                    <Link href={`/blog/${post.slug}`} className="post-title-link">
                                        <h4 className="post-title">{post.title}</h4>
                                    </Link>

                                    <div className="post-meta">
                                        {post.category && (
                                            <span className="post-category">{post.category}</span>
                                        )}
                                        {post.publishDate && (
                                            <span className="post-date">{formatDate(post.publishDate)}</span>
                                        )}
                                        {post.readTime && (
                                            <span className="post-read-time">{post.readTime} min read</span>
                                        )}
                                    </div>
                                </div>

                                <div className="post-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Views</span>
                                        <span className="stat-value">{formatViews(post.views)}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Engagement</span>
                                        <span
                                            className="stat-value engagement-score"
                                            style={{ color: getEngagementColor(post.engagement) }}
                                        >
                                            {post.engagement.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .popular-posts {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .posts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .posts-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .posts-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .sort-selector {
          display: flex;
          gap: 0.5rem;
        }

        .sort-selector button {
          padding: 0.25rem 0.75rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .sort-selector button.active,
        .sort-selector button:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .time-range-selector {
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background: white;
          color: #374151;
          font-size: 0.75rem;
        }

        .posts-content {
          max-height: 600px;
          overflow-y: auto;
        }

        .loading-posts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loading-post-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .loading-rank {
          width: 30px;
          height: 20px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .loading-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .loading-title {
          height: 20px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 80%;
        }

        .loading-meta {
          height: 14px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 60%;
        }

        .loading-stats {
          width: 80px;
          height: 40px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
        }

        .post-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s;
        }

        .post-item:hover {
          background-color: #f9fafb;
          margin: 0 -1rem;
          padding: 1rem;
          border-radius: 6px;
        }

        .post-item:last-child {
          border-bottom: none;
        }

        .post-rank {
          font-weight: 700;
          color: #6b7280;
          font-size: 1.125rem;
          min-width: 30px;
          text-align: center;
        }

        .post-content {
          flex: 1;
          min-width: 0;
        }

        .post-title-link {
          text-decoration: none;
          color: inherit;
        }

        .post-title {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-title-link:hover .post-title {
          color: #3b82f6;
        }

        .post-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: #6b7280;
          flex-wrap: wrap;
        }

        .post-category {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .post-stats {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: right;
          min-width: 80px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .stat-label {
          font-size: 0.625rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .engagement-score {
          font-weight: 700;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .posts-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .posts-controls {
            flex-direction: column;
            gap: 0.75rem;
          }

          .post-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .post-stats {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            text-align: left;
          }

          .popular-posts {
            padding: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default PopularPosts;
