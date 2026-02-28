"use client";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

interface PageViewData {
  path: string;
  visited_at: string;
  referrer: string | null;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<{ views: PageViewData[]; total: number }>({ views: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Aggregate by path
  const pathCounts: Record<string, number> = {};
  data.views.forEach((v) => {
    pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
  });
  const topPaths = Object.entries(pathCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="max-w-4xl">
      <FadeIn>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Analytics</h1>
        <p className="font-body text-white/40 mb-10">Page views and visitor data.</p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <FadeIn delay={0.05}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Total Views</p>
            <p className="font-display font-bold text-4xl text-white">
              {loading ? "..." : data.total}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-2">Unique Pages</p>
            <p className="font-display font-bold text-4xl text-white">
              {loading ? "..." : Object.keys(pathCounts).length}
            </p>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.15}>
        <h2 className="font-display font-semibold text-lg text-white mb-4">Top Pages</h2>
        {loading ? (
          <div className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-4 w-full bg-glass-white rounded" />
          </div>
        ) : topPaths.length === 0 ? (
          <div className="glass-card rounded-2xl p-6">
            <p className="font-body text-sm text-white/30">No analytics data yet. Connect Supabase to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topPaths.map(([path, count]) => (
              <div key={path} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <span className="font-mono text-sm text-white/60">{path}</span>
                <span className="font-mono text-sm text-blue-400">{count}</span>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      {/* Recent views */}
      <FadeIn delay={0.2}>
        <h2 className="font-display font-semibold text-lg text-white mt-10 mb-4">Recent Views</h2>
        {data.views.length === 0 ? (
          <div className="glass-card rounded-2xl p-6">
            <p className="font-body text-sm text-white/30">No recent views.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.views.slice(0, 20).map((view, i) => (
              <div key={i} className="glass-card rounded-xl p-3 flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-white/50 truncate">{view.path}</span>
                <span className="font-mono text-xs text-white/20 shrink-0">
                  {new Date(view.visited_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
