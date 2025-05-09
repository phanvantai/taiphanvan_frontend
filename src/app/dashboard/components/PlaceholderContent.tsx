import Link from 'next/link';

type PlaceholderContentProps = {
    icon: 'file' | 'message' | 'chart';
    title: string;
    description: string;
    actionText?: string;
    actionLink?: string;
};

export default function PlaceholderContent({ icon, title, description, actionText, actionLink }: PlaceholderContentProps) {
    return (
        <div className="content-placeholder">
            <div className="placeholder-icon">
                {icon === 'file' && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                )}
                {icon === 'message' && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
                {icon === 'chart' && (
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                )}
            </div>
            <h3 className="placeholder-title">{title}</h3>
            <p className="placeholder-description">{description}</p>
            {actionText && actionLink && (
                <Link href={actionLink} className="placeholder-action">
                    {actionText}
                </Link>
            )}
        </div>
    );
}