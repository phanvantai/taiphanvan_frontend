import { fetchPosts } from "@/lib/blog";
import FeaturedPosts from "@/components/home/FeaturedPosts";
import FeaturedNews from "@/components/home/FeaturedNews";
import NewsletterSection from "@/components/home/NewsletterSection";
import styles from "./page.module.css";

/**
 * Home page component
 * 
 * Displays the main landing page with featured news, featured posts, and newsletter signup
 */
export default async function Home() {
  // Get featured blog posts from the API
  const featuredPosts = await fetchPosts(3, 'published');

  return (
    <div className={styles.container} data-testid="home-page">
      <FeaturedNews />
      <FeaturedPosts posts={featuredPosts} />
      <NewsletterSection />
    </div>
  );
}
