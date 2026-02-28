"use client";
import { useState } from "react";
import { EnhancedPayrollSettings, PayFrequency, TaxConfig, IncomeGoal } from "@/types";
import { generateId } from "@/lib/finance-utils";
import { FILING_STATUS_LABELS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface PayrollSettingsPanelProps {
  settings: EnhancedPayrollSettings;
  onUpdate: (updates: Partial<EnhancedPayrollSettings>) => void;
}

const frequencies: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "semimonthly", label: "Semi-Monthly" },
  { value: "monthly", label: "Monthly" },
];

export function PayrollSettingsPanel({ settings, onUpdate }: PayrollSettingsPanelProps) {
  const [openSection, setOpenSection] = useState<string>("general");
  const [newGoalYear, setNewGoalYear] = useState(new Date().getFullYear());
  const [newGoalAmount, setNewGoalAmount] = useState(0);
  const [newDeductionLabel, setNewDeductionLabel] = useState("");
  const [newDeductionAmount, setNewDeductionAmount] = useState(0);
  const [newDeductionIsPercent, setNewDeductionIsPercent] = useState(false);

  const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";
  const labelCls = "font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block";

  function toggleSection(id: string) {
    setOpenSection(openSection === id ? "" : id);
  }

  function updateTaxConfig(updates: Partial<TaxConfig>) {
    onUpdate({ tax_config: { ...settings.tax_config, ...updates } });
  }

  function addIncomeGoal() {
    if (newGoalAmount <= 0) return;
    const goal: IncomeGoal = { id: generateId(), year: newGoalYear, target_amount: newGoalAmount };
    onUpdate({ income_goals: [...settings.income_goals, goal] });
    setNewGoalAmount(0);
  }

  function removeIncomeGoal(id: string) {
    onUpdate({ income_goals: settings.income_goals.filter((g) => g.id !== id) });
  }

  function addCustomDeduction() {
    if (!newDeductionLabel || newDeductionAmount <= 0) return;
    const deduction = { label: newDeductionLabel, amount: newDeductionAmount, is_percentage: newDeductionIsPercent };
    updateTaxConfig({ custom_deductions: [...settings.tax_config.custom_deductions, deduction] });
    setNewDeductionLabel("");
    setNewDeductionAmount(0);
    setNewDeductionIsPercent(false);
  }

  function removeCustomDeduction(idx: number) {
    const updated = settings.tax_config.custom_deductions.filter((_, i) => i !== idx);
    updateTaxConfig({ custom_deductions: updated });
  }

  const sections = [
    { id: "general", label: "General" },
    { id: "tax", label: "Tax Configuration" },
    { id: "goals", label: "Income Goals" },
    { id: "integration", label: "Integration" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-lg text-white">Payroll Settings</h3>

      {sections.map((section) => (
        <div key={section.id} className="glass-card rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
          >
            <span className="font-body text-sm text-white">{section.label}</span>
            <svg
              className={`w-4 h-4 text-white/20 transition-transform ${openSection === section.id ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <AnimatePresence>
            {openSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-5 border-t border-white/5 pt-4">
                  {section.id === "general" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Your Name in Schedule</label>
                          <input
                            type="text"
                            value={settings.schedule_name}
                            onChange={(e) => onUpdate({ schedule_name: e.target.value })}
                            className={inputCls}
                            placeholder="e.g. Pavan"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Default Hourly Rate ($)</label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={settings.hourly_rate || ""}
                            onChange={(e) => onUpdate({ hourly_rate: parseFloat(e.target.value) || 0 })}
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Default Employer</label>
                        <input
                          type="text"
                          value={settings.default_employer}
                          onChange={(e) => onUpdate({ default_employer: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Pay Frequency</label>
                        <select
                          value={settings.pay_frequency}
                          onChange={(e) => onUpdate({ pay_frequency: e.target.value as PayFrequency })}
                          className={inputCls}
                        >
                          {frequencies.map((f) => (
                            <option key={f.value} value={f.value} className="bg-charcoal-950">{f.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Apps Script / Sheets URL</label>
                        <input
                          type="url"
                          value={settings.google_sheets_url}
                          onChange={(e) => onUpdate({ google_sheets_url: e.target.value })}
                          className={inputCls}
                          placeholder="https://script.google.com/macros/s/.../exec"
                        />
                      </div>
                    </>
                  )}

                  {section.id === "tax" && (
                    <>
                      <div>
                        <label className={labelCls}>Filing Status</label>
                        <select
                          value={settings.tax_config.filing_status}
                          onChange={(e) => updateTaxConfig({ filing_status: e.target.value as TaxConfig["filing_status"] })}
                          className={inputCls}
                        >
                          {Object.entries(FILING_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value} className="bg-charcoal-950">{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className={labelCls}>Federal Standard Deduction</label>
                          <input
                            type="number"
                            value={settings.tax_config.federal_standard_deduction}
                            onChange={(e) => updateTaxConfig({ federal_standard_deduction: parseFloat(e.target.value) || 0 })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>FICA Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={(settings.tax_config.fica_rate * 100).toFixed(2)}
                            onChange={(e) => updateTaxConfig({ fica_rate: (parseFloat(e.target.value) || 0) / 100 })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>FICA Wage Cap</label>
                          <input
                            type="number"
                            value={settings.tax_config.fica_wage_cap}
                            onChange={(e) => updateTaxConfig({ fica_wage_cap: parseFloat(e.target.value) || 0 })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Medicare Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={(settings.tax_config.medicare_rate * 100).toFixed(3)}
                            onChange={(e) => updateTaxConfig({ medicare_rate: (parseFloat(e.target.value) || 0) / 100 })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Custom deductions */}
                      <div>
                        <p className={labelCls}>Custom Deductions</p>
                        {settings.tax_config.custom_deductions.map((ded, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2">
                            <span className="font-body text-sm text-white/60 flex-1">{ded.label}</span>
                            <span className="font-mono text-xs text-white/40">
                              {ded.is_percentage ? `${ded.amount}%` : `$${ded.amount}`}
                            </span>
                            <button onClick={() => removeCustomDeduction(i)} className="text-white/20 hover:text-red-400 transition-colors text-xs">
                              Remove
                            </button>
                          </div>
                        ))}
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <input
                            type="text"
                            value={newDeductionLabel}
                            onChange={(e) => setNewDeductionLabel(e.target.value)}
                            placeholder="Label"
                            className={`${inputCls} col-span-2`}
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={newDeductionAmount || ""}
                            onChange={(e) => setNewDeductionAmount(parseFloat(e.target.value) || 0)}
                            placeholder="Amount"
                            className={inputCls}
                          />
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setNewDeductionIsPercent(!newDeductionIsPercent)}
                              className={`px-2 py-1 rounded-lg text-xs font-mono ${newDeductionIsPercent ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/40"}`}
                            >
                              {newDeductionIsPercent ? "%" : "$"}
                            </button>
                            <button
                              onClick={addCustomDeduction}
                              className="px-2 py-1 rounded-lg text-xs font-mono text-emerald-400 hover:bg-emerald-500/10"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "goals" && (
                    <>
                      {settings.income_goals.map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                          <div>
                            <p className="font-body text-sm text-white">{goal.year}</p>
                            <p className="font-mono text-xs text-white/40">
                              Target: ${goal.target_amount.toLocaleString()}
                            </p>
                          </div>
                          <button onClick={() => removeIncomeGoal(goal.id)} className="text-white/20 hover:text-red-400 transition-colors text-xs">
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Year</label>
                          <input
                            type="number"
                            value={newGoalYear}
                            onChange={(e) => setNewGoalYear(parseInt(e.target.value) || new Date().getFullYear())}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Target Amount ($)</label>
                          <input
                            type="number"
                            value={newGoalAmount || ""}
                            onChange={(e) => setNewGoalAmount(parseFloat(e.target.value) || 0)}
                            className={inputCls}
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={addIncomeGoal}
                            className="glass-card px-4 py-3 rounded-2xl text-sm font-body text-emerald-400 hover:border-emerald-500/30 transition-all w-full"
                          >
                            Add Goal
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {section.id === "integration" && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body text-sm text-white">Auto-send Payroll to Finance Income</p>
                          <p className="font-body text-xs text-white/30 mt-1">
                            When enabled, adding a pay stub will automatically create an income transaction.
                          </p>
                        </div>
                        <button
                          onClick={() => onUpdate({ auto_send_to_income: !settings.auto_send_to_income })}
                          className={`w-10 h-5 rounded-full transition-colors relative ${
                            settings.auto_send_to_income ? "bg-blue-500/40" : "bg-white/10"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                              settings.auto_send_to_income ? "left-5 bg-blue-400" : "left-0.5 bg-white/30"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body text-sm text-white">Auto-sync Schedule & Pay Stubs</p>
                          <p className="font-body text-xs text-white/30 mt-1">
                            Automatically fetch data from your Apps Script URL on page load and periodically.
                          </p>
                        </div>
                        <button
                          onClick={() => onUpdate({ auto_sync_enabled: !settings.auto_sync_enabled })}
                          className={`w-10 h-5 rounded-full transition-colors relative ${
                            settings.auto_sync_enabled ? "bg-blue-500/40" : "bg-white/10"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                              settings.auto_sync_enabled ? "left-5 bg-blue-400" : "left-0.5 bg-white/30"
                            }`}
                          />
                        </button>
                      </div>

                      {settings.auto_sync_enabled && (
                        <div>
                          <label className={labelCls}>Sync Interval (minutes)</label>
                          <input
                            type="number"
                            min="5"
                            max="120"
                            step="5"
                            value={settings.auto_sync_interval_minutes || 30}
                            onChange={(e) => onUpdate({
                              auto_sync_interval_minutes: Math.max(5, parseInt(e.target.value) || 30)
                            })}
                            className={inputCls}
                          />
                        </div>
                      )}

                      {settings.last_synced_at && (
                        <div className="bg-white/[0.03] rounded-xl p-3">
                          <p className="font-mono text-[10px] text-white/25 uppercase">Last Synced</p>
                          <p className="font-mono text-xs text-white/50">
                            {new Date(settings.last_synced_at).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Gmail Integration Setup */}
                      <div className="bg-white/[0.03] rounded-xl p-4 space-y-3">
                        <p className="font-body text-sm text-white">Gmail Pay Stub Reader</p>
                        <p className="font-body text-xs text-white/30">
                          Deploy the Gmail Apps Script to automatically read pay stub emails
                          and write them to a Google Sheet. The auto-sync feature will then
                          pick up the data.
                        </p>
                        <ol className="list-decimal list-inside font-body text-xs text-white/40 space-y-1">
                          <li>Open script.google.com and create a new project</li>
                          <li>Paste the Gmail pay stub script code (see docs/gmail-paystub-script.gs)</li>
                          <li>Run <code className="font-mono text-blue-400/60">setupTrigger()</code> once</li>
                          <li>Deploy as web app (Execute: Me, Access: Anyone)</li>
                          <li>Copy the web app URL into the Apps Script URL field in General settings</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
