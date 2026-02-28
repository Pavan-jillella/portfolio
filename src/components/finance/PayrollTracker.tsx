"use client";
import { useState, useMemo, useCallback } from "react";
import {
  PayStub,
  PartTimeJob,
  PartTimeHourEntry,
  PayrollSettings,
  WorkSchedule,
  Employer,
  EnhancedWorkSchedule,
  EnhancedPayrollSettings,
  AppsScriptData,
} from "@/types";
import { getPayrollSummary, generateId, parseGoogleSheetsCSV } from "@/lib/finance-utils";
import { PayStubList } from "./PayStubList";
import { PayStubForm } from "./PayStubForm";
import { GoogleSheetsImport } from "./GoogleSheetsImport";
import { PartTimeJobsTracker } from "./PartTimeJobsTracker";
import { PayrollSettingsPanel } from "./PayrollSettingsPanel";
import { ScheduleImport } from "./ScheduleImport";
import { EmployerManager } from "./EmployerManager";
import { PayrollDashboard } from "./PayrollDashboard";
import { ShiftCalendar } from "./ShiftCalendar";
import { ShiftConflictAlert } from "./ShiftConflictAlert";
import { ScheduleFileManager } from "./ScheduleFileManager";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { detectShiftConflicts, appsScriptToShifts, formatRelativeTime } from "@/lib/payroll-utils";
import { useAutoSync } from "@/hooks/useAutoSync";
import { motion } from "framer-motion";

interface PayrollTrackerProps {
  payStubs: PayStub[];
  partTimeJobs: PartTimeJob[];
  partTimeHours: PartTimeHourEntry[];
  workSchedules: WorkSchedule[];
  settings: PayrollSettings;
  onAddPayStub: (stub: PayStub) => void;
  onEditPayStub: (id: string, stub: PayStub) => void;
  onDeletePayStub: (id: string) => void;
  onImportPayStubs: (stubs: PayStub[]) => void;
  onAddJob: (job: PartTimeJob) => void;
  onDeleteJob: (id: string) => void;
  onToggleJob: (id: string) => void;
  onAddHours: (entry: PartTimeHourEntry) => void;
  onDeleteHours: (id: string) => void;
  onAddSchedule: (schedule: WorkSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onUpdateSettings: (settings: PayrollSettings) => void;
  // New enhanced props
  employers?: Employer[];
  enhancedSchedules?: EnhancedWorkSchedule[];
  enhancedSettings?: EnhancedPayrollSettings;
  onAddEmployer?: (employer: Employer) => void;
  onUpdateEmployer?: (id: string, updates: Partial<Employer>) => void;
  onDeleteEmployer?: (id: string) => void;
  onAddEnhancedSchedule?: (schedule: EnhancedWorkSchedule) => void;
  onDeleteEnhancedSchedule?: (id: string) => void;
  onUpdateEnhancedSettings?: (updates: Partial<EnhancedPayrollSettings>) => void;
}

const subTabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "schedule", label: "Schedule" },
  { id: "files", label: "Files" },
  { id: "stubs", label: "Pay Stubs" },
  { id: "employers", label: "Employers" },
  { id: "jobs", label: "Part-Time Jobs" },
  { id: "calendar", label: "Calendar" },
  { id: "import", label: "CSV Import" },
  { id: "settings", label: "Settings" },
];

export function PayrollTracker({
  payStubs,
  partTimeJobs,
  partTimeHours,
  workSchedules,
  settings,
  onAddPayStub,
  onEditPayStub,
  onDeletePayStub,
  onImportPayStubs,
  onAddJob,
  onDeleteJob,
  onToggleJob,
  onAddHours,
  onDeleteHours,
  onAddSchedule,
  onDeleteSchedule,
  onUpdateSettings,
  employers = [],
  enhancedSchedules = [],
  enhancedSettings,
  onAddEmployer,
  onUpdateEmployer,
  onDeleteEmployer,
  onAddEnhancedSchedule,
  onDeleteEnhancedSchedule,
  onUpdateEnhancedSettings,
}: PayrollTrackerProps) {
  const [activeSubTab, setActiveSubTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingStub, setEditingStub] = useState<PayStub | null>(null);
  const [prefillHours, setPrefillHours] = useState(0);

  const summary = useMemo(() => getPayrollSummary(payStubs), [payStubs]);

  const conflicts = useMemo(
    () => detectShiftConflicts(enhancedSchedules, employers),
    [enhancedSchedules, employers]
  );

  // Auto-sync callbacks
  const handleAutoSyncSchedule = useCallback((data: AppsScriptData) => {
    if (!data.current || data.current.length === 0) return;
    const shifts = appsScriptToShifts(data.current);
    const totalHours = shifts.reduce((s, sh) => s + sh.hours, 0);
    const label = data.payPeriod?.period?.label
      ? `Week of ${data.payPeriod.period.label}`
      : "Auto-Synced Schedule";

    const existing = workSchedules.find((s) => s.period_label === label);
    if (!existing) {
      onAddSchedule({
        id: generateId(),
        period_label: label,
        period_start: "",
        period_end: "",
        shifts,
        total_hours: totalHours,
        hourly_rate: settings.hourly_rate,
        created_at: new Date().toISOString(),
      });
    }

    // Auto-import history weeks
    if (data.history) {
      const existingLabels = new Set(workSchedules.map((s) => s.period_label));
      for (const week of data.history) {
        const wLabel = week.prettyLabel || week.weekLabel;
        if (existingLabels.has(wLabel)) continue;
        onAddSchedule({
          id: generateId(),
          period_label: wLabel,
          period_start: "",
          period_end: "",
          shifts: [],
          total_hours: week.totalHours,
          hourly_rate: settings.hourly_rate,
          created_at: new Date().toISOString(),
        });
        existingLabels.add(wLabel);
      }
    }
  }, [workSchedules, settings.hourly_rate, onAddSchedule]);

  const handleAutoSyncPayStubs = useCallback((csv: string) => {
    const parsed = parseGoogleSheetsCSV(csv);
    const existingKeys = new Set(
      payStubs.map((s) => `${s.pay_date}|${s.gross_pay}`)
    );
    const newStubs: PayStub[] = parsed
      .filter((p) => p.pay_date && p.gross_pay && !existingKeys.has(`${p.pay_date}|${p.gross_pay}`))
      .map((p) => ({
        id: generateId(),
        employer_name: p.employer_name || settings.default_employer,
        pay_period_start: p.pay_period_start || "",
        pay_period_end: p.pay_period_end || "",
        pay_date: p.pay_date || "",
        regular_hours: p.regular_hours || 0,
        overtime_hours: p.overtime_hours || 0,
        hourly_rate: p.hourly_rate || settings.hourly_rate,
        gross_pay: p.gross_pay || 0,
        deductions: p.deductions || {
          federal_tax: 0, state_tax: 0, social_security: 0,
          medicare: 0, other_deductions: 0, other_deductions_label: "",
        },
        net_pay: p.net_pay || 0,
        source: "google-sheets" as const,
        created_at: new Date().toISOString(),
      }));
    if (newStubs.length > 0) {
      onImportPayStubs(newStubs);
    }
  }, [payStubs, settings.default_employer, settings.hourly_rate, onImportPayStubs]);

  const handleSyncComplete = useCallback((timestamp: string) => {
    onUpdateEnhancedSettings?.({ last_synced_at: timestamp });
  }, [onUpdateEnhancedSettings]);

  const autoSync = useAutoSync(
    {
      enabled: enhancedSettings?.auto_sync_enabled ?? false,
      url: settings.google_sheets_url,
      intervalMinutes: enhancedSettings?.auto_sync_interval_minutes ?? 30,
      lastSyncedAt: enhancedSettings?.last_synced_at ?? null,
    },
    {
      onScheduleData: handleAutoSyncSchedule,
      onPayStubData: handleAutoSyncPayStubs,
      onSyncComplete: handleSyncComplete,
    }
  );

  function handleEdit(stub: PayStub) {
    setEditingStub(stub);
    setShowForm(true);
  }

  function handleFormSubmit(stub: PayStub) {
    if (editingStub) {
      onEditPayStub(editingStub.id, stub);
    } else {
      onAddPayStub(stub);
    }
    setEditingStub(null);
    setPrefillHours(0);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingStub(null);
    setPrefillHours(0);
  }

  function handleCreatePayStubFromSchedule(totalHours: number) {
    setPrefillHours(totalHours);
    setEditingStub(null);
    setShowForm(true);
  }

  // Build a prefill stub when creating from schedule
  const prefillStub = prefillHours > 0 ? {
    id: generateId(),
    employer_name: settings.default_employer,
    pay_period_start: "",
    pay_period_end: "",
    pay_date: "",
    regular_hours: prefillHours,
    overtime_hours: 0,
    hourly_rate: settings.hourly_rate,
    gross_pay: parseFloat((prefillHours * settings.hourly_rate).toFixed(2)),
    deductions: {
      federal_tax: 0,
      state_tax: 0,
      social_security: 0,
      medicare: 0,
      other_deductions: 0,
      other_deductions_label: "",
    },
    net_pay: parseFloat((prefillHours * settings.hourly_rate).toFixed(2)),
    source: "manual" as const,
    created_at: new Date().toISOString(),
  } : undefined;

  return (
    <div className="space-y-6">
      {/* YTD Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">YTD Gross</p>
          <p className="font-display font-bold text-xl text-white">
            $<AnimatedCounter target={summary.totalGross} duration={1200} />
          </p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">YTD Net (In-Hand)</p>
          <p className="font-display font-bold text-xl text-emerald-400">
            $<AnimatedCounter target={summary.totalNet} duration={1200} />
          </p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">YTD Taxes</p>
          <p className="font-display font-bold text-xl text-red-400">
            $<AnimatedCounter target={summary.totalTax} duration={1200} />
          </p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Avg Net/Period</p>
          <p className="font-display font-bold text-xl text-white">
            $<AnimatedCounter target={summary.avgNetPerPeriod} duration={1200} />
          </p>
        </motion.div>
      </div>

      {/* Shift Conflicts Alert */}
      {conflicts.length > 0 && <ShiftConflictAlert conflicts={conflicts} />}

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
              activeSubTab === tab.id
                ? "glass-card text-blue-400"
                : "text-white/40 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {activeSubTab === "stubs" && (
          <button
            onClick={() => {
              setEditingStub(null);
              setPrefillHours(0);
              setShowForm(true);
            }}
            className="ml-auto glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            + Add Pay Stub
          </button>
        )}
      </div>

      {/* Auto-sync status */}
      {enhancedSettings?.auto_sync_enabled && settings.google_sheets_url && (
        <div className="flex items-center gap-3">
          {autoSync.isSyncing && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-mono text-[10px] text-white/20">Syncing...</span>
            </div>
          )}
          {autoSync.lastSyncedAt && !autoSync.isSyncing && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] text-white/20">
                Last synced {formatRelativeTime(autoSync.lastSyncedAt)}
              </span>
            </div>
          )}
          {autoSync.syncError && (
            <span className="font-mono text-[10px] text-yellow-400/60">{autoSync.syncError}</span>
          )}
          <button
            onClick={autoSync.triggerSync}
            disabled={autoSync.isSyncing}
            className="font-mono text-[10px] text-blue-400/60 hover:text-blue-400 transition-colors disabled:opacity-30"
          >
            Sync now
          </button>
        </div>
      )}

      {/* Sub-tab content */}
      {activeSubTab === "dashboard" && (
        <PayrollDashboard
          payStubs={payStubs}
          employers={employers}
          enhancedSchedules={enhancedSchedules}
          incomeGoals={enhancedSettings?.income_goals || []}
        />
      )}

      {activeSubTab === "schedule" && (
        <ScheduleImport
          schedules={workSchedules}
          settings={settings}
          onAddSchedule={onAddSchedule}
          onDeleteSchedule={onDeleteSchedule}
          onCreatePayStub={handleCreatePayStubFromSchedule}
        />
      )}

      {activeSubTab === "files" && (
        <ScheduleFileManager
          schedules={enhancedSchedules}
          employers={employers}
          onDelete={onDeleteEnhancedSchedule}
        />
      )}

      {activeSubTab === "stubs" && (
        <PayStubList
          stubs={payStubs}
          onEdit={handleEdit}
          onDelete={onDeletePayStub}
          employers={employers}
        />
      )}

      {activeSubTab === "employers" && onAddEmployer && onUpdateEmployer && onDeleteEmployer && (
        <EmployerManager
          employers={employers}
          onAdd={onAddEmployer}
          onUpdate={onUpdateEmployer}
          onDelete={onDeleteEmployer}
        />
      )}

      {activeSubTab === "jobs" && (
        <PartTimeJobsTracker
          jobs={partTimeJobs}
          hours={partTimeHours}
          onAddJob={onAddJob}
          onDeleteJob={onDeleteJob}
          onToggleJob={onToggleJob}
          onAddHours={onAddHours}
          onDeleteHours={onDeleteHours}
        />
      )}

      {activeSubTab === "calendar" && (
        <ShiftCalendar
          schedules={enhancedSchedules}
          employers={employers}
        />
      )}

      {activeSubTab === "import" && (
        <GoogleSheetsImport
          existingStubs={payStubs}
          savedUrl={settings.google_sheets_url}
          onImport={onImportPayStubs}
        />
      )}

      {activeSubTab === "settings" && enhancedSettings && onUpdateEnhancedSettings ? (
        <PayrollSettingsPanel
          settings={enhancedSettings}
          onUpdate={onUpdateEnhancedSettings}
        />
      ) : activeSubTab === "settings" ? (
        <PayrollSettingsPanel
          settings={enhancedSettings || {
            ...settings,
            tax_config: {
              filing_status: "single",
              federal_standard_deduction: 14600,
              fica_rate: 0.062,
              fica_wage_cap: 168600,
              medicare_rate: 0.0145,
              state: "VA",
              custom_deductions: [],
            },
            employers: [],
            income_goals: [],
            auto_send_to_income: false,
            auto_sync_enabled: false,
            auto_sync_interval_minutes: 30,
            last_synced_at: null,
          }}
          onUpdate={onUpdateEnhancedSettings || (() => {})}
        />
      ) : null}

      {/* Pay stub form modal */}
      <PayStubForm
        open={showForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editStub={editingStub || prefillStub || undefined}
        defaultEmployer={settings.default_employer}
        employers={employers}
        taxConfig={enhancedSettings?.tax_config}
      />
    </div>
  );
}
