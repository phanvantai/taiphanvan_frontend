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
    const { isAuthenticated, isLoading, user } = useAuth();

    // Check if user has admin or editor role
    const hasAdminAccess = user?.role === 'admin' || user?.role === 'editor';

    useEffect(() => {
        // Redirect to home if not authenticated or doesn't have admin/editor role
        if (!isLoading) {
            // First check if not authenticated at all
            if (!isAuthenticated) {
                redirect('/login?redirect=/dashboard');
            }
            // Then check if authenticated but doesn't have admin/editor role
            else if (!hasAdminAccess) {
                redirect('/');
            }
        }
    }, [isAuthenticated, isLoading, hasAdminAccess]);

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

    // Only render children if authenticated and has admin access
    return hasAdminAccess ? (
        <div className="dashboard-layout">
            <div className="dashboard-container">
                {children}
            </div>
        </div>
    ) : null; // This null should never be rendered due to the redirect in useEffect
}