import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { newsService } from '@/lib/api/newsService';
import { News } from '@/models/News';
import { decodeHtmlEntities } from '@/lib/utils/textUtils';
import '../news.css';
import NewsDetailLoading from './loading';

// Generate metadata for this page
export async function generateMetadata(
    props: {
        params: Promise<{ slug: string }>
    }
): Promise<Metadata> {
    const params = await props.params;
    try {
        const news = await newsService.getNewsBySlug(params.slug);

        return {
            title: `${news.title} | Tai Phan Van`,
            description: decodeHtmlEntities(news.summary),
            openGraph: {
                title: news.title,
                description: decodeHtmlEntities(news.summary),
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

// Extract image URLs from HTML content using regex (for server-side compatibility)
function extractImagesFromHTML(htmlContent?: string): string[] {
    if (!htmlContent) return [];

    // Server-side compatible regex approach
    const imgSrcRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const imageUrls: string[] = [];
    let match;

    while ((match = imgSrcRegex.exec(htmlContent)) !== null) {
        if (match[1]) {
            imageUrls.push(match[1]);
        }
    }

    return imageUrls;
}

// Compare image URLs considering different formats
function areImageUrlsEqual(url1: string, url2: string): boolean {
    if (!url1 || !url2) return false;

    // Direct comparison
    if (url1 === url2) return true;

    // Normalize URLs (remove protocol, query params, etc.)
    const normalizeUrl = (url: string): string => {
        // Remove protocol
        let normalized = url.replace(/^https?:\/\//, '');
        // Remove query parameters
        normalized = normalized.split('?')[0];
        // Remove hash
        normalized = normalized.split('#')[0];
        return normalized;
    };

    const normalizedUrl1 = normalizeUrl(url1);
    const normalizedUrl2 = normalizeUrl(url2);

    // Check for normalized equality
    if (normalizedUrl1 === normalizedUrl2) return true;

    // Check if one URL is a subpath of the other
    if (normalizedUrl1.includes(normalizedUrl2) || normalizedUrl2.includes(normalizedUrl1)) return true;

    // Compare just the filename
    const filename1 = normalizedUrl1.split('/').pop() || '';
    const filename2 = normalizedUrl2.split('/').pop() || '';

    return filename1 === filename2 && filename1 !== '';
}

function imageAppearsInContent(content?: string, imageUrl?: string): boolean {
    if (!content || !imageUrl) return false;

    // Extract all image URLs from the content
    const imageUrls = extractImagesFromHTML(content);

    // Compare with the target image URL
    return imageUrls.some(url => areImageUrlsEqual(url, imageUrl));
}

// News Detail component
async function NewsDetail({ news }: { news: News }) {
    // Extract images for debugging
    const contentImages = extractImagesFromHTML(news.content);

    // Debug information on server
    console.log('Top image URL:', news.image_url);
    console.log('Images in content:', contentImages);
    console.log('Image appears in content:', imageAppearsInContent(news.content, news.image_url));

    // Check if the image should be displayed at the top
    const shouldDisplayTopImage = news.image_url && !imageAppearsInContent(news.content, news.image_url);

    return (
        <article className="newsDetailContainer">
            <h1 className="newsDetailTitle">{news.title}</h1>

            <div className="newsDetailMeta">
                <span>From: <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="sourceLink">{news.source}</a></span>
                <span>Published: {formatDate(news.publish_date)}</span>
            </div>

            {news.image_url && shouldDisplayTopImage && (
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

            <div className="newsDetailSummary">{decodeHtmlEntities(news.summary)}</div>

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
export default async function NewsDetailPage(
    props: {
        params: Promise<{ slug: string }>
    }
) {
    const params = await props.params;
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
