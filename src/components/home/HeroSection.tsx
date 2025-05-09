import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
    return (
        <section className={styles.hero} data-testid="hero-section">
            <h1 className="section-title">
                Welcome to <span className="highlight">Tai Phan Van</span>
            </h1>
            <p className={styles.description}>
                Sharing thoughts, experiences, and knowledge on technology, design, and life.
            </p>
            <Link
                href="/blog"
                className="btn btn-primary"
                data-testid="read-blog-button"
            >
                Read My Blog
            </Link>
        </section>
    );
}