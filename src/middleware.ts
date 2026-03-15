import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

/** Paths that never require authentication */
const PUBLIC_PATHS = [
  "/login",
  "/about",
  "/blog",
  "/projects",
  "/contact",
  "/api/auth",
  "/api/contact",
  "/api/comments",
  "/api/analytics",
  "/api/github",
  "/api/leetcode",
  "/api/newsletter",
  "/api/public",
  "/api/education/profile/",
  "/education/profile/",
  "/terms",
  "/privacy",
];

/** Paths that require auth even though their parent is public */
const PRIVATE_OVERRIDES = ["/blog/write"];

/** Files at the root that should be publicly accessible */
const PUBLIC_FILES = [
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap-0.xml",
  "/favicon.ico",
];

const PUBLIC_EXTENSIONS = [
  ".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico",
  ".webp", ".woff", ".woff2", ".ttf", ".css", ".js",
];

function isPublicPath(pathname: string): boolean {
  if (PRIVATE_OVERRIDES.some((p) => pathname.startsWith(p))) return false;
  if (pathname === "/") return true;
  if (PUBLIC_FILES.includes(pathname)) return true;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (PUBLIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return true;
  return false;
}

// --- In-memory rate limiting for API routes ---
const apiRateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Cleanup stale entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const key of Array.from(apiRateLimitMap.keys())) {
      const entry = apiRateLimitMap.get(key);
      if (entry && now > entry.resetAt) {
        apiRateLimitMap.delete(key);
      }
    }
  }, 60_000);
}

function checkApiRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const LIMIT = 60; // 60 requests per window
  const WINDOW_MS = 60_000; // 1 minute
  const now = Date.now();
  const key = `api:${ip}`;
  const entry = apiRateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    apiRateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: LIMIT - entry.count };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    // Rate limit public API routes too
    if (pathname.startsWith("/api")) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.ip || "unknown";
      const { allowed, remaining } = checkApiRateLimit(ip);
      if (!allowed) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": "60",
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return response;
    }
    return NextResponse.next();
  }

  // Rate limit all API routes
  if (pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.ip || "unknown";
    const { allowed, remaining } = checkApiRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const { supabase, response } = createMiddlewareClient(request);
    await supabase.auth.getUser();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  const { supabase, response } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
