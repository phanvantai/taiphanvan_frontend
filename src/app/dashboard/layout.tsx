"use client";

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './dashboard.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!isAuthenticated && !isLoading) {
            redirect('/login?redirect=/dashboard');
        }
    }, [isAuthenticated, isLoading]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="dashboard-layout">
                <div className="dashboard-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Only render children if authenticated
    return (
        <div className="dashboard-layout">
            <div className="dashboard-container">
                {children}
            </div>
        </div>
    );
}