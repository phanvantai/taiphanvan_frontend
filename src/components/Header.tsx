"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import ColorPicker from './ColorPicker';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { user, logout, isAuthenticated } = useAuth();

    // Check if user has admin or editor role
    const hasAdminAccess = user?.role === 'admin' || user?.role === 'editor';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
    };

    const openLoginDialog = () => {
        setShowLoginDialog(true);
        setShowRegisterDialog(false);
        setIsMenuOpen(false);
    };

    const openRegisterDialog = () => {
        setShowRegisterDialog(true);
        setShowLoginDialog(false);
        setIsMenuOpen(false);
    };

    const closeDialogs = () => {
        // Use setTimeout to ensure React has time to process state changes
        setTimeout(() => {
            setShowLoginDialog(false);
            setShowRegisterDialog(false);
        }, 0);
    };

    const switchToRegister = () => {
        // First hide login dialog
        setShowLoginDialog(false);
        // Then show register dialog after a small delay
        setTimeout(() => {
            setShowRegisterDialog(true);
        }, 50);
    };

    const switchToLogin = () => {
        // First hide register dialog
        setShowRegisterDialog(false);
        // Then show login dialog after a small delay
        setTimeout(() => {
            setShowLoginDialog(true);
        }, 50);
    };

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="logo">
                        <Link href="/">
                            <Image
                                src="/images/logo.png"
                                alt="Blog Logo"
                                width={44}
                                height={44}
                                className="logo-image"
                            />
                            <span className="logo-text">Tai Phan Van</span>
                        </Link>
                    </div>

                    <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
                        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
                    </div>

                    <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <Link href="/" className="nav-link">
                            Home
                        </Link>
                        <Link href="/news" className="nav-link">
                            News
                        </Link>
                        <Link href="/blog" className="nav-link">
                            Blog
                        </Link>
                        {isAuthenticated ? (
                            <div className="relative inline-block user-menu-container" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="user-menu-button"
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="true"
                                >
                                    {user?.profileImage ? (
                                        <div className="user-avatar">
                                            <Image
                                                src={user.profileImage}
                                                alt={user.username}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="user-avatar-placeholder">
                                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                    )}
                                    <span className="username">{user?.username || 'Account'}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`chevron-icon ${userMenuOpen ? 'rotate' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div className="user-dropdown">
                                        <div className="user-dropdown-header">
                                            {user?.profileImage ? (
                                                <div className="user-dropdown-avatar">
                                                    <Image
                                                        src={user.profileImage}
                                                        alt={user.username}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="user-dropdown-avatar-placeholder">
                                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                                </div>
                                            )}
                                            <div className="user-dropdown-info">
                                                <div className="user-dropdown-name">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username}</div>
                                                <div className="user-dropdown-email">{user?.email}</div>
                                            </div>
                                        </div>

                                        <div className="user-dropdown-menu">
                                            <Link
                                                href="/profile"
                                                className="menu-button"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <i className="fas fa-user menu-icon"></i>
                                                Your Profile
                                            </Link>

                                            {/* Only show Dashboard link for admin or editor roles */}
                                            {hasAdminAccess && (
                                                <Link
                                                    href="/dashboard"
                                                    className="menu-button"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <i className="fas fa-tachometer-alt menu-icon"></i>
                                                    Dashboard
                                                </Link>
                                            )}

                                            {/* <Link
                                                href="/settings"
                                                className="menu-button"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <i className="fas fa-cog menu-icon"></i>
                                                Settings
                                            </Link> */}
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="logout-button"
                                        >
                                            <i className="fas fa-sign-out-alt logout-icon"></i>
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={openLoginDialog}
                                    className="auth-btn login-btn"
                                    aria-label="Login"
                                >
                                    <i className="fas fa-sign-in-alt auth-icon"></i>
                                    Login
                                </button>
                                <button
                                    onClick={openRegisterDialog}
                                    className="auth-btn register-btn"
                                    aria-label="Register"
                                >
                                    <i className="fas fa-user-plus auth-icon"></i>
                                    Register
                                </button>
                            </>
                        )}

                        <div className="theme-toggle-wrapper">
                            <ThemeToggle />
                        </div>

                        <ColorPicker />
                    </nav>
                </div>
            </header>

            {/* Login Dialog */}
            {showLoginDialog && (
                <div className="dialog-overlay" onClick={closeDialogs}>
                    <div className="dialog-container" onClick={e => e.stopPropagation()}>
                        <button className="dialog-close" onClick={closeDialogs}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        {/* Use a key to force remounting when dialog opens */}
                        <LoginForm
                            key={`login-form-${Date.now()}`}
                            onSuccess={closeDialogs}
                            onRegisterClick={switchToRegister}
                            inDialog={true}
                        />
                    </div>
                </div>
            )}

            {/* Register Dialog */}
            {showRegisterDialog && (
                <div className="dialog-overlay" onClick={closeDialogs}>
                    <div className="dialog-container" onClick={e => e.stopPropagation()}>
                        <button className="dialog-close" onClick={closeDialogs}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        {/* Use a key to force remounting when dialog opens */}
                        <RegisterForm
                            key={`register-form-${Date.now()}`}
                            onSuccess={() => switchToLogin()}
                            onLoginClick={switchToLogin}
                            inDialog={true}
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                .auth-btn {
                    padding: 0.6rem 1.2rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    border-radius: 30px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    margin-left: 0.75rem;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .auth-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.2) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    transition: all 0.6s ease;
                }
                
                .auth-btn:hover::before {
                    left: 100%;
                }
                
                .auth-icon {
                    margin-right: 0.5rem;
                    font-size: 0.9rem;
                }
                
                .login-btn {
                    background-color: var(--background-alt-color);
                    color: var(--primary-color);
                    border: 1px solid var(--border-color);
                }
                
                .login-btn:hover {
                    background-color: var(--card-bg-color);
                    border-color: var(--primary-color);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                .register-btn {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                }
                
                .register-btn:hover {
                    background-color: var(--secondary-color);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(108, 99, 255, 0.3);
                }
                
                .dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                
                .dialog-container {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    background-color: var(--background-color);
                    border-radius: 10px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    animation: slideUp 0.3s ease;
                }
                
                .dialog-close {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--background-alt-color);
                    border: none;
                    border-radius: 50%;
                    color: var(--text-color);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                }
                
                .dialog-close:hover {
                    background-color: var(--border-color);
                }
                
                /* User Menu Styles */
                .user-menu-container {
                    position: relative;
                }
                
                .user-menu-button {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem;
                    background-color: transparent;
                    border: none;
                    color: var(--text-color);
                    font-weight: 500;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .user-menu-button:hover {
                    color: var(--primary-color);
                }
                
                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 0.75rem;
                    border: 2px solid var(--primary-color);
                }
                
                .user-avatar-placeholder {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-right: 0.75rem;
                }
                
                .username {
                    margin-right: 0.5rem;
                    max-width: 120px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .chevron-icon {
                    transition: transform 0.3s ease;
                }
                
                .chevron-icon.rotate {
                    transform: rotate(180deg);
                }
                
                .user-dropdown {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 0.5rem);
                    width: 280px;
                    background-color: var(--card-bg-color);
                    border-radius: 10px;
                    box-shadow: 0 5px 15px var(--shadow-color);
                    border: 1px solid var(--border-color);
                    z-index: 50;
                    overflow: hidden;
                    animation: fadeIn 0.2s ease, slideDown 0.3s ease;
                }
                
                .user-dropdown-header {
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    background-color: var(--background-alt-color);
                    border-bottom: 1px solid var(--border-color);
                    margin-bottom: 0;
                }
                
                .user-dropdown-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 1rem;
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .user-dropdown-avatar:hover {
                    transform: scale(1.05);
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2);
                    border-color: var(--secondary-color);
                }
                
                .user-dropdown-avatar-placeholder {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background-color: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.25rem;
                    margin-right: 1rem;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                
                .user-dropdown-avatar-placeholder:hover {
                    transform: scale(1.05);
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2);
                    background-color: var(--secondary-color);
                }
                
                .user-dropdown-info {
                    flex: 1;
                    overflow: hidden;
                }
                
                .user-dropdown-name {
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 0.25rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .user-dropdown-email {
                    font-size: 0.875rem;
                    color: var(--text-muted-color);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .user-dropdown-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin: 0.75rem 0.75rem 0;
                }
                
                .menu-button {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    width: 100%;
                    padding: 0.75rem;
                    color: var(--text-color);
                    background-color: var(--background-alt-color);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }
                
                .menu-button:hover {
                    background-color: var(--card-bg-color);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .menu-icon {
                    width: 1.5rem;
                    margin-right: 0.75rem;
                    color: var(--primary-color);
                    font-size: 1.1rem;
                    text-align: center;
                }
                
                .logout-button {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    width: calc(100% - 1.5rem);
                    margin: 0.75rem;
                    padding: 0.75rem;
                    color: var(--danger-color);
                    background-color: rgba(220, 53, 69, 0.05);
                    border: 1px solid rgba(220, 53, 69, 0.3);
                    border-radius: 8px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .logout-button:hover {
                    background-color: rgba(220, 53, 69, 0.1);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 5px rgba(220, 53, 69, 0.2);
                    border-color: rgba(220, 53, 69, 0.5);
                }
                
                .logout-icon {
                    width: 1.5rem;
                    margin-right: 0.75rem;
                    color: var(--danger-color);
                    font-size: 1.1rem;
                    text-align: center;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                /* Theme Toggle Wrapper */
                .theme-toggle-wrapper {
                    margin-right: 1rem;
                    display: inline-flex;
                    align-items: center;
                    vertical-align: middle;
                }
                
                /* Color picker container */
                .color-picker {
                    display: inline-flex;
                    align-items: center;
                    vertical-align: middle;
                }
                
                /* Make theme toggle and color picker visually consistent */
                .theme-toggle-wrapper .theme-toggle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    border: 1px solid var(--border-color);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                /* Add hover animation to theme toggle similar to color picker */
                .theme-toggle-wrapper .theme-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                
                /* Adjust color picker size to 32px */
                .color-picker .color-toggle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    border: 1px solid var(--border-color);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                /* Enhanced hover effect for color picker */
                .color-picker .color-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                
                /* Adjust icon size in color picker */
                .color-picker .color-toggle i {
                    font-size: 0.9rem;
                }
                
                /* Color Picker Styles */
                .color-picker-container {
                    position: relative;
                    margin-right: 0.75rem;
                }
                
                .color-picker-button {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem;
                    background-color: var(--background-alt-color);
                    border: 1px solid var(--border-color);
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .color-picker-button:hover {
                    background-color: var(--card-bg-color);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .color-indicator {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin-right: 0.5rem;
                    border: 2px solid var(--background-color);
                    transition: all 0.3s ease;
                }
                
                .color-dropdown {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 0.5rem);
                    width: 220px;
                    background-color: var(--card-bg-color);
                    border-radius: 10px;
                    box-shadow: 0 5px 15px var(--shadow-color);
                    border: 1px solid var(--border-color);
                    z-index: 50;
                    overflow: hidden;
                    animation: fadeIn 0.2s ease, slideDown 0.3s ease;
                }
                
                .color-dropdown-header {
                    padding: 0.75rem 1rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--text-color);
                    background-color: var(--background-alt-color);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .color-options {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                    padding: 0.75rem;
                }
                
                .color-option {
                    width: 100%;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .color-option:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                
                .color-option.active {
                    border: 2px solid white;
                    box-shadow: 0 0 0 2px var(--text-color);
                }

                @media (max-width: 768px) {
                    .auth-btn {
                        width: 100%;
                        margin: 0.5rem 0;
                        text-align: center;
                        height: 42px;
                    }
                    
                    .login-btn {
                        order: 2;
                    }
                    
                    .register-btn {
                        order: 1;
                        margin-bottom: 0.75rem;
                    }
                    
                    .user-menu-button {
                        width: 100%;
                        justify-content: center;
                        margin: 0.5rem 0;
                    }
                    
                    .user-dropdown {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 90%;
                        max-width: 320px;
                        max-height: 80vh;
                        overflow-y: auto;
                        animation: fadeIn 0.3s ease;
                    }
                    
                    .color-picker-container {
                        margin: 0.5rem 0;
                        width: 100%;
                    }
                    
                    .color-picker-button {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .color-dropdown {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 90%;
                        max-width: 280px;
                        animation: fadeIn 0.3s ease;
                    }
                }
            `}</style>
        </>
    );
}