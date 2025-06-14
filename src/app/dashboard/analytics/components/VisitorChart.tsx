/**
 * Visitor Chart Component
 * Interactive chart showing visitor trends over time
 */

'use client';

import React, { useState } from 'react';

interface VisitorDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

interface VisitorChartProps {
  data?: VisitorDataPoint[];
  isLoading?: boolean;
  error?: string;
  timeRange?: '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
  className?: string;
}

export const VisitorChart: React.FC<VisitorChartProps> = ({
  data = [],
  isLoading = false,
  error,
  timeRange = '30d',
  onTimeRangeChange,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'visitors' | 'pageViews'>('visitors');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Generate sample data if none provided
  const sampleData: VisitorDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    visitors: Math.floor(Math.random() * 200) + 50,
    pageViews: Math.floor(Math.random() * 500) + 100
  })); const chartData = data.length > 0 ? data : sampleData;
  const maxValue = Math.max(...chartData.map(d => d[selectedMetric]));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className={`visitor-chart error ${className}`}>
        <div className="chart-header">
          <h3>Visitor Trends</h3>
        </div>
        <div className="error-content">
          <span className="error-icon">📊</span>
          <p>Unable to load chart data</p>
          <small>{error}</small>
        </div>
        <style jsx>{`
          .visitor-chart.error {
            border: 1px solid #fee2e2;
            background: #fef2f2;
            min-height: 300px;
            display: flex;
            flex-direction: column;
          }
          .error-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #dc2626;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`visitor-chart ${className}`}>
      <div className="chart-header">
        <h3>Visitor Trends</h3>
        <div className="chart-controls">
          <div className="metric-selector">
            <button
              className={selectedMetric === 'visitors' ? 'active' : ''}
              onClick={() => setSelectedMetric('visitors')}
            >
              Visitors
            </button>
            <button
              className={selectedMetric === 'pageViews' ? 'active' : ''}
              onClick={() => setSelectedMetric('pageViews')}
            >
              Page Views
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

      <div className="chart-content">
        {isLoading ? (
          <div className="loading-chart">
            <div className="loading-bars">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="loading-bar"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
            <p>Loading chart data...</p>
          </div>
        ) : (
          <>
            <div className="chart-area">
              <svg viewBox="0 0 800 200" className="chart-svg">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2="800"
                    y2={i * 40}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}

                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 800;
                    const y = 200 - (point[selectedMetric] / maxValue) * 180;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Data points */}
                {chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 800;
                  const y = 200 - (point[selectedMetric] / maxValue) * 180;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={hoveredPoint === index ? "6" : "4"}
                      fill="#3b82f6"
                      className="data-point"
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredPoint !== null && (
                <div
                  className="chart-tooltip"
                  style={{
                    left: `${(hoveredPoint / (chartData.length - 1)) * 100}%`,
                    transform: hoveredPoint > chartData.length / 2 ? 'translateX(-100%)' : 'none'
                  }}
                >
                  <div className="tooltip-content">
                    <div className="tooltip-date">
                      {formatDate(chartData[hoveredPoint].date)}
                    </div>
                    <div className="tooltip-value">
                      {selectedMetric === 'visitors' ? 'Visitors' : 'Page Views'}: {chartData[hoveredPoint][selectedMetric].toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
                <span>{selectedMetric === 'visitors' ? 'Unique Visitors' : 'Page Views'}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .visitor-chart {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .chart-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .metric-selector {
          display: flex;
          gap: 0.5rem;
        }

        .metric-selector button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .metric-selector button.active,
        .metric-selector button:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .time-range-selector {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 0.875rem;
        }

        .chart-content {
          position: relative;
          min-height: 250px;
        }

        .loading-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 250px;
          color: #6b7280;
        }

        .loading-bars {
          display: flex;
          gap: 8px;
          align-items: end;
          height: 100px;
          margin-bottom: 1rem;
        }

        .loading-bar {
          width: 12px;
          background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
          border-radius: 2px;
          animation: pulse 1.5s infinite;
        }

        .chart-area {
          position: relative;
          height: 200px;
          margin-bottom: 1rem;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
        }

        .data-point {
          cursor: pointer;
          transition: r 0.2s;
        }

        .chart-tooltip {
          position: absolute;
          top: -60px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          pointer-events: none;
          z-index: 10;
        }

        .tooltip-content {
          text-align: center;
        }

        .tooltip-date {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .chart-controls {
            flex-direction: column;
            gap: 0.75rem;
          }

          .visitor-chart {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VisitorChart;
