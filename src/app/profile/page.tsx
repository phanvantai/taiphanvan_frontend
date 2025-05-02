'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, updateProfile, error, clearError } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                bio: user.bio || '',
                profileImage: user.profileImage || ''
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
                bio: formData.bio || undefined,
                profileImage: formData.profileImage || undefined
            });

            setFormMsg({ type: 'success', message: 'Profile updated successfully!' });
        } catch (err) {
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
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

            {formMsg.message && (
                <div className={`p-4 mb-6 rounded ${formMsg.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                    {formMsg.message}
                </div>
            )}

            <div className="bg-card-bg-color p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-text-muted-color">Username</p>
                            <p className="font-medium">{user.username}</p>
                        </div>
                        <div>
                            <p className="text-text-muted-color">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="firstName" className="block text-text-color mb-2 font-medium">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border border-border-color bg-background-color text-text-color"
                                placeholder="Your first name"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-text-color mb-2 font-medium">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded border border-border-color bg-background-color text-text-color"
                                placeholder="Your last name"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="bio" className="block text-text-color mb-2 font-medium">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 rounded border border-border-color bg-background-color text-text-color"
                            placeholder="Tell us a bit about yourself"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="profileImage" className="block text-text-color mb-2 font-medium">
                            Profile Image URL
                        </label>
                        <input
                            id="profileImage"
                            name="profileImage"
                            type="text"
                            value={formData.profileImage}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded border border-border-color bg-background-color text-text-color"
                            placeholder="https://example.com/your-image.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}