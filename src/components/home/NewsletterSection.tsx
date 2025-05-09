"use client";

import { useState } from "react";
import styles from "./NewsletterSection.module.css";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setMessage({ text: "Please enter your email address", type: "error" });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            // This would be replaced with an actual API call
            // await subscribeToNewsletter(email);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setMessage({ text: "Thank you for subscribing!", type: "success" });
            setEmail("");
        } catch (error) {
            setMessage({
                text: "Failed to subscribe. Please try again later. " + error,
                type: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.newsletter} data-testid="newsletter-section">
            <div className={styles.container}>
                <h2 className="section-title">
                    Subscribe to my newsletter
                </h2>
                <p className={styles.description}>
                    Get the latest posts and updates delivered straight to your inbox.
                </p>

                {message && (
                    <div
                        className={`${styles.message} ${styles[message.type]}`}
                        data-testid="newsletter-message"
                        role="alert"
                    >
                        {message.text}
                    </div>
                )}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    data-testid="newsletter-form"
                >
                    <input
                        type="email"
                        placeholder="Your email address"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email address"
                        required
                        data-testid="newsletter-email-input"
                    />
                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitButton}`}
                        disabled={isSubmitting}
                        data-testid="newsletter-submit-button"
                    >
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </button>
                </form>
            </div>
        </section>
    );
}