// Augment the Next.js namespace to fix incompatible types

declare module 'next' {
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
} 