import { ReactNode } from 'react';

interface AppsLayoutProps {
    children: ReactNode;
}

export default function AppsLayout({ children }: AppsLayoutProps) {
    return (
        <main className="pt-20">
            {children}
        </main>
    );
}
