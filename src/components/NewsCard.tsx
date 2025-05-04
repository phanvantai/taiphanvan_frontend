import React from 'react';
import Image from 'next/image';
import { NewsItem } from '@/types';
import ShareButtons from './ShareButtons';

interface NewsCardProps {
    news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
    const { title, description, imageUrl, publishedAt, source, url, category } = news;

    // Format the date
    const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={imageUrl || '/images/news-placeholder.jpg'}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {category}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-medium">{source}</span>
                    <span className="mx-2">•</span>
                    <span>{formattedDate}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                    {title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {description}
                </p>

                <div className="flex justify-between items-center">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center transition-colors"
                    >
                        Read Full Article
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    <ShareButtons
                        url={url}
                        title={title}
                        compact={true}
                    />
                </div>
            </div>
        </div>
    );
}