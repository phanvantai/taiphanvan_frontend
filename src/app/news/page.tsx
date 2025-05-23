import { Suspense } from 'react';
import { newsService } from '@/lib/api/newsService';
import NewsCard from '@/components/NewsCard';
import PaginationClient from '@/components/Pagination';
import './news.css';

/**
 * Loading component for news page
 */
function NewsLoading() {
    return (
        <div className="newsContainer">
            <h1 className="pageTitle">Loading News...</h1>
            <div className="newsGrid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="newsCard" style={{ opacity: 0.5 }}>
                        <div className="newsImageContainer">
                            <div className="placeholderImage">Loading...</div>
                        </div>
                        <div className="newsContent">
                            <div className="newsTitle" style={{ backgroundColor: 'var(--bg-secondary)', height: '20px', marginBottom: '15px', width: '100%' }}></div>
                            <div className="newsSummary" style={{ backgroundColor: 'var(--bg-secondary)', height: '60px', marginBottom: '15px', width: '100%' }}></div>
                            <div className="newsFooter">
                                <div style={{ backgroundColor: 'var(--bg-secondary)', height: '20px', width: '80px' }}></div>
                                <div style={{ backgroundColor: 'var(--bg-secondary)', height: '20px', width: '100px' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * News List component - fetches and displays the news
 */
async function NewsList({ page = 1 }: { page?: number }) {
    const perPage = 9; // Number of news items per page
    const newsData = await newsService.getNews(page, perPage);

    // Check if there was an error or no news items
    if (newsData.error || !newsData.news || newsData.news.length === 0) {
        return (
            <div className="newsContainer">
                <h1 className="pageTitle">Latest News</h1>
                <p className="description">
                    {newsData.error
                        ? "Sorry, we couldn't load the news at this time. Please try again later."
                        : "No news articles found."}
                </p>
            </div>
        );
    }

    return (
        <div className="newsContainer">
            <h1 className="pageTitle">Latest News</h1>
            <p className="description">
                Stay updated with the latest technology news and trends from trusted sources around the web.
            </p>

            <div className="newsGrid">
                {newsData.news.map(newsItem => (
                    <NewsCard key={newsItem.id} item={newsItem} />
                ))}
            </div>

            {newsData.total_pages > 1 && (
                <PaginationClient
                    currentPage={newsData.page}
                    totalPages={newsData.total_pages}
                    basePath="/news"
                />
            )}
        </div>
    );
}

/**
 * Main News Page component
 */
export default async function NewsPage(
    props: {
        searchParams?: Promise<{
            page?: string
        }>
    }
) {
    const searchParams = await props.searchParams;
    // Use a default value of 1 if searchParams.page is not provided or cannot be parsed
    const pageParam = searchParams?.page;
    const page = pageParam ? Number(pageParam) : 1;

    return (
        <Suspense fallback={<NewsLoading />}>
            <NewsList page={page} />
        </Suspense>
    );
}
