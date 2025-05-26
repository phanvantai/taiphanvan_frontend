import type { Metadata } from "next/types";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthErrorMessage from "@/components/AuthErrorMessage";

export const metadata: Metadata = {
  title: "Tai Phan Van | Blog & News",
  description: "A blog where Tai Phan Van shares thoughts and experiences",
  icons: {
    icon: '/favicon.ico',
    apple: '/images/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-poppins">{/* Using custom CSS class instead of poppins.className */}
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="container" style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: 'calc(100vh - 200px)' }}>
              {children}
            </main>
            <Footer />
            <AuthErrorMessage />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
