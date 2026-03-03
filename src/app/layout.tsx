import type { Metadata } from "next";
import "./globals.css";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { FloatingBackground } from "@/components/ui/FloatingBackground";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Pavan Jillella — Building. Thinking. Documenting.",
  description:
    "Personal brand platform at the intersection of education, finance, and technology. Sharing systems, stories, and software.",
  keywords: ["developer", "finance", "education", "technology", "portfolio"],
  authors: [{ name: "Pavan Jillella" }],
  openGraph: {
    title: "Pavan Jillella — Building. Thinking. Documenting.",
    description:
      "Personal brand platform at the intersection of education, finance, and technology.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavan Jillella — Building. Thinking. Documenting.",
    description:
      "Personal brand platform at the intersection of education, finance, and technology.",
  },
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
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
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
                <CursorGlow />
                <FloatingBackground />
                <LayoutShell>{children}</LayoutShell>
                <PageViewTracker />
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
