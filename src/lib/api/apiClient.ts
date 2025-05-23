/**
 * Base API Client
 * 
 * This module provides a centralized API client for making HTTP requests.
 * It handles common functionality like authentication, error handling, and request/response processing.
 */

// Environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9876/api';

// Error types
export class ApiError extends Error {
    status: number;
    data?: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export class AuthenticationError extends ApiError {
    constructor(message: string = 'Authentication required', status: number = 401, data?: unknown) {
        super(message, status, data);
        this.name = 'AuthenticationError';
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Network error occurred') {
        super(message);
        this.name = 'NetworkError';
    }
}

// Request options interface
export interface ApiRequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
    requiresAuth?: boolean;
}

// Response interface
export interface ApiResponse<T> {
    data: T;
    status: number;
    headers: Headers;
}

/**
 * API Client class for handling HTTP requests
 */
export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Get the authentication token from storage
     * @returns The access token or null if not available
     */
    private getToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }
        return localStorage.getItem('access_token');
    }

    /**
     * Build the full URL including query parameters
     * @param endpoint API endpoint
     * @param params Query parameters
     * @returns Full URL with query parameters
     */
    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
        const url = new URL(`${this.baseUrl}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return url.toString();
    }

    /**
     * Add authentication headers to request options
     * @param options Request options
     * @returns Updated request options with auth headers
     */
    private addAuthHeaders(options: RequestInit): RequestInit {
        const token = this.getToken();

        if (!token) {
            throw new AuthenticationError();
        }

        return {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        };
    }

    /**
     * Process the API response
     * @param response Fetch response
     * @returns Promise with processed response
     */
    private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
        // Handle HTTP error responses
        if (!response.ok) {
            // For error responses, first try to get the response as text
            const responseText = await response.text();
            let errorData;

            try {
                // Try to parse as JSON only if it looks like JSON
                if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
                    errorData = JSON.parse(responseText);
                } else {
                    // If not JSON, create a meaningful error object
                    errorData = {
                        message: `Server returned non-JSON error: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`
                    };
                }
            } catch (parseError) {
                // If JSON parsing fails, create a meaningful error object
                errorData = {
                    message: `Failed to parse error response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
                    responseText: responseText.substring(0, 200) // Include part of the response for debugging
                };
            }

            const errorMessage = errorData.message || `HTTP error ${response.status}`;

            // Handle specific error cases
            if (response.status === 401) {
                throw new AuthenticationError(errorMessage, response.status, errorData);
            }

            // Handle rate limiting (429 Too Many Requests)
            if (response.status === 429) {
                console.warn('Rate limit exceeded. Backing off before retrying.');

                // Get retry-after header if available, or default to 2 seconds
                const retryAfter = response.headers.get('retry-after');
                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000;

                // Log the wait time
                console.log(`Waiting ${waitTime}ms before retrying request`);

                // Return a special error for rate limiting that can be handled by callers
                const rateLimitError = new ApiError(
                    'Rate limit exceeded. Please try again later.',
                    response.status,
                    { ...errorData, retryAfter: waitTime }
                );
                rateLimitError.name = 'RateLimitError';
                throw rateLimitError;
            }

            throw new ApiError(errorMessage, response.status, errorData);
        }

        try {
            // Get the response as text first
            const responseText = await response.text();

            // Try to parse as JSON
            let data;
            try {
                data = JSON.parse(responseText) as T;
            } catch (parseError) {
                console.error('Error parsing JSON response:', parseError);
                throw new ApiError(
                    `Error parsing JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
                    response.status,
                    {
                        originalError: parseError,
                        responseText: responseText.substring(0, 200) // Include part of the response for debugging
                    }
                );
            }

            return {
                data,
                status: response.status,
                headers: response.headers
            };
        } catch (error) {
            console.error('Error processing response:', error);
            throw new ApiError(
                `Error processing response: ${error instanceof Error ? error.message : String(error)}`,
                response.status,
                { originalError: error }
            );
        }
    }

    /**
     * Make an HTTP request
     * @param endpoint API endpoint
     * @param options Request options
     * @returns Promise with the response
     */
    public async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
        const { params, requiresAuth = false, ...fetchOptions } = options;

        let requestOptions = { ...fetchOptions };

        // Set default headers
        requestOptions.headers = {
            'Accept': 'application/json',
            ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
            ...requestOptions.headers
        };

        // Add auth headers if required
        if (requiresAuth) {
            requestOptions = this.addAuthHeaders(requestOptions);
        }

        // Build the URL with query parameters
        const url = this.buildUrl(endpoint, params);

        try {
            const response = await fetch(url, requestOptions);
            return this.processResponse<T>(response);
        } catch (error) {
            // Handle network errors
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new NetworkError();
            }
            throw error;
        }
    }

    /**
     * Make a GET request
     * @param endpoint API endpoint
     * @param options Request options
     * @returns Promise with the response
     */
    public async get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
            ...options
        });
    }

    /**
     * Make a POST request
     * @param endpoint API endpoint
     * @param data Request body data
     * @param options Request options
     * @returns Promise with the response
     */
    public async post<T>(endpoint: string, data?: Record<string, unknown>, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    }

    /**
     * Make a PUT request
     * @param endpoint API endpoint
     * @param data Request body data
     * @param options Request options
     * @returns Promise with the response
     */
    public async put<T>(endpoint: string, data?: Record<string, unknown>, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    }

    /**
     * Make a DELETE request
     * @param endpoint API endpoint
     * @param options Request options
     * @returns Promise with the response
     */
    public async delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options
        });
    }
}

// Create and export a default instance
export const apiClient = new ApiClient();