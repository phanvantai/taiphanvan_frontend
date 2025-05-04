'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import '@/styles/auth-error.css';

interface AuthErrorMessageProps {
    redirectPath?: string;
}

const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({
    redirectPath = '/login'
}) => {
    const { error, clearError } = useAuth();
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [dismissing, setDismissing] = useState(false);

    useEffect(() => {
        if (error) {
            setVisible(true);
            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                handleDismiss();
            }, 5000);

            return () => clearTimeout(timer);
        } else {
            setVisible(false);
            setDismissing(false);
        }
    }, [error]);

    const handleDismiss = () => {
        setDismissing(true);
        setTimeout(() => {
            clearError();
            setDismissing(false);
        }, 300); // Match transition duration
    };

    const handleRedirect = () => {
        clearError();
        router.push(redirectPath);
    };

    if (!error) return null;

    return (
        <div className={`auth-error-message ${visible ? 'visible' : ''} ${dismissing ? 'dismissing' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Authentication Error</div>
                <button
                    onClick={handleDismiss}
                    className="dismiss"
                >
                    ×
                </button>
            </div>
            <div>{error}</div>
            {error.includes('expired') || error.includes('log in again') ? (
                <button
                    onClick={handleRedirect}
                    className="login"
                >
                    Go to Login
                </button>
            ) : null}
        </div>
    );
};

export default AuthErrorMessage;