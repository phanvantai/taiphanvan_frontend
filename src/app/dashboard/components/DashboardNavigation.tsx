import Link from 'next/link';
import Icon from '@/components/Icon';

type TabType = 'overview' | 'posts' | 'comments' | 'analytics';

type DashboardNavigationProps = {
    activeTab: TabType;
};

export default function DashboardNavigation({ activeTab }: DashboardNavigationProps) {
    return (
        <div className="dashboard-nav">
            <NavTab
                icon="grid"
                label="Overview"
                path="/dashboard/overview"
                isActive={activeTab === 'overview'}
            />
            <NavTab
                icon="file"
                label="Posts"
                path="/dashboard/posts"
                isActive={activeTab === 'posts'}
            />
            <NavTab
                icon="message"
                label="Comments"
                path="/dashboard/comments"
                isActive={activeTab === 'comments'}
            />
            <NavTab
                icon="chart"
                label="Analytics"
                path="/dashboard/analytics"
                isActive={activeTab === 'analytics'}
            />
        </div>
    );
}

type IconType = 'grid' | 'file' | 'message' | 'chart';

type NavTabProps = {
    icon: IconType;
    label: string;
    path: string;
    isActive: boolean;
};

function NavTab({ icon, label, path, isActive }: NavTabProps) {
    return (
        <Link href={path} className={`nav-tab ${isActive ? 'active' : ''}`}>
            <Icon name={icon} size={18} />
            {label}
        </Link>
    );
}