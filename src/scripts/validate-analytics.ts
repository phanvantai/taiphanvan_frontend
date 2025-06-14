/**
 * Environment Validation Script
 * Validates analytics configuration during build/development
 */

import { validateAnalyticsConfig, analyticsConfig } from '../lib/analytics/config';

console.log('🔧 Validating Analytics Configuration...\n');

// Validate configuration
const isValid = validateAnalyticsConfig();

if (isValid) {
    console.log('✅ Analytics configuration is valid!');
    console.log('📊 GA4 Measurement ID:', analyticsConfig.ga4.measurementId);
    console.log('🛡️ Privacy consent required:', analyticsConfig.privacy.consentRequired); console.log('🎯 Features enabled:', Object.entries(analyticsConfig.features)
        .filter(([, enabled]) => enabled)
        .map(([feature]) => feature)
        .join(', '));
} else {
    console.log('❌ Analytics configuration validation failed');
    console.log('Please check your environment variables and configuration');
}

console.log('\n🏁 Environment validation complete\n');
