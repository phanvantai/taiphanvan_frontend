import { Suspense } from 'react';
import { newsService } from '@/lib/api/newsService';
import NewsCard from '@/components/NewsCard';
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
 * Pagination component
 */
function Pagination({
    currentPage,
    totalPages,
    onPageChange
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                className="pageButton"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {startPage > 1 && (
                <>
                    <button className="pageButton" onClick={() => onPageChange(1)}>1</button>
                    {startPage > 2 && <span>...</span>}
                </>
            )}

            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`pageButton ${currentPage === number ? 'active' : ''}`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span>...</span>}
                    <button className="pageButton" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                </>
            )}

            <button
                className="pageButton"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
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
                <Pagination
                    currentPage={newsData.page}
                    totalPages={newsData.total_pages}
                    onPageChange={(newPage) => {
                        // This will be handled client-side with a search params update
                        window.location.href = `/news?page=${newPage}`;
                    }}
                />
            )}
        </div>
    );
}

/**
 * Main News Page component
 */
export default function NewsPage({
    searchParams
}: {
    searchParams?: {
        page?: string
    }
}) {
    // Use a default value of 1 if searchParams.page is not provided or cannot be parsed
    const pageParam = searchParams?.page;
    const page = pageParam ? Number(pageParam) : 1;

    return (
        <Suspense fallback={<NewsLoading />}>
            <NewsList page={page} />
        </Suspense>
    );
}
