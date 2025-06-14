/**
 * Analytics Components
 * Main entry point for all analytics-related components
 */

// Core analytics components
export { AnalyticsProvider, useAnalytics } from './AnalyticsProvider';
export { TrackingScript } from './TrackingScript';
export { CookieConsent } from './CookieConsent';

// Re-export types for convenience
export type {
    ConsentPreferences,
    ConsentState
} from '@/lib/analytics/privacy';
