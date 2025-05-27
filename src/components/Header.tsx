"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import ColorPicker from './ColorPicker';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [appsMenuOpen, setAppsMenuOpen] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const appsMenuRef = useRef<HTMLDivElement>(null);
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
            if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) {
                setAppsMenuOpen(false);
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
                        <div className="apps-menu-container relative" ref={appsMenuRef}>
                            <button
                                className="nav-link apps-menu-button"
                                onClick={() => setAppsMenuOpen(!appsMenuOpen)}
                                aria-expanded={appsMenuOpen}
                                aria-haspopup="true"
                            >
                                Apps
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
                                    className={`chevron-icon ${appsMenuOpen ? 'rotate' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {appsMenuOpen && (
                                <div className="apps-dropdown">
                                    <div className="apps-dropdown-header">
                                        Mini Tools & Games
                                    </div>
                                    <div className="apps-dropdown-menu">
                                        <Link
                                            href="/apps/typing-speed-test"
                                            className="app-menu-button"
                                            onClick={() => setAppsMenuOpen(false)}
                                        >
                                            <i className="fas fa-keyboard app-menu-icon"></i>
                                            <div className="app-menu-content">
                                                <span className="app-menu-title">Typing Speed Test</span>
                                                <span className="app-menu-description">Test your typing speed and accuracy</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
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
        </>
    );
}