import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api", "/_next", "/favicon.ico"];
const PUBLIC_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".woff", ".woff2", ".ttf", ".css", ".js"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (PUBLIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;
  if (token !== "authenticated") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
