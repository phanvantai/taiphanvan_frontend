/**
 * News item model representing a news article from the API
 */
export interface News {
    id: number;
    title: string;
    slug: string;
    summary: string;
    content?: string;
    source: string;
    source_url: string;
    image_url: string;
    category: string;
    status: string;
    published: boolean;
    publish_date: string;
    external_id: string;
    created_at: string;
    updated_at: string;
    tags: string[];
}

/**
 * Response model for the news API endpoint
 */
export interface NewsResponse {
    news: News[];
    total_items: number;
    page: number;
    per_page: number;
    total_pages: number;
    error?: string;
}

/**
 * Response model for the news detail API endpoint
 */
export interface NewsDetailResponse {
    news: News;
    content_status: {
        is_truncated: boolean;
        truncated_chars: number;
        has_full_content: boolean;
    };
}
