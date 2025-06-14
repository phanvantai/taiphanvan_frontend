/**
 * Custom Analytics Events
 * Defines blog-specific event tracking functions
 */

import { trackEvent, trackTiming, trackException } from './google-analytics';
import { featureFlags } from './config';

// Event parameter interfaces for type safety
export interface BlogPostEventParams {
    post_slug: string;
    post_title: string;
    post_category?: string;
    post_tags?: string[];
    author?: string;
    publish_date?: string;
    reading_time?: number;
    word_count?: number;
}

export interface ReadingProgressParams {
    post_slug: string;
    percentage: number;
    time_spent?: number;
    scroll_depth?: number;
    words_read?: number;
}

export interface SearchEventParams {
    search_query: string;
    search_location: string;
    results_count?: number;
    filter_applied?: string;
    sort_order?: string;
}

// Blog Post Events
/**
 * Track blog post views with comprehensive metadata
 */
export const trackBlogPostView = (params: BlogPostEventParams): void => {
    trackEvent({
        action: 'blog_post_view',
        category: 'blog',
        label: params.post_slug,
        custom_parameters: {
            post_title: params.post_title,
            post_category: params.post_category,
            post_tags: params.post_tags?.join(','),
            author: params.author,
            publish_date: params.publish_date,
            reading_time: params.reading_time,
            word_count: params.word_count,
            content_type: 'blog_post'
        }
    });
};

/**
 * Track reading progress milestones
 */
export const trackReadingProgress = (params: ReadingProgressParams): void => {
    if (!featureFlags.enableScrollTracking) return;

    trackEvent({
        action: 'reading_progress',
        category: 'engagement',
        label: params.post_slug,
        value: params.percentage,
        custom_parameters: {
            progress_percentage: params.percentage,
            time_spent_seconds: params.time_spent,
            scroll_depth_percentage: params.scroll_depth,
            estimated_words_read: params.words_read
        }
    });
};

/**
 * Track when users finish reading a blog post
 */
export const trackBlogPostComplete = (
    postSlug: string,
    totalTimeSpent: number,
    engagementScore?: number
): void => {
    trackEvent({
        action: 'blog_post_complete',
        category: 'engagement',
        label: postSlug,
        value: Math.round(totalTimeSpent),
        custom_parameters: {
            total_reading_time: totalTimeSpent,
            engagement_score: engagementScore,
            completion_status: 'completed'
        }
    });
};

/**
 * Track blog post interactions (likes, bookmarks, etc.)
 */
export const trackBlogPostInteraction = (
    postSlug: string,
    interaction: 'like' | 'bookmark' | 'share' | 'comment',
    value?: number
): void => {
    trackEvent({
        action: 'blog_post_interaction',
        category: 'engagement',
        label: `${interaction}_${postSlug}`,
        value: value || 1,
        custom_parameters: {
            post_slug: postSlug,
            interaction_type: interaction
        }
    });
};

// Social Sharing Events
/**
 * Track social media sharing with platform details
 */
export const trackSocialShare = (
    platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'email' | 'copy_link',
    postSlug: string,
    postTitle?: string
): void => {
    trackEvent({
        action: 'social_share',
        category: 'engagement',
        label: platform,
        custom_parameters: {
            post_slug: postSlug,
            post_title: postTitle,
            share_platform: platform,
            share_method: 'social_button'
        }
    });
};

/**
 * Track native share API usage
 */
export const trackNativeShare = (postSlug: string, success: boolean): void => {
    trackEvent({
        action: 'native_share',
        category: 'engagement',
        label: postSlug,
        value: success ? 1 : 0,
        custom_parameters: {
            post_slug: postSlug,
            share_success: success,
            share_method: 'native_api'
        }
    });
};

// Navigation & Search Events
/**
 * Track internal navigation patterns
 */
export const trackNavigation = (
    fromPage: string,
    toPage: string,
    navigationMethod: 'link' | 'menu' | 'search' | 'button' | 'breadcrumb' = 'link'
): void => {
    trackEvent({
        action: 'navigation',
        category: 'user_interaction',
        custom_parameters: {
            from_page: fromPage,
            to_page: toPage,
            navigation_method: navigationMethod,
            navigation_type: toPage.startsWith('http') ? 'external' : 'internal'
        }
    });
};

/**
 * Track search usage with detailed parameters
 */
export const trackSearch = (params: SearchEventParams): void => {
    trackEvent({
        action: 'search',
        category: 'user_interaction',
        label: params.search_query,
        value: params.results_count,
        custom_parameters: {
            search_query: params.search_query,
            search_location: params.search_location,
            results_count: params.results_count,
            has_results: (params.results_count || 0) > 0,
            filter_applied: params.filter_applied,
            sort_order: params.sort_order
        }
    });
};

/**
 * Track search result clicks
 */
export const trackSearchResultClick = (
    query: string,
    resultTitle: string,
    resultPosition: number,
    resultType: 'blog_post' | 'page' | 'app'
): void => {
    trackEvent({
        action: 'search_result_click',
        category: 'user_interaction',
        label: query,
        value: resultPosition,
        custom_parameters: {
            search_query: query,
            result_title: resultTitle,
            result_position: resultPosition,
            result_type: resultType
        }
    });
};

// Newsletter & Conversion Events
/**
 * Track newsletter signups with source attribution
 */
export const trackNewsletterSignup = (
    source: string,
    location: 'header' | 'footer' | 'sidebar' | 'popup' | 'inline' | 'post_end',
    success: boolean = true
): void => {
    trackEvent({
        action: 'newsletter_signup',
        category: 'conversion',
        label: source,
        value: success ? 1 : 0,
        custom_parameters: {
            signup_source: source,
            signup_location: location,
            signup_success: success,
            conversion_type: 'newsletter'
        }
    });
};

/**
 * Track newsletter signup form interactions
 */
export const trackNewsletterFormInteraction = (
    action: 'focus' | 'input' | 'submit' | 'error',
    location: string,
    errorMessage?: string
): void => {
    trackEvent({
        action: 'newsletter_form_interaction',
        category: 'form_interaction',
        label: `${action}_${location}`,
        custom_parameters: {
            form_action: action,
            form_location: location,
            error_message: errorMessage
        }
    });
};

// File Download Events
/**
 * Track file downloads with metadata
 */
export const trackDownload = (
    fileName: string,
    fileType: string,
    fileSize?: number,
    downloadSource?: string
): void => {
    trackEvent({
        action: 'file_download',
        category: 'engagement',
        label: fileName,
        value: fileSize,
        custom_parameters: {
            file_name: fileName,
            file_type: fileType,
            file_size_bytes: fileSize,
            download_source: downloadSource,
            download_method: 'direct_link'
        }
    });
};

// App-specific Events
/**
 * Track application usage within the site
 */
export const trackAppUsage = (
    appName: string,
    action: 'launch' | 'complete' | 'share' | 'error',
    duration?: number,
    additionalData?: Record<string, unknown>
): void => {
    trackEvent({
        action: 'app_usage',
        category: 'apps',
        label: appName,
        value: duration,
        custom_parameters: {
            app_name: appName,
            app_action: action,
            usage_duration: duration,
            ...additionalData
        }
    });
};

/**
 * Track typing speed test completion
 */
export const trackTypingTestComplete = (
    wpm: number,
    accuracy: number,
    duration: number,
    testType: string = 'standard'
): void => {
    trackEvent({
        action: 'typing_test_complete',
        category: 'apps',
        value: wpm,
        custom_parameters: {
            words_per_minute: wpm,
            accuracy_percentage: accuracy,
            test_duration_seconds: duration,
            test_type: testType,
            performance_score: Math.round((wpm * accuracy) / 100)
        }
    });
};

// Comment System Events (if implemented)
/**
 * Track comment interactions
 */
export const trackCommentInteraction = (
    postSlug: string,
    action: 'submit' | 'like' | 'reply' | 'report',
    commentId?: string
): void => {
    trackEvent({
        action: 'comment_interaction',
        category: 'engagement',
        label: `${action}_${postSlug}`,
        custom_parameters: {
            post_slug: postSlug,
            comment_action: action,
            comment_id: commentId
        }
    });
};

// Error & Performance Tracking
/**
 * Track application errors with context
 */
export const trackError = (
    errorType: 'javascript' | 'network' | 'user_input' | 'api',
    errorMessage: string,
    errorLocation: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void => {
    trackException(errorMessage, severity === 'critical', {
        error_type: errorType,
        error_location: errorLocation,
        error_severity: severity,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
    });
};

/**
 * Track page load performance
 */
export const trackPagePerformance = (
    pagePath: string,
    loadTime: number,
    performanceMetrics?: {
        fcp?: number; // First Contentful Paint
        lcp?: number; // Largest Contentful Paint
        fid?: number; // First Input Delay
        cls?: number; // Cumulative Layout Shift
    }
): void => {
    trackTiming('page_load', loadTime, 'Performance', pagePath);

    if (performanceMetrics) {
        Object.entries(performanceMetrics).forEach(([metric, value]) => {
            if (value !== undefined) {
                trackTiming(`web_vital_${metric}`, value, 'Web Vitals', pagePath);
            }
        });
    }
};

// Theme & Accessibility Events
/**
 * Track theme changes
 */
export const trackThemeChange = (
    newTheme: 'light' | 'dark' | 'system',
    method: 'manual' | 'system' | 'auto'
): void => {
    trackEvent({
        action: 'theme_change',
        category: 'user_preference',
        label: newTheme,
        custom_parameters: {
            new_theme: newTheme,
            change_method: method
        }
    });
};

/**
 * Track accessibility feature usage
 */
export const trackAccessibilityFeature = (
    feature: 'high_contrast' | 'large_text' | 'keyboard_navigation' | 'screen_reader',
    enabled: boolean
): void => {
    trackEvent({
        action: 'accessibility_feature',
        category: 'user_preference',
        label: feature,
        value: enabled ? 1 : 0,
        custom_parameters: {
            accessibility_feature: feature,
            feature_enabled: enabled
        }
    });
};

// Session & Engagement Tracking
/**
 * Track session engagement milestones
 */
export const trackEngagementMilestone = (
    milestone: 'first_visit' | '5_min_session' | '10_pages_viewed' | 'return_visitor',
    value?: number
): void => {
    trackEvent({
        action: 'engagement_milestone',
        category: 'engagement',
        label: milestone,
        value: value,
        custom_parameters: {
            milestone_type: milestone,
            session_quality: 'high_engagement'
        }
    });
};

/**
 * Track user journey completion
 */
export const trackJourneyComplete = (
    journeyType: 'blog_reader' | 'app_user' | 'newsletter_subscriber',
    journeySteps: string[],
    totalDuration: number
): void => {
    trackEvent({
        action: 'user_journey_complete',
        category: 'conversion',
        label: journeyType,
        value: Math.round(totalDuration),
        custom_parameters: {
            journey_type: journeyType,
            journey_steps: journeySteps.join(' > '),
            step_count: journeySteps.length,
            journey_duration: totalDuration
        }
    });
};
