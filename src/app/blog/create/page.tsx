'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CreateArticlePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        categories: '',
        coverImage: ''
    });

    // Redirect if not authenticated or not admin
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
            console.log('Not authorized, redirecting to blog page');
            router.push('/blog');
        } else if (!isLoading && isAuthenticated && user?.role === 'admin') {
            console.log('User is authorized as admin:', user);
        }
    }, [isLoading, isAuthenticated, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would implement the API call to create a new article
        alert('Article creation functionality would be implemented here');
        // After successful creation, redirect to the blog page
        // router.push('/blog');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-color"></div>
            </div>
        );
    }

    // If not admin, this will redirect, but we'll return null while that happens
    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="section-title" style={{
                    fontSize: '2.5rem',
                    marginBottom: '0.5rem',
                    position: 'relative',
                    textAlign: 'center',
                    color: 'var(--text-color)'
                }}>
                    Create New Article
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
                    Share your knowledge and insights with the world
                </p>
            </div>

            <div style={{
                backgroundColor: 'var(--card-bg-color)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px var(--shadow-color)',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease',
                padding: '2rem'
            }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="title"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-color)'
                            }}
                        >
                            Article Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            placeholder="Enter article title"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="excerpt"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-color)'
                            }}
                        >
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                minHeight: '100px',
                                resize: 'vertical'
                            }}
                            placeholder="Brief summary of the article"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="content"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-color)'
                            }}
                        >
                            Content (Markdown supported)
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                minHeight: '300px',
                                resize: 'vertical',
                                fontFamily: 'monospace'
                            }}
                            placeholder="Write your article content here (Markdown supported)"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label
                            htmlFor="categories"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-color)'
                            }}
                        >
                            Categories (comma separated)
                        </label>
                        <input
                            id="categories"
                            name="categories"
                            type="text"
                            value={formData.categories}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            placeholder="e.g. Development, Next.js, React"
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            htmlFor="coverImage"
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: 'var(--text-color)'
                            }}
                        >
                            Cover Image URL
                        </label>
                        <input
                            id="coverImage"
                            name="coverImage"
                            type="text"
                            value={formData.coverImage}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <Link
                            href="/blog"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                backgroundColor: 'var(--background-alt-color)',
                                color: 'var(--text-color)',
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontWeight: '500',
                                flex: '1'
                            }}
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '500',
                                flex: '1'
                            }}
                        >
                            Create Article
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}