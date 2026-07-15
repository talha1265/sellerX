import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UIProvider } from "@/context/ui-context";
import { AuthProvider } from "@/context/auth-context";
import { AmazonProvider } from "@/context/amazon-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SellerX Portfolio & Active Trading OS",
  description: "Enterprise Brand Aggregator and Algorithmic Trading Operations Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        <AuthProvider>
          <UIProvider>
            <AmazonProvider>
              {children}
            </AmazonProvider>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
