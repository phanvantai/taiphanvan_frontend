/**
 * BlogTag Model
 * 
 * This file defines the BlogTag model and related interfaces for use throughout the application.
 * It serves as the single source of truth for the blog tag data structure.
 */

/**
 * Represents a tag associated with blog posts
 */
export interface BlogTag {
    id: number;
    name: string;
    post_count?: number;
}

/**
 * Represents a tag with minimal information (used for creating/updating posts)
 */
export interface BlogTagMinimal {
    id?: number;
    name: string;
}

/**
 * Utility function to clean tag names (remove quotes and brackets from API response)
 */
export function cleanTagName(name: string): string {
    return name.replace(/[\[\]"]/g, '').trim();
}

/**
 * Convert a comma-separated string of tags to an array of BlogTagMinimal objects
 */
export function parseTagsString(tagsString: string): BlogTagMinimal[] {
    return tagsString.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(name => ({ name }));
}

/**
 * Convert an array of BlogTag or BlogTagMinimal objects to an array of tag names
 */
export function getTagNames(tags: (BlogTag | BlogTagMinimal)[]): string[] {
    return tags.map(tag => tag.name);
}