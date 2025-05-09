'use client';

import Image from 'next/image';
import { useState } from 'react';

// List of domains that are configured in next.config.ts
const CONFIGURED_DOMAINS = [
    'source.unsplash.com',
    'res.cloudinary.com',
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'localhost', // Add localhost for development
];

interface SmartImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    style?: React.CSSProperties;
    priority?: boolean;
    onError?: () => void;
}

export default function SmartImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className = '',
    style = {},
    priority = false,
    onError,
}: SmartImageProps) {
    const [, setImgError] = useState(false);

    // Function to check if the image is from a configured domain
    const isConfiguredDomain = () => {
        try {
            // Handle relative URLs (they're always from our domain)
            if (src.startsWith('/')) {
                return true;
            }

            const url = new URL(src);
            return CONFIGURED_DOMAINS.includes(url.hostname);
        } catch {
            // If URL parsing fails, assume it's not a configured domain
            console.warn(`Failed to parse image URL: ${src}`);
            return false;
        }
    };

    // Log the image source for debugging
    console.log(`SmartImage rendering with src: ${src}, configured: ${isConfiguredDomain()}`);

    // Always use unoptimized Image for now to troubleshoot the issue
    return (
        <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width || 100}
            height={fill ? undefined : height || 100}
            fill={fill}
            className={className}
            style={style}
            priority={priority}
            unoptimized={true} // Skip image optimization for all images to troubleshoot
            onError={(e) => {
                console.error(`Image error for src: ${src}`, e);
                setImgError(true);
                onError?.();
            }}
        />
    );
}