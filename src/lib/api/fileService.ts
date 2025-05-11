/**
 * File Service
 * 
 * This module provides functionality for file operations like upload and deletion.
 */

import { apiClient } from './apiClient';

/**
 * Response interface for file upload
 */
export interface FileUploadResponse {
    status: string;
    message: string;
    data: {
        file_url: string;
    };
}

/**
 * Request interface for file deletion
 */
export interface FileDeleteRequest {
    file_url: string;
}

/**
 * Response interface for file deletion
 */
export interface FileDeleteResponse {
    status: string;
    message: string;
    data: Record<string, unknown>;
}

/**
 * File Service class for handling file operations
 */
export class FileService {
    /**
     * Upload a file to the server
     * @param file The file to upload
     * @param requiresAuth Whether authentication is required (default: true)
     * @returns Promise with the upload response
     */
    public async uploadFile(
        file: File,
        requiresAuth: boolean = true
    ): Promise<FileUploadResponse> {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Make a custom request since we need to handle FormData
        const response = await fetch(`${apiClient['baseUrl']}/files/upload`, {
            method: 'POST',
            headers: requiresAuth
                ? { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                : {},
            body: formData,
        });

        // Handle errors
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'Unknown error occurred' };
            }

            const errorMessage = errorData.message || `HTTP error ${response.status}`;
            throw new Error(errorMessage);
        }

        // Parse and return the response
        const data = await response.json();
        return data;
    }

    /**
     * Delete a file from the server
     * @param fileUrl URL of the file to delete
     * @param requiresAuth Whether authentication is required (default: true)
     * @returns Promise with the deletion response
     */
    public async deleteFile(
        fileUrl: string,
        requiresAuth: boolean = true
    ): Promise<FileDeleteResponse> {
        const response = await apiClient.post<FileDeleteResponse>(
            '/files/delete',
            { file_url: fileUrl },
            { requiresAuth }
        );

        return response.data;
    }
}

// Create and export a default instance
export const fileService = new FileService();