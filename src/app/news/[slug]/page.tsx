import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { newsService } from '@/lib/api/newsService';
import { News } from '@/models/News';
import '../news.css';
import NewsDetailLoading from './loading';

// Generate metadata for this page
export async function generateMetadata({
    params
}: {
    params: { slug: string }
}): Promise<Metadata> {
    try {
        const news = await newsService.getNewsBySlug(params.slug);

        return {
            title: `${news.title} | Tai Phan Van`,
            description: news.summary,
            openGraph: {
                title: news.title,
                description: news.summary,
                url: `/news/${news.slug}`,
                type: 'article',
                images: news.image_url ? [{ url: news.image_url }] : [],
            },
        };
    } catch {
        return {
            title: 'News Article | Tai Phan Van',
            description: 'Read the latest news article',
        };
    }
}

// Format date to a readable format
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// News Detail component
async function NewsDetail({ news }: { news: News }) {
    return (
        <article className="newsDetailContainer">
            <h1 className="newsDetailTitle">{news.title}</h1>

            <div className="newsDetailMeta">
                <span>From: <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="sourceLink">{news.source}</a></span>
                <span>Published: {formatDate(news.publish_date)}</span>
            </div>

            {news.image_url && (
                <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '2rem' }}>
                    <Image
                        src={news.image_url}
                        alt={news.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="100vw"
                        priority
                    />
                </div>
            )}

            <div className="newsDetailSummary">{news.summary}</div>

            {news.content && (
                <div
                    className="newsContent"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="backButton" style={{ marginRight: '1rem' }}>
                    Read Full Article
                </a>
                <Link href="/news" className="backButton">
                    Back to News
                </Link>
            </div>
        </article>
    );
}

// News Detail Page
export default async function NewsDetailPage({
    params
}: {
    params: { slug: string }
}) {
    return (
        <Suspense fallback={<NewsDetailLoading />}>
            <NewsDetailContent params={params} />
        </Suspense>
    );
}

// News Detail Content with data fetching
async function NewsDetailContent({ params }: { params: { slug: string } }) {
    try {
        const news = await newsService.getNewsBySlug(params.slug);
        return <NewsDetail news={news} />;
    } catch (error) {
        console.error(`Error fetching news for slug ${params.slug}:`, error);
        notFound();
    }
}
