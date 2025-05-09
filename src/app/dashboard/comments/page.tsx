"use client";

import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import DashboardNavigation from '../components/DashboardNavigation';
import PlaceholderContent from '../components/PlaceholderContent';

export default function CommentsPage() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <DashboardHeader user={user} />
            <DashboardNavigation activeTab="comments" />
            <div className="dashboard-content">
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Comments</h2>
                        <p>Manage comments on your blog posts</p>
                    </div>
                    <PlaceholderContent
                        icon="message"
                        title="Comment Management Coming Soon"
                        description="This section will let you view, moderate, and respond to comments on your blog posts."
                    />
                </div>
            </div>
        </div>
    );
}