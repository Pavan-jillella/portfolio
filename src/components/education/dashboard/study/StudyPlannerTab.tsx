"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { StudySession, StudyGoal, Course } from "@/types";
import {
  getStudyStreak,
  getDailyStudyData,
  getSubjectBreakdown,
  getWeeklyGoalProgress,
  formatDuration,
  getWeekStart,
} from "@/lib/education-utils";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StudySessionForm } from "./StudySessionForm";
import { StudySessionList } from "./StudySessionList";
import { StudyGoalsTracker } from "./StudyGoalsTracker";
import { StudyStreakCounter } from "./StudyStreakCounter";
import { LearningPlannerTab } from "../planner/LearningPlannerTab";
import { motion } from "framer-motion";

const StudyBarChart = dynamic(() => import("./StudyBarChart").then((m) => m.StudyBarChart), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-64 animate-pulse" />,
});

const SubjectBreakdownChart = dynamic(() => import("./SubjectBreakdownChart").then((m) => m.SubjectBreakdownChart), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-64 animate-pulse" />,
});

interface StudyPlannerTabProps {
  sessions: StudySession[];
  goals: StudyGoal[];
  courses: Course[];
  onAddSession: (session: Omit<StudySession, "id" | "created_at">) => void;
  onEditSession: (id: string, session: Omit<StudySession, "id" | "created_at">) => void;
  onDeleteSession: (id: string) => void;
  onAddGoal: (goal: Omit<StudyGoal, "id" | "created_at">) => void;
  onDeleteGoal: (id: string) => void;
}

export function StudyPlannerTab({
  sessions,
  goals,
  courses,
  onAddSession,
  onEditSession,
  onDeleteSession,
  onAddGoal,
  onDeleteGoal,
}: StudyPlannerTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);

  // Compute stats
  const streak = useMemo(() => getStudyStreak(sessions), [sessions]);
  const dailyData = useMemo(() => getDailyStudyData(sessions, 7), [sessions]);
  const subjectBreakdown = useMemo(() => getSubjectBreakdown(sessions), [sessions]);
  const goalProgress = useMemo(() => getWeeklyGoalProgress(sessions, goals), [sessions, goals]);

  // This week's sessions
  const weekStats = useMemo(() => {
    const weekStartStr = getWeekStart(new Date());
    const thisWeekSessions = sessions.filter((s) => s.date >= weekStartStr);
    const totalMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    return {
      count: thisWeekSessions.length,
      totalMinutes,
      totalHours: parseFloat((totalMinutes / 60).toFixed(1)),
    };
  }, [sessions]);

  function handleEdit(session: StudySession) {
    setEditingSession(session);
    setShowForm(true);
  }

  function handleFormSubmit(data: Omit<StudySession, "id" | "created_at">) {
    if (editingSession) {
      onEditSession(editingSession.id, data);
    } else {
      onAddSession(data);
    }
    setEditingSession(null);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingSession(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">Study Planner</h2>
        <button
          onClick={() => {
            setEditingSession(null);
            setShowForm(true);
          }}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          + Log Session
        </button>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sessions this week */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <p className="font-body text-xs text-white/40 mb-1">Sessions This Week</p>
          <p className="font-display font-bold text-2xl text-white">
            <AnimatedCounter target={weekStats.count} duration={1200} />
          </p>
        </motion.div>

        {/* Total hours this week */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="font-body text-xs text-white/40 mb-1">Hours This Week</p>
          <p className="font-display font-bold text-2xl text-white">
            <AnimatedCounter target={weekStats.totalHours} suffix="h" duration={1200} />
          </p>
        </motion.div>

        {/* Current streak */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-body text-xs text-white/40 mb-1">Current Streak</p>
          <p className="font-display font-bold text-2xl text-white">
            <AnimatedCounter target={streak} suffix=" days" duration={1200} />
          </p>
        </motion.div>

        {/* Active goals */}
        <motion.div
          className="glass-card rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="font-body text-xs text-white/40 mb-1">Active Goals</p>
          <p className="font-display font-bold text-2xl text-white">
            <AnimatedCounter target={goals.length} duration={1200} />
          </p>
        </motion.div>
      </div>

      {/* Study Streak Heatmap + Milestones */}
      <StudyStreakCounter streak={streak} sessions={sessions} />

      {/* Charts row - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyBarChart data={dailyData} />
        <SubjectBreakdownChart data={subjectBreakdown} />
      </div>

      {/* Goals tracker */}
      <StudyGoalsTracker
        goals={goals}
        progress={goalProgress}
        onAddGoal={onAddGoal}
        onDeleteGoal={onDeleteGoal}
      />

      {/* Sessions list */}
      <StudySessionList
        sessions={sessions}
        onEdit={handleEdit}
        onDelete={onDeleteSession}
      />

      {/* AI Learning Planner (merged from standalone Planner tab) */}
      <LearningPlannerTab sessions={sessions} courses={courses} />

      {/* Session form modal */}
      <StudySessionForm
        open={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editSession={editingSession || undefined}
      />
    </div>
  );
}
