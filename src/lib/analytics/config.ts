/**
 * Environment Configuration for Analytics
 * Centralizes all environment variable handling and validation
 */

// Validate required environment variables
const requiredEnvVars = {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
} as const;

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    console.warn(
        `⚠️  Missing environment variables: ${missingEnvVars.join(', ')}\n` +
        'Analytics features may not work properly. Please check your .env.local file.'
    );
}

/**
 * Analytics Environment Configuration
 */
export const analyticsConfig = {
    // Google Analytics 4 Configuration
    ga4: {
        measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
        enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        debug: process.env.NODE_ENV === 'development',
    },

    // Privacy & Consent Configuration
    privacy: {
        consentRequired: true,
        consentCookieExpiry: 365, // days
        analyticsStorageExpiry: 730, // days (2 years)
    },

    // Feature Flags
    features: {
        enableRealTimeTracking: true,
        enableEnhancedEcommerce: false,
        enableCustomDimensions: true,
        enableScrollTracking: true,
        enableFormTracking: true,
    },

    // Performance Configuration
    performance: {
        sampleRate: process.env.NODE_ENV === 'production' ? 100 : 1,
        siteSpeedSampleRate: 10,
        enableWebVitals: true,
    },

    // Development Configuration
    development: {
        enableDebugMode: process.env.NODE_ENV === 'development',
        enableConsoleLogging: process.env.NODE_ENV === 'development',
        enableTestMode: process.env.NODE_ENV === 'test',
    },
} as const;

/**
 * Validate analytics configuration
 */
export const validateAnalyticsConfig = (): boolean => {
    const { ga4 } = analyticsConfig;

    if (!ga4.enabled) {
        console.warn('🚫 Analytics is disabled: No GA4 Measurement ID found');
        return false;
    }

    if (!ga4.measurementId.startsWith('G-')) {
        console.error('❌ Invalid GA4 Measurement ID format. Expected format: G-XXXXXXXXXX');
        return false;
    }

    if (ga4.debug) {
        console.log('🔧 Analytics Debug Mode Enabled');
        console.log('📊 GA4 Measurement ID:', ga4.measurementId);
    }

    return true;
};

/**
 * Get environment-specific settings
 */
export const getEnvironmentSettings = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    const isTest = process.env.NODE_ENV === 'test';

    return {
        isDevelopment,
        isProduction,
        isTest,
        shouldLoadAnalytics: isProduction || (isDevelopment && analyticsConfig.ga4.enabled),
        shouldShowDebugInfo: isDevelopment,
    };
};

/**
 * Export individual config sections for easy access
 */
export const {
    ga4: ga4Config,
    privacy: privacyConfig,
    features: featureFlags,
    performance: performanceConfig,
    development: developmentConfig,
} = analyticsConfig;
