import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

export default function AdminBlogPage() {
  return (
    <div className="max-w-4xl">
      <FadeIn>
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Blog Posts</h1>
          <p className="font-body text-white/40">
            Blog management has moved to the main blog page.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              href="/blog"
              className="glass-card px-5 py-2.5 rounded-full text-sm font-body text-white/80 hover:text-white transition-all hover:border-blue-500/30"
            >
              View blog →
            </Link>
            <Link
              href="/blog/write"
              className="glass-card px-5 py-2.5 rounded-full text-sm font-body text-blue-400 hover:text-blue-300 transition-all hover:border-blue-500/30"
            >
              Write new post →
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
