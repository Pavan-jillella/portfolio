"use client";
import { useState, useCallback, useMemo } from "react";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { Habit, HabitLog, HabitChain } from "@/types";
import { HABIT_TABS, HabitTabId } from "@/lib/constants";
import { calculateXP, calculateStreak, isChainCompleteToday } from "@/lib/habit-utils";
import { FadeIn } from "@/components/ui/FadeIn";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { RealtimeStatus } from "@/components/ui/RealtimeStatus";
import { HabitForm } from "./HabitForm";
import { HabitOverviewTab } from "./overview/HabitOverviewTab";
import { DailyTrackerTab } from "./daily/DailyTrackerTab";
import { WeeklyGoalsTab } from "./weekly/WeeklyGoalsTab";
import { ChainsTab } from "./chains/ChainsTab";
import { HabitCalendarTab } from "./calendar/HabitCalendarTab";
import { HabitAnalyticsTab } from "./analytics/HabitAnalyticsTab";
import { HabitXPTab } from "./xp/HabitXPTab";
import { HabitCoachTab } from "./coach/HabitCoachTab";

export function HabitTrackerClient() {
  const [habits, setHabits, habitsConnected] = useSupabaseRealtimeSync<Habit>("pj-habits", "habits", []);
  const [habitLogs, setHabitLogs, logsConnected] = useSupabaseRealtimeSync<HabitLog>("pj-habit-logs", "habit_logs", []);
  const [habitChains, setHabitChains, chainsConnected] = useSupabaseRealtimeSync<HabitChain>("pj-habit-chains", "habit_chains", []);

  const [activeTab, setActiveTab] = useState<HabitTabId>("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const isRealtimeConnected = habitsConnected || logsConnected || chainsConnected;

  const activeHabits = useMemo(() => habits.filter((h) => h.active), [habits]);

  // ── CRUD handlers ──
  const addHabit = useCallback((habit: Habit) => {
    setHabits((prev) => [habit, ...prev]);
    setShowAddForm(false);
  }, [setHabits]);

  const updateHabit = useCallback((updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    setEditingHabit(null);
  }, [setHabits]);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setHabitLogs((prev) => prev.filter((l) => l.habit_id !== id));
  }, [setHabits, setHabitLogs]);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    const existing = habitLogs.find(
      (l) => l.habit_id === habitId && l.date === date && l.completed
    );

    if (existing) {
      // Remove the log
      setHabitLogs((prev) => prev.filter((l) => l.id !== existing.id));
    } else {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const streak = calculateStreak(habitLogs, habitId);
      const xp = calculateXP(habit.difficulty, streak);

      // Check if completing this habit completes a chain
      let bonusXp = 0;
      if (habit.chain_id) {
        const chain = habitChains.find((c) => c.id === habit.chain_id);
        if (chain) {
          // Temporarily add this completion to check chain status
          const tempLogs = [...habitLogs, { id: "temp", habit_id: habitId, date, completed: true, xp_earned: 0, notes: "", created_at: "" }];
          if (isChainCompleteToday(chain, habits, tempLogs)) {
            bonusXp = chain.bonus_xp;
          }
        }
      }

      const log: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        date,
        completed: true,
        xp_earned: xp + bonusXp,
        notes: "",
        created_at: new Date().toISOString(),
      };
      setHabitLogs((prev) => [log, ...prev]);
    }
  }, [habitLogs, habits, habitChains, setHabitLogs]);

  // ── Chain CRUD ──
  const addChain = useCallback((chain: HabitChain) => {
    setHabitChains((prev) => [chain, ...prev]);
  }, [setHabitChains]);

  const updateChain = useCallback((updated: HabitChain) => {
    setHabitChains((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, [setHabitChains]);

  const deleteChain = useCallback((id: string) => {
    setHabitChains((prev) => prev.filter((c) => c.id !== id));
    // Unlink habits from this chain
    setHabits((prev) =>
      prev.map((h) => (h.chain_id === id ? { ...h, chain_id: null } : h))
    );
  }, [setHabitChains, setHabits]);

  const handleManualSync = useCallback(async () => {
    const tables = [
      { table: "habits", data: habits },
      { table: "habit_logs", data: habitLogs },
      { table: "habit_chains", data: habitChains },
    ];

    let synced = 0;
    for (const { table, data } of tables) {
      if (data.length === 0) continue;
      try {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table, upsert: data }),
        });
        if (res.ok) synced++;
      } catch {}
    }
    return { synced, failed: [] as string[] };
  }, [habits, habitLogs, habitChains]);

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="glass-card px-5 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
            >
              + Add Habit
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2 flex-1">
            {HABIT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
                  activeTab === tab.id
                    ? "glass-card text-blue-400"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <RealtimeStatus isConnected={isRealtimeConnected} onSync={handleManualSync} />
        </div>
      </FadeIn>

      {/* Add/Edit Form */}
      {(showAddForm || editingHabit) && (
        <HabitForm
          habit={editingHabit}
          chains={habitChains}
          onSave={editingHabit ? updateHabit : addHabit}
          onCancel={() => {
            setShowAddForm(false);
            setEditingHabit(null);
          }}
        />
      )}

      {/* Tab content */}
      {activeTab === "overview" && (
        <ErrorBoundary module="Habit Overview">
          <HabitOverviewTab
            habits={activeHabits}
            logs={habitLogs}
            onToggle={toggleHabitCompletion}
            onEdit={setEditingHabit}
            onDelete={deleteHabit}
          />
        </ErrorBoundary>
      )}

      {activeTab === "daily" && (
        <ErrorBoundary module="Daily Tracker">
          <DailyTrackerTab
            habits={activeHabits}
            logs={habitLogs}
            onToggle={toggleHabitCompletion}
          />
        </ErrorBoundary>
      )}

      {activeTab === "weekly" && (
        <ErrorBoundary module="Weekly Goals">
          <WeeklyGoalsTab habits={activeHabits} logs={habitLogs} />
        </ErrorBoundary>
      )}

      {activeTab === "chains" && (
        <ErrorBoundary module="Routines">
          <ChainsTab
            habits={activeHabits}
            logs={habitLogs}
            chains={habitChains}
            onAddChain={addChain}
            onDeleteChain={deleteChain}
            onToggle={toggleHabitCompletion}
          />
        </ErrorBoundary>
      )}

      {activeTab === "calendar" && (
        <ErrorBoundary module="Habit Calendar">
          <HabitCalendarTab habits={activeHabits} logs={habitLogs} />
        </ErrorBoundary>
      )}

      {activeTab === "analytics" && (
        <ErrorBoundary module="Habit Analytics">
          <HabitAnalyticsTab habits={activeHabits} logs={habitLogs} />
        </ErrorBoundary>
      )}

      {activeTab === "xp" && (
        <ErrorBoundary module="XP & Levels">
          <HabitXPTab habits={activeHabits} logs={habitLogs} />
        </ErrorBoundary>
      )}

      {activeTab === "coach" && (
        <ErrorBoundary module="AI Coach">
          <HabitCoachTab habits={activeHabits} logs={habitLogs} />
        </ErrorBoundary>
      )}
    </div>
  );
}
