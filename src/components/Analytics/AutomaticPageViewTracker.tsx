"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics/google-analytics";

/**
 * AutomaticPageViewTracker
 * Tracks page views on route changes for all client-side navigations.
 * Should be placed in the root layout or a top-level client component.
 */
export default function AutomaticPageViewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Compose the full URL with query params
        const url = `${pathname}${searchParams ? `?${searchParams.toString()}` : ""}`;
        trackPageView(url);
    }, [pathname, searchParams]);

    return null;
}
