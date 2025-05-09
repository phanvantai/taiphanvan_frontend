/**
 * User Service
 * 
 * This service handles all user-related API calls.
 */

import { apiClient } from './apiClient';
import {
    User,
    UserLoginCredentials,
    UserRegistrationData,
    UserProfileUpdateData,
    AuthTokens,
    mapApiResponseToUser
} from '@/models/User';

/**
 * Login a user
 * @param credentials User login credentials
 * @returns User data and auth tokens
 */
export async function loginUser(credentials: UserLoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Cast credentials to Record<string, unknown> to satisfy the apiClient.post type requirements
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials as Record<string, unknown>);

    // Map the user data to ensure it matches our User model
    const user = mapApiResponseToUser(response.data.user);

    return {
        user,
        tokens: response.data.tokens
    };
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns User data and auth tokens
 */
export async function registerUser(userData: UserRegistrationData): Promise<{ user: User; tokens: AuthTokens }> {
    // Cast userData to Record<string, unknown> to satisfy the apiClient.post type requirements
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/register', userData as Record<string, unknown>);

    // Map the user data to ensure it matches our User model
    const user = mapApiResponseToUser(response.data.user);

    return {
        user,
        tokens: response.data.tokens
    };
}

/**
 * Get the current user's profile
 * @returns User data
 */
export async function getUserProfile(): Promise<User> {
    const response = await apiClient.get<User>('/profile', { requiresAuth: true });

    // Map the user data to ensure it matches our User model
    return mapApiResponseToUser(response.data);
}

/**
 * Update the current user's profile
 * @param profileData User profile update data
 * @returns Updated user data
 */
export async function updateUserProfile(profileData: UserProfileUpdateData): Promise<User> {
    // Cast profileData to Record<string, unknown> to satisfy the apiClient.put type requirements
    const response = await apiClient.put<User>('/profile', profileData as Record<string, unknown>, { requiresAuth: true });

    // Map the user data to ensure it matches our User model
    return mapApiResponseToUser(response.data);
}

/**
 * Upload a user avatar
 * @param file Avatar image file
 * @returns Updated user data
 */
export async function uploadUserAvatar(file: File): Promise<User> {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('avatar', file);

    // Create custom fetch options for file upload
    const fetchOptions: RequestInit = {
        method: 'POST',
        body: formData,
        headers: {
            // Don't set Content-Type header for FormData
            // The browser will set it with the correct boundary
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    };

    // Make the request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9876/api'}/profile/avatar`, fetchOptions);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload avatar: ${response.status}`);
    }

    const data = await response.json();

    // Map the user data to ensure it matches our User model
    return mapApiResponseToUser(data);
}

/**
 * Refresh the access token
 * @param refreshToken Refresh token
 * @returns New auth tokens
 */
export async function refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken } as Record<string, unknown>);
    return response.data;
}