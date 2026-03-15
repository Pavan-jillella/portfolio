"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { isOwner } from "@/lib/roles";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Blog", href: "/admin/blog" },
  { label: "About", href: "/admin/about" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "DB Setup", href: "/admin/setup" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Block non-owners
  useEffect(() => {
    if (!loading && (!user || !isOwner(user.email))) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user || !isOwner(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-sm text-white/30">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/5 p-6 hidden md:block">
        <div className="sticky top-24">
          <h2 className="font-display font-bold text-lg text-white mb-8">
            Admin<span className="text-blue-400">.</span>
          </h2>
          <nav className="space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block font-body text-sm py-2 px-3 rounded-xl transition-all",
                  isActive(link.href)
                    ? "text-blue-400 bg-blue-500/[0.08]"
                    : "text-white/50 hover:text-white hover:bg-white/4"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-white/5">
            <Link
              href="/"
              className="font-body text-sm text-white/30 hover:text-white transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden border-b border-white/5 pt-20 px-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-white">
            Admin<span className="text-blue-400">.</span>
          </h2>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/50 hover:text-white transition-colors"
            aria-label="Toggle admin menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="flex flex-wrap gap-2 pb-2">
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border font-body text-xs transition-all",
                      isActive(link.href)
                        ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                        : "border-white/8 bg-white/4 text-white/40 hover:text-white/60"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-body text-xs text-white/30 hover:text-white transition-colors"
              >
                ← Back to site
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 md:pt-24">{children}</main>
    </div>
  );
}
