/**
 * Google Analytics 4 Integration
 * Handles GA4 initialization, page tracking, and custom events
 */

import { analyticsConfig, validateAnalyticsConfig } from './config';
import { isAnalyticsAllowed } from './privacy';

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        dataLayer: unknown[];
        GA_INITIALIZED?: boolean;
        [key: string]: unknown;
    }
}

export interface GAEvent {
    action: string;
    category?: string;
    label?: string;
    value?: number;
    custom_parameters?: Record<string, unknown>;
}

export interface PageViewData {
    page_title?: string;
    page_location?: string;
    page_referrer?: string;
    content_group1?: string;
    content_group2?: string;
    user_id?: string;
    custom_parameters?: Record<string, unknown>;
}

export interface UserProperties {
    user_type?: 'anonymous' | 'registered' | 'subscriber';
    preferred_theme?: 'light' | 'dark' | 'system';
    user_engagement?: 'high' | 'medium' | 'low';
    custom_properties?: Record<string, unknown>;
}

/**
 * Initialize Google Analytics 4
 * @param measurementId - GA4 Measurement ID (G-XXXXXXXXXX)
 */
export const initGA = (measurementId: string): void => {
    // Validate configuration first
    if (!validateAnalyticsConfig()) {
        console.warn('🚫 GA4 initialization skipped: Invalid configuration');
        return;
    }

    // Check if analytics is allowed by user consent
    if (!isAnalyticsAllowed()) {
        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('🛡️ GA4 initialization skipped: User consent not given');
        }
        return;
    }

    // Prevent double initialization
    if (typeof window !== 'undefined' && window.GA_INITIALIZED) {
        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('⚠️ GA4 already initialized');
        }
        return;
    }

    try {
        // Initialize dataLayer if it doesn't exist
        if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];            // Define gtag function
            window.gtag = function (...args: unknown[]) {
                window.dataLayer.push(args);
            };

            // Initialize with current timestamp
            window.gtag('js', new Date());

            // Configure GA4 with privacy-focused settings
            window.gtag('config', measurementId, {
                // Page view settings
                send_page_view: true,
                page_title: document?.title,
                page_location: window.location.href,

                // Privacy settings
                anonymize_ip: true,
                allow_google_signals: analyticsConfig.privacy.consentRequired ? false : true,
                allow_ad_personalization_signals: false,

                // Cookie settings
                cookie_domain: 'auto',
                cookie_expires: analyticsConfig.privacy.analyticsStorageExpiry * 24 * 60 * 60, // Convert days to seconds
                cookie_flags: 'SameSite=Lax;Secure',

                // Sampling settings
                sample_rate: analyticsConfig.performance.sampleRate,
                site_speed_sample_rate: analyticsConfig.performance.siteSpeedSampleRate,

                // Custom settings
                custom_map: {
                    'custom_dimension_1': 'user_type',
                    'custom_dimension_2': 'content_category',
                    'custom_dimension_3': 'user_engagement'
                }
            });

            // Set default consent state
            window.gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                functionality_storage: 'granted',
                personalization_storage: 'denied',
                security_storage: 'granted'
            });

            // Mark as initialized
            window.GA_INITIALIZED = true;

            if (analyticsConfig.development.enableConsoleLogging) {
                console.log('✅ GA4 initialized successfully:', measurementId);
                console.log('🔧 Configuration:', {
                    anonymize_ip: true,
                    sample_rate: analyticsConfig.performance.sampleRate,
                    cookie_expires: analyticsConfig.privacy.analyticsStorageExpiry
                });
            }
        }
    } catch (error) {
        console.error('❌ GA4 initialization failed:', error);
    }
};

/**
 * Update consent settings
 * @param granted - Whether analytics consent is granted
 */
export const updateConsent = (granted: boolean): void => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
            analytics_storage: granted ? 'granted' : 'denied',
            ad_storage: 'denied', // Keep ads denied for privacy
            functionality_storage: 'granted',
            personalization_storage: granted ? 'granted' : 'denied',
            security_storage: 'granted'
        });

        if (analyticsConfig.development.enableConsoleLogging) {
            console.log(`🛡️ Consent updated: Analytics ${granted ? 'granted' : 'denied'}`);
        }
    }
};

/**
 * Track page views
 * @param url - Page URL
 * @param title - Page title
 * @param additionalData - Additional page view data
 */
export const trackPageView = (
    url: string,
    title?: string,
    additionalData?: Partial<PageViewData>
): void => {
    if (!isAnalyticsAllowed()) {
        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('🛡️ Page view tracking skipped: User consent not given');
        }
        return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
        try {
            const pageViewData: PageViewData = {
                page_title: title || document?.title || 'Unknown Page',
                page_location: url,
                page_referrer: document?.referrer || '',
                ...additionalData
            };            // Remove undefined values
            const cleanData = Object.fromEntries(
                Object.entries(pageViewData).filter(([, value]) => value !== undefined)
            );

            window.gtag('event', 'page_view', cleanData);

            if (analyticsConfig.development.enableConsoleLogging) {
                console.log('📊 Page view tracked:', { url, title, ...cleanData });
            }
        } catch (error) {
            console.error('❌ Page view tracking failed:', error);
        }
    }
};

/**
 * Track custom events
 * @param event - Event configuration
 */
export const trackEvent = (event: GAEvent): void => {
    if (!isAnalyticsAllowed()) {
        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('🛡️ Event tracking skipped: User consent not given');
        }
        return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
        try {
            const { action, category, label, value, custom_parameters, ...otherParams } = event;

            const eventData: Record<string, unknown> = {
                event_category: category,
                event_label: label,
                value: value,
                ...custom_parameters,
                ...otherParams
            };            // Remove undefined values
            const cleanEventData = Object.fromEntries(
                Object.entries(eventData).filter(([, value]) => value !== undefined)
            );

            window.gtag('event', action, cleanEventData);

            if (analyticsConfig.development.enableConsoleLogging) {
                console.log('📊 Event tracked:', { action, ...cleanEventData });
            }
        } catch (error) {
            console.error('❌ Event tracking failed:', error);
        }
    }
};

/**
 * Set user properties
 * @param properties - User properties to set
 */
export const setUserProperties = (properties: UserProperties): void => {
    if (!isAnalyticsAllowed()) {
        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('🛡️ User properties skipped: User consent not given');
        }
        return;
    } if (typeof window !== 'undefined' && window.gtag) {
        try {
            // Clean properties - remove undefined values
            const cleanProperties = Object.fromEntries(
                Object.entries(properties).filter(([, value]) => value !== undefined)
            );

            window.gtag('set', cleanProperties);

            if (analyticsConfig.development.enableConsoleLogging) {
                console.log('👤 User properties set:', cleanProperties);
            }
        } catch (error) {
            console.error('❌ User properties setting failed:', error);
        }
    }
};

/**
 * Set user ID for cross-device tracking
 * @param userId - Unique user identifier
 */
export const setUserId = (userId: string): void => {
    if (!isAnalyticsAllowed()) {
        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('🛡️ User ID setting skipped: User consent not given');
        }
        return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
        try {
            window.gtag('config', getMeasurementId() || '', {
                user_id: userId
            });

            if (analyticsConfig.development.enableConsoleLogging) {
                console.log('👤 User ID set:', userId);
            }
        } catch (error) {
            console.error('❌ User ID setting failed:', error);
        }
    }
};

/**
 * Track timing events (e.g., page load time, API response time)
 * @param name - Timing name
 * @param value - Timing value in milliseconds
 * @param category - Timing category
 * @param label - Timing label
 */
export const trackTiming = (
    name: string,
    value: number,
    category = 'Performance',
    label?: string
): void => {
    trackEvent({
        action: 'timing_complete',
        category,
        label: label || name,
        value: Math.round(value),
        custom_parameters: {
            timing_name: name,
            timing_value: value
        }
    });
};

/**
 * Track exceptions and errors
 * @param description - Error description
 * @param fatal - Whether the error is fatal
 * @param additionalData - Additional error data
 */
export const trackException = (
    description: string,
    fatal = false,
    additionalData?: Record<string, unknown>
): void => {
    trackEvent({
        action: 'exception',
        custom_parameters: {
            description,
            fatal,
            ...additionalData
        }
    });
};

/**
 * Get GA4 measurement ID from configuration
 */
export const getMeasurementId = (): string | undefined => {
    return analyticsConfig.ga4.measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
};

/**
 * Check if GA4 is properly initialized
 */
export const isGAInitialized = (): boolean => {
    return typeof window !== 'undefined' &&
        !!window.gtag &&
        !!window.dataLayer &&
        !!window.GA_INITIALIZED;
};

/**
 * Disable GA4 tracking (for opt-out)
 */
export const disableGA = (): void => {
    const measurementId = getMeasurementId();
    if (measurementId && typeof window !== 'undefined') {        // Set the GA disable flag
        window[`ga-disable-${measurementId}`] = true;

        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('🚫 GA4 tracking disabled');
        }
    }
};

/**
 * Enable GA4 tracking (for opt-in)
 */
export const enableGA = (): void => {
    const measurementId = getMeasurementId();
    if (measurementId && typeof window !== 'undefined') {        // Remove the GA disable flag
        delete window[`ga-disable-${measurementId}`];

        if (analyticsConfig.development.enableConsoleLogging) {
            console.log('✅ GA4 tracking enabled');
        }
    }
};

/**
 * Send custom dimensions
 * @param dimensions - Custom dimensions object
 */
export const sendCustomDimensions = (dimensions: Record<string, string>): void => {
    if (!isAnalyticsAllowed() || !analyticsConfig.features.enableCustomDimensions) {
        return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
        try {
            window.gtag('event', 'custom_dimensions', {
                custom_parameters: dimensions
            });

            if (analyticsConfig.development.enableConsoleLogging) {
                console.log('📏 Custom dimensions sent:', dimensions);
            }
        } catch (error) {
            console.error('❌ Custom dimensions failed:', error);
        }
    }
};
