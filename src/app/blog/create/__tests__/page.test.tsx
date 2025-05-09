import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { postsService } from '@/lib/api/postsService';
import { markdownToHtml } from '@/lib/markdown';
import CreateArticlePage from '../page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
    useAuth: jest.fn()
}));

// Mock the posts service
jest.mock('@/lib/api/postsService', () => ({
    postsService: {
        createPost: jest.fn()
    }
}));

// Mock the markdown library
jest.mock('@/lib/markdown', () => ({
    markdownToHtml: jest.fn().mockResolvedValue('<p>Test content</p>')
}));

describe('CreateArticlePage', () => {
    const mockRouter = {
        push: jest.fn(),
        back: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'editor' },
            isAuthenticated: true,
            isLoading: false
        });

        (postsService.createPost as jest.Mock).mockResolvedValue({
            id: 1,
            title: 'Test Title',
            slug: 'test-title'
        });
    });

    it('redirects non-editor users to the blog page', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { role: 'user' },
            isAuthenticated: true,
            isLoading: false
        });

        render(<CreateArticlePage />);

        expect(mockRouter.push).toHaveBeenCalledWith('/blog');
    });

    it('shows loading state when auth is loading', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isLoading: true
        });

        render(<CreateArticlePage />);

        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('renders the form for editor users', () => {
        render(<CreateArticlePage />);

        expect(screen.getByText('Create New Article')).toBeInTheDocument();
        expect(screen.getByTestId('article-title-input')).toBeInTheDocument();
        expect(screen.getByTestId('article-excerpt-input')).toBeInTheDocument();
        expect(screen.getByTestId('article-content-input')).toBeInTheDocument();
        expect(screen.getByTestId('article-tags-input')).toBeInTheDocument();
        expect(screen.getByTestId('article-cover-image-input')).toBeInTheDocument();
        expect(screen.getByTestId('article-submit-button')).toBeInTheDocument();
    });

    it('validates form fields on submission', async () => {
        render(<CreateArticlePage />);

        // Try to submit the form without filling required fields
        fireEvent.click(screen.getByTestId('article-submit-button'));

        // Check that validation errors are displayed
        await waitFor(() => {
            expect(screen.getByText('Title is required')).toBeInTheDocument();
            expect(screen.getByText('Excerpt is required')).toBeInTheDocument();
            expect(screen.getByText('Content is required')).toBeInTheDocument();
            expect(screen.getByText('At least one tag is required')).toBeInTheDocument();
        });

        // Form should not be submitted
        expect(postsService.createPost).not.toHaveBeenCalled();
    });

    it('submits the form when all required fields are filled', async () => {
        render(<CreateArticlePage />);

        // Fill in the form
        fireEvent.change(screen.getByTestId('article-title-input'), {
            target: { value: 'Test Title' }
        });
        fireEvent.change(screen.getByTestId('article-excerpt-input'), {
            target: { value: 'Test excerpt' }
        });
        fireEvent.change(screen.getByTestId('article-content-input'), {
            target: { value: 'Test content' }
        });
        fireEvent.change(screen.getByTestId('article-tags-input'), {
            target: { value: 'test,nextjs' }
        });

        // Submit the form
        fireEvent.click(screen.getByTestId('article-submit-button'));

        // Check that the form was submitted with correct data
        await waitFor(() => {
            expect(postsService.createPost).toHaveBeenCalledWith({
                title: 'Test Title',
                excerpt: 'Test excerpt',
                content: 'Test content',
                tags: [
                    { id: 0, name: 'test' },
                    { id: 1, name: 'nextjs' }
                ],
                cover: '',
                status: 'published'
            });
        });

        // Check that success message is shown and redirection happens
        await waitFor(() => {
            expect(screen.getByText('Article created successfully!')).toBeInTheDocument();
        });

        // Let the setTimeout run
        jest.runAllTimers();

        expect(mockRouter.push).toHaveBeenCalledWith('/blog/test-title');
    });

    it('handles API errors properly', async () => {
        // Mock API error
        (postsService.createPost as jest.Mock).mockRejectedValue(new Error('API Error'));

        render(<CreateArticlePage />);

        // Fill in the form
        fireEvent.change(screen.getByTestId('article-title-input'), {
            target: { value: 'Test Title' }
        });
        fireEvent.change(screen.getByTestId('article-excerpt-input'), {
            target: { value: 'Test excerpt' }
        });
        fireEvent.change(screen.getByTestId('article-content-input'), {
            target: { value: 'Test content' }
        });
        fireEvent.change(screen.getByTestId('article-tags-input'), {
            target: { value: 'test' }
        });

        // Submit the form
        fireEvent.click(screen.getByTestId('article-submit-button'));

        // Check that error message is shown
        await waitFor(() => {
            expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
        });
    });

    it('navigates back when cancel button is clicked', () => {
        render(<CreateArticlePage />);

        fireEvent.click(screen.getByTestId('article-cancel-button'));

        expect(mockRouter.back).toHaveBeenCalled();
    });

    it('toggles between edit and preview mode', async () => {
        // Mock the markdownToHtml function
        (markdownToHtml as jest.Mock).mockResolvedValue('<p>Formatted content</p>');

        render(<CreateArticlePage />);

        // Add some content to preview
        fireEvent.change(screen.getByTestId('article-content-input'), {
            target: { value: '# Markdown Content' }
        });

        // Click on the preview button
        fireEvent.click(screen.getByTestId('preview-toggle-button'));

        // Wait for the preview to be rendered
        await waitFor(() => {
            expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
            expect(screen.queryByTestId('article-content-input')).not.toBeInTheDocument();
        });

        // Check preview content is rendered
        expect(screen.getByTestId('markdown-preview').innerHTML).toContain('Formatted content');

        // Click back to edit mode
        fireEvent.click(screen.getByTestId('preview-toggle-button'));

        // Check we're back in edit mode
        await waitFor(() => {
            expect(screen.queryByTestId('markdown-preview')).not.toBeInTheDocument();
            expect(screen.getByTestId('article-content-input')).toBeInTheDocument();
        });
    });
});
