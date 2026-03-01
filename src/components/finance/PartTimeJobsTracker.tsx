"use client";
import { useState, useMemo, useEffect } from "react";
import { PartTimeJob, PartTimeHourEntry } from "@/types";
import { generateId, getCurrentMonth, formatCurrency } from "@/lib/finance-utils";
import { getPartTimeJobEarnings } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface PartTimeJobsTrackerProps {
  jobs: PartTimeJob[];
  hours: PartTimeHourEntry[];
  onAddJob: (job: PartTimeJob) => void;
  onDeleteJob: (id: string) => void;
  onToggleJob: (id: string) => void;
  onAddHours: (entry: PartTimeHourEntry) => void;
  onDeleteHours: (id: string) => void;
}

const JOB_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6", "#eab308"];

export function PartTimeJobsTracker({
  jobs,
  hours,
  onAddJob,
  onDeleteJob,
  onToggleJob,
  onAddHours,
  onDeleteHours,
}: PartTimeJobsTrackerProps) {
  const [showAddJob, setShowAddJob] = useState(false);
  const [showLogHours, setShowLogHours] = useState(false);
  const [jobName, setJobName] = useState("");
  const [jobRate, setJobRate] = useState(0);
  const [logJobId, setLogJobId] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logHours, setLogHours] = useState(0);
  const [logNotes, setLogNotes] = useState("");
  const [logMode, setLogMode] = useState<"manual" | "time">("time");
  const [logStartTime, setLogStartTime] = useState("");
  const [logEndTime, setLogEndTime] = useState("");
  const [logBreakMinutes, setLogBreakMinutes] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [logView, setLogView] = useState<"list" | "table" | "grid">("table");

  // Auto-calculate hours from start/end times
  const calculatedHours = useMemo(() => {
    if (!logStartTime || !logEndTime) return 0;
    const [sh, sm] = logStartTime.split(":").map(Number);
    const [eh, em] = logEndTime.split(":").map(Number);
    let totalMinutes = (eh * 60 + em) - (sh * 60 + sm);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // overnight shift
    totalMinutes -= logBreakMinutes;
    return Math.max(0, parseFloat((totalMinutes / 60).toFixed(2)));
  }, [logStartTime, logEndTime, logBreakMinutes]);

  useEffect(() => {
    if (logMode === "time" && calculatedHours > 0) {
      setLogHours(calculatedHours);
    }
  }, [calculatedHours, logMode]);

  const monthEarnings = useMemo(
    () => getPartTimeJobEarnings(jobs, hours, selectedMonth),
    [jobs, hours, selectedMonth]
  );

  const totalMonthEarnings = monthEarnings.reduce((s, e) => s + e.earnings, 0);
  const totalMonthHours = monthEarnings.reduce((s, e) => s + e.totalHours, 0);

  // Recent hours log (last 20)
  const recentHours = useMemo(() => {
    return [...hours]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 20);
  }, [hours]);

  // Group recent hours by job
  const groupedByJob = useMemo(() => {
    const groups = new Map<string, { job: PartTimeJob; entries: PartTimeHourEntry[] }>();
    for (const entry of recentHours) {
      const job = jobs.find((j) => j.id === entry.job_id);
      if (!job) continue;
      if (!groups.has(job.id)) groups.set(job.id, { job, entries: [] });
      groups.get(job.id)!.entries.push(entry);
    }
    return Array.from(groups.values());
  }, [recentHours, jobs]);

  function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    if (!jobName || jobRate <= 0) return;
    const color = JOB_COLORS[jobs.length % JOB_COLORS.length];
    onAddJob({
      id: generateId(),
      name: jobName,
      hourly_rate: jobRate,
      color,
      active: true,
      created_at: new Date().toISOString(),
    });
    setJobName("");
    setJobRate(0);
    setShowAddJob(false);
  }

  function handleLogHours(e: React.FormEvent) {
    e.preventDefault();
    if (!logJobId || logHours <= 0) return;
    onAddHours({
      id: generateId(),
      job_id: logJobId,
      date: logDate,
      hours: logHours,
      notes: logNotes,
      ...(logMode === "time" && logStartTime && logEndTime
        ? { start_time: logStartTime, end_time: logEndTime }
        : {}),
      created_at: new Date().toISOString(),
    });
    setLogHours(0);
    setLogNotes("");
    setLogStartTime("");
    setLogEndTime("");
    setLogBreakMinutes(0);
    setShowLogHours(false);
  }

  function getJobById(id: string) {
    return jobs.find((j) => j.id === id);
  }

  const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";
  const labelCls = "font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-white">Part-Time Jobs</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLogHours(true)}
            className="glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            + Log Hours
          </button>
          <button
            onClick={() => setShowAddJob(true)}
            className="glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            + Add Job
          </button>
        </div>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-3">
        <label className="font-mono text-xs text-white/30">Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-1.5 font-mono text-sm focus:border-blue-500/50 transition-all"
        />
      </div>

      {/* Jobs list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const earnings = monthEarnings.find((e) => e.job.id === job.id);
          return (
            <div key={job.id} className={`glass-card rounded-2xl p-5 ${!job.active ? "opacity-40" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: job.color }} />
                  <span className="font-body text-sm text-white">{job.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleJob(job.id)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors"
                  >
                    {job.active ? "Active" : "Paused"}
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              <p className="font-mono text-xs text-white/30">${job.hourly_rate}/hr</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-xs text-white/30">{earnings?.totalHours || 0} hrs</span>
                <span className="font-mono text-sm text-emerald-400">{formatCurrency(earnings?.earnings || 0)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly totals */}
      {jobs.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-white/30">Monthly Total</p>
              <p className="font-mono text-sm text-white/60">{totalMonthHours} hours</p>
            </div>
            <p className="font-display font-bold text-xl text-emerald-400">{formatCurrency(totalMonthEarnings)}</p>
          </div>
        </div>
      )}

      {/* Recent hours log — grouped by job */}
      {recentHours.length > 0 && (
        <div className="space-y-4">
          {/* Header + view toggle */}
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-white">Recent Hours Log</h4>
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
              {(["list", "table", "grid"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setLogView(v)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all ${
                    logView === v ? "bg-white/10 text-blue-400" : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Per-job sections */}
          {groupedByJob.map(({ job, entries }) => {
            const jobTotal = entries.reduce((s, e) => s + e.hours, 0);
            const jobEarnings = jobTotal * job.hourly_rate;

            return (
              <div key={job.id} className="glass-card rounded-2xl p-5">
                {/* Job header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: job.color }} />
                    <span className="font-body text-sm font-medium text-white">{job.name}</span>
                    <span className="font-mono text-[10px] text-white/20">${job.hourly_rate}/hr</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/40">{jobTotal}h</span>
                    <span className="font-mono text-xs text-emerald-400">{formatCurrency(jobEarnings)}</span>
                  </div>
                </div>

                {/* List view */}
                {logView === "list" && (
                  <div className="space-y-1">
                    {entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/40">{entry.date}</span>
                          {entry.start_time && entry.end_time && (
                            <span className="font-mono text-[10px] text-white/25">{entry.start_time}–{entry.end_time}</span>
                          )}
                          {entry.notes && <span className="font-body text-xs text-white/20 truncate max-w-[150px]">— {entry.notes}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/50">{entry.hours}h</span>
                          <span className="font-mono text-xs text-emerald-400/70">{formatCurrency(entry.hours * job.hourly_rate)}</span>
                          <button onClick={() => onDeleteHours(entry.id)} className="text-white/15 hover:text-red-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table view */}
                {logView === "table" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="pb-2 font-mono text-[10px] text-white/30 uppercase tracking-widest">Date</th>
                          <th className="pb-2 font-mono text-[10px] text-white/30 uppercase tracking-widest hidden sm:table-cell">Start</th>
                          <th className="pb-2 font-mono text-[10px] text-white/30 uppercase tracking-widest hidden sm:table-cell">End</th>
                          <th className="pb-2 font-mono text-[10px] text-white/30 uppercase tracking-widest text-right">Hours</th>
                          <th className="pb-2 font-mono text-[10px] text-white/30 uppercase tracking-widest text-right">Earnings</th>
                          <th className="pb-2 font-mono text-[10px] text-white/30 uppercase tracking-widest hidden sm:table-cell">Notes</th>
                          <th className="pb-2 w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((entry) => (
                          <tr key={entry.id} className="border-b border-white/[0.03] last:border-0">
                            <td className="py-2 pr-3 font-mono text-xs text-white/40">{entry.date}</td>
                            <td className="py-2 pr-3 font-mono text-xs text-white/40 hidden sm:table-cell">{entry.start_time || "—"}</td>
                            <td className="py-2 pr-3 font-mono text-xs text-white/40 hidden sm:table-cell">{entry.end_time || "—"}</td>
                            <td className="py-2 pr-3 font-mono text-xs text-white/50 text-right">{entry.hours}h</td>
                            <td className="py-2 pr-3 font-mono text-xs text-emerald-400/70 text-right">{formatCurrency(entry.hours * job.hourly_rate)}</td>
                            <td className="py-2 pr-3 font-body text-xs text-white/20 truncate max-w-[120px] hidden sm:table-cell">{entry.notes || "—"}</td>
                            <td className="py-2">
                              <button onClick={() => onDeleteHours(entry.id)} className="text-white/15 hover:text-red-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Grid view */}
                {logView === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {entries.map((entry) => (
                      <div key={entry.id} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-white/50">{entry.date}</span>
                          <button onClick={() => onDeleteHours(entry.id)} className="text-white/10 group-hover:text-white/30 hover:!text-red-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        </div>
                        {entry.start_time && entry.end_time && (
                          <p className="font-mono text-[10px] text-white/25 mb-1">{entry.start_time} – {entry.end_time}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-bold text-white">{entry.hours}h</span>
                          <span className="font-mono text-sm text-emerald-400">{formatCurrency(entry.hours * job.hourly_rate)}</span>
                        </div>
                        {entry.notes && <p className="font-body text-[10px] text-white/20 mt-1 truncate">{entry.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Job Modal */}
      <AnimatePresence>
        {showAddJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddJob(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-8 w-full max-w-sm relative"
            >
              <h3 className="font-display font-semibold text-lg text-white mb-6">Add Part-Time Job</h3>
              <form onSubmit={handleAddJob} className="space-y-4">
                <div>
                  <label className={labelCls}>Job Name</label>
                  <input type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} className={inputCls} required placeholder="e.g. Campus Library" />
                </div>
                <div>
                  <label className={labelCls}>Hourly Rate ($)</label>
                  <input type="number" step="0.25" min="0.01" value={jobRate || ""} onChange={(e) => setJobRate(parseFloat(e.target.value) || 0)} className={inputCls} required />
                </div>
                <button type="submit" className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-blue-300 hover:border-blue-500/30 transition-all">
                  Add Job →
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Hours Modal */}
      <AnimatePresence>
        {showLogHours && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogHours(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-8 w-full max-w-sm relative"
            >
              <h3 className="font-display font-semibold text-lg text-white mb-6">Log Hours</h3>
              <form onSubmit={handleLogHours} className="space-y-4">
                <div>
                  <label className={labelCls}>Job</label>
                  <select
                    value={logJobId}
                    onChange={(e) => setLogJobId(e.target.value)}
                    className={inputCls}
                    required
                  >
                    <option value="" className="bg-charcoal-950">Select a job...</option>
                    {jobs.filter((j) => j.active).map((j) => (
                      <option key={j.id} value={j.id} className="bg-charcoal-950">{j.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} className={inputCls} required />
                </div>

                {/* Mode toggle */}
                <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLogMode("time")}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                      logMode === "time" ? "bg-white/10 text-blue-400" : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    Start / End
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogMode("manual")}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                      logMode === "manual" ? "bg-white/10 text-blue-400" : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    Manual
                  </button>
                </div>

                {logMode === "time" ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Start Time</label>
                        <input type="time" value={logStartTime} onChange={(e) => setLogStartTime(e.target.value)} className={inputCls} required />
                      </div>
                      <div>
                        <label className={labelCls}>End Time</label>
                        <input type="time" value={logEndTime} onChange={(e) => setLogEndTime(e.target.value)} className={inputCls} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Break (minutes)</label>
                      <input type="number" step="5" min="0" value={logBreakMinutes || ""} onChange={(e) => setLogBreakMinutes(parseInt(e.target.value) || 0)} className={inputCls} placeholder="0" />
                    </div>
                    {calculatedHours > 0 && (
                      <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                        <span className="font-body text-sm text-white/40">Calculated Hours</span>
                        <span className="font-mono text-lg font-bold text-white">{calculatedHours}h</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <label className={labelCls}>Hours</label>
                    <input type="number" step="0.25" min="0.25" value={logHours || ""} onChange={(e) => setLogHours(parseFloat(e.target.value) || 0)} className={inputCls} required />
                  </div>
                )}

                {/* Estimated earnings preview */}
                {logHours > 0 && logJobId && (() => {
                  const selectedJob = jobs.find((j) => j.id === logJobId);
                  if (!selectedJob) return null;
                  return (
                    <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                      <span className="font-body text-sm text-white/40">Est. Earnings</span>
                      <span className="font-mono text-lg font-bold text-emerald-400">{formatCurrency(logHours * selectedJob.hourly_rate)}</span>
                    </div>
                  );
                })()}

                <div>
                  <label className={labelCls}>Notes (optional)</label>
                  <input type="text" value={logNotes} onChange={(e) => setLogNotes(e.target.value)} className={inputCls} placeholder="e.g. Evening shift" />
                </div>
                <button type="submit" className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-blue-300 hover:border-blue-500/30 transition-all">
                  Log Hours →
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
