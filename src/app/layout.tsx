import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
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
    <html lang="fr">
      <body className={`${inter.variable} ${geistSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {children}
          <footer className="site-footer">
            <div><strong>ZodBack Docs</strong><p>© 2024 ZodBack SaaS. Engineered for<br /> performance.</p></div>
            <div><strong>Resources</strong><p>Privacy Policy</p><p>Terms of Service</p><p>Changelog</p><p>Status</p><p>Support</p></div>
          </footer>
        </div>
      </body>
    </html>
  );
}
