'use client';

import { useEffect, useState, useCallback, useMemo, useRef, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updatePost, getPostBySlug } from '@/lib/api/postsService';
import { apiClient, ApiError, AuthenticationError } from '@/lib/api/apiClient';
import { BlogTag, BlogTagMinimal, parseTagsString, cleanTagName } from '@/models/BlogTag';
import { markdownToHtml } from '@/lib/markdown';
import { BlogPost } from '@/models/BlogPost';
import './edit-article.css';

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
 * Interface for edit article form data
 */
interface ArticleFormData {
    title: string;
    excerpt: string;
    content: string;
    tags: string;
    coverImage: string;
}

// Use the BlogTag interface from the model
type Tag = BlogTag;

/**
 * Loading component to display while the page is loading
 */
function LoadingComponent() {
    return (
        <div className="loading-container">
            <div className="loading-spinner" aria-label="Loading"></div>
            <p className="loading-text">Loading article editor...</p>
        </div>
    );
}

/**
 * The main content component that uses params
 */
function EditArticleContent() {
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const params = useParams();

    // Extract the post slug from params
    const postSlug = useMemo(() => {
        console.log('Params:', params);
        if (!params?.slug) return null;

        const slugValue = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        console.log(`Extracted post slug: ${slugValue}`);
        return slugValue;
    }, [params]);

    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Form data state
    const [formData, setFormData] = useState<ArticleFormData>({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        coverImage: ''
    });

    // Original post data for comparison
    const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

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

    /**
     * Fetch available tags from API
     */
    const fetchTags = useCallback(async () => {
        console.log('fetchTags called');

        try {
            console.log('Making API request for tags');
            const response = await apiClient.get<BlogTag[]>('/tags');

            console.log('Tags received from API:', response.data);

            if (!response.data || !Array.isArray(response.data)) {
                console.error('Invalid tags data received:', response.data);
                return;
            }

            // Clean tag names using the utility function
            const cleanedTags = response.data.map((tag: BlogTag) => ({
                ...tag,
                name: cleanTagName(tag.name)
            }));

            setAvailableTags(cleanedTags);
            console.log('Tags state updated with', cleanedTags.length, 'tags');
        } catch (error) {
            console.error('Error fetching tags:', error);
            setLoadError('Failed to load tags. Please try again.');
        } finally {
            console.log('Tags fetch completed');
        }
    }, []);

    /**
     * Fetch post data by slug
     */
    const fetchPost = useCallback(async () => {
        console.log('fetchPost called, current state:', { isLoading, postSlug });

        if (!postSlug) {
            console.error('No post slug provided to fetchPost');
            setLoadError('No post slug provided');
            setIsLoading(false);
            return;
        }

        console.log(`Starting API request for post with slug: ${postSlug}`);
        setLoadError(null);

        try {
            console.log(`Calling getPostBySlug with slug: ${postSlug}`);
            const post = await getPostBySlug(postSlug);

            // Add a small delay for stability
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('Post data received from API:', post);

            // Check if post exists
            if (!post) {
                console.error('Post data is null or undefined');
                setLoadError('Failed to load post data. The server returned an empty response.');
                setIsLoading(false);
                return;
            }

            // Safely log tags with proper null check
            console.log('Post tags:', post.tags ? post.tags : 'No tags available');
            setOriginalPost(post);

            // Convert tags array to comma-separated string with additional safety checks
            let tagsString = '';
            try {
                if (post.tags && Array.isArray(post.tags) && post.tags.length > 0) {
                    tagsString = post.tags.map(tag => cleanTagName(tag.name)).join(', ');
                }
            } catch (tagError) {
                console.error('Error processing tags:', tagError);
            }

            // Set form data from post with fallbacks for missing fields
            try {
                setFormData({
                    title: post.title || '',
                    excerpt: post.excerpt || '',
                    content: post.content || '',
                    tags: tagsString,
                    coverImage: post.cover || ''
                });
                console.log('Form data set successfully');
            } catch (formError) {
                console.error('Error setting form data:', formError);
                setLoadError('Error preparing form data. Some post fields may be missing or invalid.');
                setIsLoading(false);
                return;
            }

            // Set publish status with fallback to draft
            setPublishStatus(post.status || 'draft');
            console.log('Publish status set successfully');

            // Now fetch tags after post is loaded successfully
            console.log('Post loaded successfully, fetching tags next');
            try {
                await fetchTags();
                console.log('Both post and tags loaded successfully');
            } catch (tagError) {
                console.error('Error fetching tags after post:', tagError);
                setLoadError('Post loaded but failed to load tags. You can still edit the post.');
                setIsLoading(false);
            }

        } catch (error) {
            console.error('Error fetching post:', error);
            setLoadError('Failed to load the post. Please try again later.');
            setIsLoading(false);
        } finally {
            // Always ensure loading state is cleared
            console.log('fetchPost completed, clearing loading state');
            setIsLoading(false);

            // Additional check for incomplete post data
            if (originalPost && (!originalPost.title || !originalPost.content)) {
                console.warn('Incomplete post data detected:', originalPost);
                setLoadError('The post data appears to be incomplete. Some fields may be missing.');
            }
        }
    }, [postSlug, originalPost, fetchTags, isLoading]);

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
        if (!isAuthLoading && (!isAuthenticated || user?.role !== 'editor')) {
            console.log('Not authorized, redirecting to blog page');
            router.push('/blog');
        }
    }, [isAuthLoading, isAuthenticated, user, router]);

    /**
     * Fetch post and tags when component mounts
     * Using a ref to prevent duplicate fetches
     */
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        console.log('Auth state:', { isAuthenticated, postSlug, isAuthLoading });

        // Set loading state during auth check
        if (isAuthLoading) {
            console.log('Auth is loading, setting loading state');
            setIsLoading(true);
            return;
        }

        console.log('Auth loading complete, dataFetchedRef.current:', dataFetchedRef.current);

        // If authentication is complete and we have a slug, start loading the post
        if (isAuthenticated && postSlug && !dataFetchedRef.current) {
            console.log('Auth complete and have slug, starting post loading');
            dataFetchedRef.current = true;
            setIsLoading(true);

            // Use setTimeout to ensure this runs after the current render cycle
            setTimeout(() => {
                console.log('Executing fetchPost');
                fetchPost();
            }, 0);
        }
        // Handle error cases
        else if (!isAuthenticated && !isAuthLoading) {
            console.log('Not authenticated, showing error');
            setIsLoading(false);
            setLoadError('Authentication required');
        } else if (!postSlug && !isAuthLoading && isAuthenticated) {
            console.log('No post slug provided, showing error');
            setIsLoading(false);
            setLoadError('No post slug provided');
        }
    }, [isAuthenticated, postSlug, isAuthLoading, fetchPost]);

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
            if (!postSlug) {
                throw new Error('Post slug is missing');
            }

            // Prepare API data format
            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                tags: parseTags(formData.tags),
                cover: formData.coverImage,
                status: publishStatus
            };

            // Submit to API using the post ID from originalPost
            if (!originalPost || !originalPost.id) {
                throw new Error('Post ID is missing');
            }

            const response = await updatePost(originalPost.id, postData);

            // Handle success
            setSubmitSuccess(true);

            // Redirect after a brief delay to show success message
            setTimeout(() => {
                router.push(`/blog/${response.slug}`);
            }, 1500);

        } catch (error: unknown) {
            console.error('Error updating post:', error);

            // Handle specific error types
            if (error instanceof AuthenticationError) {
                setSubmitError('You must be logged in to update posts. Please log in and try again.');
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

    // Show loading spinner while checking auth or loading post
    if (isLoading || isAuthLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" aria-label="Loading"></div>
                <p className="loading-text">Loading article editor...</p>
            </div>
        );
    }

    // Show error message if there's an error
    if (loadError) {
        return (
            <div className="error-container">
                <div className="error-icon" aria-hidden="true">⚠️</div>
                <h2>Error Loading Article</h2>
                <p className="error-message">{loadError}</p>
                <button
                    className="btn-secondary"
                    onClick={() => router.push('/blog')}
                >
                    Return to Blog
                </button>
            </div>
        );
    }

    return (
        <div className="edit-article-container">
            <div className="article-header">
                <h1 className="section-title">
                    Edit Article
                    <span className="title-underline"></span>
                </h1>
                <p className="subtitle">Update your article content and settings</p>
            </div>

            <div className="article-form-card">
                {submitSuccess ? (
                    <div className="success-message" role="alert">
                        <svg aria-hidden="true" className="success-icon" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                        </svg>
                        <p>Article updated successfully! Redirecting to your updated post...</p>
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
                            <label htmlFor="coverImage">
                                Cover Image URL
                            </label>
                            <input
                                id="coverImage"
                                name="coverImage"
                                type="url"
                                value={formData.coverImage}
                                onChange={handleChange}
                                aria-invalid={!!errors.coverImage}
                                aria-describedby={errors.coverImage ? "coverImage-error" : undefined}
                                placeholder="https://example.com/image.jpg"
                                className={errors.coverImage ? "input-error" : ""}
                                data-testid="article-cover-input"
                            />
                            {errors.coverImage && <p id="coverImage-error" className="error-text">{errors.coverImage}</p>}
                            <p className="input-help">Enter a URL for the article cover image</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">
                                Tags <span className="required-mark">*</span>
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
                                placeholder="Enter tags separated by commas"
                                className={errors.tags ? "input-error" : ""}
                                data-testid="article-tags-input"
                            />
                            {errors.tags && <p id="tags-error" className="error-text">{errors.tags}</p>}

                            <div className="tags-selector">
                                <p className="tags-selector-label">Available tags (click to add):</p>
                                <div className="tags-list">
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            className="tag-button"
                                            onClick={() => handleTagSelect(tag.name)}
                                            data-testid={`tag-${tag.name}`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-group content-group">
                            <div className="content-header">
                                <label htmlFor="content">
                                    Article Content <span className="required-mark">*</span>
                                </label>
                                <button
                                    type="button"
                                    className={`preview-toggle ${showPreview ? 'active' : ''}`}
                                    onClick={togglePreview}
                                    data-testid="preview-toggle"
                                >
                                    {showPreview ? 'Edit' : 'Preview'}
                                </button>
                            </div>

                            {showPreview ? (
                                <div
                                    className="markdown-preview"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                    data-testid="markdown-preview"
                                />
                            ) : (
                                <>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                        aria-required="true"
                                        aria-invalid={!!errors.content}
                                        aria-describedby={errors.content ? "content-error" : undefined}
                                        placeholder="Write your article content in Markdown format"
                                        className={`content-editor ${errors.content ? "input-error" : ""}`}
                                        data-testid="article-content-input"
                                    />
                                    {errors.content && <p id="content-error" className="error-text">{errors.content}</p>}
                                    <p className="input-help">Markdown formatting is supported</p>
                                </>
                            )}
                        </div>

                        <div className="form-group publish-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={publishStatus === 'published'}
                                    onChange={handleStatusToggle}
                                    data-testid="publish-checkbox"
                                />
                                <span className="checkbox-text">
                                    {publishStatus === 'published' ? 'Published' : 'Draft'}
                                </span>
                            </label>
                            <p className="status-help">
                                {publishStatus === 'published'
                                    ? 'This article is visible to all users'
                                    : 'This article is only visible to editors'}
                            </p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancel}
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
                                        Updating...
                                    </>
                                ) : 'Update Article'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

/**
 * Edit Article Page Component
 * 
 * This component provides a form for editor users to edit existing blog posts.
 * It includes form validation, error handling, and submission to the API.
 */
export default function EditArticlePage() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <EditArticleContent />
        </Suspense>
    );
}