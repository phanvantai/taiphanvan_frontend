import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found | My Personal Blog',
    description: 'Sorry, the page you are looking for does not exist.'
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="space-x-4">
                <Link
                    href="/"
                    className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-full transition-colors"
                >
                    Go Home
                </Link>
                <Link
                    href="/blog"
                    className="border border-gray-300 hover:border-gray-400 font-medium px-6 py-3 rounded-full transition-colors"
                >
                    Read Blog
                </Link>
            </div>
        </div>
    );
}