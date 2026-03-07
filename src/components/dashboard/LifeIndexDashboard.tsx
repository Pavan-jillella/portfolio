"use client";
import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGitHubData } from "@/hooks/queries/useGitHubData";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import {
  Transaction,
  Budget,
  SavingsGoal,
  Investment,
  NetWorthEntry,
  StudySession,
  Course,
  DashboardProject,
  Note,
  Habit,
  HabitLog,
} from "@/types";
import { getCurrentMonth, getMonthlyTransactions } from "@/lib/finance-utils";
import { getOverallHabitScore } from "@/lib/habit-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface LifeIndexDashboardProps {
  blogCount: number;
}

/* ── Domain score type ── */
interface DomainScore {
  label: string;
  score: number;
  color: string;
  metrics: { label: string; value: string }[];
}

/* ── Score ring SVG ── */
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div className="relative" style={{ width: size, height: size, perspective: "600px" }}>
      <svg width={size} height={size} className="-rotate-90" style={{ transform: "rotateX(12deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold text-white">{score}</span>
        <span className="font-body text-xs text-white/30">/ 100</span>
      </div>
    </div>
  );
}

/* ── Mini bar ── */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 rounded-full bg-white/[0.06] w-full">
      <div
        className="h-full rounded-full transition-all duration-700 bar-3d-horizontal"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

/* ── Domain card ── */
function DomainCard({ domain }: { domain: DomainScore }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-white">{domain.label}</h3>
        <span
          className="font-mono text-lg font-bold"
          style={{ color: domain.color }}
        >
          {domain.score}
        </span>
      </div>
      <MiniBar value={domain.score} max={100} color={domain.color} />
      <div className="mt-4 space-y-2">
        {domain.metrics.map((m) => (
          <div key={m.label} className="flex justify-between">
            <span className="font-body text-xs text-white/40">{m.label}</span>
            <span className="font-mono text-xs text-white/60">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Monthly trend sparkline ── */
function TrendChart({ data }: { data: { month: string; score: number }[] }) {
  if (data.length < 2) {
    return (
      <p className="font-body text-xs text-white/20 text-center py-8">
        Need at least two months of data
      </p>
    );
  }

  const w = 280;
  const h = 60;
  const pts = data.map((d, i) => ({
    x: (w / (data.length - 1)) * i,
    y: h - (d.score / 100) * h,
  }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;

  return (
    <div>
      <Chart3DWrapper tiltX={8} tiltY={-4}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <filter id="trendGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={area} fill="url(#area-grad)" />
        <path d={path} fill="none" className="stroke-blue-400" strokeWidth={2} filter="url(#trendGlow)" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} className="fill-blue-400" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }} />
        ))}
      </svg>
      </Chart3DWrapper>
      <div className="flex justify-between mt-1">
        {data.map((d) => (
          <span key={d.month} className="font-mono text-[9px] text-white/20">
            {d.month.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══ Main Dashboard ═══ */
export function LifeIndexDashboard({ blogCount }: LifeIndexDashboardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Finance data ──
  const [transactions] = useLocalStorage<Transaction[]>("pj-transactions", []);
  const [budgets] = useLocalStorage<Budget[]>("pj-budgets", []);
  const [savingsGoals] = useLocalStorage<SavingsGoal[]>("pj-savings-goals", []);
  const [investments] = useLocalStorage<Investment[]>("pj-investments", []);
  const [netWorthEntries] = useLocalStorage<NetWorthEntry[]>("pj-net-worth", []);

  // ── Education data ──
  const [studySessions] = useLocalStorage<StudySession[]>("pj-study-sessions", []);
  const [courses] = useLocalStorage<Course[]>("pj-courses", []);
  const [projects] = useLocalStorage<DashboardProject[]>("pj-edu-projects", []);
  const [notes] = useLocalStorage<Note[]>("pj-edu-notes", []);

  // ── Habit data ──
  const [habits] = useLocalStorage<Habit[]>("pj-habits", []);
  const [habitLogs] = useLocalStorage<HabitLog[]>("pj-habit-logs", []);

  // ── External data ──
  const [githubUsername] = useLocalStorage<string>("pj-github-username", "");
  const [leetcodeUsername] = useLocalStorage<string>("pj-leetcode-username", "");
  const { data: githubData } = useGitHubData(githubUsername);
  const { data: leetcodeData } = useLeetCodeData(leetcodeUsername);
  const [commitDays, setCommitDays] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    if (!githubUsername) return;
    fetch(`/api/github/events?username=${encodeURIComponent(githubUsername)}`)
      .then((r) => r.json())
      .then((d) => setCommitDays(d.commits || []))
      .catch(() => {});
  }, [githubUsername]);

  const currentMonth = getCurrentMonth();

  // ── Finance score (0-100) ──
  const financeScore = useMemo(() => {
    const monthTx = getMonthlyTransactions(transactions, currentMonth);
    const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Budget adherence: % of budgets not exceeded
    const monthBudgets = budgets.filter((b) => b.month === currentMonth);
    let budgetAdherence = 100;
    if (monthBudgets.length > 0) {
      const withinBudget = monthBudgets.filter((b) => {
        const spent = monthTx
          .filter((t) => t.type === "expense" && t.category === b.category)
          .reduce((s, t) => s + t.amount, 0);
        return spent <= b.monthly_limit;
      }).length;
      budgetAdherence = (withinBudget / monthBudgets.length) * 100;
    }

    // Net worth positive
    const assets = netWorthEntries
      .filter((e) => e.type === "asset")
      .reduce((s, e) => s + e.value, 0);
    const liabilities = netWorthEntries
      .filter((e) => e.type === "liability")
      .reduce((s, e) => s + e.value, 0);
    const netWorth = assets - liabilities;
    const nwScore = netWorth > 0 ? Math.min(netWorth / 10000, 1) * 100 : 0;

    // Savings goals progress
    const goalProgress =
      savingsGoals.length > 0
        ? savingsGoals.reduce(
            (s, g) =>
              s + Math.min(g.current_amount / Math.max(g.target_amount, 1), 1),
            0
          ) /
          savingsGoals.length *
          100
        : 50; // neutral if no goals

    // Composite: 30% savings rate, 25% budget adherence, 25% net worth, 20% goal progress
    const raw =
      Math.max(0, Math.min(savingsRate, 100)) * 0.3 +
      budgetAdherence * 0.25 +
      nwScore * 0.25 +
      goalProgress * 0.2;

    return {
      score: Math.round(Math.min(raw, 100)),
      savingsRate: Math.round(savingsRate),
      income,
      expenses,
      netWorth,
      investmentCount: investments.length,
    };
  }, [transactions, budgets, savingsGoals, netWorthEntries, investments, currentMonth]);

  // ── Learning score (0-100) ──
  const learningScore = useMemo(() => {
    // Study hours this month
    const monthSessions = studySessions.filter(
      (s) => (s.date || s.created_at || "").startsWith(currentMonth)
    );
    const studyHours = monthSessions.reduce((s, sess) => s + (sess.duration_minutes || 0), 0) / 60;
    const studyTarget = 40; // target 40 hrs/month
    const studyPct = Math.min(studyHours / studyTarget, 1) * 100;

    // Course completion rate
    const completedCourses = courses.filter((c) => c.status === "completed").length;
    const coursePct =
      courses.length > 0 ? (completedCourses / courses.length) * 100 : 0;

    // LeetCode progress
    const solved = leetcodeData?.solved || 0;
    const leetPct = Math.min(solved / 150, 1) * 100; // target 150

    // Active projects
    const activeProjects = projects.filter(
      (p) => p.status === "in-progress" || p.status === "completed"
    ).length;
    const projPct = Math.min(activeProjects / 5, 1) * 100;

    // Composite: 35% study, 25% courses, 25% leetcode, 15% projects
    const raw = studyPct * 0.35 + coursePct * 0.25 + leetPct * 0.25 + projPct * 0.15;

    return {
      score: Math.round(Math.min(raw, 100)),
      studyHours: Math.round(studyHours * 10) / 10,
      completedCourses,
      totalCourses: courses.length,
      leetcodeSolved: solved,
      activeProjects,
    };
  }, [studySessions, courses, projects, leetcodeData, currentMonth]);

  // ── Technical score (0-100) ──
  const technicalScore = useMemo(() => {
    // Commits this month
    const monthCommits = commitDays
      .filter((c) => c.date.startsWith(currentMonth))
      .reduce((s, c) => s + c.count, 0);
    const commitPct = Math.min(monthCommits / 60, 1) * 100; // target 60 commits/month

    // Total repos & stars
    const totalRepos = githubData?.stats.totalRepos || 0;
    const repoPct = Math.min(totalRepos / 30, 1) * 100; // target 30 repos

    const totalStars = githubData?.stats.totalStars || 0;
    const starPct = Math.min(totalStars / 50, 1) * 100;

    // Languages diversity
    const langCount = githubData?.languages.length || 0;
    const langPct = Math.min(langCount / 8, 1) * 100;

    // Composite: 40% commits, 25% repos, 20% stars, 15% languages
    const raw = commitPct * 0.4 + repoPct * 0.25 + starPct * 0.2 + langPct * 0.15;

    return {
      score: Math.round(Math.min(raw, 100)),
      monthCommits,
      totalRepos,
      totalStars,
      langCount,
    };
  }, [commitDays, githubData, currentMonth]);

  // ── Personal Growth score (0-100) ──
  const growthScore = useMemo(() => {
    // Notes written
    const notesPct = Math.min(notes.length / 20, 1) * 100;

    // Blog posts
    const blogPct = Math.min(blogCount / 10, 1) * 100;

    // Study streak (consecutive days with sessions in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDates = new Set(
      studySessions
        .filter((s) => new Date(s.date || s.created_at) >= thirtyDaysAgo)
        .map((s) => (s.date || s.created_at || "").slice(0, 10))
    );
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (recentDates.has(d.toISOString().slice(0, 10))) {
        streak++;
      } else if (i > 0) break;
    }
    const streakPct = Math.min(streak / 14, 1) * 100; // target 14 day streak

    // Completed projects
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const projPct = Math.min(completedProjects / 5, 1) * 100;

    // Habit score (overall completion rate across active habits, last 30 days)
    const habitScore = getOverallHabitScore(habits, habitLogs);

    // Composite: 20% notes, 20% blog, 15% streak, 20% projects, 25% habits
    const raw = notesPct * 0.2 + blogPct * 0.2 + streakPct * 0.15 + projPct * 0.2 + habitScore * 0.25;

    return {
      score: Math.round(Math.min(raw, 100)),
      notesCount: notes.length,
      streak,
      completedProjects,
      habitScore,
    };
  }, [notes, blogCount, studySessions, projects, habits, habitLogs]);

  // ── Composite index ──
  const compositeScore = Math.round(
    (financeScore.score + learningScore.score + technicalScore.score + growthScore.score) / 4
  );

  // ── Monthly trend (last 6 months) ──
  const monthlyTrend = useMemo(() => {
    const months: { month: string; score: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.toISOString().slice(0, 7);

      // Simple study hours for the month
      const mSessions = studySessions.filter(
        (s) => (s.date || s.created_at || "").startsWith(m)
      );
      const studyH = mSessions.reduce((s, sess) => s + (sess.duration_minutes || 0), 0) / 60;
      const studyNorm = Math.min(studyH / 40, 1);

      // Commits for the month
      const mCommits = commitDays
        .filter((c) => c.date.startsWith(m))
        .reduce((s, c) => s + c.count, 0);
      const commitNorm = Math.min(mCommits / 60, 1);

      // Transactions for the month
      const mTx = transactions.filter((t) => t.date.startsWith(m));
      const inc = mTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const exp = mTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const savR = inc > 0 ? Math.max(0, (inc - exp) / inc) : 0;

      const score = Math.round(
        (studyNorm * 30 + commitNorm * 30 + savR * 20 + Math.min((leetcodeData?.solved || 0) / 150, 1) * 20)
      );
      months.push({ month: m, score });
    }

    return months;
  }, [studySessions, commitDays, transactions, leetcodeData]);

  const domains: DomainScore[] = [
    {
      label: "Financial Health",
      score: financeScore.score,
      color: "#10b981",
      metrics: [
        { label: "Savings rate", value: `${financeScore.savingsRate}%` },
        {
          label: "Net worth",
          value: `$${financeScore.netWorth.toLocaleString()}`,
        },
        { label: "Investments", value: `${financeScore.investmentCount}` },
      ],
    },
    {
      label: "Learning",
      score: learningScore.score,
      color: "#3b82f6",
      metrics: [
        { label: "Study hours (mo)", value: `${learningScore.studyHours}h` },
        {
          label: "Courses",
          value: `${learningScore.completedCourses}/${learningScore.totalCourses}`,
        },
        { label: "LeetCode solved", value: `${learningScore.leetcodeSolved}` },
      ],
    },
    {
      label: "Technical",
      score: technicalScore.score,
      color: "#8b5cf6",
      metrics: [
        { label: "Commits (mo)", value: `${technicalScore.monthCommits}` },
        { label: "Repos", value: `${technicalScore.totalRepos}` },
        { label: "Stars", value: `${technicalScore.totalStars}` },
      ],
    },
    {
      label: "Personal Growth",
      score: growthScore.score,
      color: "#f59e0b",
      metrics: [
        { label: "Notes", value: `${growthScore.notesCount}` },
        { label: "Blog posts", value: `${blogCount}` },
        { label: "Streak", value: `${growthScore.streak}d` },
      ],
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="glass-card rounded-2xl p-8 h-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-5 h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Composite Score */}
      <div className="glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
        <ScoreRing score={compositeScore} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-xl font-bold text-white mb-1">
            Composite Life Index
          </h2>
          <p className="font-body text-sm text-white/40 mb-4">
            Equally weighted across four domains this month.
          </p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {domains.map((d) => (
              <span
                key={d.label}
                className="font-mono text-xs px-3 py-1 rounded-full"
                style={{
                  background: `${d.color}15`,
                  color: d.color,
                }}
              >
                {d.label.split(" ")[0]} {d.score}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {domains.map((d) => (
          <DomainCard key={d.label} domain={d} />
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-sm text-white mb-1">
          Monthly Trend
        </h3>
        <p className="font-body text-xs text-white/30 mb-4">
          Composite score over the last 6 months
        </p>
        <TrendChart data={monthlyTrend} />
      </div>
    </div>
  );
}
