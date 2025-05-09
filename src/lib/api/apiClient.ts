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
            let errorData;
            try {
                errorData = await response.json();
            } catch (error) {
                errorData = { message: 'Unknown error occurred' + error };
            }

            const errorMessage = errorData.message || `HTTP error ${response.status}`;

            if (response.status === 401) {
                throw new AuthenticationError(errorMessage, response.status, errorData);
            }

            throw new ApiError(errorMessage, response.status, errorData);
        }

        // Parse JSON response
        const data = await response.json() as T;

        return {
            data,
            status: response.status,
            headers: response.headers
        };
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