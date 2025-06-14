import type { Metadata } from "next/types";
import Script from "next/script";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthErrorMessage from "@/components/AuthErrorMessage";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

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
    <html lang="en" className={poppins.className}>
      <head>
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
