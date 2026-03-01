"use client";
import { useState } from "react";
import { EnhancedWorkSchedule, Employer, PartTimeJob, PartTimeHourEntry } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ShiftCalendarProps {
  schedules: EnhancedWorkSchedule[];
  employers: Employer[];
  partTimeJobs?: PartTimeJob[];
  partTimeHours?: PartTimeHourEntry[];
}

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ShiftCalendar({ schedules, employers, partTimeJobs = [], partTimeHours = [] }: ShiftCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const employerMap = new Map(employers.map((e) => [e.id, e]));

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  }

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Map shifts by date string
  const shiftsByDate = new Map<string, { name: string; color: string; hours: number; start: string; end: string }[]>();
  for (const schedule of schedules) {
    const emp = employerMap.get(schedule.employer_id);
    if (!emp) continue;
    for (const shift of schedule.shifts) {
      if (shift.hours <= 0 || !shift.date) continue;
      const key = shift.date;
      if (!shiftsByDate.has(key)) shiftsByDate.set(key, []);
      shiftsByDate.get(key)!.push({
        name: emp.name,
        color: emp.color,
        hours: shift.hours,
        start: shift.start_time,
        end: shift.end_time,
      });
    }
  }

  // Merge part-time hours into the calendar
  const jobMap = new Map(partTimeJobs.map((j) => [j.id, j]));
  for (const entry of partTimeHours) {
    if (entry.hours <= 0 || !entry.date) continue;
    const job = jobMap.get(entry.job_id);
    if (!job) continue;
    const key = entry.date;
    if (!shiftsByDate.has(key)) shiftsByDate.set(key, []);
    shiftsByDate.get(key)!.push({
      name: job.name,
      color: job.color,
      hours: entry.hours,
      start: entry.start_time || "",
      end: entry.end_time || "",
    });
  }

  // Build legend from both employers and part-time jobs
  const legendItems: { id: string; name: string; color: string }[] = [
    ...employers.filter((e) => e.active).map((e) => ({ id: e.id, name: e.name, color: e.color })),
    ...partTimeJobs.filter((j) => j.active).map((j) => ({ id: j.id, name: j.name, color: j.color })),
  ];

  const selectedShifts = selectedDate ? shiftsByDate.get(selectedDate) || [] : [];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="glass-card w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="font-display font-semibold text-sm text-white">{monthLabel}</h4>
        <button
          onClick={nextMonth}
          className="glass-card w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center font-mono text-[10px] text-white/25 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="h-16 rounded-lg bg-white/[0.01]" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const shifts = shiftsByDate.get(dateStr) || [];
              const isToday =
                day === now.getDate() &&
                month === now.getMonth() &&
                year === now.getFullYear();
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-16 rounded-lg p-1 text-left transition-all ${
                    isSelected
                      ? "bg-blue-500/10 border border-blue-500/30"
                      : isToday
                      ? "bg-white/[0.04] border border-white/10"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]"
                  }`}
                >
                  <p
                    className={`font-mono text-[10px] ${
                      isToday ? "text-blue-400" : "text-white/40"
                    }`}
                  >
                    {day}
                  </p>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {shifts.map((shift, si) => (
                      <div
                        key={si}
                        className="rounded px-1 py-0.5"
                        style={{ backgroundColor: shift.color + "20" }}
                      >
                        <span
                          className="font-mono text-[8px]"
                          style={{ color: shift.color }}
                        >
                          {shift.hours}h
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected date details */}
      <AnimatePresence>
        {selectedDate && selectedShifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-4 space-y-2 overflow-hidden"
          >
            <p className="font-mono text-xs text-white/40">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selectedShifts.map((shift, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: shift.color }}
                  />
                  <span className="font-body text-sm text-white">{shift.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {shift.start && shift.end && (
                    <span className="font-mono text-xs text-white/40">
                      {shift.start} – {shift.end}
                    </span>
                  )}
                  <span className="font-mono text-sm text-white">{shift.hours}h</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
        {selectedDate && selectedShifts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-4"
          >
            <p className="font-body text-sm text-white/30 text-center">No shifts on this day</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      {legendItems.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {legendItems.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-mono text-[10px] text-white/30">{item.name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
