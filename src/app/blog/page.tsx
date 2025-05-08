import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog";
import BlogPostCard from "@/components/BlogPostCard";
import "./blog.css";

export default async function BlogPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Get the tag filter from the URL if present
    const tagFilter = searchParams.tag as string | undefined;

    // Fetch all posts and tags
    const blogPosts = await getAllPosts();
    const tags = await getAllTags();

    // Filter posts by tag if a tag is selected
    const filteredPosts = tagFilter
        ? blogPosts.filter(post => post.tags.includes(tagFilter))
        : blogPosts;

    return (
        <div className="blog-container">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="section-title">Tai Phan Van Blog</h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-muted-color)',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    Thoughts, stories, and ideas on technology, design, and more.
                </p>
            </header>

            {/* Tags filter */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <div className="filter-buttons">
                    <Link
                        href="/blog"
                        className={`filter-btn ${!tagFilter ? 'active' : ''}`}
                    >
                        All
                    </Link>
                    {tags.map(tag => (
                        <Link
                            key={tag}
                            href={`/blog?tag=${tag}`}
                            className={`filter-btn ${tagFilter === tag ? 'active' : ''}`}
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="blog-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                        No posts found {tagFilter ? `with tag "${tagFilter}"` : ''}.
                    </p>
                )}
            </div>
        </div>
    );
}