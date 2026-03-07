"use client";
import { getMonthLabel } from "@/lib/finance-utils";

interface MonthPickerProps {
  selectedMonth: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ selectedMonth, onChange }: MonthPickerProps) {
  function shift(delta: number) {
    const [y, m] = selectedMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    onChange(d.toISOString().slice(0, 7));
  }

  const now = new Date().toISOString().slice(0, 7);
  const isCurrent = selectedMonth === now;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => shift(-1)}
        aria-label="Previous month"
        className="glass-card w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="text-center min-w-[180px]">
        <p className="font-display font-semibold text-white">{getMonthLabel(selectedMonth)}</p>
        {isCurrent && (
          <span className="tag-badge px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs">
            Current
          </span>
        )}
      </div>
      <button
        onClick={() => shift(1)}
        aria-label="Next month"
        className="glass-card w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
