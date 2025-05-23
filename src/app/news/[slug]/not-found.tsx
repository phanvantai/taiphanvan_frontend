"use client";

import Link from 'next/link';

export default function NewsNotFound() {
  return (
    <div className="not-found-container">
      <h1>Article Not Found</h1>
      <p>The news article you were looking for could not be found.</p>
      <p>This could be because:</p>
      <ul>
        <li>The article has been removed</li>
        <li>The URL is incorrect</li>
        <li>The article is no longer available</li>
      </ul>
      <Link href="/news" className="back-button">
        Return to News
      </Link>

      <style jsx>{`
        .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        p {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
        
        ul {
          list-style-type: disc;
          margin: 1rem 0;
          padding-left: 2rem;
          align-self: flex-start;
          text-align: left;
        }
        
        li {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
        
        .back-button {
          margin-top: 2rem;
          padding: 0.75rem 1.5rem;
          background-color: var(--bg-accent);
          color: var(--text-on-accent);
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .back-button:hover {
          background-color: var(--bg-accent-hover);
        }
      `}</style>
    </div>
  );
}
