"use client";
import { useState } from "react";
import { WorkSchedule, ScheduleShift, PayrollSettings } from "@/types";
import { parseScheduleSheet, generateId, formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface ScheduleImportProps {
  schedules: WorkSchedule[];
  settings: PayrollSettings;
  onAddSchedule: (schedule: WorkSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onCreatePayStub: (totalHours: number, periodLabel: string) => void;
}

export function ScheduleImport({
  schedules,
  settings,
  onAddSchedule,
  onDeleteSchedule,
  onCreatePayStub,
}: ScheduleImportProps) {
  const [url, setUrl] = useState(settings.google_sheets_url);
  const [periodLabel, setPeriodLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ScheduleShift[] | null>(null);

  const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";

  async function handleFetch() {
    if (!url) return;
    if (!settings.schedule_name) {
      setError("Set your name in Payroll Settings first.");
      return;
    }
    setLoading(true);
    setError("");
    setPreview(null);

    try {
      const res = await fetch("/api/finance/payroll-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        return;
      }

      const shifts = parseScheduleSheet(data.csv, settings.schedule_name);
      if (shifts.length === 0) {
        setError(`Could not find "${settings.schedule_name}" in the spreadsheet. Check your name in Settings.`);
        return;
      }

      setPreview(shifts);
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveSchedule() {
    if (!preview) return;
    const totalHours = preview.reduce((s, sh) => s + sh.hours, 0);
    const schedule: WorkSchedule = {
      id: generateId(),
      period_label: periodLabel || "Imported Schedule",
      period_start: "",
      period_end: "",
      shifts: preview,
      total_hours: totalHours,
      hourly_rate: settings.hourly_rate,
      created_at: new Date().toISOString(),
    };
    onAddSchedule(schedule);
    setPreview(null);
    setPeriodLabel("");
  }

  const previewTotal = preview ? preview.reduce((s, sh) => s + sh.hours, 0) : 0;
  const previewGross = previewTotal * settings.hourly_rate;
  const sortedSchedules = [...schedules].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div className="space-y-6">
      {/* Import section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-semibold text-lg text-white">Import Work Schedule</h3>
        <p className="font-body text-sm text-white/40">
          Paste the Google Sheets URL for your schedule. We&apos;ll find <span className="text-blue-400">{settings.schedule_name || "your name"}</span>&apos;s row and extract hours.
        </p>

        <div>
          <label className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block">Period Label</label>
          <input
            type="text"
            value={periodLabel}
            onChange={(e) => setPeriodLabel(e.target.value)}
            placeholder="e.g. Feb 23 - Mar 1"
            className={inputCls}
          />
        </div>

        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className={`${inputCls} flex-1`}
          />
          <button
            onClick={handleFetch}
            disabled={loading || !url}
            className="glass-card px-5 py-3 rounded-2xl text-sm font-body text-blue-300 hover:border-blue-500/30 transition-all disabled:opacity-30"
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {error && <p className="font-body text-sm text-yellow-400/80">{error}</p>}
      </div>

      {/* Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-white">
              {settings.schedule_name}&apos;s Schedule
            </h4>
            <button
              onClick={handleSaveSchedule}
              className="glass-card px-4 py-2 rounded-xl text-sm font-body text-emerald-400 hover:border-emerald-500/30 transition-all"
            >
              Save Schedule
            </button>
          </div>

          <ScheduleWeekView shifts={preview} />

          {/* Summary */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-mono text-[10px] text-white/25 uppercase">Total Hours</p>
                <p className="font-mono text-lg text-white">{previewTotal}h</p>
              </div>
              {settings.hourly_rate > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-white/25 uppercase">Est. Gross</p>
                  <p className="font-mono text-lg text-emerald-400">{formatCurrency(previewGross)}</p>
                </div>
              )}
            </div>
            {settings.hourly_rate > 0 && (
              <button
                onClick={() => {
                  handleSaveSchedule();
                  onCreatePayStub(previewTotal, periodLabel || "Imported Schedule");
                }}
                className="glass-card px-4 py-2 rounded-xl text-sm font-body text-blue-400 hover:border-blue-500/30 transition-all"
              >
                Create Pay Stub
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Saved schedules */}
      {sortedSchedules.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-lg text-white">Saved Schedules</h3>
          {sortedSchedules.map((schedule) => (
            <div key={schedule.id} className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-white">{schedule.period_label}</p>
                  <p className="font-mono text-xs text-white/30">
                    {new Date(schedule.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-xs text-white/30">Hours</p>
                    <p className="font-mono text-sm text-white">{schedule.total_hours}h</p>
                  </div>
                  {schedule.hourly_rate > 0 && (
                    <div className="text-right">
                      <p className="font-mono text-xs text-white/30">Est. Gross</p>
                      <p className="font-mono text-sm text-emerald-400">
                        {formatCurrency(schedule.total_hours * schedule.hourly_rate)}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => onDeleteSchedule(schedule.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              <ScheduleWeekView shifts={schedule.shifts} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScheduleWeekView({ shifts, compact }: { shifts: ScheduleShift[]; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-7 gap-2 ${compact ? "" : ""}`}>
      {shifts.map((shift, i) => {
        const hasShift = shift.hours > 0;
        return (
          <div
            key={shift.day}
            className={`rounded-xl p-3 text-center ${
              hasShift
                ? "bg-blue-500/10 border border-blue-500/20"
                : "bg-white/[0.02] border border-white/5"
            }`}
          >
            <p className={`font-mono text-xs mb-1 ${hasShift ? "text-blue-400" : "text-white/20"}`}>
              {shift.day}
            </p>
            {hasShift ? (
              <>
                <p className={`font-mono ${compact ? "text-[10px]" : "text-xs"} text-white/60`}>
                  {shift.start_time}–{shift.end_time}
                </p>
                <p className={`font-mono ${compact ? "text-xs" : "text-sm"} text-white font-medium mt-0.5`}>
                  {shift.hours}h
                </p>
              </>
            ) : (
              <p className={`font-mono ${compact ? "text-xs" : "text-sm"} text-white/15`}>Off</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
