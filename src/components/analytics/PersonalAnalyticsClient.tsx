"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { CorrelationChart } from "./CorrelationChart";
import { CommitTimeline } from "./CommitTimeline";
import { GrowthIndexCard } from "./GrowthIndexCard";

const KnowledgeGraph = dynamic(
  () => import("./KnowledgeGraph").then((m) => m.KnowledgeGraph),
  {
    ssr: false,
    loading: () => <div className="glass-card rounded-2xl p-6 h-[500px] animate-pulse" />,
  }
);

export function PersonalAnalyticsClient() {
  const [sessions] = useLocalStorage<any[]>("pj-study-sessions", []);
  const [githubUsername] = useLocalStorage<string>("pj-github-username", "");
  const [leetcodeUsername] = useLocalStorage<string>("pj-leetcode-username", "");
  const { data: githubData } = useGitHubData(githubUsername);
  const { data: leetcodeData } = useLeetCodeData(leetcodeUsername);
  const [commitDays, setCommitDays] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    if (!githubUsername) return;
    fetch(`/api/github/events?username=${encodeURIComponent(githubUsername)}`)
      .then((r) => r.json())
      .then((data) => setCommitDays(data.commits || []))
      .catch(() => {});
  }, [githubUsername]);

  const leetcodeSolved = leetcodeData?.solved || 0;

  return (
    <div className="space-y-8">
      <ContributionHeatmap sessions={sessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationChart sessions={sessions} leetcodeSolved={leetcodeSolved} />
        <CommitTimeline commits={commitDays} />
      </div>

      <GrowthIndexCard sessions={sessions} commitDays={commitDays} leetcodeSolved={leetcodeSolved} />

      <KnowledgeGraph />
    </div>
  );
}
