'use client';

/**
 * Privacy Policy Page
 * Comprehensive privacy policy with analytics disclosure
 */

import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="privacy-policy-container">
            <div className="privacy-policy-content">
                <header className="privacy-header">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </header>

                <div className="privacy-sections">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Tai Phan Van&apos;s personal blog. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you visit our website. Please read
                            this privacy policy carefully. If you do not agree with the terms of this privacy
                            policy, please do not access the site.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>

                        <h3>2.1 Personal Information</h3>
                        <p>We may collect personal information that you voluntarily provide to us when you:</p>
                        <ul>
                            <li>Subscribe to our newsletter</li>
                            <li>Submit comments on blog posts</li>
                            <li>Contact us through forms or email</li>
                            <li>Register for an account (if applicable)</li>
                        </ul>

                        <h3>2.2 Automatically Collected Information</h3>
                        <p>
                            When you visit our website, we may automatically collect certain information about
                            your device and browsing behavior, including:
                        </p>
                        <ul>
                            <li>IP address and approximate location</li>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>Pages viewed and time spent on pages</li>
                            <li>Referring website</li>
                            <li>Device type and screen resolution</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Analytics and Tracking Technologies</h2>

                        <h3>3.1 Google Analytics 4</h3>
                        <p>
                            We use Google Analytics 4 (GA4) to understand how visitors interact with our website.
                            Google Analytics collects information such as:
                        </p>
                        <ul>
                            <li>Pages you visit and time spent on each page</li>
                            <li>How you arrived at our site (search engines, direct visits, social media)</li>
                            <li>Your approximate geographic location (city/country level)</li>
                            <li>Device and browser information</li>
                            <li>User engagement and interaction patterns</li>
                        </ul>

                        <div className="analytics-details">
                            <h4>Data Processing and Retention</h4>
                            <ul>
                                <li><strong>Data Processor:</strong> Google LLC</li>
                                <li><strong>Data Retention:</strong> 26 months (or as configured)</li>
                                <li><strong>IP Anonymization:</strong> Enabled</li>
                                <li><strong>Data Sharing:</strong> Limited to analytics purposes only</li>
                            </ul>
                        </div>

                        <h3>3.2 Cookies and Local Storage</h3>
                        <p>We use different types of cookies and local storage for various purposes:</p>

                        <div className="cookie-types">
                            <h4>Essential Cookies (Always Active)</h4>
                            <ul>
                                <li><strong>Consent Preferences:</strong> Remembers your cookie preferences</li>
                                <li><strong>Session Management:</strong> Maintains your session state</li>
                                <li><strong>Security:</strong> Prevents cross-site request forgery</li>
                            </ul>

                            <h4>Analytics Cookies (Optional)</h4>
                            <ul>
                                <li><strong>_ga:</strong> Distinguishes unique users (expires: 2 years)</li>
                                <li><strong>_ga_*:</strong> Used to persist session state (expires: 2 years)</li>
                                <li><strong>_gid:</strong> Distinguishes unique users (expires: 24 hours)</li>
                            </ul>

                            <h4>Marketing Cookies (Optional)</h4>
                            <ul>
                                <li><strong>Social Media Pixels:</strong> Track engagement from social platforms</li>
                                <li><strong>Advertisement Cookies:</strong> Measure ad effectiveness (if applicable)</li>
                            </ul>
                        </div>

                        <h3>3.3 Your Choices Regarding Analytics</h3>
                        <p>You have several options to control analytics tracking:</p>
                        <ul>
                            <li><strong>Cookie Consent Banner:</strong> Choose which cookies to accept when you first visit</li>
                            <li><strong>Browser Settings:</strong> Disable cookies in your browser settings</li>
                            <li><strong>Google Analytics Opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                            <li><strong>Do Not Track:</strong> We respect Do Not Track signals from your browser</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. How We Use Your Information</h2>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li><strong>Website Operation:</strong> Provide and maintain our website services</li>
                            <li><strong>Analytics:</strong> Understand user behavior and improve our content</li>
                            <li><strong>Communication:</strong> Send newsletters and respond to inquiries</li>
                            <li><strong>Security:</strong> Monitor for suspicious activity and prevent abuse</li>
                            <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Data Sharing and Disclosure</h2>
                        <p>We do not sell, trade, or rent your personal information. We may share information in the following limited circumstances:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> Google Analytics, email service providers, hosting services</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfer:</strong> In the event of a merger or acquisition</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational security measures to protect
                            your personal information against unauthorized access, alteration, disclosure, or
                            destruction. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2>7. Your Privacy Rights</h2>

                        <h3>7.1 GDPR Rights (EU Residents)</h3>
                        <p>If you are located in the European Union, you have the following rights:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                            <li><strong>Portability:</strong> Request transfer of your data</li>
                            <li><strong>Objection:</strong> Object to processing of your data</li>
                            <li><strong>Restriction:</strong> Request restriction of processing</li>
                        </ul>

                        <h3>7.2 CCPA Rights (California Residents)</h3>
                        <p>If you are a California resident, you have the right to:</p>
                        <ul>
                            <li>Know what personal information is collected about you</li>
                            <li>Know whether your personal information is sold or disclosed</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt-out of the sale of your personal information</li>
                            <li>Non-discrimination for exercising your privacy rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Children&apos;s Privacy</h2>
                        <p>
                            Our website is not intended for children under the age of 13. We do not knowingly
                            collect personal information from children under 13. If you are a parent or guardian
                            and believe your child has provided us with personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2>9. Third-Party Services</h2>
                        <p>Our website may contain links to third-party websites or services. This privacy policy applies only to our website. We encourage you to read the privacy policies of any third-party sites you visit.</p>

                        <h3>Third-Party Services We Use:</h3>
                        <ul>
                            <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                            <li><strong>Vercel (Hosting):</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2>10. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your own.
                            We ensure that such transfers comply with applicable data protection laws and implement
                            appropriate safeguards.
                        </p>
                    </section>

                    <section>
                        <h2>11. Updates to This Privacy Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. Any changes will be posted on
                            this page with an updated revision date. We encourage you to review this privacy
                            policy periodically.
                        </p>
                    </section>

                    <section>
                        <h2>12. Contact Information</h2>
                        <p>If you have any questions about this privacy policy or our privacy practices, please contact us:</p>
                        <div className="contact-info">
                            <p><strong>Email:</strong> privacy@taiphanvan.com</p>
                            <p><strong>Response Time:</strong> We will respond to privacy inquiries within 30 days</p>
                        </div>
                    </section>

                    <section className="manage-preferences">
                        <h2>13. Manage Your Privacy Preferences</h2>
                        <p>You can manage your cookie and privacy preferences at any time:</p>
                        <button
                            className="preferences-button"
                            onClick={() => {
                                // This will trigger the cookie consent banner to reappear
                                if (typeof window !== 'undefined') {
                                    localStorage.removeItem('analytics_consent');
                                    window.location.reload();
                                }
                            }}
                        >
                            Update Cookie Preferences
                        </button>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .privacy-policy-container {
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }

                .privacy-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    padding-bottom: 2rem;
                    border-bottom: 2px solid #e5e5e5;
                }

                .privacy-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    color: #2c3e50;
                }

                .last-updated {
                    color: #666;
                    font-style: italic;
                    margin: 0;
                }

                .privacy-sections {
                    space-y: 2rem;
                }

                section {
                    margin-bottom: 2.5rem;
                }

                h2 {
                    color: #2c3e50;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #e5e5e5;
                }

                h3 {
                    color: #34495e;
                    font-size: 1.2rem;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }

                h4 {
                    color: #2c3e50;
                    font-size: 1rem;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }

                p {
                    margin-bottom: 1rem;
                }

                ul, ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }

                li {
                    margin-bottom: 0.5rem;
                }

                a {
                    color: #0066cc;
                    text-decoration: underline;
                }

                a:hover {
                    color: #0052a3;
                }

                .analytics-details,
                .cookie-types {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin: 1rem 0;
                    border-left: 4px solid #0066cc;
                }

                .contact-info {
                    background: #e8f4fd;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    border-left: 4px solid #0066cc;
                }

                .manage-preferences {
                    background: #f0f8f0;
                    padding: 2rem;
                    border-radius: 8px;
                    text-align: center;
                    border: 2px solid #28a745;
                }

                .preferences-button {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    margin-top: 1rem;
                }

                .preferences-button:hover {
                    background: #218838;
                }

                @media (max-width: 768px) {
                    .privacy-policy-container {
                        margin: 1rem auto;
                        padding: 0 0.75rem;
                    }

                    .privacy-header h1 {
                        font-size: 2rem;
                    }

                    .analytics-details,
                    .cookie-types {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
