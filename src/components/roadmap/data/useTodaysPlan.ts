"use client";

import { useMemo } from "react";
import { ROADMAP_PHASES, RoadmapPhase, RoadmapTopic } from "@/lib/roadmap-data";
import { DailyQuest, QuestObjective, RoadmapProgressV2 } from "@/types";
import { TOPIC_LEETCODE_MAP } from "@/lib/roadmap-leetcode-problems";
import { getDayPlan } from "@/lib/roadmap-daily-questions";

export interface TodaysPlan {
  date: string;
  dayOfWeek: string;
  currentPhase: RoadmapPhase;
  phaseProgress: number;
  daysIntoPhase: number;
  daysRemainingInPhase: number;
  
  // Today's topics (2-3 recommended)
  todaysTopics: RoadmapTopic[];
  completedTopics: RoadmapTopic[];
  
  // Today's problems (from curriculum + recommendations)
  recommendedProblems: RecommendedProblem[];
  
  // Theory content
  theoryBite: TheoryBite | null;
  
  // Daily quest
  dailyQuest: DailyQuest;
  
  // Curriculum day info
  curriculumDay: number;
  curriculumContent: CurriculumDayContent | null;
}

export interface RecommendedProblem {
  id: string;
  title: string;
  number: number;
  difficulty: "easy" | "medium" | "hard";
  url: string;
  topicId: string;
  source: "curriculum" | "recommendation" | "review";
}

export interface TheoryBite {
  title: string;
  url: string;
  source: string;
  estimatedTime: string;
  topicId: string;
}

export interface CurriculumDayContent {
  day: number;
  topic: string;
  topicId: string;
  phase: number;
  phaseName: string;
  theoryToRead: Array<{
    title: string;
    url: string;
    source: string;
    estimatedTime: string;
  }>;
  problems: Array<{
    title: string;
    difficulty: string;
    url: string;
    source: string;
    tags: string[];
  }>;
  learningTips: Array<{
    tip: string;
    category: string;
  }>;
  keyConceptsSummary: string;
  tomorrowPreview: string;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getCurrentPhaseByDate(date: Date = new Date()): RoadmapPhase {
  for (const phase of ROADMAP_PHASES) {
    const start = new Date(phase.dateStart);
    const end = new Date(phase.dateEnd);
    if (date >= start && date <= end) {
      return phase;
    }
  }
  // Before roadmap starts
  if (date < new Date(ROADMAP_PHASES[0].dateStart)) {
    return ROADMAP_PHASES[0];
  }
  // After roadmap ends
  return ROADMAP_PHASES[ROADMAP_PHASES.length - 1];
}

function calculateDaysIntoPhase(phase: RoadmapPhase, date: Date = new Date()): number {
  const start = new Date(phase.dateStart);
  const diff = date.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function calculateDaysRemainingInPhase(phase: RoadmapPhase, date: Date = new Date()): number {
  const end = new Date(phase.dateEnd);
  const diff = end.getTime() - date.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function calculateCurriculumDay(date: Date = new Date()): number {
  const roadmapStart = new Date(ROADMAP_PHASES[0].dateStart);
  const diff = date.getTime() - roadmapStart.getTime();
  const daysSinceStart = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, daysSinceStart + 1);
}

export function useTodaysPlan(progress: RoadmapProgressV2 | null): TodaysPlan | null {
  return useMemo(() => {
    if (!progress) return null;
    
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
    
    // Get current phase
    const currentPhase = getCurrentPhaseByDate(today);
    const daysIntoPhase = calculateDaysIntoPhase(currentPhase, today);
    const daysRemainingInPhase = calculateDaysRemainingInPhase(currentPhase, today);
    
    // Calculate phase progress
    const phaseData = progress.phases.find(p => p.phaseId === currentPhase.id);
    const completedInPhase = phaseData?.topicProgress.filter(t => t.completed).length || 0;
    const totalInPhase = currentPhase.topics.length;
    const phaseProgress = totalInPhase > 0 ? (completedInPhase / totalInPhase) * 100 : 0;
    
    // Get today's topics (2-3 based on pace)
    const topicsPerDay = Math.ceil(totalInPhase / (daysIntoPhase + daysRemainingInPhase));
    const expectedCompleted = Math.min(topicsPerDay * (daysIntoPhase + 1), totalInPhase);
    
    const completedTopicIds = new Set(
      phaseData?.topicProgress.filter(t => t.completed).map(t => t.topicId) || []
    );
    
    const remainingTopics = currentPhase.topics.filter(t => !completedTopicIds.has(t.id));
    const todaysTopics = remainingTopics.slice(0, Math.min(3, topicsPerDay));
    const completedTopics = currentPhase.topics.filter(t => completedTopicIds.has(t.id));
    
    // Get curriculum day content
    const curriculumDay = calculateCurriculumDay(today);
    let curriculumContent: CurriculumDayContent | null = null;
    try {
      const dayPlan = getDayPlan(curriculumDay);
      if (dayPlan) {
        curriculumContent = dayPlan as CurriculumDayContent;
      }
    } catch {
      // No curriculum for this day
    }
    
    // Get recommended problems
    const recommendedProblems: RecommendedProblem[] = [];
    
    // Add problems from curriculum
    if (curriculumContent?.problems) {
      curriculumContent.problems.forEach((p, i) => {
        recommendedProblems.push({
          id: `curriculum-${curriculumDay}-${i}`,
          title: p.title,
          number: 0,
          difficulty: (p.difficulty?.toLowerCase() || "medium") as "easy" | "medium" | "hard",
          url: p.url,
          topicId: curriculumContent!.topicId,
          source: "curriculum",
        });
      });
    }
    
    // Add problems from topic recommendations
    todaysTopics.forEach(topic => {
      const topicProblems = TOPIC_LEETCODE_MAP[topic.id] || [];
      topicProblems.slice(0, 2).forEach(p => {
        if (!recommendedProblems.find(rp => rp.id === p.id)) {
          recommendedProblems.push({
            ...p,
            topicId: topic.id,
            source: "recommendation",
          });
        }
      });
    });
    
    // Get theory bite (first unread theory from curriculum)
    let theoryBite: TheoryBite | null = null;
    if (curriculumContent?.theoryToRead?.[0]) {
      const theory = curriculumContent.theoryToRead[0];
      theoryBite = {
        title: theory.title,
        url: theory.url,
        source: theory.source,
        estimatedTime: theory.estimatedTime,
        topicId: curriculumContent.topicId,
      };
    }
    
    // Generate daily quest
    const dailyQuest = generateDailyQuest(
      dateStr,
      currentPhase,
      todaysTopics,
      recommendedProblems,
      progress
    );
    
    return {
      date: dateStr,
      dayOfWeek,
      currentPhase,
      phaseProgress,
      daysIntoPhase,
      daysRemainingInPhase,
      todaysTopics,
      completedTopics,
      recommendedProblems: recommendedProblems.slice(0, 5),
      theoryBite,
      dailyQuest,
      curriculumDay,
      curriculumContent,
    };
  }, [progress]);
}

function generateDailyQuest(
  date: string,
  phase: RoadmapPhase,
  topics: RoadmapTopic[],
  problems: RecommendedProblem[],
  progress: RoadmapProgressV2
): DailyQuest {
  const topicName = topics[0]?.label || phase.title;
  const shortTopic = topicName.split("(")[0].trim().split(":")[0].trim();
  
  // Main objectives
  const objectives: QuestObjective[] = [];
  
  // Problem solving objective
  const easyCount = problems.filter(p => p.difficulty === "easy").length;
  const mediumCount = problems.filter(p => p.difficulty === "medium").length;
  const targetProblems = Math.min(3, problems.length);
  
  objectives.push({
    id: `${date}-problems`,
    type: "problems",
    description: `Solve ${targetProblems} ${shortTopic} problems`,
    target: targetProblems,
    current: 0, // Will be updated from tracking
    xpReward: easyCount * 10 + mediumCount * 25,
    completed: false,
  });
  
  // Bonus objectives
  const bonusObjectives: QuestObjective[] = [];
  
  // Theory bonus
  bonusObjectives.push({
    id: `${date}-theory`,
    type: "theory",
    description: "Read today's theory article",
    target: 1,
    current: 0,
    xpReward: 5,
    completed: false,
  });
  
  // Time bonus (solve within time limit)
  bonusObjectives.push({
    id: `${date}-speed`,
    type: "time",
    description: "Solve each problem in under 25 minutes",
    target: targetProblems,
    current: 0,
    xpReward: 15,
    completed: false,
  });
  
  // Notes bonus
  bonusObjectives.push({
    id: `${date}-notes`,
    type: "notes",
    description: "Write solution notes for at least 1 problem",
    target: 1,
    current: 0,
    xpReward: 5,
    completed: false,
  });
  
  const totalXP = 
    objectives.reduce((sum, o) => sum + o.xpReward, 0) +
    bonusObjectives.reduce((sum, o) => sum + o.xpReward, 0) +
    30; // Quest completion bonus
  
  return {
    id: `quest-${date}`,
    date,
    title: `Master ${shortTopic}`,
    description: `Focus on ${shortTopic} today. Complete problems and read theory to level up!`,
    phaseId: phase.id,
    topicId: topics[0]?.id || "",
    objectives,
    bonusObjectives,
    totalXP,
    completed: false,
  };
}

export default useTodaysPlan;
