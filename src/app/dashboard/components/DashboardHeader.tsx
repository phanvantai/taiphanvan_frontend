import Link from 'next/link';
import Icon from '@/components/Icon';
import { User } from '@/models/User';

type DashboardHeaderProps = {
    user: User | null;
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <div className="dashboard-header">
            <div className="welcome-section">
                <h1 className="dashboard-title">
                    Welcome back, {user?.firstName || user?.username || 'User'}!
                </h1>
                <p className="dashboard-subtitle">
                    Here&apos;s what&apos;s happening with your blog today.
                </p>
            </div>
            <div className="dashboard-actions">
                <Link href="/blog/create" className="create-post-button">
                    <span className="create-post-icon">
                        <Icon name="plus" size={20} />
                    </span>
                    New Post
                </Link>
            </div>
        </div>
    );
}