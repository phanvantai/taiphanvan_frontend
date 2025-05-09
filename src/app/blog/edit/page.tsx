'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './edit-redirect.css';

/**
 * Loading component to display while the page is loading
 */
function LoadingComponent() {
    return (
        <div className="loading-container">
            <div className="loading-spinner" aria-label="Loading"></div>
            <p className="loading-text">Preparing edit page...</p>
        </div>
    );
}

/**
 * The main content component that uses searchParams
 */
function EditRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, user, isLoading } = useAuth();

    useEffect(() => {
        // Check if user is authenticated and is an editor
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'editor') {
                console.log('Not authorized, redirecting to blog page');
                router.push('/blog');
                return;
            }

            // Get the post slug from query parameters
            const postSlug = searchParams.get('slug');

            if (postSlug) {
                // Redirect to the edit page with the post slug
                console.log(`Redirecting to edit page for slug: ${postSlug}`);
                router.push(`/blog/edit/${postSlug}`);
            } else {
                // If no slug is provided, redirect back to the blog page
                console.log('No post slug provided, redirecting to blog page');
                router.push('/blog');
            }
        }
    }, [isLoading, isAuthenticated, user, router, searchParams]);

    // Show loading spinner while checking auth
    return <LoadingComponent />;
}

/**
 * Blog Edit Redirect Page
 * 
 * This page serves as an entry point to the edit page.
 * It expects a query parameter 'slug' and redirects to the appropriate edit page.
 * If no slug is provided, it redirects back to the blog page.
 */
export default function BlogEditRedirectPage() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <EditRedirectContent />
        </Suspense>
    );
}