import Icon from '@/components/Icon';
import { DashboardStat } from '@/lib/api/dashboardService';

type StatsSectionProps = {
    stats: DashboardStat[];
};

export default function StatsSection({ stats }: StatsSectionProps) {
    return (
        <div className="stats-section">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>
        </div>
    );
}

type StatCardProps = {
    stat: DashboardStat;
};

function StatCard({ stat }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
                <Icon name={stat.icon} size={24} />
            </div>
            <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
            </div>
        </div>
    );
}