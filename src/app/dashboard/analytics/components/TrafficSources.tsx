/**
 * Traffic Sources Component
 * Displays traffic sources with pie chart visualization and breakdown table
 */

'use client';

import React, { useState } from 'react';

interface TrafficSource {
    source: string;
    medium: string;
    sessions: number;
    percentage: number;
    change?: number; // percentage change from previous period
}

interface TrafficSourcesProps {
    sources?: TrafficSource[];
    isLoading?: boolean;
    error?: string;
    timeRange?: '7d' | '30d' | '90d';
    onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
    className?: string;
}

export const TrafficSources: React.FC<TrafficSourcesProps> = ({
    sources = [],
    isLoading = false,
    error,
    timeRange = '30d',
    onTimeRangeChange,
    className = ''
}) => {
    const [view, setView] = useState<'chart' | 'table'>('chart');

    // Generate sample data if none provided
    const sampleSources: TrafficSource[] = [
        {
            source: 'google',
            medium: 'organic',
            sessions: 1245,
            percentage: 42.5,
            change: 8.2
        },
        {
            source: 'direct',
            medium: '(none)',
            sessions: 856,
            percentage: 29.1,
            change: -2.4
        },
        {
            source: 'twitter.com',
            medium: 'social',
            sessions: 423,
            percentage: 14.4,
            change: 15.7
        },
        {
            source: 'github.com',
            medium: 'referral',
            sessions: 287,
            percentage: 9.8,
            change: 3.2
        },
        {
            source: 'linkedin.com',
            medium: 'social',
            sessions: 123,
            percentage: 4.2,
            change: -0.8
        }
    ];

    const displaySources = sources.length > 0 ? sources : sampleSources;
    const totalSessions = displaySources.reduce((sum, source) => sum + source.sessions, 0);

    // Colors for pie chart
    const colors = [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // yellow
        '#ef4444', // red
        '#8b5cf6', // purple
        '#06b6d4', // cyan
        '#84cc16', // lime
        '#f97316'  // orange
    ];

    const getSourceIcon = (source: string, medium: string): string => {
        if (medium === 'organic') return '🔍';
        if (medium === 'social') {
            if (source.includes('twitter')) return '🐦';
            if (source.includes('linkedin')) return '💼';
            if (source.includes('facebook')) return '📘';
            return '📱';
        }
        if (source === 'direct') return '🔗';
        if (medium === 'referral') return '🔗';
        if (medium === 'email') return '📧';
        return '🌐';
    };

    const formatSessions = (sessions: number): string => {
        if (sessions >= 1000) {
            return (sessions / 1000).toFixed(1) + 'k';
        }
        return sessions.toString();
    };

    const getTrendColor = (change?: number): string => {
        if (!change) return '#6b7280';
        return change > 0 ? '#10b981' : '#ef4444';
    };

    const getTrendIcon = (change?: number): string => {
        if (!change) return '➡️';
        return change > 0 ? '↗️' : '↘️';
    };

    // Calculate pie chart paths
    const createPieSlice = (percentage: number, startAngle: number, color: string, index: number) => {
        const angle = (percentage / 100) * 360;
        const endAngle = startAngle + angle;

        const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
        const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

        const largeArcFlag = angle > 180 ? 1 : 0;

        return (
            <g key={index}>
                <path
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={color}
                    className="pie-slice"
                />
            </g>
        );
    };

    if (error) {
        return (
            <div className={`traffic-sources error ${className}`}>
                <div className="sources-header">
                    <h3>Traffic Sources</h3>
                </div>
                <div className="error-content">
                    <span className="error-icon">📊</span>
                    <p>Unable to load traffic data</p>
                    <small>{error}</small>
                </div>
                <style jsx>{`
          .traffic-sources.error {
            border: 1px solid #fee2e2;
            background: #fef2f2;
            min-height: 300px;
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
        <div className={`traffic-sources ${className}`}>
            <div className="sources-header">
                <h3>Traffic Sources</h3>
                <div className="sources-controls">
                    <div className="view-selector">
                        <button
                            className={view === 'chart' ? 'active' : ''}
                            onClick={() => setView('chart')}
                        >
                            Chart
                        </button>
                        <button
                            className={view === 'table' ? 'active' : ''}
                            onClick={() => setView('table')}
                        >
                            Table
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

            <div className="sources-content">
                {isLoading ? (
                    <div className="loading-sources">
                        <div className="loading-chart">
                            <div className="loading-pie"></div>
                        </div>
                        <div className="loading-legend">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="loading-legend-item">
                                    <div className="loading-color"></div>
                                    <div className="loading-text"></div>
                                    <div className="loading-value"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {view === 'chart' ? (
                            <div className="chart-view">
                                <div className="pie-chart-container">
                                    <svg viewBox="0 0 200 200" className="pie-chart">
                                        {displaySources.map((source, index) => {
                                            const startAngle = displaySources
                                                .slice(0, index)
                                                .reduce((sum, s) => sum + (s.percentage / 100) * 360, -90);
                                            return createPieSlice(source.percentage, startAngle, colors[index % colors.length], index);
                                        })}

                                        {/* Center circle for donut effect */}
                                        <circle cx="100" cy="100" r="35" fill="white" />

                                        {/* Center text */}
                                        <text x="100" y="95" textAnchor="middle" className="center-text-label">
                                            Total
                                        </text>
                                        <text x="100" y="110" textAnchor="middle" className="center-text-value">
                                            {formatSessions(totalSessions)}
                                        </text>
                                    </svg>
                                </div>

                                <div className="chart-legend">
                                    {displaySources.map((source, index) => (
                                        <div key={`${source.source}-${source.medium}`} className="legend-item">
                                            <div className="legend-item-header">
                                                <span
                                                    className="legend-color"
                                                    style={{ backgroundColor: colors[index % colors.length] }}
                                                ></span>
                                                <span className="legend-icon">
                                                    {getSourceIcon(source.source, source.medium)}
                                                </span>
                                                <span className="legend-label">
                                                    {source.source === 'direct' ? 'Direct' : source.source}
                                                </span>
                                            </div>
                                            <div className="legend-stats">
                                                <span className="legend-percentage">{source.percentage.toFixed(1)}%</span>
                                                <span className="legend-sessions">{formatSessions(source.sessions)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="table-view">
                                <div className="sources-table">
                                    <div className="table-header">
                                        <div className="header-cell">Source / Medium</div>
                                        <div className="header-cell">Sessions</div>
                                        <div className="header-cell">Percentage</div>
                                        <div className="header-cell">Change</div>
                                    </div>

                                    {displaySources.map((source, index) => (
                                        <div key={`${source.source}-${source.medium}`} className="table-row">
                                            <div className="table-cell source-cell">
                                                <span className="source-icon">
                                                    {getSourceIcon(source.source, source.medium)}
                                                </span>
                                                <div className="source-info">
                                                    <div className="source-name">
                                                        {source.source === 'direct' ? 'Direct' : source.source}
                                                    </div>
                                                    <div className="source-medium">{source.medium}</div>
                                                </div>
                                            </div>
                                            <div className="table-cell">{source.sessions.toLocaleString()}</div>
                                            <div className="table-cell">
                                                <div className="percentage-bar">
                                                    <div
                                                        className="percentage-fill"
                                                        style={{
                                                            width: `${source.percentage}%`,
                                                            backgroundColor: colors[index % colors.length]
                                                        }}
                                                    ></div>
                                                    <span className="percentage-text">{source.percentage.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                            <div className="table-cell">
                                                {source.change !== undefined && (
                                                    <span
                                                        className="change-indicator"
                                                        style={{ color: getTrendColor(source.change) }}
                                                    >
                                                        <span className="change-icon">{getTrendIcon(source.change)}</span>
                                                        {Math.abs(source.change).toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
        .traffic-sources {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .sources-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .sources-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .sources-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .view-selector {
          display: flex;
          gap: 0.5rem;
        }

        .view-selector button {
          padding: 0.25rem 0.75rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .view-selector button.active,
        .view-selector button:hover {
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

        .sources-content {
          min-height: 300px;
        }

        .loading-sources {
          display: flex;
          gap: 2rem;
          height: 300px;
        }

        .loading-chart {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-pie {
          width: 150px;
          height: 150px;
          border: 12px solid #f3f4f6;
          border-top: 12px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loading-legend-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .loading-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        .loading-text {
          flex: 1;
          height: 16px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .loading-value {
          width: 40px;
          height: 16px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .chart-view {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .pie-chart-container {
          flex: 1;
          max-width: 250px;
        }

        .pie-chart {
          width: 100%;
          height: auto;
        }

        .pie-slice {
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .pie-slice:hover {
          opacity: 0.8;
        }

        .center-text-label {
          font-size: 12px;
          fill: #6b7280;
          font-weight: 500;
        }

        .center-text-value {
          font-size: 16px;
          fill: #111827;
          font-weight: 700;
        }

        .chart-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .legend-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .legend-item:hover {
          background-color: #f9fafb;
        }

        .legend-item-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .legend-icon {
          font-size: 1rem;
        }

        .legend-label {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
          text-transform: capitalize;
        }

        .legend-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }

        .legend-percentage {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
        }

        .legend-sessions {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .table-view {
          overflow-x: auto;
        }

        .sources-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 2fr 1fr;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 0.5rem;
        }

        .header-cell {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 2fr 1fr;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
          align-items: center;
        }

        .table-row:hover {
          background-color: #f9fafb;
          margin: 0 -1rem;
          padding: 0.75rem 1rem;
          border-radius: 6px;
        }

        .table-cell {
          font-size: 0.875rem;
          color: #374151;
        }

        .source-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .source-icon {
          font-size: 1.25rem;
        }

        .source-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .source-name {
          font-weight: 600;
          color: #111827;
          text-transform: capitalize;
        }

        .source-medium {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .percentage-bar {
          position: relative;
          height: 20px;
          background: #f3f4f6;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .percentage-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .percentage-text {
          position: absolute;
          right: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .change-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .change-icon {
          font-size: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .sources-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .sources-controls {
            flex-direction: column;
            gap: 0.75rem;
          }

          .chart-view {
            flex-direction: column;
            gap: 1.5rem;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .header-cell:not(:first-child),
          .table-cell:not(:first-child) {
            display: none;
          }

          .traffic-sources {
            padding: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default TrafficSources;
