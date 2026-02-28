"use client";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface StudyStreakCounterProps {
  streak: number;
}

export function StudyStreakCounter({ streak }: StudyStreakCounterProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <p className="font-body text-sm text-white/40 mb-2">Current Streak</p>
      <p className="font-display font-bold text-4xl text-white">
        <AnimatedCounter target={streak} suffix=" days" duration={1500} />
      </p>
    </div>
  );
}
