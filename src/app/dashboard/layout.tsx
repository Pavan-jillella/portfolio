"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

const dashboardTabs = [
  { label: "Overview", href: "/dashboard" },
  { label: "Life Index", href: "/dashboard/life-index" },
  { label: "Habits", href: "/dashboard/habits" },
  { label: "Activity", href: "/dashboard/activity" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Edit About", href: "/dashboard/about" },
];

const quickLinks = [
  { label: "Finance", href: "/finance/tracker" },
  { label: "Education", href: "/education/dashboard" },
  { label: "Roadmap", href: "/roadmap" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${pathname}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="min-h-screen pt-24">
      {/* Sticky sub-navigation */}
      <div className="sticky top-[48px] z-40 border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
            {/* Primary tabs */}
            <div className="flex items-center gap-2 shrink-0">
              {dashboardTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "px-3 py-1.5 rounded-full border font-body text-xs whitespace-nowrap transition-all duration-200",
                    isActive(tab.href)
                      ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                      : "border-white/8 bg-white/4 text-white/40 hover:border-white/15 hover:text-white/60"
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-5 bg-white/10 shrink-0" />

            {/* Quick links */}
            <div className="flex items-center gap-2 shrink-0">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full border border-white/5 bg-transparent font-mono text-[10px] text-white/30 hover:text-white/50 hover:border-white/10 whitespace-nowrap transition-all duration-200"
                >
                  {link.label} ↗
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
