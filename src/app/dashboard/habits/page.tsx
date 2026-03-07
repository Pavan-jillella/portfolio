"use client";
import { HabitTrackerClient } from "@/components/habits/HabitTrackerClient";

export default function HabitTrackerPage() {
  return (
    <section className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2">
            Dashboard / Habits
          </p>
          <h1 className="font-display text-3xl font-bold text-white">Habit Tracker</h1>
          <p className="font-body text-sm text-white/40 mt-2">
            Build consistent habits, track streaks, and level up your personal growth.
          </p>
        </div>
        <HabitTrackerClient />
      </div>
    </section>
  );
}
