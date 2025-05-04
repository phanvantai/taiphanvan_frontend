import React from 'react';
import { getLatestNews } from '@/lib/news';
import NewsCard from '@/components/NewsCard';
import type { Metadata } from 'next/types';
import { NewsItem } from '@/types';

export const metadata: Metadata = {
    title: 'Latest Technology News | Tai Phan Van',
    description: 'Stay updated with the latest news about AI, blockchain, and emerging technologies.',
    openGraph: {
        title: 'Latest Technology News | Tai Phan Van',
        description: 'Stay updated with the latest news about AI, blockchain, and emerging technologies.',
        type: 'website',
    },
};

export default async function NewsPage() {
    const news = await getLatestNews();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Latest Technology News</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Stay updated with the latest developments in AI, blockchain, and other emerging technologies.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item: NewsItem) => (
                    <NewsCard key={item.id} news={item} />
                ))}
            </div>
        </div>
    );
}