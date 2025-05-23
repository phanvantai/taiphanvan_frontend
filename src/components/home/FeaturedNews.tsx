import { newsService } from '@/lib/api/newsService';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import styles from './FeaturedNews.module.css';

/**
 * Featured News component for the homepage
 * Shows the latest news articles
 */
export default async function FeaturedNews() {
    try {
        // Fetch the latest 3 news articles
        const newsData = await newsService.getNews(1, 3);

        // Handle error or empty results gracefully
        if (newsData.error || !newsData.news || newsData.news.length === 0) {
            // If in development, log the error
            if (process.env.NODE_ENV === 'development' && newsData.error) {
                console.error('Error fetching news for homepage:', newsData.error);
            }
            return null; // Don't show the section if there's an error or no news
        }

        return (
            <section className={styles.featuredNewsSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Latest News</h2>
                    <p className={styles.sectionDescription}>
                        Stay updated with the latest technology news and trends
                    </p>

                    <div className={styles.newsGrid}>
                        {newsData.news.map((newsItem) => (
                            <NewsCard key={newsItem.id} item={newsItem} />
                        ))}
                    </div>

                    <div className={styles.viewAllContainer}>
                        <Link href="/news" className={styles.viewAllButton}>
                            View All News
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIcon}>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error in FeaturedNews component:', error);
        return null; // Return null to gracefully handle any unexpected errors
    }
}
