'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import '@/styles/not-found.css';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFound() {
    // Get the current theme and primary color
    const { theme, colorHex } = useTheme();

    // Set the document title and apply theme
    useEffect(() => {
        document.title = 'Page Not Found | Tai Phan Van';

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.setProperty('--primary-color', colorHex);
    }, [theme, colorHex]);

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <i className="fas fa-compass"></i>
                </div>
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>
                <p className="not-found-message">
                    Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="not-found-actions">
                    <Link href="/" className="btn btn-primary">
                        <i className="fas fa-home"></i> Go Home
                    </Link>
                    <Link href="/blog" className="btn btn-secondary">
                        <i className="fas fa-book"></i> Read Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}