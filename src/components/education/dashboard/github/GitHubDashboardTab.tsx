"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { RepoCard } from "./RepoCard";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAll, setShowAll] = useState(false);

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

  const displayedRepos = showAll ? data.repos : data.repos.slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">GitHub</h2>
        <div className="flex items-center gap-3">
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          <button
            onClick={() => setUsername("")}
            className="font-body text-xs text-white/20 hover:text-white/50 transition-colors"
          >
            Change username
          </button>
        </div>
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

      {/* Language chart */}
      <LanguageChart data={data.languages} />

      {/* Repos - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      {/* Repos - List View */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {displayedRepos.map((repo) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-display font-semibold text-sm text-white group-hover:text-blue-300 transition-colors truncate">
                  {repo.name}
                </span>
                {repo.language && (
                  <span className="font-mono text-[10px] text-white/40 shrink-0">{repo.language}</span>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {repo.stargazers_count > 0 && <span className="font-mono text-xs text-white/30">★ {repo.stargazers_count}</span>}
                {repo.forks_count > 0 && <span className="font-mono text-xs text-white/30">⑂ {repo.forks_count}</span>}
                <span className="font-body text-xs text-white/20 truncate max-w-[200px] hidden md:block">{repo.description || ""}</span>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Repos - Table View */}
      {viewMode === "table" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Language</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Stars</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Forks</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {displayedRepos.map((repo) => (
                  <tr key={repo.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                         className="font-body text-xs text-white/70 hover:text-blue-300 transition-colors">{repo.name}</a>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[10px] text-white/40">{repo.language || "—"}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/40">{repo.stargazers_count}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/40">{repo.forks_count}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-body text-xs text-white/30 truncate max-w-[300px] block">{repo.description || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show all toggle */}
      {data.repos.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 rounded-xl bg-white/4 text-white/30 font-body text-xs hover:bg-white/6 hover:text-white/50 transition-all"
        >
          {showAll ? "Show fewer" : `Show all ${data.repos.length} repositories`}
        </button>
      )}
    </div>
  );
}
