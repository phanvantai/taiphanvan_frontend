/**
 * Privacy & Consent Management
 * Handles GDPR compliance and user consent for analytics
 */

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

const CONSENT_STORAGE_KEY = 'analytics_consent';
const CONSENT_VERSION = '1.0';

/**
 * Get current consent state from localStorage
 */
export const getConsentState = (): ConsentState => {
    if (typeof window === 'undefined') {
        return {
            hasConsent: false,
            preferences: {
                analytics: false,
                marketing: false,
                functional: true, // Usually allowed by default
                timestamp: Date.now()
            },
            consentGiven: null
        };
    }

    try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...parsed,
                consentGiven: parsed.consentGiven ? new Date(parsed.consentGiven) : null
            };
        }
    } catch (error) {
        console.error('Error reading consent state:', error);
    }

    return {
        hasConsent: false,
        preferences: {
            analytics: false,
            marketing: false,
            functional: true,
            timestamp: Date.now()
        },
        consentGiven: null
    };
};

/**
 * Save consent preferences to localStorage
 */
export const saveConsentPreferences = (preferences: ConsentPreferences): void => {
    if (typeof window === 'undefined') return;

    const consentState: ConsentState = {
        hasConsent: true,
        preferences: {
            ...preferences,
            timestamp: Date.now()
        },
        consentGiven: new Date()
    };

    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
            ...consentState,
            version: CONSENT_VERSION
        }));
    } catch (error) {
        console.error('Error saving consent preferences:', error);
    }
};

/**
 * Check if analytics tracking is allowed
 */
export const isAnalyticsAllowed = (): boolean => {
    const consent = getConsentState();
    return consent.hasConsent && consent.preferences.analytics;
};

/**
 * Check if marketing tracking is allowed
 */
export const isMarketingAllowed = (): boolean => {
    const consent = getConsentState();
    return consent.hasConsent && consent.preferences.marketing;
};

/**
 * Revoke all consent and clear data
 */
export const revokeConsent = (): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        // Clear any analytics cookies if they exist
        document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            if (name.trim().startsWith('_ga')) {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
        });
    } catch (error) {
        console.error('Error revoking consent:', error);
    }
};

/**
 * Check if consent banner should be shown
 */
export const shouldShowConsentBanner = (): boolean => {
    const consent = getConsentState();
    return !consent.hasConsent;
};

/**
 * Get consent expiry date (1 year from consent date)
 */
export const getConsentExpiry = (): Date | null => {
    const consent = getConsentState();
    if (!consent.consentGiven) return null;

    const expiry = new Date(consent.consentGiven);
    expiry.setFullYear(expiry.getFullYear() + 1);
    return expiry;
};

/**
 * Check if consent has expired
 */
export const hasConsentExpired = (): boolean => {
    const expiry = getConsentExpiry();
    if (!expiry) return true;

    return new Date() > expiry;
};

/**
 * Update specific consent preference
 */
export const updateConsentPreference = (
    category: keyof ConsentPreferences,
    value: boolean
): void => {
    const currentState = getConsentState();
    const updatedPreferences: ConsentPreferences = {
        ...currentState.preferences,
        [category]: value,
        timestamp: Date.now()
    };

    saveConsentPreferences(updatedPreferences);
};

/**
 * Get user's privacy preferences for display
 */
export const getPrivacySettings = (): {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
    hasGivenConsent: boolean;
    consentDate: Date | null;
    expiryDate: Date | null;
} => {
    const state = getConsentState();
    return {
        analytics: state.preferences.analytics,
        marketing: state.preferences.marketing,
        functional: state.preferences.functional,
        hasGivenConsent: state.hasConsent,
        consentDate: state.consentGiven,
        expiryDate: getConsentExpiry()
    };
};

/**
 * Clear all analytics-related cookies
 */
export const clearAnalyticsCookies = (): void => {
    if (typeof window === 'undefined') return;

    const cookiesToClear = [
        '_ga', '_ga_*', '_gid', '_gat', '_gat_*',
        '__utma', '__utmb', '__utmc', '__utmt', '__utmz',
        '_fbp', '_fbc', '__hstc', '__hssc', '__hssrc'
    ];

    cookiesToClear.forEach(cookieName => {
        // Clear for current domain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;

        // Clear for parent domain (if subdomain)
        const parts = window.location.hostname.split('.');
        if (parts.length > 2) {
            const parentDomain = '.' + parts.slice(-2).join('.');
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${parentDomain}`;
        }
    });
};

/**
 * Initialize privacy management system
 */
export const initPrivacyManager = (): ConsentState => {
    const state = getConsentState();

    // Check if consent has expired
    if (state.hasConsent && hasConsentExpired()) {
        revokeConsent();
        return getConsentState();
    }

    return state;
};

/**
 * Get consent status for specific region (GDPR compliance)
 */
export const requiresConsent = async (): Promise<boolean> => {
    // Check if user is in EU/EEA or other regions requiring consent
    // This is a simplified version - in production, you might want to use
    // a geolocation service or IP-based detection

    if (typeof window === 'undefined') return true;

    try {
        // Check timezone as a rough indicator
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; const euTimezones = [
            'Europe/', 'GMT', 'WET', 'CET', 'EET'
        ];

        // Check if user is likely in EU (currently unused but kept for future enhancement)
        euTimezones.some(tz => timezone.includes(tz));

        // Always show consent banner for now - can be enhanced with proper geo-detection
        return true;
    } catch {
        // Default to requiring consent if we can't determine location
        return true;
    }
};

/**
 * Export user data for GDPR data portability
 */
export const exportUserData = (): string => {
    const state = getConsentState();
    const data = {
        consentPreferences: state.preferences,
        consentGiven: state.consentGiven,
        consentVersion: CONSENT_VERSION,
        exportDate: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
    };

    return JSON.stringify(data, null, 2);
};

/**
 * Event listeners for privacy preference changes
 */
export type PrivacyEventListener = (preferences: ConsentPreferences) => void;

class PrivacyEventManager {
    private listeners: PrivacyEventListener[] = [];

    addListener(listener: PrivacyEventListener): () => void {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners(preferences: ConsentPreferences): void {
        this.listeners.forEach(listener => {
            try {
                listener(preferences);
            } catch (error) {
                console.error('Error in privacy event listener:', error);
            }
        });
    }
}

export const privacyEventManager = new PrivacyEventManager();

// Enhanced save function that notifies listeners
export const saveConsentPreferencesWithNotification = (preferences: ConsentPreferences): void => {
    saveConsentPreferences(preferences);
    privacyEventManager.notifyListeners(preferences);
};
