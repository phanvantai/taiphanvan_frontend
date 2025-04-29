"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
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
                        <span className="logo-text">My Personal Blog</span>
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
                    <Link href="/blog" className="nav-link">
                        Blog
                    </Link>
                    <Link href="/about" className="nav-link">
                        About
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}