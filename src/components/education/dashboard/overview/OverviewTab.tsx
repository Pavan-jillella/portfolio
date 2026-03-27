"use client";
import { useMemo } from "react";
import {
  StudySession,
  Course,
  Note,
  DashboardProject,
  DashboardOverviewStats,
  ReadingListItem,
} from "@/types";
import {
  getStudyStreak,
  getDailyStudyData,
  getRecentActivity,
  formatDuration,
  getWeekStart,
  generateSkillsFromData,
} from "@/lib/education-utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { motion } from "framer-motion";
import { AIInsightsPanel } from "../ai/AIInsightsPanel";
import { LearningAnalyticsPanel } from "../analytics/LearningAnalyticsPanel";
import { ReadingList } from "./ReadingList";

interface OverviewTabProps {
  sessions: StudySession[];
  courses: Course[];
  notes: Note[];
  projects: DashboardProject[];
  readingList: ReadingListItem[];
  onAddReadingItem: (item: Omit<ReadingListItem, "id" | "created_at">) => void;
  onDeleteReadingItem: (id: string) => void;
  onUpdateReadingItem: (id: string, updates: Partial<ReadingListItem>) => void;
}

export function OverviewTab({ sessions, courses, notes, projects, readingList, onAddReadingItem, onDeleteReadingItem, onUpdateReadingItem }: OverviewTabProps) {
  const [githubUsername] = useLocalStorage<string>("pj-github-username", "");
  const [leetcodeUsername] = useLocalStorage<string>("pj-leetcode-username", "");
  const { data: githubData } = useGitHubData(githubUsername);
  const { data: leetcodeData } = useLeetCodeData(leetcodeUsername);
  const streak = useMemo(() => getStudyStreak(sessions), [sessions]);
  const dailyData = useMemo(() => getDailyStudyData(sessions, 7), [sessions]);
  const recentActivity = useMemo(() => getRecentActivity(sessions, notes, projects), [sessions, notes, projects]);
  const skills = useMemo(() => generateSkillsFromData(sessions, courses, projects), [sessions, courses, projects]);

  const stats: DashboardOverviewStats = useMemo(() => {
    const weekStart = getWeekStart(new Date());
    const weekSessions = sessions.filter((s) => s.date >= weekStart);
    const studyMinutes = weekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    return {
      studyHoursThisWeek: parseFloat((studyMinutes / 60).toFixed(1)),
      coursesCompleted: courses.filter((c) => c.status === "completed").length,
      coursesTotal: courses.length,
      githubRepos: githubData?.stats.totalRepos ?? 0,
      githubStars: githubData?.stats.totalStars ?? 0,
      leetcodeSolved: leetcodeData?.solved ?? 0,
      activeProjects: projects.filter((p) => p.status === "in-progress").length,
      notesCount: notes.length,
    };
  }, [sessions, courses, notes, projects, githubData, leetcodeData]);

  const maxMinutes = Math.max(...dailyData.map((d) => d.minutes), 1);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-semibold text-xl text-white">Overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Study This Week", value: stats.studyHoursThisWeek, suffix: "h" },
          { label: "Current Streak", value: streak, suffix: " days" },
          { label: "Courses", value: stats.coursesTotal, suffix: "" },
          { label: "Active Projects", value: stats.activeProjects, suffix: "" },
          { label: "Courses Completed", value: stats.coursesCompleted, suffix: "" },
          { label: "Notes", value: stats.notesCount, suffix: "" },
          { label: "GitHub Repos", value: stats.githubRepos, suffix: "" },
          { label: "LeetCode Solved", value: stats.leetcodeSolved, suffix: "" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{s.label}</p>
            <p className="font-display font-bold text-2xl text-white">
              <AnimatedCounter target={s.value} suffix={s.suffix} duration={1200} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Weekly mini bar chart */}
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-display font-semibold text-lg text-white mb-4">This Week</h3>
        <div className="flex items-end gap-2 h-32">
          {dailyData.map((d) => {
            const height = d.minutes > 0 ? Math.max((d.minutes / maxMinutes) * 100, 4) : 0;
            const dayLabel = new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-white/30">
                  {d.minutes > 0 ? formatDuration(d.minutes) : ""}
                </span>
                <div
                  className="w-full rounded-t-lg bg-blue-500/60 transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
                <span className="font-mono text-[10px] text-white/20">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display font-semibold text-lg text-white mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="font-body text-sm text-white/20 text-center py-4">No activity yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  activity.type === "study" ? "bg-blue-500" :
                  activity.type === "note" ? "bg-purple-500" :
                  activity.type === "project" ? "bg-emerald-500" :
                  activity.type === "course" ? "bg-cyan-500" :
                  "bg-white/20"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white/60 truncate">{activity.description}</p>
                  <p className="font-mono text-[10px] text-white/20">
                    {new Date(activity.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* AI Insights */}
      <AIInsightsPanel sessions={sessions} courses={courses} notes={notes} projects={projects} />

      {/* Learning Analytics */}
      <LearningAnalyticsPanel sessions={sessions} courses={courses} />

      {/* Reading List */}
      <ReadingList
        items={readingList}
        onAdd={onAddReadingItem}
        onDelete={onDeleteReadingItem}
        onUpdate={onUpdateReadingItem}
      />
    </div>
  );
}
