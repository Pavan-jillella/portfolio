"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { RepoCard } from "./RepoCard";
import { motion } from "framer-motion";

const LanguageChart = dynamic(() => import("./LanguageChart").then((m) => m.LanguageChart), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-64 animate-pulse" />,
});

function UsernamePrompt({ onSave }: { onSave: (username: string) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-semibold text-xl text-white">GitHub</h2>
      <div className="glass-card rounded-2xl p-8 text-center space-y-4">
        <p className="font-body text-sm text-white/60">
          Enter your GitHub username to view your repositories and stats.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) onSave(input.trim()); }}
          className="flex items-center gap-3 max-w-sm mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. octocat"
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 font-body text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-30"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export function GitHubDashboardTab() {
  const [username, setUsername] = useLocalStorage<string>("pj-github-username", "");
  const { data, isLoading, error } = useGitHubData(username);

  if (!username) {
    return <UsernamePrompt onSave={setUsername} />;
  }

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
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">GitHub</h2>
        <button
          onClick={() => setUsername("")}
          className="font-body text-xs text-white/20 hover:text-white/50 transition-colors"
        >
          Change username
        </button>
      </div>

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
