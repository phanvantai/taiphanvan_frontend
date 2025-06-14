/**
 * Analytics TypeScript Type Definitions
 * Defines all TypeScript interfaces and types for analytics functionality
 */

// Environment Variables
declare global {
    interface ProcessEnv {
        NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
    }
}

// Analytics Configuration Types
export interface AnalyticsConfig {
    ga4: {
        measurementId: string;
        enabled: boolean;
        debug: boolean;
    };
    privacy: {
        consentRequired: boolean;
        consentCookieExpiry: number;
        analyticsStorageExpiry: number;
    };
    features: {
        enableRealTimeTracking: boolean;
        enableEnhancedEcommerce: boolean;
        enableCustomDimensions: boolean;
        enableScrollTracking: boolean;
        enableFormTracking: boolean;
    };
    performance: {
        sampleRate: number;
        siteSpeedSampleRate: number;
        enableWebVitals: boolean;
    };
    development: {
        enableDebugMode: boolean;
        enableConsoleLogging: boolean;
        enableTestMode: boolean;
    };
}

// Event Tracking Types
export interface BaseAnalyticsEvent {
    action: string;
    category?: string;
    label?: string;
    value?: number;
    custom_parameters?: Record<string, unknown>;
}

export interface BlogAnalyticsEvent extends BaseAnalyticsEvent {
    post_slug?: string;
    post_title?: string;
    post_category?: string;
    reading_progress?: number;
}

export interface NavigationAnalyticsEvent extends BaseAnalyticsEvent {
    from_page?: string;
    to_page?: string;
    navigation_type?: 'internal' | 'external';
}

export interface SearchAnalyticsEvent extends BaseAnalyticsEvent {
    search_query?: string;
    results_count?: number;
    search_location?: string;
}

export interface ConversionAnalyticsEvent extends BaseAnalyticsEvent {
    conversion_type?: 'newsletter' | 'download' | 'contact';
    conversion_source?: string;
    conversion_value?: number;
}

// Union type for all analytics events
export type AnalyticsEvent =
    | BaseAnalyticsEvent
    | BlogAnalyticsEvent
    | NavigationAnalyticsEvent
    | SearchAnalyticsEvent
    | ConversionAnalyticsEvent;

// Page View Tracking
export interface PageViewData {
    page_title: string;
    page_location: string;
    content_group1?: string; // e.g., 'blog', 'apps', 'dashboard'
    content_group2?: string; // e.g., post category, app name
    user_id?: string;
    custom_parameters?: Record<string, unknown>;
}

// User Properties
export interface UserProperties {
    user_type?: 'anonymous' | 'registered' | 'subscriber';
    preferred_theme?: 'light' | 'dark' | 'system';
    user_engagement?: 'high' | 'medium' | 'low';
    signup_date?: string;
    last_visit_date?: string;
    visit_count?: number;
    custom_properties?: Record<string, unknown>;
}

// Consent Management Types (re-export from privacy.ts)
export interface ConsentPreferences {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    timestamp: number;
}

export interface ConsentState {
    hasConsent: boolean;
    preferences: ConsentPreferences;
    consentGiven: Date | null;
}

// Dashboard API Types (re-export from dashboard-api.ts)
export interface AnalyticsOverview {
    pageViews: number;
    uniqueUsers: number;
    sessions: number;
    bounceRate: number;
    avgSessionDuration: number;
    previousPeriodComparison: {
        pageViews: number;
        uniqueUsers: number;
        sessions: number;
    };
}

export interface PopularPost {
    slug: string;
    title: string;
    views: number;
    engagement: number;
    category?: string;
    publishDate?: string;
    readTime?: number;
}

export interface TrafficSource {
    source: string;
    medium: string;
    sessions: number;
    percentage: number;
    change?: number;
}

export interface RealTimeData {
    activeUsers: number;
    activePages: Array<{
        page: string;
        users: number;
        title?: string;
    }>;
    lastUpdated?: Date;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

// Component Props Types
export interface AnalyticsProviderProps {
    children: React.ReactNode;
}

export interface TrackingScriptProps {
    measurementId?: string;
}

export interface CookieConsentProps {
    className?: string;
    position?: 'bottom' | 'top' | 'center';
    theme?: 'light' | 'dark';
}

// Error Types
export interface AnalyticsError {
    code: string;
    message: string;
    details?: unknown;
    timestamp: Date;
}

// API Response Types
export interface AnalyticsApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: AnalyticsError;
    timestamp: string;
}

// Utility Types
export type TimeRange = '7d' | '30d' | '90d' | 'custom';
export type MetricType = 'pageViews' | 'users' | 'sessions' | 'bounceRate' | 'duration';
export type ChartType = 'line' | 'bar' | 'pie' | 'donut';
export type ViewMode = 'chart' | 'table' | 'grid';

// Export all types for easy access
export * from './types';
