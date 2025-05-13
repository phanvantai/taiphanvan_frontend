'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { postsService, CreatePostData } from '@/lib/api/postsService';
import { apiClient, ApiError, AuthenticationError } from '@/lib/api/apiClient';
import { BlogTag, BlogTagMinimal, parseTagsString, cleanTagName } from '@/models/BlogTag';
import { markdownToHtml } from '@/lib/markdown';
import FileUploader from '@/components/FileUploader';
import './create-article.css';

/**
 * Interface for form validation errors
 */
interface FormErrors {
    title?: string;
    excerpt?: string;
    content?: string;
    tags?: string;
    coverImage?: string;
    [key: string]: string | undefined;
}

/**
 * Interface for create article form data
 */
interface ArticleFormData {
    title: string;
    excerpt: string;
    content: string;
    tags: string;
    coverImage: string;
}

// Use the BlogTag interface from the model
// This is kept for backward compatibility
type Tag = BlogTag;

/**
 * Create Article Page Component
 * 
 * This component provides a form for editor users to create new blog posts.
 * It includes form validation, error handling, and submission to the API.
 */
export default function CreateArticlePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<ArticleFormData>({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        coverImage: ''
    });

    // State for publish status
    const [publishStatus, setPublishStatus] = useState<'published' | 'draft'>('draft');

    // Form state management
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Markdown preview state
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [showPreview, setShowPreview] = useState(false);

    // Tags state
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);

    /**
     * Fetch available tags from API
     */
    const fetchTags = async () => {
        setIsLoadingTags(true);
        try {
            const response = await apiClient.get<BlogTag[]>('/tags');
            // Clean tag names using the utility function
            const cleanedTags = response.data.map((tag: BlogTag) => ({
                ...tag,
                name: cleanTagName(tag.name)
            }));
            setAvailableTags(cleanedTags);
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setIsLoadingTags(false);
        }
    };

    /**
     * Handle tag selection
     */
    const handleTagSelect = (tagName: string) => {
        const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        // Don't add duplicate tags
        if (!currentTags.includes(tagName)) {
            const newTags = [...currentTags, tagName].join(', ');
            setFormData(prev => ({
                ...prev,
                tags: newTags
            }));

            // Clear any tag-related errors
            if (errors.tags) {
                setErrors(prev => {
                    const updated = { ...prev };
                    delete updated.tags;
                    return updated;
                });
            }
        }
    };

    /**
     * Update markdown preview from content
     */
    const updatePreview = useCallback(async () => {
        if (showPreview && formData.content) {
            try {
                const html = await markdownToHtml(formData.content);
                setPreviewHtml(html);
            } catch (error) {
                console.error('Error generating preview:', error);
                setPreviewHtml('<p>Error generating preview</p>');
            }
        }
    }, [showPreview, formData.content]);

    /**
     * Toggle between preview and edit mode
     */
    const togglePreview = async () => {
        const newPreviewState = !showPreview;
        setShowPreview(newPreviewState);

        if (newPreviewState && formData.content) {
            await updatePreview();
        }
    };

    /**
     * Effect to update preview when content changes and preview is visible
     */
    useEffect(() => {
        if (showPreview) {
            const previewTimer = setTimeout(() => {
                updatePreview();
            }, 500); // Debounce preview updates

            return () => clearTimeout(previewTimer);
        }
    }, [formData.content, showPreview, updatePreview]);

    /**
     * Redirect if not authenticated or not an editor
     */
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'editor')) {
            console.log('Not authorized, redirecting to blog page');
            router.push('/blog');
        }
    }, [isLoading, isAuthenticated, user, router]);

    /**
     * Fetch tags when component mounts
     */
    useEffect(() => {
        if (isAuthenticated) {
            fetchTags();
        }
    }, [isAuthenticated]);

    /**
     * Validate form inputs
     * @returns Object containing any validation errors
     */
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = 'Excerpt is required';
        } else if (formData.excerpt.length > 200) {
            newErrors.excerpt = 'Excerpt must be less than 200 characters';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        if (!formData.tags.trim()) {
            newErrors.tags = 'At least one tag is required';
        }

        if (formData.coverImage && !/^https?:\/\/.+/.test(formData.coverImage)) {
            newErrors.coverImage = 'Cover image must be a valid URL';
        }

        return newErrors;
    };

    /**
     * Handle form input changes
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }

        // Clear submit error when user makes changes
        if (submitError) {
            setSubmitError(null);
        }
    };

    /**
     * Convert tags string to BlogTagMinimal array
     */
    const parseTags = (tagsString: string): BlogTagMinimal[] => {
        return parseTagsString(tagsString);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Prepare API data format
            const postData: CreatePostData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                tags: parseTags(formData.tags),
                cover: formData.coverImage,
                status: publishStatus
            };

            // If publishing, add the current date
            if (publishStatus === 'published') {
                postData.publish_at = new Date().toISOString();
            }

            // Submit to API - passing publish status
            const response = await postsService.createPost(postData, publishStatus === 'published');

            // Handle success
            setSubmitSuccess(true);

            // Redirect after a brief delay to show success message
            setTimeout(() => {
                router.push(`/blog/${response.slug}`);
            }, 1500);

        } catch (error: unknown) {
            console.error('Error creating post:', error);

            // Handle specific error types
            if (error instanceof AuthenticationError) {
                setSubmitError('You must be logged in to create posts. Please log in and try again.');
            } else if (error instanceof ApiError) {
                setSubmitError(`Error: ${error.message}`);
            } else {
                setSubmitError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle cancel button click
     */
    const handleCancel = () => {
        router.back();
    };

    /**
     * Toggle publish status
     */
    const handleStatusToggle = () => {
        setPublishStatus(prev => prev === 'published' ? 'draft' : 'published');
    };

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" aria-label="Loading"></div>
            </div>
        );
    }

    // If not editor, this will redirect, but we'll return null while that happens
    if (!isAuthenticated || user?.role !== 'editor') {
        return null;
    }

    return (
        <div className="create-article-container">
            <div className="article-header">
                <h1 className="section-title">
                    Create New Article
                    <span className="title-underline"></span>
                </h1>
                <p className="subtitle">Share your knowledge and insights with the world</p>
            </div>

            <div className="article-form-card">
                {submitSuccess ? (
                    <div className="success-message" role="alert">
                        <svg aria-hidden="true" className="success-icon" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                        </svg>
                        <p>Article created successfully! Redirecting to your new post...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        {submitError && (
                            <div className="error-message" role="alert">
                                {submitError}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="title">
                                Article Title <span className="required-mark">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                                placeholder="Enter article title"
                                className={errors.title ? "input-error" : ""}
                                data-testid="article-title-input"
                            />
                            {errors.title && <p id="title-error" className="error-text">{errors.title}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="excerpt">
                                Excerpt <span className="required-mark">*</span>
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.excerpt}
                                aria-describedby={errors.excerpt ? "excerpt-error" : undefined}
                                placeholder="Brief summary of the article"
                                className={errors.excerpt ? "input-error" : ""}
                                data-testid="article-excerpt-input"
                            />
                            {errors.excerpt && <p id="excerpt-error" className="error-text">{errors.excerpt}</p>}
                        </div>

                        <div className="form-group">
                            <div className="content-header">
                                <label htmlFor="content">
                                    Content (Markdown supported) <span className="required-mark">*</span>
                                </label>
                                <button
                                    type="button"
                                    className="preview-toggle-btn"
                                    onClick={togglePreview}
                                    data-testid="preview-toggle-button"
                                >
                                    {showPreview ? 'Edit Mode' : 'Preview Mode'}
                                </button>
                            </div>

                            {showPreview ? (
                                <div
                                    className="markdown-preview"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                    data-testid="markdown-preview"
                                    aria-label="Markdown preview"
                                />
                            ) : (
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!errors.content}
                                    aria-describedby={errors.content ? "content-error" : undefined}
                                    placeholder="Write your article content here (Markdown supported)"
                                    className={`code-editor ${errors.content ? "input-error" : ""}`}
                                    data-testid="article-content-input"
                                    rows={25}
                                />
                            )}
                            {errors.content && <p id="content-error" className="error-text">{errors.content}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">
                                Tags (comma separated) <span className="required-mark">*</span>
                            </label>
                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                value={formData.tags}
                                onChange={handleChange}
                                required
                                aria-required="true"
                                aria-invalid={!!errors.tags}
                                aria-describedby={errors.tags ? "tags-error" : undefined}
                                placeholder="e.g. Development, Next.js, React"
                                className={errors.tags ? "input-error" : ""}
                                data-testid="article-tags-input"
                            />                            {errors.tags && <p id="tags-error" className="error-text">{errors.tags}</p>}

                            <div className="available-tags">
                                <div className="tags-container" data-testid="tags-selector">
                                    {isLoadingTags ? (
                                        <span className="tags-loading">Loading tags...</span>
                                    ) : availableTags.length > 0 ? (
                                        availableTags.map(tag => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                className="tag-pill"
                                                onClick={() => handleTagSelect(tag.name)}
                                                title={`${tag.post_count} posts with this tag`}
                                            >
                                                {tag.name} ({tag.post_count})
                                            </button>
                                        ))
                                    ) : (
                                        <span className="no-tags">No tags available</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="coverImage">Cover Image</label>
                            <div className="cover-image-container">
                                <div className="cover-image-input">
                                    <input
                                        id="coverImage"
                                        name="coverImage"
                                        type="text"
                                        value={formData.coverImage}
                                        onChange={handleChange}
                                        aria-invalid={!!errors.coverImage}
                                        aria-describedby={errors.coverImage ? "coverImage-error" : undefined}
                                        placeholder="https://example.com/image.jpg"
                                        className={errors.coverImage ? "input-error" : ""}
                                        data-testid="article-cover-image-input"
                                    />
                                    {errors.coverImage && <p id="coverImage-error" className="error-text">{errors.coverImage}</p>}
                                </div>

                                <div className="cover-image-upload">
                                    <h4>Or upload an image</h4>
                                    <FileUploader
                                        acceptedFileTypes="image/jpeg,image/jpg,image/png,image/webp"
                                        maxSizeMB={5}
                                        onFileUploaded={(fileUrl) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                coverImage: fileUrl
                                            }));

                                            // Clear any cover image errors
                                            if (errors.coverImage) {
                                                setErrors(prev => {
                                                    const updated = { ...prev };
                                                    delete updated.coverImage;
                                                    return updated;
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="publish-options">
                            <label className="publish-toggle">
                                <input
                                    type="checkbox"
                                    checked={publishStatus === 'published'}
                                    onChange={handleStatusToggle}
                                    data-testid="publish-toggle"
                                />
                                <span className="publish-toggle-text">
                                    {publishStatus === 'published' ? 'Published' : 'Save as draft'}
                                </span>
                            </label>
                            <p className="publish-description">
                                {publishStatus === 'published'
                                    ? 'When published, the article will be visible to all users'
                                    : 'As a draft, the article will only be visible to editors'}
                            </p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn-secondary"
                                disabled={isSubmitting}
                                data-testid="article-cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                                data-testid="article-submit-button"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="button-spinner" aria-hidden="true"></span>
                                        Creating...
                                    </>
                                ) : publishStatus === 'published' ? 'Publish Article' : 'Save as Draft'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}