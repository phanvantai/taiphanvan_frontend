'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
    onSuccess?: () => void;
    onLoginClick?: () => void;
    inDialog?: boolean;
}

export default function RegisterForm({ onSuccess, onLoginClick, inDialog = false }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const { register, error, clearError } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear field-specific error when user types
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await register(
                formData.username,
                formData.email,
                formData.password,
                formData.firstName || undefined,
                formData.lastName || undefined
            );

            // Call success callback or redirect
            if (onSuccess) {
                onSuccess();
            } else if (!inDialog) {
                router.push('/login?registered=true');
            }
        } catch (err) {
            // Error is already handled in the auth context
            console.error('Registration failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onLoginClick) {
            onLoginClick();
        } else if (!inDialog) {
            router.push('/login');
        }
    };

    return (
        <div className={inDialog ? "" : "max-w-xl w-full mx-auto"}>
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
                            Create an Account
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
                            Join our community and start sharing your thoughts
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            borderLeft: '4px solid var(--danger-color)',
                            color: 'var(--danger-color)',
                            display: 'flex',
                            alignItems: 'center'
                        }} role="alert">
                            <i className="fas fa-exclamation-circle" style={{ marginRight: '0.75rem' }}></i>
                            <span style={{ flex: 1 }}>{error}</span>
                            <button
                                onClick={clearError}
                                aria-label="Close"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--danger-color)'
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Username and Email */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div>
                                <label
                                    htmlFor="username"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    Username <span style={{ color: 'var(--danger-color)' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '1rem',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary-color)',
                                        pointerEvents: 'none'
                                    }}>
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem 0.8rem 2.5rem',
                                            borderRadius: '30px',
                                            border: formErrors.username
                                                ? '1px solid var(--danger-color)'
                                                : '1px solid var(--border-color)',
                                            backgroundColor: 'var(--background-color)',
                                            color: 'var(--text-color)',
                                            outline: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                        placeholder="Choose a username"
                                        aria-label="Username"
                                        aria-invalid={!!formErrors.username}
                                    />
                                </div>
                                {formErrors.username && (
                                    <p style={{
                                        color: 'var(--danger-color)',
                                        fontSize: '0.875rem',
                                        marginTop: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }} aria-live="polite">
                                        <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>
                                        {formErrors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    Email <span style={{ color: 'var(--danger-color)' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '1rem',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary-color)',
                                        pointerEvents: 'none'
                                    }}>
                                        <i className="far fa-envelope"></i>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem 0.8rem 2.5rem',
                                            borderRadius: '30px',
                                            border: formErrors.email
                                                ? '1px solid var(--danger-color)'
                                                : '1px solid var(--border-color)',
                                            backgroundColor: 'var(--background-color)',
                                            color: 'var(--text-color)',
                                            outline: 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                        placeholder="Your email address"
                                        aria-label="Email"
                                        aria-invalid={!!formErrors.email}
                                    />
                                </div>
                                {formErrors.email && (
                                    <p style={{
                                        color: 'var(--danger-color)',
                                        fontSize: '0.875rem',
                                        marginTop: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }} aria-live="polite">
                                        <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>
                                        {formErrors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* First Name and Last Name */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div>
                                <label
                                    htmlFor="firstName"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    First Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '1rem',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary-color)',
                                        pointerEvents: 'none'
                                    }}>
                                        <i className="fas fa-user-tag"></i>
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
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
                                        placeholder="Your first name"
                                        aria-label="First Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                        color: 'var(--text-color)'
                                    }}
                                >
                                    Last Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '1rem',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary-color)',
                                        pointerEvents: 'none'
                                    }}>
                                        <i className="fas fa-user-tag"></i>
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
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
                                        placeholder="Your last name"
                                        aria-label="Last Name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: 'var(--text-color)'
                                }}
                            >
                                Password <span style={{ color: 'var(--danger-color)' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '1rem',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--primary-color)',
                                    pointerEvents: 'none'
                                }}>
                                    <i className="fas fa-lock"></i>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                                        borderRadius: '30px',
                                        border: formErrors.password
                                            ? '1px solid var(--danger-color)'
                                            : '1px solid var(--border-color)',
                                        backgroundColor: 'var(--background-color)',
                                        color: 'var(--text-color)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="Create a strong password"
                                    aria-label="Password"
                                    aria-invalid={!!formErrors.password}
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
                            {formErrors.password && (
                                <p style={{
                                    color: 'var(--danger-color)',
                                    fontSize: '0.875rem',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }} aria-live="polite">
                                    <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>
                                    {formErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                htmlFor="confirmPassword"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: 'var(--text-color)'
                                }}
                            >
                                Confirm Password <span style={{ color: 'var(--danger-color)' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '1rem',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--primary-color)',
                                    pointerEvents: 'none'
                                }}>
                                    <i className="fas fa-lock"></i>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                                        borderRadius: '30px',
                                        border: formErrors.confirmPassword
                                            ? '1px solid var(--danger-color)'
                                            : '1px solid var(--border-color)',
                                        backgroundColor: 'var(--background-color)',
                                        color: 'var(--text-color)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="Confirm your password"
                                    aria-label="Confirm Password"
                                    aria-invalid={!!formErrors.confirmPassword}
                                />
                            </div>
                            {formErrors.confirmPassword && (
                                <p style={{
                                    color: 'var(--danger-color)',
                                    fontSize: '0.875rem',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }} aria-live="polite">
                                    <i className="fas fa-exclamation-circle" style={{ marginRight: '0.25rem' }}></i>
                                    {formErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '1.5rem',
                                opacity: isSubmitting ? 0.7 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg className="animate-spin" style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </div>
                            ) : 'Create Account'}
                        </button>
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
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {inDialog ? (
                            <a
                                href="#"
                                onClick={handleLoginClick}
                                className="btn btn-secondary"
                                style={{
                                    width: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Log in to your account"
                            >
                                <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
                                Sign In
                            </a>
                        ) : (
                            <Link
                                href="/login"
                                className="btn btn-secondary"
                                style={{
                                    width: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Log in to your account"
                            >
                                <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}