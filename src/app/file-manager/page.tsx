'use client';

import { useState } from 'react';
import Image from 'next/image';
import FileUploader from '@/components/FileUploader';
import { fileService } from '@/lib/api/fileService';
import './file-manager.css';

/**
 * File Manager Page
 * 
 * This page demonstrates the file upload and delete functionality.
 */
export default function FileManagerPage() {
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string, name: string }>>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle file upload
     */
    const handleFileUploaded = (fileUrl: string) => {
        // Extract filename from URL
        const fileName = fileUrl.split('/').pop() || 'uploaded-file';

        // Add to uploaded files list
        setUploadedFiles(prev => [...prev, { url: fileUrl, name: fileName }]);
    };

    /**
     * Handle file deletion
     */
    const handleDeleteFile = async (fileUrl: string) => {
        setIsDeleting(fileUrl);
        setError(null);

        try {
            await fileService.deleteFile(fileUrl);

            // Remove from list on success
            setUploadedFiles(prev => prev.filter(file => file.url !== fileUrl));
        } catch (error) {
            console.error('Error deleting file:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete file');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="file-manager-container">
            <div className="file-manager-header">
                <h1 className="section-title">
                    File Manager
                    <span className="title-underline"></span>
                </h1>
                <p className="subtitle">Upload and manage your files</p>
            </div>

            <div className="file-manager-card">
                <h2>Upload Files</h2>
                <p className="description">
                    Upload image files to the server. Supported file types: JPG, JPEG, PNG, WEBP (Max size: 5MB).
                </p>

                <FileUploader
                    onFileUploaded={handleFileUploaded}
                    acceptedFileTypes="image/jpeg,image/jpg,image/png,image/webp"
                    maxSizeMB={5}
                />

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                {uploadedFiles.length > 0 && (
                    <div className="uploaded-files-section">
                        <h3>Your Files</h3>
                        <div className="files-grid">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="file-card">
                                    {file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                        <div className="file-preview">
                                            <Image
                                                src={file.url}
                                                alt={file.name}
                                                width={200}
                                                height={150}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="file-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                        </div>
                                    )}

                                    <div className="file-info">
                                        <span className="file-name">{file.name}</span>
                                        <div className="file-actions">
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="view-btn">
                                                View
                                            </a>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteFile(file.url)}
                                                disabled={isDeleting === file.url}
                                            >
                                                {isDeleting === file.url ? (
                                                    <span className="button-spinner"></span>
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="api-documentation">
                    <h3>API Documentation</h3>
                    <div className="api-section">
                        <h4>Upload File API</h4>
                        <pre className="api-example">
                            {`curl -X 'POST' \\
  'http://localhost:9876/api/files/upload' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'file=@image.png;type=image/png'`}
                        </pre>
                    </div>

                    <div className="api-section">
                        <h4>Delete File API</h4>
                        <pre className="api-example">
                            {`curl -X 'POST' \\
  'http://localhost:9876/api/files/delete' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{ "file_url": "https://example.com/file.jpg" }'`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}