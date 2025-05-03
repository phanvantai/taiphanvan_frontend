import type { Metadata } from "next/types";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tai Phan Van | Blog & News",
  description: "A blog where Tai Phan Van shares thoughts and experiences",
  icons: {
    icon: [
      { url: '/images/logo.png' }
    ],
    apple: [
      { url: '/images/logo.png' }
    ]
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
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={poppins.className}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="container" style={{ paddingTop: '100px', paddingBottom: '50px', minHeight: 'calc(100vh - 200px)' }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
