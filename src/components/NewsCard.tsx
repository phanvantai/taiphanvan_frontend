"use client";

import Link from 'next/link';
import { News } from '@/models/News';
import NewsImage from './NewsImage';
import './news-card.css';

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * News Card Component for displaying news article summaries
 * 
 * @param item - The news item to display
 */
export default function NewsCard({ item }: { item: News }) {
    return (
        <Link href={`/news/${item.slug}`} className="newsCard">
            <NewsImage
                src={item.image_url}
                alt={item.title}
                className="newsImage"
            />
            <div className="newsContent">
                <h2 className="newsTitle">{item.title}</h2>
                <p className="newsSummary">{item.summary}</p>
                <div className="newsFooter">
                    <span className="newsSource">{item.source}</span>
                    <span className="newsDate">{formatDate(item.publish_date)}</span>
                </div>
            </div>
        </Link>
    );
}
