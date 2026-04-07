"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  RoadmapProgressV2, 
  TrackedProblem, 
  XPAction,
  DailyQuest,
  QuestObjective,
  Achievement,
  MockInterviewSession,
  XP_VALUES,
  LEVEL_TIERS,
  UserLevel,
} from "@/types";
import { ROADMAP_PHASES, RoadmapPhase } from "@/lib/roadmap-data";

const STORAGE_KEY = "roadmap_progress_v2";

// Default achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Problem milestones
  { id: "first-blood", title: "First Blood", description: "Solve your first problem", icon: "🎯", category: "problems", tier: "bronze", requirement: { type: "problems_total", value: 1 }, xpReward: 10 },
  { id: "getting-started", title: "Getting Started", description: "Solve 10 problems", icon: "🌱", category: "problems", tier: "bronze", requirement: { type: "problems_total", value: 10 }, xpReward: 25 },
  { id: "problem-solver", title: "Problem Solver", description: "Solve 50 problems", icon: "🧩", category: "problems", tier: "silver", requirement: { type: "problems_total", value: 50 }, xpReward: 100 },
  { id: "century", title: "Century", description: "Solve 100 problems", icon: "💯", category: "problems", tier: "gold", requirement: { type: "problems_total", value: 100 }, xpReward: 250 },
  { id: "problem-master", title: "Problem Master", description: "Solve 200 problems", icon: "🏆", category: "problems", tier: "platinum", requirement: { type: "problems_total", value: 200 }, xpReward: 500 },
  
  // Difficulty achievements
  { id: "easy-10", title: "Warm Up", description: "Solve 10 easy problems", icon: "🟢", category: "problems", tier: "bronze", requirement: { type: "problems_easy", value: 10 }, xpReward: 20 },
  { id: "medium-10", title: "Stepping Up", description: "Solve 10 medium problems", icon: "🟡", category: "problems", tier: "silver", requirement: { type: "problems_medium", value: 10 }, xpReward: 50 },
  { id: "hard-5", title: "Hard Hitter", description: "Solve 5 hard problems", icon: "🔴", category: "problems", tier: "gold", requirement: { type: "problems_hard", value: 5 }, xpReward: 100 },
  { id: "hard-25", title: "Fearless", description: "Solve 25 hard problems", icon: "💀", category: "problems", tier: "platinum", requirement: { type: "problems_hard", value: 25 }, xpReward: 300 },
  
  // Streak achievements
  { id: "streak-3", title: "On Fire", description: "3-day streak", icon: "🔥", category: "streak", tier: "bronze", requirement: { type: "streak", value: 3 }, xpReward: 15 },
  { id: "streak-7", title: "Week Warrior", description: "7-day streak", icon: "⚡", category: "streak", tier: "silver", requirement: { type: "streak", value: 7 }, xpReward: 50 },
  { id: "streak-30", title: "Monthly Master", description: "30-day streak", icon: "🌟", category: "streak", tier: "gold", requirement: { type: "streak", value: 30 }, xpReward: 200 },
  { id: "streak-100", title: "Unstoppable", description: "100-day streak", icon: "👑", category: "streak", tier: "platinum", requirement: { type: "streak", value: 100 }, xpReward: 1000 },
  
  // Mock interview achievements
  { id: "mock-1", title: "Interview Rookie", description: "Complete 1 mock interview", icon: "🎤", category: "mock", tier: "bronze", requirement: { type: "mock_interviews", value: 1 }, xpReward: 50 },
  { id: "mock-5", title: "Interview Ready", description: "Complete 5 mock interviews", icon: "🎯", category: "mock", tier: "silver", requirement: { type: "mock_interviews", value: 5 }, xpReward: 150 },
  { id: "mock-15", title: "Interview Pro", description: "Complete 15 mock interviews", icon: "🏅", category: "mock", tier: "gold", requirement: { type: "mock_interviews", value: 15 }, xpReward: 400 },
  
  // Quest achievements
  { id: "quest-7", title: "Quest Seeker", description: "Complete 7 daily quests", icon: "📜", category: "dedication", tier: "bronze", requirement: { type: "quests", value: 7 }, xpReward: 30 },
  { id: "quest-30", title: "Quest Champion", description: "Complete 30 daily quests", icon: "🗡️", category: "dedication", tier: "silver", requirement: { type: "quests", value: 30 }, xpReward: 150 },
  { id: "quest-100", title: "Legendary", description: "Complete 100 daily quests", icon: "⚔️", category: "dedication", tier: "gold", requirement: { type: "quests", value: 100 }, xpReward: 500 },
];

function getDefaultProgress(): RoadmapProgressV2 {
  return {
    phases: ROADMAP_PHASES.map(phase => ({
      phaseId: phase.id,
      topicProgress: phase.topics.map(t => ({
        topicId: t.id,
        completed: false,
      })),
      notes: "",
      updatedAt: new Date().toISOString(),
    })),
    dailyEntries: [],
    totalXP: 0,
    xpHistory: [],
    problemsSolved: {},
    problemStats: { easy: 0, medium: 0, hard: 0, total: 0 },
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
    achievements: DEFAULT_ACHIEVEMENTS,
    unlockedAchievements: [],
    dailyQuests: [],
    completedQuests: 0,
    mockInterviews: [],
    mockInterviewsDone: 0,
    bookmarkedProblems: [],
    problemNotes: {},
    systemDesignsDone: 0,
    projectsCompleted: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getLevelFromXP(xp: number): UserLevel {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXP) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = getLevelFromXP(xp);
  const nextLevel = LEVEL_TIERS.find(l => l.level === level.level + 1);
  if (!nextLevel) {
    return { current: xp - level.minXP, required: 1, percentage: 100 };
  }
  const current = xp - level.minXP;
  const required = nextLevel.minXP - level.minXP;
  return { current, required, percentage: Math.min(100, (current / required) * 100) };
}

export function useRoadmapProgress() {
  const [progress, setProgress] = useState<RoadmapProgressV2 | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate from old format if needed
        if (!parsed.totalXP) {
          const migrated = migrateFromV1(parsed);
          setProgress(migrated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        } else {
          setProgress(parsed);
        }
      } else {
        // Check for v1 data
        const v1Data = localStorage.getItem("roadmap_progress");
        if (v1Data) {
          const migrated = migrateFromV1(JSON.parse(v1Data));
          setProgress(migrated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        } else {
          setProgress(getDefaultProgress());
        }
      }
    } catch {
      setProgress(getDefaultProgress());
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveProgress = useCallback((newProgress: RoadmapProgressV2) => {
    const updated = { ...newProgress, updatedAt: new Date().toISOString() };
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  // Add XP
  const addXP = useCallback((type: XPAction["type"], metadata?: Record<string, unknown>) => {
    if (!progress) return;
    
    const xpAmount = XP_VALUES[type] || 0;
    const action: XPAction = {
      type,
      xp: xpAmount,
      timestamp: new Date().toISOString(),
      metadata,
    };
    
    const newProgress = {
      ...progress,
      totalXP: progress.totalXP + xpAmount,
      xpHistory: [...progress.xpHistory, action],
    };
    
    // Check achievements after XP gain
    const withAchievements = checkAchievements(newProgress);
    saveProgress(withAchievements);
  }, [progress, saveProgress]);

  // Mark problem solved
  const solveProblem = useCallback((problem: Omit<TrackedProblem, "solved" | "solvedAt" | "masteryLevel" | "attempts" | "bookmarked">) => {
    if (!progress) return;
    
    const existingProblem = progress.problemsSolved[problem.id];
    const tracked: TrackedProblem = {
      ...problem,
      solved: true,
      solvedAt: new Date().toISOString(),
      masteryLevel: 1,
      attempts: (existingProblem?.attempts || 0) + 1,
      bookmarked: existingProblem?.bookmarked || false,
    };
    
    const wasAlreadySolved = existingProblem?.solved;
    
    const newStats = { ...progress.problemStats };
    if (!wasAlreadySolved) {
      newStats[problem.difficulty]++;
      newStats.total++;
    }
    
    const newProgress = {
      ...progress,
      problemsSolved: { ...progress.problemsSolved, [problem.id]: tracked },
      problemStats: newStats,
    };
    
    // Add XP only if first solve
    if (!wasAlreadySolved) {
      const xpType = `${problem.difficulty}_problem` as XPAction["type"];
      const xpAmount = XP_VALUES[xpType] || 0;
      newProgress.totalXP += xpAmount;
      newProgress.xpHistory = [...newProgress.xpHistory, {
        type: xpType,
        xp: xpAmount,
        timestamp: new Date().toISOString(),
        metadata: { problemId: problem.id, problemTitle: problem.title },
      }];
    }
    
    // Update streak
    const today = new Date().toISOString().split("T")[0];
    if (progress.lastActivityDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      
      if (progress.lastActivityDate === yesterdayStr) {
        newProgress.currentStreak = progress.currentStreak + 1;
        // Add streak XP
        newProgress.totalXP += XP_VALUES.daily_streak;
        newProgress.xpHistory = [...newProgress.xpHistory, {
          type: "daily_streak",
          xp: XP_VALUES.daily_streak,
          timestamp: new Date().toISOString(),
        }];
      } else if (progress.lastActivityDate !== today) {
        newProgress.currentStreak = 1;
      }
      newProgress.lastActivityDate = today;
      newProgress.longestStreak = Math.max(newProgress.longestStreak, newProgress.currentStreak);
    }
    
    const withAchievements = checkAchievements(newProgress);
    saveProgress(withAchievements);
  }, [progress, saveProgress]);

  // Toggle topic completion
  const toggleTopic = useCallback((phaseId: number, topicId: string) => {
    if (!progress) return;
    
    const newPhases = progress.phases.map(phase => {
      if (phase.phaseId !== phaseId) return phase;
      return {
        ...phase,
        topicProgress: phase.topicProgress.map(topic => {
          if (topic.topicId !== topicId) return topic;
          return {
            ...topic,
            completed: !topic.completed,
            completedAt: !topic.completed ? new Date().toISOString() : undefined,
          };
        }),
        updatedAt: new Date().toISOString(),
      };
    });
    
    saveProgress({ ...progress, phases: newPhases });
  }, [progress, saveProgress]);

  // Toggle bookmark
  const toggleBookmark = useCallback((problemId: string) => {
    if (!progress) return;
    
    const bookmarks = progress.bookmarkedProblems.includes(problemId)
      ? progress.bookmarkedProblems.filter(id => id !== problemId)
      : [...progress.bookmarkedProblems, problemId];
    
    // Also update in problemsSolved if exists
    const problemsSolved = { ...progress.problemsSolved };
    if (problemsSolved[problemId]) {
      problemsSolved[problemId] = {
        ...problemsSolved[problemId],
        bookmarked: !problemsSolved[problemId].bookmarked,
      };
    }
    
    saveProgress({ ...progress, bookmarkedProblems: bookmarks, problemsSolved });
  }, [progress, saveProgress]);

  // Save problem solution and explanation
  const saveProblemNotes = useCallback((problemId: string, solution: string, explanation: string) => {
    if (!progress) return;
    
    const problemsSolved = { ...progress.problemsSolved };
    if (problemsSolved[problemId]) {
      problemsSolved[problemId] = {
        ...problemsSolved[problemId],
        solution,
        explanation,
      };
    }
    
    saveProgress({ ...progress, problemsSolved });
  }, [progress, saveProgress]);

  // Complete daily quest
  const completeQuest = useCallback((questId: string) => {
    if (!progress) return;
    
    const newQuests = progress.dailyQuests.map(q => 
      q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q
    );
    
    const newProgress = {
      ...progress,
      dailyQuests: newQuests,
      completedQuests: progress.completedQuests + 1,
      totalXP: progress.totalXP + XP_VALUES.quest_complete,
      xpHistory: [...progress.xpHistory, {
        type: "quest_complete" as const,
        xp: XP_VALUES.quest_complete,
        timestamp: new Date().toISOString(),
        metadata: { questId },
      }],
    };
    
    const withAchievements = checkAchievements(newProgress);
    saveProgress(withAchievements);
  }, [progress, saveProgress]);

  // Add mock interview
  const addMockInterview = useCallback((session: MockInterviewSession) => {
    if (!progress) return;
    
    const newProgress = {
      ...progress,
      mockInterviews: [...progress.mockInterviews, session],
      mockInterviewsDone: progress.mockInterviewsDone + 1,
      totalXP: progress.totalXP + XP_VALUES.mock_interview,
      xpHistory: [...progress.xpHistory, {
        type: "mock_interview" as const,
        xp: XP_VALUES.mock_interview,
        timestamp: new Date().toISOString(),
        metadata: { sessionId: session.id },
      }],
    };
    
    const withAchievements = checkAchievements(newProgress);
    saveProgress(withAchievements);
  }, [progress, saveProgress]);

  // Calculate overall progress
  const getOverallProgress = useCallback(() => {
    if (!progress) return { completed: 0, total: 0, percentage: 0 };
    
    let completed = 0;
    let total = 0;
    
    progress.phases.forEach(phase => {
      phase.topicProgress.forEach(topic => {
        total++;
        if (topic.completed) completed++;
      });
    });
    
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }, [progress]);

  // Get current phase based on date
  const getCurrentPhase = useCallback((): RoadmapPhase | null => {
    const today = new Date();
    for (const phase of ROADMAP_PHASES) {
      const start = new Date(phase.dateStart);
      const end = new Date(phase.dateEnd);
      if (today >= start && today <= end) {
        return phase;
      }
    }
    // If before first phase, return first
    if (today < new Date(ROADMAP_PHASES[0].dateStart)) {
      return ROADMAP_PHASES[0];
    }
    // If after last phase, return last
    return ROADMAP_PHASES[ROADMAP_PHASES.length - 1];
  }, []);

  return {
    progress,
    isLoaded,
    saveProgress,
    addXP,
    solveProblem,
    toggleTopic,
    toggleBookmark,
    saveProblemNotes,
    completeQuest,
    addMockInterview,
    getOverallProgress,
    getCurrentPhase,
    getLevelFromXP,
    getXPProgress,
  };
}

// Check and unlock achievements
function checkAchievements(progress: RoadmapProgressV2): RoadmapProgressV2 {
  const newUnlocked = [...progress.unlockedAchievements];
  let xpGained = 0;
  const xpHistory = [...progress.xpHistory];
  
  for (const achievement of progress.achievements) {
    if (newUnlocked.includes(achievement.id)) continue;
    
    let shouldUnlock = false;
    const { type, value } = achievement.requirement;
    
    switch (type) {
      case "problems_total":
        shouldUnlock = progress.problemStats.total >= value;
        break;
      case "problems_easy":
        shouldUnlock = progress.problemStats.easy >= value;
        break;
      case "problems_medium":
        shouldUnlock = progress.problemStats.medium >= value;
        break;
      case "problems_hard":
        shouldUnlock = progress.problemStats.hard >= value;
        break;
      case "streak":
        shouldUnlock = progress.currentStreak >= value;
        break;
      case "mock_interviews":
        shouldUnlock = progress.mockInterviewsDone >= value;
        break;
      case "quests":
        shouldUnlock = progress.completedQuests >= value;
        break;
    }
    
    if (shouldUnlock) {
      newUnlocked.push(achievement.id);
      xpGained += achievement.xpReward;
      xpHistory.push({
        type: "achievement_unlock",
        xp: achievement.xpReward,
        timestamp: new Date().toISOString(),
        metadata: { achievementId: achievement.id },
      });
    }
  }
  
  // Update achievements with unlock timestamps
  const updatedAchievements = progress.achievements.map(a => 
    newUnlocked.includes(a.id) && !a.unlockedAt
      ? { ...a, unlockedAt: new Date().toISOString() }
      : a
  );
  
  return {
    ...progress,
    achievements: updatedAchievements,
    unlockedAchievements: newUnlocked,
    totalXP: progress.totalXP + xpGained,
    xpHistory,
  };
}

// Migrate from v1 format
function migrateFromV1(v1: Record<string, unknown>): RoadmapProgressV2 {
  const base = getDefaultProgress();
  
  // Migrate phases if present
  if (Array.isArray(v1.phases)) {
    base.phases = v1.phases as RoadmapProgressV2["phases"];
  }
  
  // Migrate problem stats
  if (v1.problemsSolved && typeof v1.problemsSolved === "object") {
    const ps = v1.problemsSolved as { easy?: number; medium?: number; hard?: number };
    base.problemStats = {
      easy: ps.easy || 0,
      medium: ps.medium || 0,
      hard: ps.hard || 0,
      total: (ps.easy || 0) + (ps.medium || 0) + (ps.hard || 0),
    };
    // Estimate XP from old data
    base.totalXP = 
      (ps.easy || 0) * XP_VALUES.easy_problem +
      (ps.medium || 0) * XP_VALUES.medium_problem +
      (ps.hard || 0) * XP_VALUES.hard_problem;
  }
  
  // Migrate daily entries
  if (Array.isArray(v1.dailyEntries)) {
    base.dailyEntries = v1.dailyEntries as RoadmapProgressV2["dailyEntries"];
  }
  
  // Migrate other fields
  base.mockInterviewsDone = (v1.mockInterviewsDone as number) || 0;
  base.systemDesignsDone = (v1.systemDesignsDone as number) || 0;
  base.projectsCompleted = (v1.projectsCompleted as string[]) || [];
  
  return base;
}
