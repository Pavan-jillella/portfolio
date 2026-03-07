import { Habit, HabitLog, HabitChain, HabitDifficulty, HabitCategory, HabitWithStats, HabitBadge, HabitDayData, HabitCategoryScore, HabitChainWithHabits } from "@/types";
import { HABIT_DIFFICULTY_XP, HABIT_STREAK_BADGES, HABIT_XP_PER_LEVEL } from "@/lib/constants";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getToday(): string {
  return toDateStr(new Date());
}

function getStartOfWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

export function calculateStreak(logs: HabitLog[], habitId: string): number {
  const completedDates = new Set(
    logs
      .filter((l) => l.habit_id === habitId && l.completed)
      .map((l) => l.date)
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (completedDates.has(toDateStr(d))) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      // Today not completed yet — that's ok, check from yesterday
      continue;
    }
  }
  return streak;
}

export function calculateLongestStreak(logs: HabitLog[], habitId: string): number {
  const dates = logs
    .filter((l) => l.habit_id === habitId && l.completed)
    .map((l) => l.date)
    .sort();

  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
    // diff === 0 means same date, skip
  }

  return longest;
}

export function getWeeklyCompletions(logs: HabitLog[], habitId: string): number {
  const weekStart = toDateStr(getStartOfWeek());
  return logs.filter(
    (l) => l.habit_id === habitId && l.completed && l.date >= weekStart
  ).length;
}

export function getCompletionRate(logs: HabitLog[], habitId: string, days: number): number {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  const start = toDateStr(startDate);

  const completedDates = new Set(
    logs
      .filter((l) => l.habit_id === habitId && l.completed && l.date >= start)
      .map((l) => l.date)
  );

  return days > 0 ? Math.round((completedDates.size / days) * 100) : 0;
}

export function getHabitHeatmapData(logs: HabitLog[], habits: Habit[], days: number): HabitDayData[] {
  const today = new Date();
  const totalActiveHabits = habits.filter((h) => h.active).length;
  const data: HabitDayData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = toDateStr(d);

    const completions = new Set(
      logs.filter((l) => l.date === dateStr && l.completed).map((l) => l.habit_id)
    ).size;

    data.push({
      date: dateStr,
      completions,
      total: totalActiveHabits,
    });
  }

  return data;
}

export function calculateXP(difficulty: HabitDifficulty, currentStreak: number): number {
  const base = HABIT_DIFFICULTY_XP[difficulty];
  // +10% bonus per 7-day streak milestone
  const streakMultiplier = 1 + Math.floor(currentStreak / 7) * 0.1;
  return Math.round(base * streakMultiplier);
}

export function getHabitLevel(totalXP: number): { level: number; xp: number; maxXp: number; label: string } {
  const levels = HABIT_XP_PER_LEVEL;
  const labels = ["Beginner", "Consistent", "Dedicated", "Advanced", "Master"];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i]) {
      return {
        level: i + 1,
        xp: totalXP - levels[i],
        maxXp: i < levels.length - 1 ? levels[i + 1] - levels[i] : 0,
        label: labels[i] || "Master",
      };
    }
  }

  return { level: 1, xp: 0, maxXp: levels[1] || 100, label: "Beginner" };
}

export function getCategoryScores(habits: Habit[], logs: HabitLog[]): HabitCategoryScore[] {
  const categories: HabitCategory[] = ["Health", "Learning", "Productivity", "Personal"];

  return categories.map((category) => {
    const categoryHabits = habits.filter((h) => h.category === category && h.active);
    if (categoryHabits.length === 0) {
      return { category, score: 0, habits_count: 0, completion_rate: 0 };
    }

    const rates = categoryHabits.map((h) => getCompletionRate(logs, h.id, 30));
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;

    return {
      category,
      score: Math.round(avgRate),
      habits_count: categoryHabits.length,
      completion_rate: Math.round(avgRate),
    };
  });
}

export function getEarnedBadges(longestStreak: number): HabitBadge[] {
  return HABIT_STREAK_BADGES
    .filter((b) => longestStreak >= b.days)
    .map((b) => ({
      type: b.type,
      streak_days: b.days,
      label: b.label,
      color: b.color,
    }));
}

export function getWeeklyScore(habits: Habit[], logs: HabitLog[]): number {
  const activeHabits = habits.filter((h) => h.active);
  if (activeHabits.length === 0) return 0;

  const totalTarget = activeHabits.reduce((s, h) => s + h.frequency_per_week, 0);
  const totalCompleted = activeHabits.reduce(
    (s, h) => s + Math.min(getWeeklyCompletions(logs, h.id), h.frequency_per_week),
    0
  );

  return totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
}

export function isChainCompleteToday(
  chain: HabitChain,
  habits: Habit[],
  logs: HabitLog[]
): boolean {
  const today = getToday();
  const chainHabits = habits.filter((h) => h.chain_id === chain.id && h.active);
  if (chainHabits.length === 0) return false;

  return chainHabits.every((habit) =>
    logs.some((l) => l.habit_id === habit.id && l.date === today && l.completed)
  );
}

export function getHabitWithStats(habit: Habit, logs: HabitLog[]): HabitWithStats {
  const habitLogs = logs.filter((l) => l.habit_id === habit.id);
  const current_streak = calculateStreak(logs, habit.id);
  const longest_streak = calculateLongestStreak(logs, habit.id);
  const completions_this_week = getWeeklyCompletions(logs, habit.id);
  const completion_rate = getCompletionRate(logs, habit.id, 30);
  const total_xp = habitLogs.reduce((s, l) => s + l.xp_earned, 0);
  const level = getHabitLevel(total_xp).level;

  return {
    ...habit,
    current_streak,
    longest_streak,
    completions_this_week,
    completion_rate,
    total_xp,
    level,
  };
}

export function getChainWithHabits(
  chain: HabitChain,
  habits: Habit[],
  logs: HabitLog[]
): HabitChainWithHabits {
  const chainHabits = habits.filter((h) => h.chain_id === chain.id && h.active);
  return {
    ...chain,
    habits: chainHabits,
    all_completed_today: isChainCompleteToday(chain, habits, logs),
  };
}

export function isHabitCompletedToday(logs: HabitLog[], habitId: string): boolean {
  const today = getToday();
  return logs.some((l) => l.habit_id === habitId && l.date === today && l.completed);
}

export function getOverallHabitScore(habits: Habit[], logs: HabitLog[]): number {
  const activeHabits = habits.filter((h) => h.active);
  if (activeHabits.length === 0) return 0;

  const rates = activeHabits.map((h) => getCompletionRate(logs, h.id, 30));
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
}
