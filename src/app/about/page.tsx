import type { Metadata } from 'next/types';

export const metadata: Metadata = {
    title: 'About Me | Tai Phan Van',
    description: 'Learn more about Tai Phan Van and my background, interests, and expertise.'
};

export default function AboutPage() {
    return (
        <div className="blog-container">
            <h1 className="section-title">About Me</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
            }}>
                <div className="about-image" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '400px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px var(--shadow-color)'
                    }}>
                        {/* Replace with your own photo */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'var(--background-alt-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted-color)'
                        }}>
                            <i className="fas fa-user fa-3x"></i>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        marginBottom: '1rem',
                        color: 'var(--primary-color)'
                    }}>Hello, I&apos;m Tai Phan Van</h2>
                    <p style={{
                        marginBottom: '1.5rem',
                        color: 'var(--text-muted-color)'
                    }}>
                        I&apos;m a [your profession] with a passion for [your interests]. This blog is where I share my thoughts,
                        experiences, and knowledge about technology, design, and personal development.
                    </p>
                    <p style={{
                        marginBottom: '1.5rem',
                        color: 'var(--text-muted-color)'
                    }}>
                        I started this blog in April 2025 as a way to document my journey, connect with like-minded people,
                        and contribute to the community that has helped me grow throughout my career.
                    </p>
                    <div className="social-icons" style={{ marginTop: '2rem' }}>
                        <a
                            href="https://twitter.com/taiphanvan"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Follow me on Twitter"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                        </a>
                        <a
                            href="https://github.com/taiphanvan"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Follow me on GitHub"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </a>
                        <a
                            href="https://linkedin.com/in/taiphanvan"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Connect with me on LinkedIn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a
                            href="mailto:contact@taiphanvan.dev"
                            aria-label="Email me"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <section style={{ marginBottom: '4rem' }}>
                <h2 className="section-title">My Background</h2>
                <p style={{
                    marginBottom: '1.5rem',
                    color: 'var(--text-muted-color)'
                }}>
                    I have over [X years] of experience in [your field]. I&apos;ve worked with [relevant technologies, tools, or companies]
                    and have developed expertise in [your specialties].
                </p>
                <p style={{
                    marginBottom: '1.5rem',
                    color: 'var(--text-muted-color)'
                }}>
                    My educational background includes [your education]. I&apos;m always learning and currently exploring [what you&apos;re learning now].
                </p>
            </section>

            <section style={{ marginBottom: '4rem' }}>
                <h2 className="section-title">What I Write About</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'var(--card-bg-color)',
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 5px 15px var(--shadow-color)',
                        transition: 'transform 0.3s ease'
                    }} className="hover-card">
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: 'var(--primary-color)'
                        }}>
                            <i className="fas fa-laptop-code" style={{ marginRight: '0.5rem' }}></i>
                            Technology
                        </h3>
                        <p style={{ color: 'var(--text-muted-color)' }}>
                            Web development, programming languages, tools, and best practices.
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--card-bg-color)',
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 5px 15px var(--shadow-color)',
                        transition: 'transform 0.3s ease'
                    }} className="hover-card">
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: 'var(--primary-color)'
                        }}>
                            <i className="fas fa-paint-brush" style={{ marginRight: '0.5rem' }}></i>
                            Design
                        </h3>
                        <p style={{ color: 'var(--text-muted-color)' }}>
                            UI/UX principles, design systems, and creative processes.
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--card-bg-color)',
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 5px 15px var(--shadow-color)',
                        transition: 'transform 0.3s ease'
                    }} className="hover-card">
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: 'var(--primary-color)'
                        }}>
                            <i className="fas fa-brain" style={{ marginRight: '0.5rem' }}></i>
                            Personal Growth
                        </h3>
                        <p style={{ color: 'var(--text-muted-color)' }}>
                            Learning strategies, productivity tips, and career development.
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'var(--card-bg-color)',
                        padding: '2rem',
                        borderRadius: '10px',
                        boxShadow: '0 5px 15px var(--shadow-color)',
                        transition: 'transform 0.3s ease'
                    }} className="hover-card">
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: 'var(--primary-color)'
                        }}>
                            <i className="fas fa-project-diagram" style={{ marginRight: '0.5rem' }}></i>
                            Projects
                        </h3>
                        <p style={{ color: 'var(--text-muted-color)' }}>
                            Showcasing my work, side projects, and open source contributions.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="section-title">Get In Touch</h2>
                <p style={{
                    marginBottom: '2rem',
                    color: 'var(--text-muted-color)',
                    textAlign: 'center',
                    maxWidth: '700px',
                    margin: '0 auto 2rem'
                }}>
                    I&apos;m always open to connecting with new people, discussing interesting projects, or just having a friendly chat.
                    Feel free to reach out to me through any of the social platforms above or send me an email at
                    <a href="mailto:contact@taiphanvan.dev" style={{
                        color: 'var(--primary-color)',
                        marginLeft: '5px'
                    }}>
                        contact@taiphanvan.dev
                    </a>.
                </p>

                <div style={{ textAlign: 'center' }}>
                    <a href="mailto:contact@taiphanvan.dev" className="btn btn-primary">
                        Get in Touch
                    </a>
                </div>
            </section>
        </div>
    );
}