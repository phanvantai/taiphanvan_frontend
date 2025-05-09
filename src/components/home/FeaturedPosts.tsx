import Link from "next/link";
import BlogPostCard from "@/components/BlogPostCard";
import { FormattedPost } from "@/models/BlogPost";
import styles from "./FeaturedPosts.module.css";

interface FeaturedPostsProps {
    posts: FormattedPost[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
    return (
        <section data-testid="featured-posts-section">
            <div className={styles.header}>
                <h2 className="section-title">Featured Posts</h2>
                <Link href="/blog" className={`${styles.viewAll} hover-effect`} data-testid="view-all-posts">
                    View all posts →
                </Link>
            </div>

            <div className="blog-grid">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p data-testid="no-posts-message">No posts available at the moment. Check back later!</p>
                )}
            </div>
        </section>
    );
}