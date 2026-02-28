"use client";
import dynamic from "next/dynamic";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { RepoCard } from "./RepoCard";
import { motion } from "framer-motion";

const LanguageChart = dynamic(() => import("./LanguageChart").then((m) => m.LanguageChart), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-64 animate-pulse" />,
});

export function GitHubDashboardTab() {
  const { data, isLoading, error } = useGitHubData();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display font-semibold text-xl text-white">GitHub</h2>
        <SkeletonGrid count={3} columns="grid-cols-3" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display font-semibold text-xl text-white">GitHub</h2>
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/40">
            {error instanceof Error ? error.message : "Could not load GitHub data."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-semibold text-xl text-white">GitHub</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Repositories", value: data.stats.totalRepos },
          { label: "Stars", value: data.stats.totalStars },
          { label: "Forks", value: data.stats.totalForks },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{s.label}</p>
            <p className="font-display font-bold text-2xl text-white">
              <AnimatedCounter target={s.value} duration={1200} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Language chart + repos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <LanguageChart data={data.languages} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.repos.slice(0, 8).map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>

      {data.repos.length > 8 && (
        <p className="font-body text-xs text-white/20 text-center">
          Showing 8 of {data.repos.length} repositories
        </p>
      )}
    </div>
  );
}
