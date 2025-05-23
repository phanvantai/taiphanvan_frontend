/**
 * Utility functions for text processing and formatting
 */

/**
 * Decode HTML entities in a string and clean up special characters
 * @param text - Text that may contain HTML entities
 * @returns Cleaned text with HTML entities decoded
 */
export function decodeHtmlEntities(text: string | undefined): string {
    if (!text) return '';

    return text
        // Replace common HTML entities with their corresponding characters
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;|&#34;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        // Handle numeric HTML entities
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
        // Replace ellipsis entity with actual ellipsis character
        .replace(/&hellip;/g, '...')
        // Clean up any trailing ellipsis indicators like [...] that may remain
        .replace(/\[&#8230;\]|\[…\]|\[\.\.\.\]/g, '...')
        // Remove any empty brackets that might remain after cleaning
        .replace(/\[\s*\]/g, '')
        // Normalize spaces
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Client-side HTML entity decoder using the browser's DOM capabilities
 * This is a more complete solution but only works in the browser environment
 * @param text - Text that may contain HTML entities
 * @returns Cleaned text with HTML entities decoded
 */
export function decodeHtmlEntitiesClient(text: string | undefined): string {
    if (!text) return '';

    // Use this version in client components
    if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        const decodedText = textarea.value;

        // Apply additional cleanups to handle special cases
        return decodedText
            .replace(/\[&#8230;\]|\[…\]|\[\.\.\.\]/g, '...')
            .replace(/\[\s*\]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Fallback to the server-safe version when not in browser
    return decodeHtmlEntities(text);
}
