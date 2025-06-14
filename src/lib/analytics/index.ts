/**
 * Analytics Library
 * Main entry point for analytics functionality
 */

// Core analytics functions
export {
    initGA,
    trackPageView,
    trackEvent,
    setUserProperties,
    getMeasurementId,
    type GAEvent
} from './google-analytics';

// Custom event tracking
export {
    trackBlogPostView,
    trackReadingProgress,
    trackSocialShare,
    trackNavigation,
    trackSearch,
    trackNewsletterSignup,
    trackDownload,
    trackAppUsage,
    trackTypingTestComplete
} from './events';

// Privacy and consent management
export {
    getConsentState,
    saveConsentPreferences,
    isAnalyticsAllowed,
    isMarketingAllowed,
    revokeConsent,
    shouldShowConsentBanner,
    getConsentExpiry,
    hasConsentExpired,
    type ConsentPreferences,
    type ConsentState
} from './privacy';

// Dashboard API client
export {
    fetchAnalyticsOverview,
    fetchPopularPosts,
    fetchTrafficSources,
    fetchRealTimeData,
    getDateRanges,
    formatAnalyticsNumber, calculatePercentageChange,
    type AnalyticsOverview,
    type PopularPost,
    type TrafficSource,
    type RealTimeData,
    type DateRange
} from './dashboard-api';

// Configuration and environment
export {
    analyticsConfig,
    validateAnalyticsConfig,
    getEnvironmentSettings,
    ga4Config,
    privacyConfig,
    featureFlags,
    performanceConfig,
    developmentConfig
} from './config';

// TypeScript definitions
export type * from './types';
