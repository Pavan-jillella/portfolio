"use client";
import { useState } from "react";
import { WorkSchedule, ScheduleShift, EnhancedWorkSchedule, EnhancedShift, PayrollSettings, AppsScriptData } from "@/types";
import { parseScheduleSheet, generateId, formatCurrency } from "@/lib/finance-utils";
import { appsScriptToShifts } from "@/lib/payroll-utils";
import { motion } from "framer-motion";

interface ScheduleImportProps {
  schedules: WorkSchedule[];
  settings: PayrollSettings;
  onAddSchedule: (schedule: WorkSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onCreatePayStub: (totalHours: number, periodLabel: string) => void;
  onAddEnhancedSchedule?: (schedule: EnhancedWorkSchedule) => void;
}

export function ScheduleImport({
  schedules,
  settings,
  onAddSchedule,
  onDeleteSchedule,
  onCreatePayStub,
  onAddEnhancedSchedule,
}: ScheduleImportProps) {
  const [url, setUrl] = useState(settings.google_sheets_url);
  const [periodLabel, setPeriodLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ScheduleShift[] | null>(null);
  const [appsData, setAppsData] = useState<AppsScriptData | null>(null);
  const [mode, setMode] = useState<"apps-script" | "paste">("apps-script");
  const [pasteText, setPasteText] = useState("");

  const inputCls =
    "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";

  async function handleSync() {
    if (!url) return;
    setLoading(true);
    setError("");
    setPreview(null);
    setAppsData(null);

    try {
      const res = await fetch("/api/finance/payroll-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to fetch");
        return;
      }

      if (result.type === "apps-script") {
        const data = result.data as AppsScriptData;
        setAppsData(data);

        if (data.current && data.current.length > 0) {
          setPreview(appsScriptToShifts(data.current));
        }
      } else if (result.type === "csv") {
        const name = settings.schedule_name || "Pavan";
        const shifts = parseScheduleSheet(result.csv, name);
        if (shifts.length === 0) {
          setError(
            `Could not find "${name}" in the spreadsheet. Check your name in Settings.`
          );
          return;
        }
        setPreview(shifts);
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleParsePaste() {
    if (!pasteText.trim()) return;
    setError("");
    setPreview(null);

    const name = settings.schedule_name || "Pavan";
    // Convert tabs to commas for the CSV parser
    const normalized = pasteText
      .split("\n")
      .map((line) =>
        line.includes("\t")
          ? line
              .split("\t")
              .map((cell) => `"${cell.replace(/"/g, '""')}"`)
              .join(",")
          : line
      )
      .join("\n");

    const shifts = parseScheduleSheet(normalized, name);
    if (shifts.length === 0) {
      setError(
        `Could not find "${name}" in the pasted data. Make sure it contains the schedule grid with your name.`
      );
      return;
    }
    setPreview(shifts);
  }

  function handleSaveSchedule() {
    if (!preview) return;
    const totalHours = preview.reduce((s, sh) => s + sh.hours, 0);
    const label =
      periodLabel ||
      (appsData?.payPeriod?.period?.label
        ? `Week of ${appsData.payPeriod.period.label}`
        : "Imported Schedule");

    // Check for duplicate
    const existing = schedules.find((s) => s.period_label === label);
    if (existing) {
      onDeleteSchedule(existing.id);
    }

    const scheduleId = generateId();

    const schedule: WorkSchedule = {
      id: scheduleId,
      period_label: label,
      period_start: "",
      period_end: "",
      shifts: preview,
      total_hours: totalHours,
      hourly_rate: settings.hourly_rate,
      created_at: new Date().toISOString(),
    };
    onAddSchedule(schedule);

    // Also create an EnhancedWorkSchedule so Dashboard, Calendar, Files, and Forecast can read it
    if (onAddEnhancedSchedule) {
      const today = new Date().toISOString().slice(0, 10);
      const enhancedShifts: EnhancedShift[] = preview.map((shift, i) => ({
        id: generateId(),
        schedule_id: scheduleId,
        date: today,
        day: shift.day,
        start_time: shift.start_time,
        end_time: shift.end_time,
        hours: shift.hours,
        is_holiday: false,
      }));

      const enhanced: EnhancedWorkSchedule = {
        id: generateId(),
        employer_id: settings.default_employer || "",
        period_label: label,
        start_date: today,
        end_date: today,
        shifts: enhancedShifts,
        total_hours: totalHours,
        gross_amount: parseFloat((totalHours * settings.hourly_rate).toFixed(2)),
        created_at: new Date().toISOString(),
      };
      onAddEnhancedSchedule(enhanced);
    }

    setPreview(null);
    setPeriodLabel("");
  }

  function handleImportHistory() {
    if (!appsData?.history) return;
    let imported = 0;
    const existingLabels = new Set(schedules.map((s) => s.period_label));

    for (const week of appsData.history) {
      const label = week.prettyLabel || week.weekLabel;
      if (existingLabels.has(label)) continue;

      const scheduleId = generateId();
      const schedule: WorkSchedule = {
        id: scheduleId,
        period_label: label,
        period_start: "",
        period_end: "",
        shifts: [],
        total_hours: week.totalHours,
        hourly_rate: settings.hourly_rate,
        created_at: new Date().toISOString(),
      };
      onAddSchedule(schedule);

      // Also create enhanced schedule
      if (onAddEnhancedSchedule) {
        const today = new Date().toISOString().slice(0, 10);
        const enhanced: EnhancedWorkSchedule = {
          id: generateId(),
          employer_id: settings.default_employer || "",
          period_label: label,
          start_date: today,
          end_date: today,
          shifts: [],
          total_hours: week.totalHours,
          gross_amount: parseFloat((week.totalHours * settings.hourly_rate).toFixed(2)),
          created_at: new Date().toISOString(),
        };
        onAddEnhancedSchedule(enhanced);
      }

      existingLabels.add(label);
      imported++;
    }
    setError(imported > 0 ? "" : "All history weeks already imported.");
  }

  const previewTotal = preview
    ? preview.reduce((s, sh) => s + sh.hours, 0)
    : 0;
  const previewGross = previewTotal * settings.hourly_rate;
  const sortedSchedules = [...schedules].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        {(["apps-script", "paste"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError("");
              setPreview(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              mode === m
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-white/5 text-white/40 border border-white/5 hover:text-white/60"
            }`}
          >
            {m === "apps-script" ? "Sync from Apps Script" : "Paste Schedule"}
          </button>
        ))}
      </div>

      {/* Import section */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        {mode === "apps-script" ? (
          <>
            <h3 className="font-display font-semibold text-lg text-white">
              Sync from Apps Script
            </h3>
            <p className="font-body text-sm text-white/40">
              Paste your deployed Apps Script Web App URL. This fetches your
              current schedule, full history, and pay period data in one click.
            </p>

            <div>
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Web App URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={handleSync}
                  disabled={loading || !url}
                  className="glass-card px-5 py-3 rounded-2xl text-sm font-body text-blue-300 hover:border-blue-500/30 transition-all disabled:opacity-30 whitespace-nowrap"
                >
                  {loading ? "Syncing..." : "Sync All"}
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Period Label (optional)
              </label>
              <input
                type="text"
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                placeholder="e.g. Feb 23 - Mar 1"
                className={inputCls}
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="font-display font-semibold text-lg text-white">
              Paste Schedule
            </h3>
            <p className="font-body text-sm text-white/40">
              Open the schedule spreadsheet in your browser, select all
              (Ctrl+A), copy (Ctrl+C), then paste below. We&apos;ll find{" "}
              <span className="text-blue-400">
                {settings.schedule_name || "your name"}
              </span>
              &apos;s row.
            </p>

            <div>
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Period Label
              </label>
              <input
                type="text"
                value={periodLabel}
                onChange={(e) => setPeriodLabel(e.target.value)}
                placeholder="e.g. Feb 23 - Mar 1"
                className={inputCls}
              />
            </div>

            <div>
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block">
                Spreadsheet Data
              </label>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste spreadsheet data here (Ctrl+V)..."
                rows={6}
                className={`${inputCls} resize-y font-mono text-xs`}
              />
            </div>

            <button
              onClick={handleParsePaste}
              disabled={!pasteText.trim()}
              className="glass-card px-5 py-3 rounded-2xl text-sm font-body text-blue-300 hover:border-blue-500/30 transition-all disabled:opacity-30"
            >
              Parse Schedule
            </button>
          </>
        )}

        {error && (
          <p className="font-body text-sm text-yellow-400/80">{error}</p>
        )}
      </div>

      {/* Apps Script data overview */}
      {appsData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-white">
              Synced Data
            </h4>
            <p className="font-mono text-[10px] text-white/25">
              Updated{" "}
              {new Date(appsData.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.03] rounded-xl p-3 text-center">
              <p className="font-mono text-[10px] text-white/25 uppercase">
                Current Week
              </p>
              <p className="font-mono text-lg text-white">
                {appsData.current.reduce((s, c) => s + c.hours, 0).toFixed(1)}h
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3 text-center">
              <p className="font-mono text-[10px] text-white/25 uppercase">
                History Weeks
              </p>
              <p className="font-mono text-lg text-white">
                {appsData.history.length}
              </p>
            </div>
            {appsData.payPeriod && (
              <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                <p className="font-mono text-[10px] text-white/25 uppercase">
                  Pay Period
                </p>
                <p className="font-mono text-lg text-emerald-400">
                  ${appsData.payPeriod.pay.toFixed(0)}
                </p>
              </div>
            )}
          </div>

          {appsData.history.length > 0 && (
            <button
              onClick={handleImportHistory}
              className="glass-card px-4 py-2 rounded-xl text-sm font-body text-purple-400 hover:border-purple-500/30 transition-all"
            >
              Import All {appsData.history.length} History Weeks
            </button>
          )}
        </motion.div>
      )}

      {/* Preview current week */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-white">
              {settings.schedule_name || "Schedule"}&apos;s Schedule
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
                <p className="font-mono text-[10px] text-white/25 uppercase">
                  Total Hours
                </p>
                <p className="font-mono text-lg text-white">{previewTotal}h</p>
              </div>
              {settings.hourly_rate > 0 && (
                <div>
                  <p className="font-mono text-[10px] text-white/25 uppercase">
                    Est. Gross
                  </p>
                  <p className="font-mono text-lg text-emerald-400">
                    {formatCurrency(previewGross)}
                  </p>
                </div>
              )}
            </div>
            {settings.hourly_rate > 0 && (
              <button
                onClick={() => {
                  handleSaveSchedule();
                  onCreatePayStub(
                    previewTotal,
                    periodLabel || "Imported Schedule"
                  );
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
          <h3 className="font-display font-semibold text-lg text-white">
            Saved Schedules ({sortedSchedules.length})
          </h3>
          {sortedSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="glass-card rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-white">
                    {schedule.period_label}
                  </p>
                  <p className="font-mono text-xs text-white/30">
                    {new Date(schedule.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-xs text-white/30">Hours</p>
                    <p className="font-mono text-sm text-white">
                      {schedule.total_hours}h
                    </p>
                  </div>
                  {schedule.hourly_rate > 0 && (
                    <div className="text-right">
                      <p className="font-mono text-xs text-white/30">
                        Est. Gross
                      </p>
                      <p className="font-mono text-sm text-emerald-400">
                        {formatCurrency(
                          schedule.total_hours * schedule.hourly_rate
                        )}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => onDeleteSchedule(schedule.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      viewBox="0 0 24 24"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
              {schedule.shifts.length > 0 && (
                <ScheduleWeekView shifts={schedule.shifts} compact />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScheduleWeekView({
  shifts,
  compact,
}: {
  shifts: ScheduleShift[];
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {shifts.map((shift) => {
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
            <p
              className={`font-mono text-xs mb-1 ${
                hasShift ? "text-blue-400" : "text-white/20"
              }`}
            >
              {shift.day}
            </p>
            {hasShift ? (
              <>
                <p
                  className={`font-mono ${
                    compact ? "text-[10px]" : "text-xs"
                  } text-white/60`}
                >
                  {shift.start_time}–{shift.end_time}
                </p>
                <p
                  className={`font-mono ${
                    compact ? "text-xs" : "text-sm"
                  } text-white font-medium mt-0.5`}
                >
                  {shift.hours}h
                </p>
              </>
            ) : (
              <p
                className={`font-mono ${
                  compact ? "text-xs" : "text-sm"
                } text-white/15`}
              >
                Off
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
