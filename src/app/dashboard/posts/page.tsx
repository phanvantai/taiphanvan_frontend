"use client";

import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/Icon';
import DashboardHeader from '../components/DashboardHeader';
import DashboardNavigation from '../components/DashboardNavigation';
import PlaceholderContent from '../components/PlaceholderContent';

export default function PostsPage() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <DashboardHeader user={user} />
            <DashboardNavigation activeTab="posts" />
            <div className="dashboard-content">
                <div className="tab-content">
                    <div className="tab-header">
                        <h2>All Posts</h2>
                        <p>Manage all your blog posts</p>
                    </div>
                    <div className="posts-manager">
                        <div className="filters-bar">
                            <div className="search-box">
                                <Icon name="search" size={18} />
                                <input type="text" placeholder="Search posts..." />
                            </div>
                            <div className="filter-options">
                                <select className="status-filter">
                                    <option value="all">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <select className="sort-filter">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>

                        <PlaceholderContent
                            icon="file"
                            title="Post Management Coming Soon"
                            description="This section will let you manage all your blog posts, including filtering, searching, and bulk actions."
                            actionText="Create New Post"
                            actionLink="/blog/create"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}