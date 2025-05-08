import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

/**
 * Converts markdown content to HTML with support for GitHub Flavored Markdown
 * 
 * @param markdownContent The markdown content to be converted to HTML
 * @returns The converted HTML content as a string
 */
export async function markdownToHtml(markdownContent: string): Promise<string> {
    try {
        const processedContent = await remark()
            .use(remarkGfm) // Enables GitHub Flavored Markdown (tables, strikethrough, etc.)
            .use(html, { sanitize: false }) // Don't sanitize to allow custom HTML
            .process(markdownContent);

        return processedContent.toString();
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
        // Return basic paragraph with error message in case of failure
        return `<p>Error processing content</p>`;
    }
}

/**
 * Extract a plain text excerpt from markdown content
 * 
 * @param markdownContent The markdown content
 * @param length Maximum length of the excerpt
 * @returns A plain text excerpt from the markdown content
 */
export function extractExcerpt(markdownContent: string, length: number = 150): string {
    // Remove markdown formatting and HTML tags
    const plainText = markdownContent
        .replace(/#+\s+(.*)/g, '$1') // Remove headings
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
        .replace(/[*_~`]/g, '') // Remove emphasis markers
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    // Truncate to desired length
    if (plainText.length <= length) {
        return plainText;
    }

    // Truncate at word boundary
    const truncated = plainText.substring(0, length);
    return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
}