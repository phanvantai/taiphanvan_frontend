'use client';

import React, { useEffect, useState } from 'react';

interface ErrorMessageProps {
    message: string | null;
    onClear: () => void;
}

export default function ErrorMessage({ message, onClear }: ErrorMessageProps) {
    // Use local state to prevent unmounting issues
    const [localMessage, setLocalMessage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Update local state when prop changes
    useEffect(() => {
        if (message) {
            setLocalMessage(message);
            setIsVisible(true);
        } else {
            setIsVisible(false);
            // Only clear the message after the fade-out animation
            const timer = setTimeout(() => {
                setLocalMessage(null);
            }, 300); // Match this with your transition duration
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // First set visibility to false to trigger fade-out
        setIsVisible(false);

        // Call the parent's clear function after animation
        setTimeout(() => {
            onClear();
        }, 300); // Match this with your transition duration
    };

    // Always render the container, but conditionally show content
    return (
        <div
            style={{
                marginBottom: '1.5rem',
                padding: localMessage ? '0.75rem 1rem' : 0,
                height: localMessage ? 'auto' : 0,
                overflow: 'hidden',
                borderRadius: '5px',
                backgroundColor: localMessage ? 'rgba(220, 53, 69, 0.1)' : 'transparent',
                borderLeft: localMessage ? '4px solid var(--danger-color)' : 'none',
                color: 'var(--danger-color)',
                display: 'flex',
                alignItems: 'center',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s ease',
                pointerEvents: isVisible ? 'auto' : 'none'
            }}
            role={localMessage ? "alert" : undefined}
        >
            {localMessage && (
                <>
                    <i className="fas fa-exclamation-circle" style={{ marginRight: '0.75rem' }}></i>
                    <span style={{ flex: 1 }}>{localMessage}</span>
                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--danger-color)'
                        }}
                        type="button"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </>
            )}
        </div>
    );
}