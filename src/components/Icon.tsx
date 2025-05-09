'use client';

import React from 'react';

// All available icon types we use in the dashboard
type IconName =
    | 'grid'
    | 'file'
    | 'message'
    | 'chart'
    | 'file-text'
    | 'eye'
    | 'message-circle'
    | 'clock'
    | 'calendar'
    | 'edit'
    | 'view'
    | 'publish'
    | 'plus'
    | 'search'
    | 'chevron-right';

type IconProps = {
    name: IconName;
    size?: number;
    className?: string;
    strokeWidth?: number;
};

/**
 * Icon component that renders SVG icons
 * Centralizes all SVG icons for better maintainability
 */
export default function Icon({ name, size = 24, className = '', strokeWidth = 2 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {renderPath(name)}
        </svg>
    );
}

function renderPath(name: IconName) {
    switch (name) {
        case 'grid':
            return (
                <>
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </>
            );
        case 'file':
            return (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </>
            );
        case 'message':
            return (
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            );
        case 'chart':
            return (
                <>
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </>
            );
        case 'file-text':
            return (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </>
            );
        case 'eye':
            return (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </>
            );
        case 'message-circle':
            return (
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            );
        case 'clock':
            return (
                <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </>
            );
        case 'calendar':
            return (
                <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </>
            );
        case 'edit':
            return (
                <>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </>
            );
        case 'view':
            return (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </>
            );
        case 'publish':
            return (
                <>
                    <path d="M22 2v16h-20v-16h20z"></path>
                    <path d="M22 18H2a10 10 0 0 0 10 10 10 10 0 0 0 10-10z"></path>
                </>
            );
        case 'plus':
            return (
                <>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </>
            );
        case 'search':
            return (
                <>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </>
            );
        case 'chevron-right':
            return (
                <polyline points="9 18 15 12 9 6"></polyline>
            );
        default:
            return null;
    }
}
