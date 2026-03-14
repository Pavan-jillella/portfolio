/* ─── Roadmap Scheduler — Compute today's study plan ─────────────── */
import type { RoadmapProgress } from "@/types";
import { type RoadmapPhase, type RoadmapTopic, getPhaseProgress, isTopicCompleted } from "./roadmap-data";

export interface TodaysStudyPlan {
  date: string;
  currentPhase: RoadmapPhase;
  todaysTopics: RoadmapTopic[];
  nextTopics: RoadmapTopic[];
  phaseProgress: number;
  daysRemaining: number;
  totalDaysInPhase: number;
  dayIndex: number;
  isAheadOfSchedule: boolean;
  isBehindSchedule: boolean;
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function getTodaysStudyPlan(
  progress: RoadmapProgress,
  phases: RoadmapPhase[],
  today?: Date
): TodaysStudyPlan | null {
  const now = today || new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Find the current phase based on date
  let currentPhase: RoadmapPhase | null = null;

  for (const phase of phases) {
    const start = new Date(phase.dateStart + "T00:00:00");
    const end = new Date(phase.dateEnd + "T23:59:59");

    if (now >= start && now <= end) {
      currentPhase = phase;
      break;
    }
  }

  // If before first phase or after last phase, find nearest incomplete phase
  if (!currentPhase) {
    const firstStart = new Date(phases[0].dateStart + "T00:00:00");
    const lastEnd = new Date(phases[phases.length - 1].dateEnd + "T23:59:59");

    if (now < firstStart) {
      // Before roadmap starts — show first phase
      currentPhase = phases[0];
    } else if (now > lastEnd) {
      // After roadmap ends — find first incomplete phase or use last
      currentPhase = phases.find((p) => getPhaseProgress(progress, p.id) < 100) || phases[phases.length - 1];
    } else {
      // In a gap between phases — find next phase
      for (const phase of phases) {
        const start = new Date(phase.dateStart + "T00:00:00");
        if (now < start) {
          currentPhase = phase;
          break;
        }
      }
    }
  }

  if (!currentPhase) return null;

  const phaseStart = new Date(currentPhase.dateStart + "T00:00:00");
  const phaseEnd = new Date(currentPhase.dateEnd + "T23:59:59");
  const totalDays = diffDays(phaseStart, phaseEnd) + 1;
  const dayIndex = Math.max(0, diffDays(phaseStart, now));
  const daysRemaining = Math.max(0, diffDays(now, phaseEnd));

  // Get uncompleted topics
  const uncompletedTopics = currentPhase.topics.filter(
    (t) => !isTopicCompleted(progress, currentPhase!.id, t.id)
  );

  // How many topics should be done by now
  const topicsPerDay = currentPhase.topics.length / totalDays;
  const expectedCompleted = Math.floor((dayIndex + 1) * topicsPerDay);
  const actualCompleted = currentPhase.topics.length - uncompletedTopics.length;

  // Today's topics: aim for 1-3 uncompleted topics
  const todaysCount = Math.max(1, Math.min(3, Math.ceil(topicsPerDay)));
  const todaysTopics = uncompletedTopics.slice(0, todaysCount);
  const nextTopics = uncompletedTopics.slice(todaysCount, todaysCount + 3);

  const phaseProgress = getPhaseProgress(progress, currentPhase.id);

  return {
    date: todayStr,
    currentPhase,
    todaysTopics,
    nextTopics,
    phaseProgress,
    daysRemaining,
    totalDaysInPhase: totalDays,
    dayIndex,
    isAheadOfSchedule: actualCompleted > expectedCompleted,
    isBehindSchedule: actualCompleted < expectedCompleted - 1,
  };
}
