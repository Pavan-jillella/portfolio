import { getAllPosts } from "@/lib/mdx";
import { LifeIndexDashboard } from "@/components/dashboard/LifeIndexDashboard";

export const metadata = {
  title: "Life Index — Pavan Jillella",
};

export default function LifeIndexPage() {
  const blogCount = getAllPosts().length;

  return (
    <section className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2">
            Unified Metrics
          </p>
          <h1 className="font-display text-3xl font-bold text-white">Life Index</h1>
          <p className="font-body text-sm text-white/40 mt-2">
            A single composite score across finance, learning, coding, and personal growth.
          </p>
        </div>
        <LifeIndexDashboard blogCount={blogCount} />
      </div>
    </section>
  );
}
