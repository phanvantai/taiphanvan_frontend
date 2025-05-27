import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Apps - Mini Tools & Games - Tai Phan Van',
    description: 'Collection of mini tools and games including typing speed test, productivity utilities, and fun interactive applications.',
    keywords: ['mini tools', 'web apps', 'typing test', 'productivity tools', 'online games'],
    openGraph: {
        title: 'Apps - Mini Tools & Games - Tai Phan Van',
        description: 'Collection of mini tools and games including typing speed test, productivity utilities, and fun interactive applications.',
        type: 'website',
    },
};

export default function AppsPage() {
    const apps = [
        {
            title: 'Typing Speed Test',
            description: 'Test your typing speed and accuracy with real-time WPM calculation and detailed statistics.',
            href: '/apps/typing-speed-test',
            icon: '⌨️',
            category: 'Productivity',
            features: ['Real-time WPM calculation', 'Accuracy tracking', 'Multiple text samples', 'Pause/Resume functionality'],
        },
        // Add more apps here in the future
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Mini Tools & Games
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A collection of useful tools and fun games to enhance your productivity and entertainment.
                    </p>
                </div>

                {/* Apps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app, index) => (
                        <Link
                            key={index}
                            href={app.href}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
                        >
                            <div className="p-6">
                                {/* App Icon */}
                                <div className="text-4xl mb-4">{app.icon}</div>

                                {/* Category Badge */}
                                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-3">
                                    {app.category}
                                </div>

                                {/* App Title */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {app.title}
                                </h3>

                                {/* App Description */}
                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                    {app.description}
                                </p>

                                {/* Features List */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Features:</h4>
                                    <ul className="space-y-1">
                                        {app.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Launch Button */}
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                        Launch App
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Coming Soon Section */}
                <div className="mt-12 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            More Apps Coming Soon!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                            We&apos;re constantly working on new tools and games. Stay tuned for exciting updates!
                        </p>
                    </div>
                </div>

                {/* Categories */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Planned Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl mb-3">🔧</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Productivity Tools</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Utilities to boost your productivity and streamline workflows
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl mb-3">🎮</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Mini Games</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Fun and engaging games for entertainment and skill building
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl mb-3">🧮</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Calculators</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                Specialized calculators for various mathematical and practical needs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
