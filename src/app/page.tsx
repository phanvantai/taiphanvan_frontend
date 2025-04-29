import Link from "next/link";
import Image from "next/image";
import BlogPostCard from "@/components/BlogPostCard";
import { getFeaturedPosts } from "@/lib/blog";

export default function Home() {
  // Get featured blog posts using our utility function
  const featuredPosts = getFeaturedPosts(3);

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section style={{
        background: 'var(--hero-gradient)',
        borderRadius: '15px',
        padding: '4rem 2rem',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in-out'
      }}>
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>
          Welcome to My <span className="highlight">Personal Blog</span>
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-muted-color)',
          marginBottom: '2rem',
          maxWidth: '700px',
          margin: '0 auto 2rem'
        }}>
          Sharing thoughts, experiences, and knowledge on technology, design, and life.
        </p>
        <Link
          href="/blog"
          className="btn btn-primary"
        >
          Read My Blog
        </Link>
      </section>

      {/* Featured posts section */}
      <section>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 className="section-title" style={{ margin: 0 }}>Featured Posts</h2>
          <Link href="/blog" style={{
            color: 'var(--text-muted-color)',
            fontWeight: 500,
            transition: 'color 0.3s'
          }} className="hover-effect">
            View all posts →
          </Link>
        </div>

        <div className="blog-grid">
          {featuredPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter section */}
      <section style={{
        background: 'var(--background-alt-color)',
        padding: '3rem',
        borderRadius: '15px',
        boxShadow: '0 5px 15px var(--shadow-color)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Subscribe to my newsletter
          </h2>
          <p style={{
            color: 'var(--text-muted-color)',
            marginBottom: '2rem'
          }}>
            Get the latest posts and updates delivered straight to your inbox.
          </p>
          <form className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flexGrow: 1,
                padding: '0.8rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '30px',
                backgroundColor: 'var(--background-color)',
                color: 'var(--text-color)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
