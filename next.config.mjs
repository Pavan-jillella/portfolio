/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' blob: data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.github.com https://leetcode.com https://challenges.cloudflare.com https://*.posthog.com https://*.sentry.io https://api.exchangerate-api.com https://query1.finance.yahoo.com https://accounts.google.com https://www.googleapis.com https://vitals.vercel-insights.com https://*.vercel-analytics.com",
              "frame-src https://challenges.cloudflare.com https://www.youtube.com https://youtube.com https://accounts.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
