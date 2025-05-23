import { News, NewsResponse, NewsDetailResponse } from '@/models/News';
import { apiClient } from './apiClient';

/**
 * Service for handling news-related API operations
 */
export const newsService = {
    /**
     * Fetch news articles with pagination
     * @param {number} page - The page number
     * @param {number} perPage - The number of items per page
     * @returns {Promise<NewsResponse>} The paginated news response
     */
    getNews: async (page: number = 1, perPage: number = 20): Promise<NewsResponse> => {
        try {
            const response = await apiClient.get<NewsResponse>(`/news?page=${page}&per_page=${perPage}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news:', error);
            // Create a default response structure to handle the error gracefully
            return {
                news: [],
                total_items: 0,
                page: page,
                per_page: perPage,
                total_pages: 0,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    },

    /**
     * Fetch a single news article by slug
     * @param {string} slug - The news article slug
     * @returns {Promise<News>} The news article
     */
    getNewsBySlug: async (slug: string): Promise<News> => {
        try {
            const response = await apiClient.get<NewsDetailResponse>(`/news/slug/${slug}`);
            return response.data.news;
        } catch (error) {
            console.error(`Error fetching news with slug '${slug}':`, error);
            throw error;
        }
    }
};
