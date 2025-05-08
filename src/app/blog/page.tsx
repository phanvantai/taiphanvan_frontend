'use client';

import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import BlogPostCard from "@/components/BlogPostCard";
import "./blog.css";

export default function BlogPage() {
    const blogPosts = getAllPosts();
    const categories = getAllCategories();

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

            {/* Categories filter */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <div className="filter-buttons">
                    <Link
                        href="/blog"
                        className="filter-btn active"
                    >
                        All
                    </Link>
                    {categories.map(category => (
                        <Link
                            key={category}
                            href={`/blog?category=${category}`}
                            className="filter-btn"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="blog-grid">
                {blogPosts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}