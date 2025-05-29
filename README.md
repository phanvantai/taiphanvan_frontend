# Tai Phan Van Frontend

A modern personal blog and portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. This project uses the App Router for efficient page routing and React Server Components for optimal performance, with support for both light and dark themes.

## Features

- 📱 Responsive design for all devices
- 🔍 SEO optimized with metadata support
- ⚡ Fast page loading with Next.js App Router and Turbopack
- 🎨 Styled with Tailwind CSS and custom CSS variables
- 🌓 Light/Dark theme support with user preference detection
- 🔐 User authentication system with JWT token management
- 📝 Blog system with categories and related posts
- � Project showcase with dedicated project pages
- �🔄 Type safety with TypeScript
- 🧹 Code quality ensured with ESLint and Husky pre-commit hooks

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows Next.js App Router conventions:

- `src/app`: Contains pages, layouts, and routes
  - `src/app/blog`: Blog pages and post details
  - `src/app/projects`: Project showcase pages
  - `src/app/profile`: User profile management
  - `src/app/login` & `src/app/register`: Authentication pages
- `src/components`: Reusable React components
  - UI components (Header, Footer, etc.)
  - Feature-specific components (BlogPostCard, ShareButtons, etc.)
- `src/contexts`: React Context providers
  - `AuthContext`: User authentication state management
  - `ThemeContext`: Theme switching functionality
- `src/content`: Blog post content
- `src/lib`: Utility functions and shared code
  - Blog and news data management
- `src/styles`: Global and component-specific styles
- `src/types`: TypeScript type definitions
- `public`: Static assets like images and fonts

## Core Technologies

- [Next.js 15](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev/) - UI library with Server Components support
- [TypeScript 5](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [ESLint 9](https://eslint.org/) - Code quality tool
- [Husky](https://typicode.github.io/husky/) - Git hooks for code quality

## Authentication

The project includes a complete authentication system with:

- JWT token-based authentication
- Token refresh mechanism
- Protected routes
- User profile management
- Registration and login forms

## Styling

The project uses a combination of:

- Tailwind CSS for utility classes
- CSS variables for theming
- Custom CSS for component-specific styling
- Support for light and dark modes

## Deployment

This website can be easily deployed on [Vercel](https://vercel.com/new) or any other platform that supports Next.js.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Development Tools

- Turbopack for fast development experience
- ESLint for code quality
- Husky for pre-commit hooks
- TypeScript for type safety
