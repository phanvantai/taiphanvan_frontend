/**
 * Tracking Script Component
 * Conditionally loads Google Analytics 4 script based on user consent
 */

'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useAnalytics } from './AnalyticsProvider';
import { getMeasurementId } from '@/lib/analytics/google-analytics';

export const TrackingScript: React.FC = () => {
    const { isAnalyticsEnabled, consentState } = useAnalytics();
    const measurementId = getMeasurementId();

    useEffect(() => {
        // Initialize dataLayer if it doesn't exist
        if (typeof window !== 'undefined' && !window.dataLayer) {
            window.dataLayer = [];
        }
    }, []);

    // Don't render script if analytics is not enabled or no measurement ID
    if (!isAnalyticsEnabled || !measurementId) {
        return null;
    }

    return (
        <>
            {/* Google Analytics 4 Script */}
            <Script
                id="google-analytics"
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('GA4 script loaded successfully');
                }}
                onError={(error) => {
                    console.error('Failed to load GA4 script:', error);
                }}
            />

            {/* Google Analytics 4 Configuration */}
            <Script
                id="google-analytics-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
              allow_google_signals: ${consentState.preferences.marketing},
              allow_ad_personalization_signals: ${consentState.preferences.marketing},
              cookie_domain: 'auto',
              cookie_expires: 63072000, // 2 years
              cookie_flags: 'SameSite=None;Secure',
              send_page_view: true
            });
            
            // Set consent mode
            gtag('consent', 'default', {
              analytics_storage: '${consentState.preferences.analytics ? 'granted' : 'denied'}',
              ad_storage: '${consentState.preferences.marketing ? 'granted' : 'denied'}',
              functionality_storage: '${consentState.preferences.functional ? 'granted' : 'denied'}',
              personalization_storage: '${consentState.preferences.marketing ? 'granted' : 'denied'}',
              security_storage: 'granted'
            });
          `
                }}
            />
        </>
    );
};

export default TrackingScript;
