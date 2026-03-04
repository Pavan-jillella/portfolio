import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

/** Paths that never require authentication */
const PUBLIC_PATHS = [
  "/login",
  "/api/auth",
  "/api/contact",
  "/api/comments",
  "/api/analytics",
  "/api/education/profile/",
  "/education/profile/",
];

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
  if (PUBLIC_FILES.includes(pathname)) return true;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (PUBLIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const { supabase, response } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // API routes: refresh session cookies but don't redirect (they return 401 themselves)
  if (pathname.startsWith("/api")) {
    return response;
  }

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
