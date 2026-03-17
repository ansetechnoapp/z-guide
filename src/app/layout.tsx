import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZodBack Docs",
    template: "%s — ZodBack Docs",
  },
  description: "Documentation for ZodBack API and modules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <div className="flex flex-col min-h-screen">
          {children}
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400">
            Built with <span className="text-blue-500">ZodBack</span> · {new Date().getFullYear()}
          </footer>
        </div>
      </body>
    </html>
  );
}
