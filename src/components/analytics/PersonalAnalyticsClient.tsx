"use client";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { useGitHubEvents } from "@/hooks/queries/useGitHubEvents";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { CorrelationChart } from "./CorrelationChart";
import { CommitTimeline } from "./CommitTimeline";
import { GrowthIndexCard } from "./GrowthIndexCard";
import { LeetCodeHeatmap } from "./LeetCodeHeatmap";
import { LeetCodeBreakdown } from "./LeetCodeBreakdown";

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
  const { isLoading: githubLoading } = useGitHubData(githubUsername);
  const { data: leetcodeData, isLoading: leetcodeLoading } = useLeetCodeData(leetcodeUsername);
  const { data: commitDays = [] } = useGitHubEvents(githubUsername);

  return (
    <div className="space-y-8">
      {/* Setup prompt if no usernames configured */}
      {!githubUsername && !leetcodeUsername && (
        <div className="glass-card rounded-2xl p-6 border-dashed border-white/10">
          <p className="font-body text-sm text-white/40 text-center">
            Set your GitHub and LeetCode usernames in{" "}
            <a href="/education/dashboard" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
              Education Dashboard
            </a>{" "}
            settings to see your analytics.
          </p>
        </div>
      )}

      {/* Study heatmap */}
      <ContributionHeatmap sessions={sessions} />

      {/* LeetCode heatmap */}
      <LeetCodeHeatmap
        submissionCalendar={leetcodeData?.submissionCalendar}
        isLoading={leetcodeLoading}
      />

      {/* Two-column: Correlation + Commit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationChart sessions={sessions} commitDays={commitDays} />
        <CommitTimeline commits={commitDays} />
      </div>

      {/* Two-column: LeetCode Breakdown + Growth Index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeetCodeBreakdown data={leetcodeData} isLoading={leetcodeLoading} />
        <GrowthIndexCard
          sessions={sessions}
          commitDays={commitDays}
          leetcodeCalendar={leetcodeData?.submissionCalendar}
        />
      </div>

      {/* Knowledge Graph */}
      <KnowledgeGraph />
    </div>
  );
}
