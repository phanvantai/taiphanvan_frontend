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
    'images.pexels.com'
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
    const [imgError, setImgError] = useState(false);

    // Function to check if the image is from a configured domain
    const isConfiguredDomain = () => {
        try {
            const url = new URL(src);
            return CONFIGURED_DOMAINS.includes(url.hostname);
        } catch {
            return false;
        }
    };

    // If the image URL is from a configured domain and there's no error, use Next.js Image
    if (src && isConfiguredDomain() && !imgError) {
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
                onError={() => {
                    setImgError(true);
                    onError?.();
                }}
            />
        );
    }

    // Otherwise, fall back to Next.js Image with unoptimized prop
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
            unoptimized={true} // Skip image optimization for non-configured domains
            onError={() => {
                onError?.();
            }}
        />
    );
}