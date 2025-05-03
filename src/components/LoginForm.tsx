'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ErrorMessage from './ErrorMessage';

interface LoginFormProps {
    onSuccess?: () => void;
    onRegisterClick?: () => void;
    inDialog?: boolean;
}

export default function LoginForm({ onSuccess, onRegisterClick, inDialog = false }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error, clearError } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent double submission
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Clear any previous errors before attempting login
        clearError();

        try {
            console.log('Submitting login form with email:', email);

            // Wait for login to complete
            await login(email, password);

            console.log('Login successful');

            // Only proceed with navigation if login was successful
            if (onSuccess) {
                onSuccess();
            } else if (!inDialog) {
                router.push('/');
            }
        } catch (err: unknown) {
            // Error is already handled in AuthContext
            console.error('Login form submission failed:', err);
            // We don't need to do anything else here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onRegisterClick) {
            onRegisterClick();
        } else if (!inDialog) {
            router.push('/register');
        }
    };

    return (
        <div className={inDialog ? "" : "max-w-md w-full mx-auto"}>
            <div style={{
                backgroundColor: 'var(--card-bg-color)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px var(--shadow-color)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 className="section-title" style={{
                            fontSize: '2rem',
                            marginBottom: '0.5rem',
                            position: 'relative',
                            textAlign: 'center',
                            color: 'var(--text-color)'
                        }}>
                            Welcome Back
                            <span style={{
                                position: 'absolute',
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '4px',
                                background: 'var(--primary-color)'
                            }}></span>
                        </h2>
                        <p style={{
                            color: 'var(--text-muted-color)',
                            marginTop: '1.5rem'
                        }}>
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Use the separate ErrorMessage component */}
                    <ErrorMessage message={error} onClear={clearError} />

                    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: 'var(--text-color)'
                                }}
                            >
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '1rem',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted-color)',
                                    pointerEvents: 'none'
                                }}>
                                    <i className="far fa-envelope"></i>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                                        borderRadius: '30px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--background-color)',
                                        color: 'var(--text-color)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="your.email@example.com"
                                    aria-label="Email Address"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                            }}>
                                <label
                                    htmlFor="password"
                                    style={{
                                        fontWeight: '500',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--primary-color)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '1rem',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted-color)',
                                    pointerEvents: 'none'
                                }}>
                                    <i className="fas fa-lock"></i>
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                                        borderRadius: '30px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--background-color)',
                                        color: 'var(--text-color)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="••••••••••••"
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '1rem',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted-color)'
                                    }}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                }}
                                aria-busy={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin" style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div style={{ position: 'relative', margin: '2rem 0' }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            height: '1px',
                            backgroundColor: 'var(--border-color)'
                        }}></div>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <span style={{
                                padding: '0 1rem',
                                backgroundColor: 'var(--card-bg-color)',
                                color: 'var(--text-muted-color)',
                                fontSize: '0.875rem'
                            }}>
                                Don&apos;t have an account?
                            </span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {inDialog ? (
                            <a
                                href="#"
                                onClick={handleRegisterClick}
                                className="btn btn-secondary"
                                style={{
                                    width: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.8rem 1rem'
                                }}
                                aria-label="Create an account"
                            >
                                <i className="fas fa-user-plus" style={{ marginRight: '0.5rem' }}></i>
                                Create an Account
                            </a>
                        ) : (
                            <Link
                                href="/register"
                                className="btn btn-secondary"
                                style={{
                                    width: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0.8rem 1rem'
                                }}
                                aria-label="Create an account"
                            >
                                <i className="fas fa-user-plus" style={{ marginRight: '0.5rem' }}></i>
                                Create an Account
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}