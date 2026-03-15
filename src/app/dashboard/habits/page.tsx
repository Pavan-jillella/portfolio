"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { HabitTrackerClient } from "@/components/habits/HabitTrackerClient";

export default function HabitTrackerPage() {
  return (
    <>
      <PageHeader
        compact
        label="Habits"
        title="Habit Tracker"
        description="Build consistent habits, track streaks, and level up your personal growth."
      />
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <HabitTrackerClient />
        </div>
      </section>
    </>
  );
}
