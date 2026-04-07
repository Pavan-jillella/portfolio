import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { FloatingBackground } from "@/components/ui/FloatingBackground";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Pavan Jillella — Data Analyst | Morgan Stanley",
  description:
    "Data Analyst at Morgan Stanley. M.S. in Data Analytics Engineering from George Mason University. Python, SQL, ML, and cloud-certified.",
  keywords: ["data analyst", "machine learning", "python", "sql", "portfolio", "Morgan Stanley"],
  authors: [{ name: "Pavan Jillella" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PJ",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pavanjillella.com"),
  openGraph: {
    title: "Pavan Jillella — Data Analyst | Morgan Stanley",
    description:
      "Data Analyst at Morgan Stanley. M.S. Data Analytics Engineering, George Mason University.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og?title=Pavan+Jillella&subtitle=Data+Analyst+%7C+Morgan+Stanley",
        width: 1200,
        height: 630,
        alt: "Pavan Jillella — Data Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavan Jillella — Data Analyst | Morgan Stanley",
    description:
      "Data Analyst at Morgan Stanley. M.S. Data Analytics Engineering, George Mason University.",
    images: ["/api/og?title=Pavan+Jillella&subtitle=Data+Analyst+%7C+Morgan+Stanley"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f5f0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <PostHogProvider>
              <SmoothScroll>
                <GrainOverlay />
                <FloatingBackground />
                <LayoutShell>{children}</LayoutShell>
                <PageViewTracker />
                <CookieConsent />
                <Analytics />
              </SmoothScroll>
            </PostHogProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
