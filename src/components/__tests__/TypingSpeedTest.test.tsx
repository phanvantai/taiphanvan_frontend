import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TypingSpeedTest from '../TypingSpeedTest';

// Mock timers for testing
beforeEach(() => {
    jest.useFakeTimers();
});

describe('TypingSpeedTest Component', () => {
    beforeEach(() => {
        jest.clearAllTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('renders correctly with initial state', () => {
        render(<TypingSpeedTest />);

        // Check if main heading is present
        expect(screen.getByRole('heading', { name: /typing speed test/i })).toBeInTheDocument();

        // Check if statistics are initially correct - be more specific with selectors
        expect(screen.getByText('100%')).toBeInTheDocument(); // Accuracy
        expect(screen.getByText('0:00')).toBeInTheDocument(); // Time

        // Check for WPM and Errors by finding their parent containers
        const statsCards = screen.getAllByText('0');
        expect(statsCards).toHaveLength(2); // WPM and Errors both show 0

        // Check if input area is present
        expect(screen.getByPlaceholderText(/start typing here/i)).toBeInTheDocument();

        // Check if New Test button is present
        expect(screen.getByRole('button', { name: /new test/i })).toBeInTheDocument();
    });

    it('displays sample text for typing', () => {
        render(<TypingSpeedTest />);

        // Should have some text displayed for typing
        const textDisplay = document.querySelector('.font-mono');
        expect(textDisplay).toBeInTheDocument();
        expect(textDisplay?.textContent).toBeTruthy();
    });

    it('starts timer when user begins typing', async () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i) as HTMLTextAreaElement;

        // Start typing
        fireEvent.change(textarea, { target: { value: 'T' } });

        // Fast-forward time by 1 second
        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(screen.getByText('0:01')).toBeInTheDocument();
        });
    });

    it('shows pause button when typing is active', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);

        // Start typing
        fireEvent.change(textarea, { target: { value: 'T' } });

        // Pause button should appear
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });

    it('can pause and resume typing test', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);

        // Start typing
        fireEvent.change(textarea, { target: { value: 'T' } });

        // Click pause button
        const pauseButton = screen.getByRole('button', { name: /pause/i });
        fireEvent.click(pauseButton);

        // Should show resume button
        expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();

        // Textarea should be disabled
        expect(textarea).toBeDisabled();
    });

    it('resets test when New Test button is clicked', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);
        const newTestButton = screen.getByRole('button', { name: /new test/i });

        // Start typing
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        // Click New Test button
        fireEvent.click(newTestButton);

        // Input should be cleared
        expect(textarea).toHaveValue('');

        // Timer should be reset
        expect(screen.getByText('0:00')).toBeInTheDocument();
    });

    it('calculates accuracy correctly', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);

        // Get the displayed text to type correctly
        const textDisplay = document.querySelector('.font-mono');
        const targetText = textDisplay?.textContent || '';

        if (targetText.length > 0) {
            // Type first few characters correctly
            const correctInput = targetText.substring(0, 5);
            fireEvent.change(textarea, { target: { value: correctInput } });

            // Accuracy should be 100%
            expect(screen.getByText('100%')).toBeInTheDocument();
        }
    });

    it('shows completion message when test is finished', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);

        // Get the full text to complete the test
        const textDisplay = document.querySelector('.font-mono');
        const targetText = textDisplay?.textContent || '';

        if (targetText.length > 0) {
            // Type the complete text
            fireEvent.change(textarea, { target: { value: targetText } });

            // Should show completion message
            expect(screen.getByText(/test completed/i)).toBeInTheDocument();
            expect(screen.getByText(/great job/i)).toBeInTheDocument();
        }
    });

    it('disables input when test is completed', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);

        // Get the full text to complete the test
        const textDisplay = document.querySelector('.font-mono');
        const targetText = textDisplay?.textContent || '';

        if (targetText.length > 0) {
            // Type the complete text
            fireEvent.change(textarea, { target: { value: targetText } });

            // Textarea should be disabled
            expect(textarea).toBeDisabled();
            expect(textarea).toHaveAttribute('placeholder', 'Test completed!');
        }
    });

    it('prevents typing beyond text length', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i) as HTMLTextAreaElement;

        // Get the text length
        const textDisplay = document.querySelector('.font-mono');
        const targetText = textDisplay?.textContent || '';

        if (targetText.length > 0) {
            // Try to type more than the target text
            const overInput = targetText + 'extra';
            fireEvent.change(textarea, { target: { value: overInput } });

            // Should not exceed target text length
            expect(textarea.value.length).toBeLessThanOrEqual(targetText.length);
        }
    });

    it('displays instructions section', () => {
        render(<TypingSpeedTest />);

        // Check if instructions are present
        expect(screen.getByText('Instructions:')).toBeInTheDocument();
        expect(screen.getByText(/click in the text area below/i)).toBeInTheDocument();
        expect(screen.getByText(/type the text exactly as shown/i)).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
        render(<TypingSpeedTest />);

        const textarea = screen.getByPlaceholderText(/start typing here/i);

        // Check textarea attributes
        expect(textarea).toHaveAttribute('spellCheck', 'false');
        expect(textarea).toHaveAttribute('autoComplete', 'off');
    });
});
