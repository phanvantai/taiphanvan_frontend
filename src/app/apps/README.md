# Apps Directory

This directory contains all the mini tools and games available on the website.

## Current Apps

### Typing Speed Test (`/apps/typing-speed-test`)

A comprehensive typing speed test tool that measures WPM (Words Per Minute) and accuracy.

**Features:**

- Real-time WPM calculation
- Accuracy tracking with visual feedback
- Pause/resume functionality
- Multiple sample texts
- Detailed completion statistics
- Responsive design
- Dark mode support

**Technologies:**

- React with TypeScript
- Tailwind CSS
- Next.js App Router

## Adding New Apps

1. Create a new directory under `src/app/apps/your-app-name/`
2. Add a `page.tsx` file for the app page
3. Create the app component in `src/components/`
4. Update the main apps listing in `page.tsx`
5. Add the app to the header dropdown menu

## Structure

```bash
apps/
├── layout.tsx              # Shared layout for all apps
├── page.tsx                # Main apps listing page
└── typing-speed-test/
    ├── page.tsx            # Typing speed test page
    └── metadata.ts         # SEO metadata
```

## Guidelines

- Each app should be self-contained
- Use TypeScript for type safety
- Follow the existing design patterns
- Ensure responsive design
- Include proper accessibility features
- Add comprehensive tests
- Document new features
