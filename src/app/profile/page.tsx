'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SmartImage from '@/components/SmartImage';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, updateProfile, uploadAvatar, error, clearError } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        profileImage: ''
    });
    const [formMsg, setFormMsg] = useState({ type: '', message: '' });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Load user data
    useEffect(() => {
        if (user) {
            console.log('User data in profile page:', user);
            console.log('Profile image URL:', user.profileImage);

            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                bio: user.bio || '',
                profileImage: '' // We keep this field in the state but don't use it for form submission
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError?.();
        setFormMsg({ type: '', message: '' });
        setIsSubmitting(true);

        try {
            await updateProfile({
                firstName: formData.firstName || undefined,
                lastName: formData.lastName || undefined,
                bio: formData.bio || undefined
                // profileImage is now handled by the avatar upload functionality
            });

            setFormMsg({ type: 'success', message: 'Profile updated successfully!' });
        } catch {
            // Error is handled in AuthContext
            setFormMsg({ type: 'error', message: error || 'Failed to update profile' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-color"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in the useEffect
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="section-title" style={{
                    fontSize: '2.5rem',
                    marginBottom: '0.5rem',
                    position: 'relative',
                    textAlign: 'center',
                    color: 'var(--text-color)'
                }}>
                    Your Profile
                    <span style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: 'var(--primary-color)'
                    }}></span>
                </h1>
                <p style={{
                    color: 'var(--text-muted-color)',
                    marginTop: '1.5rem'
                }}>
                    Manage your personal information and account settings
                </p>
            </div>

            {formMsg.message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '10px',
                    backgroundColor: formMsg.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                    color: formMsg.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)',
                    border: `1px solid ${formMsg.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'}`,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <i className={`fas ${formMsg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '0.75rem' }}></i>
                    {formMsg.message}
                </div>
            )}

            <div style={{
                backgroundColor: 'var(--card-bg-color)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px var(--shadow-color)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            color: 'var(--text-color)',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '0.75rem'
                        }}>
                            Account Information
                        </h2>

                        {/* Avatar Section */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                backgroundColor: 'var(--primary-color)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                border: '3px solid var(--border-color)',
                                boxShadow: '0 4px 10px var(--shadow-color)'
                            }}>
                                {user.profileImage ? (
                                    <SmartImage
                                        src={user.profileImage}
                                        alt={`${user.username}'s avatar`}
                                        fill
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <span style={{
                                        fontSize: '4rem',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.username.charAt(0)}
                                    </span>
                                )}

                                {/* Edit Icon Overlay */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        width: '100%',
                                        height: '40%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: isUploading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: isUploading ? '0.7' : '0'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = isUploading ? '0.7' : '1';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = isUploading ? '0.7' : '0';
                                    }}
                                >
                                    {isUploading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <svg className="animate-spin" style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span style={{ fontSize: '0.8rem' }}>Uploading...</span>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <i className="fas fa-camera" style={{ marginRight: '0.5rem' }}></i>
                                            <span style={{ fontSize: '0.8rem' }}>Edit</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setIsUploading(true);
                                    clearError?.();
                                    setFormMsg({ type: '', message: '' });

                                    try {
                                        await uploadAvatar(file);
                                        setFormMsg({
                                            type: 'success',
                                            message: 'Avatar uploaded successfully!'
                                        });
                                    } catch {
                                        setFormMsg({
                                            type: 'error',
                                            message: error || 'Failed to upload avatar'
                                        });
                                    } finally {
                                        setIsUploading(false);
                                        // Clear the file input
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            <div style={{
                                backgroundColor: 'var(--background-alt-color)',
                                padding: '1.25rem',
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease'
                            }}>
                                <p style={{
                                    color: 'var(--text-muted-color)',
                                    fontSize: '0.875rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                                    Username
                                </p>
                                <p style={{
                                    fontWeight: '500',
                                    fontSize: '1.125rem'
                                }}>
                                    {user.username}
                                </p>
                            </div>
                            <div style={{
                                backgroundColor: 'var(--background-alt-color)',
                                padding: '1.25rem',
                                borderRadius: '8px',
                                transition: 'transform 0.3s ease'
                            }}>
                                <p style={{
                                    color: 'var(--text-muted-color)',
                                    fontSize: '0.875rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                                    Email
                                </p>
                                <p style={{
                                    fontWeight: '500',
                                    fontSize: '1.125rem'
                                }}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            color: 'var(--text-color)',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '0.75rem'
                        }}>
                            Edit Profile
                        </h2>

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
                                        color: 'var(--text-muted-color)',
                                        pointerEvents: 'none'
                                    }}>
                                        <i className="fas fa-user-edit"></i>
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
                                        color: 'var(--text-muted-color)',
                                        pointerEvents: 'none'
                                    }}>
                                        <i className="fas fa-user-edit"></i>
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
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                htmlFor="bio"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: 'var(--text-color)'
                                }}
                            >
                                Bio
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    left: '1rem',
                                    color: 'var(--text-muted-color)',
                                    pointerEvents: 'none'
                                }}>
                                    <i className="fas fa-pen"></i>
                                </div>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem 0.8rem 2.5rem',
                                        borderRadius: '15px',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--background-color)',
                                        color: 'var(--text-color)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Tell us a bit about yourself"
                                />
                            </div>
                        </div>

                        {/* Profile Image URL field removed as we now handle direct uploads */}

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
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin" style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}