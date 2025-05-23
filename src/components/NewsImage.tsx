'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './NewsImage.module.css';

interface NewsImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    aspectRatio?: string;
}

/**
 * News image component optimized for news articles
 * Includes fallback handling and optimizations
 * 
 * @param src - The image URL
 * @param alt - Alt text for the image
 * @param className - Optional CSS class name
 * @param aspectRatio - Optional aspect ratio (default: 16:9)
 */
export default function NewsImage({ src, alt, className = '', aspectRatio = '16:9' }: NewsImageProps) {
    const [imgError, setImgError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Determine aspect ratio padding
    const aspectRatioPadding = aspectRatio === '16:9' ? '56.25%' :
        aspectRatio === '4:3' ? '75%' :
            aspectRatio === '1:1' ? '100%' : '56.25%';

    // Use a placeholder if no image URL or if image fails to load
    const imageSrc = imgError || !src ? '/images/news-placeholder.svg' : src;

    return (
        <div
            className={`${styles.newsImageWrapper} ${isLoading ? styles.newsImageLoading : ''} ${className}`}
            style={{ position: 'relative', width: '100%', paddingTop: aspectRatioPadding }}
        >
            <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className={styles.newsImageElement}
                priority={false}
                loading="lazy"
                onError={() => setImgError(true)}
                onLoad={() => setIsLoading(false)}
                unoptimized={!src || !src.startsWith('/')} // Only optimize local images
            />
        </div>
    );
}
