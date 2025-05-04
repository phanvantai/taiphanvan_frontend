'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateArticleButton() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    // Only show the button if the user is authenticated and has admin role
    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    const handleClick = () => {
        console.log('Navigating to create page');
        router.push('/blog/create');
    };

    return (
        <button
            onClick={handleClick}
            className="btn btn-primary create-article-btn"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: isHovered ? '0 6px 10px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                transform: isHovered ? 'translateY(-3px)' : 'translateY(0)'
            }}
        >
            <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem' }}></i>
            Create New Article
        </button>
    );
}