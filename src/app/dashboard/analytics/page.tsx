"use client";

import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import DashboardNavigation from '../components/DashboardNavigation';
import PlaceholderContent from '../components/PlaceholderContent';

export default function AnalyticsPage() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <DashboardHeader user={user} />
            <DashboardNavigation activeTab="analytics" />
            <div className="dashboard-content">
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>Analytics</h2>
                        <p>View blog performance metrics</p>
                    </div>
                    <PlaceholderContent
                        icon="chart"
                        title="Analytics Coming Soon"
                        description="This section will provide detailed analytics about your blog's performance, including page views, reader demographics, and engagement metrics."
                    />
                </div>
            </div>
        </div>
    );
}