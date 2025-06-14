/**
 * Cookie Consent Banner
 * GDPR-compliant consent management interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsProvider';
import { shouldShowConsentBanner, ConsentPreferences } from '@/lib/analytics/privacy';

interface CookieConsentProps {
    className?: string;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ className = '' }) => {
    const { updateConsent } = useAnalytics();
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        analytics: false,
        marketing: false,
        functional: true,
        timestamp: Date.now()
    });

    useEffect(() => {
        // Show banner only if consent hasn't been given
        setShowBanner(shouldShowConsentBanner());
    }, []);

    const handleAcceptAll = () => {
        const allConsent: ConsentPreferences = {
            analytics: true,
            marketing: true,
            functional: true,
            timestamp: Date.now()
        };
        updateConsent(allConsent);
        setShowBanner(false);
    };

    const handleRejectAll = () => {
        const minimalConsent: ConsentPreferences = {
            analytics: false,
            marketing: false,
            functional: true, // Functional cookies are essential
            timestamp: Date.now()
        };
        updateConsent(minimalConsent);
        setShowBanner(false);
    };

    const handleSavePreferences = () => {
        updateConsent({
            ...preferences,
            timestamp: Date.now()
        });
        setShowBanner(false);
        setShowDetails(false);
    };

    const handlePreferenceChange = (type: keyof ConsentPreferences, value: boolean) => {
        if (type === 'timestamp') return; // Don't allow direct timestamp changes

        setPreferences(prev => ({
            ...prev,
            [type]: value
        }));
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className={`cookie-consent-banner ${className}`}>
            <div className="cookie-consent-overlay">
                <div className="cookie-consent-modal">
                    <div className="cookie-consent-header">
                        <h3>🍪 Cookie Preferences</h3>
                        <button
                            className="cookie-consent-close"
                            onClick={() => setShowBanner(false)}
                            aria-label="Close cookie banner"
                        >
                            ×
                        </button>
                    </div>

                    <div className="cookie-consent-content">
                        {!showDetails ? (
                            // Simple consent view
                            <>
                                <p>                                    We use cookies to enhance your browsing experience, analyze site traffic,
                                    and understand where our visitors are coming from. By clicking &quot;Accept All&quot;,
                                    you consent to our use of cookies.
                                </p>
                                <p>
                                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                        Learn more in our Privacy Policy
                                    </a>
                                </p>
                            </>
                        ) : (
                            // Detailed preferences view
                            <div className="cookie-preferences">
                                <h4>Manage Your Cookie Preferences</h4>

                                <div className="preference-item">
                                    <div className="preference-header">
                                        <label htmlFor="functional-cookies">
                                            <strong>Essential Cookies</strong>
                                        </label>
                                        <input
                                            id="functional-cookies"
                                            type="checkbox"
                                            checked={true}
                                            disabled={true}
                                            aria-describedby="functional-description"
                                        />
                                    </div>
                                    <p id="functional-description" className="preference-description">
                                        These cookies are necessary for the website to function and cannot be switched off.
                                    </p>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-header">
                                        <label htmlFor="analytics-cookies">
                                            <strong>Analytics Cookies</strong>
                                        </label>
                                        <input
                                            id="analytics-cookies"
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                                            aria-describedby="analytics-description"
                                        />
                                    </div>
                                    <p id="analytics-description" className="preference-description">
                                        These cookies help us understand how visitors interact with our website by collecting anonymous information.
                                    </p>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-header">
                                        <label htmlFor="marketing-cookies">
                                            <strong>Marketing Cookies</strong>
                                        </label>
                                        <input
                                            id="marketing-cookies"
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                                            aria-describedby="marketing-description"
                                        />
                                    </div>
                                    <p id="marketing-description" className="preference-description">
                                        These cookies are used to deliver personalized advertisements and measure their effectiveness.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="cookie-consent-actions">
                        {!showDetails ? (
                            <>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetails(true)}
                                >
                                    Customize
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={handleRejectAll}
                                >
                                    Reject All
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAcceptAll}
                                >
                                    Accept All
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetails(false)}
                                >
                                    Back
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={handleRejectAll}
                                >
                                    Reject All
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSavePreferences}
                                >
                                    Save Preferences
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .cookie-consent-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          pointer-events: auto;
        }

        .cookie-consent-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .cookie-consent-modal {
          background: white;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .cookie-consent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e5e5e5;
        }

        .cookie-consent-header h3 {
          margin: 0;
          color: #333;
        }

        .cookie-consent-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cookie-consent-close:hover {
          color: #333;
        }

        .cookie-consent-content {
          padding: 1.5rem;
        }

        .cookie-consent-content p {
          margin-bottom: 1rem;
          line-height: 1.5;
          color: #555;
        }

        .cookie-consent-content a {
          color: #0066cc;
          text-decoration: underline;
        }

        .cookie-preferences h4 {
          margin-bottom: 1.5rem;
          color: #333;
        }

        .preference-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .preference-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .preference-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .preference-header label {
          color: #333;
          cursor: pointer;
        }

        .preference-header input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .preference-description {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .cookie-consent-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid #e5e5e5;
          justify-content: flex-end;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #0066cc;
          color: white;
          border-color: #0066cc;
        }

        .btn-primary:hover {
          background: #0052a3;
          border-color: #0052a3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover {
          background: #5a6268;
          border-color: #5a6268;
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border-color: #6c757d;
        }

        .btn-outline:hover {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .cookie-consent-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default CookieConsent;
