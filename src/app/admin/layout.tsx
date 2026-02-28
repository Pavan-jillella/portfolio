import Link from "next/link";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Analytics", href: "/admin/analytics" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
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
                className="block font-body text-sm text-white/50 hover:text-white py-2 px-3 rounded-xl hover:bg-white/4 transition-all"
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

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 pt-24">{children}</main>
    </div>
  );
}
