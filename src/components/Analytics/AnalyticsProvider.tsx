/**
 * Analytics Provider
 * React context for managing analytics state and consent across the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    getConsentState,
    isAnalyticsAllowed,
    ConsentState,
    ConsentPreferences,
    saveConsentPreferences
} from '@/lib/analytics/privacy';
import { initGA, getMeasurementId } from '@/lib/analytics/google-analytics';

interface AnalyticsContextType {
    consentState: ConsentState;
    isAnalyticsEnabled: boolean;
    updateConsent: (preferences: ConsentPreferences) => void;
    revokeAllConsent: () => void;
    isLoading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
    children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
    const [consentState, setConsentState] = useState<ConsentState>({
        hasConsent: false,
        preferences: {
            analytics: false,
            marketing: false,
            functional: true,
            timestamp: Date.now()
        },
        consentGiven: null
    });
    const [isLoading, setIsLoading] = useState(true);

    // Initialize consent state on mount
    useEffect(() => {
        const loadConsentState = () => {
            const currentConsent = getConsentState();
            setConsentState(currentConsent);

            // Initialize GA4 if analytics is allowed
            if (currentConsent.hasConsent && currentConsent.preferences.analytics) {
                const measurementId = getMeasurementId();
                if (measurementId) {
                    initGA(measurementId);
                }
            }

            setIsLoading(false);
        };

        loadConsentState();
    }, []);

    const updateConsent = (preferences: ConsentPreferences) => {
        saveConsentPreferences(preferences);
        const newConsentState = getConsentState();
        setConsentState(newConsentState);

        // Initialize or disable analytics based on new consent
        if (preferences.analytics) {
            const measurementId = getMeasurementId();
            if (measurementId) {
                initGA(measurementId);
            }
        }
    };

    const revokeAllConsent = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('analytics_consent');
        }
        const newConsentState = getConsentState();
        setConsentState(newConsentState);
    };

    const value: AnalyticsContextType = {
        consentState,
        isAnalyticsEnabled: isAnalyticsAllowed(),
        updateConsent,
        revokeAllConsent,
        isLoading
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

// Custom hook to use analytics context
export const useAnalytics = (): AnalyticsContextType => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};
