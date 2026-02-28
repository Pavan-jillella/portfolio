"use client";
import { useState, useMemo } from "react";
import {
  PayStub,
  PartTimeJob,
  PartTimeHourEntry,
  PayrollSettings,
  WorkSchedule,
  Employer,
  EnhancedWorkSchedule,
  EnhancedPayrollSettings,
} from "@/types";
import { getPayrollSummary, generateId } from "@/lib/finance-utils";
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
import { detectShiftConflicts } from "@/lib/payroll-utils";
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
