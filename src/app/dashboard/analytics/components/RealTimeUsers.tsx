/**
 * Real Time Users Component
 * Displays live user activity and currently active pages
 */

'use client';

import React, { useState, useEffect } from 'react';

interface ActivePage {
    page: string;
    users: number;
    title?: string;
}

interface RealTimeData {
    activeUsers: number;
    activePages: ActivePage[];
    lastUpdated?: Date;
}

interface RealTimeUsersProps {
    data?: RealTimeData;
    isLoading?: boolean;
    error?: string;
    autoRefresh?: boolean;
    refreshInterval?: number; // in seconds
    className?: string;
}

export const RealTimeUsers: React.FC<RealTimeUsersProps> = ({
    data,
    isLoading = false,
    error,
    autoRefresh = true,
    refreshInterval = 30,
    className = ''
}) => {
    const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(data || null);
    const [countdown, setCountdown] = useState(refreshInterval);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Generate sample data if none provided
    const generateSampleData = (): RealTimeData => ({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        activePages: [
            {
                page: '/blog/getting-started-with-nextjs',
                users: Math.floor(Math.random() * 15) + 3,
                title: 'Getting Started with Next.js'
            },
            {
                page: '/blog/typescript-best-practices',
                users: Math.floor(Math.random() * 10) + 2,
                title: 'TypeScript Best Practices'
            },
            {
                page: '/',
                users: Math.floor(Math.random() * 8) + 1,
                title: 'Home'
            },
            {
                page: '/apps/typing-speed-test',
                users: Math.floor(Math.random() * 5) + 1,
                title: 'Typing Speed Test'
            },
            {
                page: '/blog',
                users: Math.floor(Math.random() * 6) + 1,
                title: 'Blog'
            }
        ].sort((a, b) => b.users - a.users),
        lastUpdated: new Date()
    });

    // Auto-refresh functionality
    useEffect(() => {
        if (!autoRefresh) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    // Refresh data
                    setIsRefreshing(true);
                    setTimeout(() => {
                        if (!data) {
                            setRealTimeData(generateSampleData());
                        }
                        setIsRefreshing(false);
                    }, 1000);
                    return refreshInterval;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [autoRefresh, refreshInterval, data]);

    // Initialize with sample data if no data provided
    useEffect(() => {
        if (!data && !realTimeData) {
            setRealTimeData(generateSampleData());
        }
    }, [data, realTimeData]);

    const displayData = data || realTimeData;

    const formatPagePath = (path: string): string => {
        if (path === '/') return 'Home';
        if (path.startsWith('/blog/')) {
            return path.replace('/blog/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        if (path.startsWith('/apps/')) {
            return path.replace('/apps/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        return path.replace(/\//g, ' / ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getPageIcon = (path: string): string => {
        if (path === '/') return '🏠';
        if (path.startsWith('/blog')) return '📝';
        if (path.startsWith('/apps')) return '🛠️';
        if (path.startsWith('/news')) return '📰';
        if (path.startsWith('/dashboard')) return '📊';
        return '📄';
    };

    const getUserCountColor = (users: number): string => {
        if (users >= 10) return '#10b981'; // green
        if (users >= 5) return '#f59e0b'; // yellow
        return '#6b7280'; // gray
    };

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        setCountdown(refreshInterval);
        setTimeout(() => {
            if (!data) {
                setRealTimeData(generateSampleData());
            }
            setIsRefreshing(false);
        }, 1000);
    };

    if (error) {
        return (
            <div className={`real-time-users error ${className}`}>
                <div className="real-time-header">
                    <h3>Real-Time Users</h3>
                </div>
                <div className="error-content">
                    <span className="error-icon">👥</span>
                    <p>Unable to load real-time data</p>
                    <small>{error}</small>
                </div>
                <style jsx>{`
          .real-time-users.error {
            border: 1px solid #fee2e2;
            background: #fef2f2;
            min-height: 250px;
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
        <div className={`real-time-users ${className}`}>
            <div className="real-time-header">
                <h3>Real-Time Users</h3>
                <div className="real-time-controls">
                    <button
                        className="refresh-button"
                        onClick={handleManualRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? '🔄' : '↻'}
                    </button>
                    {autoRefresh && (
                        <div className="countdown">
                            <span className="countdown-text">Next update: {countdown}s</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="real-time-content">
                {isLoading ? (
                    <div className="loading-real-time">
                        <div className="loading-active-users">
                            <div className="loading-number"></div>
                            <div className="loading-label"></div>
                        </div>
                        <div className="loading-pages">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="loading-page-item">
                                    <div className="loading-page-info"></div>
                                    <div className="loading-page-count"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="active-users-section">
                            <div className="active-users-count">
                                <span className="users-number">
                                    {displayData?.activeUsers || 0}
                                </span>
                                <span className="users-label">Active Users</span>
                            </div>
                            <div className="live-indicator">
                                <span className="live-dot"></span>
                                <span className="live-text">LIVE</span>
                            </div>
                        </div>

                        <div className="active-pages-section">
                            <h4 className="section-title">Active Pages</h4>

                            {displayData?.activePages && displayData.activePages.length > 0 ? (
                                <div className="pages-list">
                                    {displayData.activePages.map((page, index) => (
                                        <div key={page.page} className="page-item">
                                            <div className="page-rank">#{index + 1}</div>

                                            <div className="page-info">
                                                <div className="page-header">
                                                    <span className="page-icon">{getPageIcon(page.page)}</span>
                                                    <span className="page-title">
                                                        {page.title || formatPagePath(page.page)}
                                                    </span>
                                                </div>
                                                <div className="page-path">{page.page}</div>
                                            </div>

                                            <div className="page-users">
                                                <span
                                                    className="user-count"
                                                    style={{ color: getUserCountColor(page.users) }}
                                                >
                                                    {page.users}
                                                </span>
                                                <span className="user-label">
                                                    {page.users === 1 ? 'user' : 'users'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-active-pages">
                                    <span className="no-activity-icon">😴</span>
                                    <p>No active pages right now</p>
                                </div>
                            )}
                        </div>

                        {displayData?.lastUpdated && (
                            <div className="last-updated">
                                <small>
                                    Last updated: {displayData.lastUpdated.toLocaleTimeString()}
                                </small>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
        .real-time-users {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          min-height: 350px;
        }

        .real-time-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .real-time-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .real-time-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .refresh-button {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .refresh-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .countdown {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .real-time-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .loading-real-time {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .loading-active-users {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .loading-number {
          width: 80px;
          height: 3rem;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .loading-label {
          width: 100px;
          height: 1rem;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .loading-pages {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loading-page-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading-page-info {
          width: 60%;
          height: 1rem;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .loading-page-count {
          width: 30px;
          height: 1rem;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .active-users-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 8px;
          border: 1px solid #bae6fd;
        }

        .active-users-count {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .users-number {
          font-size: 3rem;
          font-weight: 700;
          color: #0369a1;
          line-height: 1;
        }

        .users-label {
          font-size: 0.875rem;
          color: #0369a1;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .live-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #ef4444;
          letter-spacing: 0.1em;
        }

        .active-pages-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .pages-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .page-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .page-item:hover {
          background-color: #f9fafb;
        }

        .page-rank {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          min-width: 24px;
        }

        .page-info {
          flex: 1;
          min-width: 0;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .page-icon {
          font-size: 1rem;
        }

        .page-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          truncate: true;
        }

        .page-path {
          font-size: 0.75rem;
          color: #6b7280;
          font-family: monospace;
        }

        .page-users {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
          min-width: 60px;
        }

        .user-count {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .user-label {
          font-size: 0.625rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .no-active-pages {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #6b7280;
        }

        .no-activity-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .last-updated {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .last-updated small {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 768px) {
          .real-time-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .real-time-controls {
            justify-content: center;
          }

          .active-users-section {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .page-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .page-users {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
          }

          .real-time-users {
            padding: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default RealTimeUsers;
