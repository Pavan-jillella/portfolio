"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { EnhancedWorkSchedule, Employer } from "@/types";
import { buildScheduleTree } from "@/lib/payroll-utils";
import { formatCurrency } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleFileManagerProps {
  schedules: EnhancedWorkSchedule[];
  employers: Employer[];
  onDelete?: (id: string) => void;
}

export function ScheduleFileManager({ schedules, employers, onDelete }: ScheduleFileManagerProps) {
  const employerMap = useMemo(() => new Map(employers.map((e) => [e.id, e])), [employers]);
  const tree = useMemo(() => buildScheduleTree(schedules), [schedules]);

  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<{ year: string; month: string } | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [detailSchedule, setDetailSchedule] = useState<EnhancedWorkSchedule | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; scheduleId: string } | null>(null);
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const contextRef = useRef<HTMLDivElement>(null);

  // Auto-expand current year
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    if (tree.has(currentYear)) {
      setExpandedYears(new Set([currentYear]));
    } else if (tree.size > 0) {
      setExpandedYears(new Set([Array.from(tree.keys())[0]]));
    }
  }, [tree]);

  // Click-away closes context menu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    }
    if (contextMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [contextMenu]);

  function toggleYear(year: string) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function selectFolder(year: string, month: string) {
    setSelectedFolder({ year, month });
    setSelectedScheduleId(null);
    setMobileTreeOpen(false);
  }

  // Get visible schedules based on selected folder
  const visibleSchedules = useMemo(() => {
    if (!selectedFolder) {
      // Show all schedules sorted by date desc
      return [...schedules].sort((a, b) => b.start_date.localeCompare(a.start_date));
    }
    const yearMap = tree.get(selectedFolder.year);
    if (!yearMap) return [];
    return yearMap.get(selectedFolder.month) || [];
  }, [selectedFolder, tree, schedules]);

  function handleContextMenu(e: React.MouseEvent, scheduleId: string) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, scheduleId });
  }

  function handleDeleteFromContext() {
    if (contextMenu && onDelete) {
      onDelete(contextMenu.scheduleId);
    }
    setContextMenu(null);
  }

  const years = Array.from(tree.keys()).sort((a, b) => b.localeCompare(a));

  if (schedules.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-body text-white/30">No schedules imported yet. Use the Schedule tab to import work schedules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-lg text-white">Schedule Files</h3>

      {/* Mobile tree toggle */}
      <button
        onClick={() => setMobileTreeOpen(!mobileTreeOpen)}
        className="lg:hidden glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all w-full text-left"
      >
        {selectedFolder ? `${selectedFolder.year} / ${selectedFolder.month}` : "All Schedules"} ▾
      </button>

      <div className="flex gap-4">
        {/* Left panel — folder tree */}
        <div className={`${mobileTreeOpen ? "block" : "hidden"} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="glass-card rounded-2xl p-3 space-y-1 max-h-[500px] overflow-y-auto">
            {/* All files */}
            <button
              onClick={() => { setSelectedFolder(null); setMobileTreeOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-body transition-all ${
                !selectedFolder ? "bg-blue-500/10 text-blue-400" : "text-white/50 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              All Schedules
            </button>

            {years.map((year) => {
              const yearMap = tree.get(year)!;
              const isExpanded = expandedYears.has(year);
              const months = Array.from(yearMap.keys());

              return (
                <div key={year}>
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white hover:bg-white/[0.03] transition-all flex items-center gap-2"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      fill="currentColor" viewBox="0 0 24 24"
                    >
                      <path d="M9 5l7 7-7 7z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-500/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                    </svg>
                    {year}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        {months.map((month) => {
                          const count = yearMap.get(month)?.length || 0;
                          const isSelected = selectedFolder?.year === year && selectedFolder?.month === month;
                          return (
                            <button
                              key={month}
                              onClick={() => selectFolder(year, month)}
                              className={`w-full text-left pl-10 pr-3 py-1.5 rounded-xl text-sm font-body transition-all flex items-center justify-between ${
                                isSelected
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-yellow-500/40" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                                </svg>
                                {month}
                              </span>
                              <span className="font-mono text-[10px] text-white/20">{count}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel — file grid */}
        <div className="flex-1 min-w-0">
          {visibleSchedules.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="font-body text-sm text-white/30">No schedules in this folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {visibleSchedules.map((schedule) => {
                const emp = employerMap.get(schedule.employer_id);
                const isSelected = selectedScheduleId === schedule.id;

                return (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`glass-card rounded-2xl p-4 cursor-pointer transition-all ${
                      isSelected ? "border-blue-500/30 bg-blue-500/[0.03]" : "hover:bg-white/[0.02]"
                    }`}
                    onClick={() => setSelectedScheduleId(isSelected ? null : schedule.id)}
                    onDoubleClick={() => setDetailSchedule(schedule)}
                    onContextMenu={(e) => handleContextMenu(e, schedule.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* File icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-8 h-8 text-blue-400/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <path d="M3 10h18" />
                          <path d="M8 4v6" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-white truncate">{schedule.period_label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {emp && (
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ backgroundColor: emp.color }}
                            />
                          )}
                          <span className="font-body text-xs text-white/40 truncate">
                            {emp?.name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-mono text-xs text-white/30">
                            {schedule.total_hours.toFixed(1)}h
                          </span>
                          <span className="font-mono text-xs text-emerald-400/60">
                            {formatCurrency(schedule.gross_amount)}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-white/20 mt-1">
                          {schedule.start_date} — {schedule.end_date}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          ref={contextRef}
          className="fixed z-50 glass-card rounded-xl py-1 min-w-[140px] shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {onDelete && (
            <button
              onClick={handleDeleteFromContext}
              className="w-full text-left px-4 py-2 text-sm font-body text-red-400 hover:bg-white/5 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Detail overlay */}
      <AnimatePresence>
        {detailSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailSchedule(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-3xl p-8 w-full max-w-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button onClick={() => setDetailSchedule(null)} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <h3 className="font-display font-semibold text-lg text-white mb-1">{detailSchedule.period_label}</h3>
              {(() => {
                const emp = employerMap.get(detailSchedule.employer_id);
                return emp ? (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emp.color }} />
                    <span className="font-body text-sm text-white/50">{emp.name}</span>
                  </div>
                ) : null;
              })()}

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="font-mono text-[10px] text-white/30 uppercase">Total Hours</p>
                  <p className="font-mono text-lg text-white">{detailSchedule.total_hours.toFixed(1)}</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="font-mono text-[10px] text-white/30 uppercase">Gross</p>
                  <p className="font-mono text-lg text-emerald-400">{formatCurrency(detailSchedule.gross_amount)}</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="font-mono text-[10px] text-white/30 uppercase">Shifts</p>
                  <p className="font-mono text-lg text-white">{detailSchedule.shifts.filter((s) => s.hours > 0).length}</p>
                </div>
              </div>

              {/* Shifts table */}
              <div className="space-y-2">
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Shifts</p>
                <div className="space-y-1">
                  {detailSchedule.shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`flex items-center justify-between px-4 py-2 rounded-xl ${
                        shift.hours > 0 ? "bg-white/[0.03]" : "opacity-30"
                      } ${shift.is_holiday ? "border border-amber-500/20" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/30 w-8">{shift.day.slice(0, 3)}</span>
                        <span className="font-body text-sm text-white/60">{shift.date}</span>
                        {shift.is_holiday && (
                          <span className="text-[10px] font-mono text-amber-400/60 bg-amber-500/10 px-1.5 py-0.5 rounded">Holiday</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-white/40">
                          {shift.hours > 0 ? `${shift.start_time} — ${shift.end_time}` : "OFF"}
                        </span>
                        <span className="font-mono text-sm text-white/60 w-12 text-right">
                          {shift.hours > 0 ? `${shift.hours.toFixed(1)}h` : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
