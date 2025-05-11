'use client';

import { useState, useRef } from 'react';
import { fileService } from '@/lib/api/fileService';
import './file-uploader.css';

interface FileUploaderProps {
    onFileUploaded?: (fileUrl: string) => void;
    acceptedFileTypes?: string;
    maxSizeMB?: number;
}

/**
 * FileUploader Component
 * 
 * A reusable component for uploading and managing files
 */
export default function FileUploader({
    onFileUploaded,
    acceptedFileTypes = 'image/jpeg,image/jpg,image/png,image/webp',
    maxSizeMB = 5
}: FileUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string, name: string }>>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    /**
     * Handle file selection
     */
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        await uploadFile(files[0]);

        // Reset the input so the same file can be uploaded again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Handle file drop
     */
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        if (!files || files.length === 0) return;

        await uploadFile(files[0]);
    };

    /**
     * Handle drag events
     */
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    /**
     * Upload a file to the server
     */
    const uploadFile = async (file: File) => {
        // Validate file size
        if (file.size > maxSizeBytes) {
            setUploadError(`File size exceeds the maximum allowed size (${maxSizeMB}MB)`);
            return;
        }

        // Validate file type
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        if (!fileExtension || !supportedExtensions.includes(`.${fileExtension}`)) {
            setUploadError(`Unsupported file type. Please upload one of the following: ${supportedExtensions.join(', ')}`);
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const response = await fileService.uploadFile(file);

            // Extract the file URL from the response
            const fileUrl = response.data.file_url;

            // Extract filename from URL
            const fileName = fileUrl.split('/').pop() || file.name;

            // Add the uploaded file to the list
            setUploadedFiles(prev => [...prev, {
                url: fileUrl,
                name: fileName
            }]);

            // Notify parent component if callback provided
            if (onFileUploaded) {
                onFileUploaded(fileUrl);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Delete a file from the server
     */
    const deleteFile = async (fileUrl: string) => {
        try {
            await fileService.deleteFile(fileUrl);

            // Remove the file from the list
            setUploadedFiles(prev => prev.filter(file => file.url !== fileUrl));
        } catch (error) {
            console.error('Error deleting file:', error);
            setUploadError(error instanceof Error ? error.message : 'Failed to delete file');
        }
    };

    /**
     * Trigger file input click
     */
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="file-uploader">
            {/* File drop area */}
            <div
                className={`file-drop-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={acceptedFileTypes}
                    className="file-input"
                />

                <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </div>

                <p className="upload-text">
                    {isUploading ? 'Uploading...' : 'Drag & drop a file or click to browse'}
                </p>
                <p className="upload-hint">
                    Accepted file types: JPG, JPEG, PNG, WEBP (Max size: {maxSizeMB}MB)
                </p>
            </div>

            {/* Error message */}
            {uploadError && (
                <div className="upload-error" role="alert">
                    {uploadError}
                </div>
            )}

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                    <h3>Uploaded Files</h3>
                    <ul>
                        {uploadedFiles.map((file, index) => (
                            <li key={index} className="file-item">
                                <div className="file-info">
                                    <span className="file-name">{file.name}</span>
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
                                        View
                                    </a>
                                </div>
                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() => deleteFile(file.url)}
                                    aria-label="Delete file"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}