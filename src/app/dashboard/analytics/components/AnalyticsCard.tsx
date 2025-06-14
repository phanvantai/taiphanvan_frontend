/**
 * Analytics Card Component
 * Displays individual metrics with trend indicators and loading states
 */

'use client';

import React from 'react';

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    previousValue?: string | number;
    icon?: string;
    description?: string;
    isLoading?: boolean;
    error?: string;
    className?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendPercentage?: number;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
    title,
    value,
    previousValue,
    icon,
    description,
    isLoading = false,
    error,
    className = '',
    trend,
    trendPercentage
}) => {
    const formatValue = (val: string | number): string => {
        if (typeof val === 'number') {
            if (val >= 1000000) {
                return (val / 1000000).toFixed(1) + 'M';
            }
            if (val >= 1000) {
                return (val / 1000).toFixed(1) + 'K';
            }
            return val.toLocaleString();
        }
        return val;
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return '↗️';
            case 'down':
                return '↘️';
            default:
                return '➡️';
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return '#10b981'; // green
            case 'down':
                return '#ef4444'; // red
            default:
                return '#6b7280'; // gray
        }
    };

    if (error) {
        return (
            <div className={`analytics-card error ${className}`}>
                <div className="card-header">
                    <h3>{title}</h3>
                    {icon && <span className="card-icon">{icon}</span>}
                </div>
                <div className="error-content">
                    <span className="error-icon">⚠️</span>
                    <p>Failed to load data</p>
                    <small>{error}</small>
                </div>
                <style jsx>{`
          .analytics-card.error {
            border: 1px solid #fee2e2;
            background: #fef2f2;
          }
          .error-content {
            text-align: center;
            padding: 1rem 0;
            color: #dc2626;
          }
          .error-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            display: block;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className={`analytics-card ${className}`}>
            <div className="card-header">
                <h3>{title}</h3>
                {icon && <span className="card-icon">{icon}</span>}
            </div>

            <div className="card-content">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="skeleton-value"></div>
                        <div className="skeleton-trend"></div>
                    </div>
                ) : (
                    <>
                        <div className="main-value">
                            {formatValue(value)}
                        </div>

                        {trendPercentage !== undefined && (
                            <div className="trend-indicator" style={{ color: getTrendColor() }}>
                                <span className="trend-icon">{getTrendIcon()}</span>
                                <span className="trend-text">
                                    {Math.abs(trendPercentage).toFixed(1)}%
                                </span>
                            </div>
                        )}

                        {description && (
                            <p className="card-description">{description}</p>
                        )}

                        {previousValue && (
                            <small className="previous-value">
                                Previous: {formatValue(previousValue)}
                            </small>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
        .analytics-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s;
        }

        .analytics-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h3 {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .card-icon {
          font-size: 1.25rem;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .main-value {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }

        .trend-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .trend-icon {
          font-size: 1rem;
        }

        .card-description {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .previous-value {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .skeleton-value {
          height: 2rem;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 60%;
        }

        .skeleton-trend {
          height: 1rem;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 40%;
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
          .analytics-card {
            padding: 1rem;
          }
          
          .main-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default AnalyticsCard;
