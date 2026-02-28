"use client";
import { PayrollSettings, PayFrequency } from "@/types";

interface PayrollSettingsPanelProps {
  settings: PayrollSettings;
  onUpdate: (settings: PayrollSettings) => void;
}

const frequencies: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "semimonthly", label: "Semi-Monthly" },
  { value: "monthly", label: "Monthly" },
];

export function PayrollSettingsPanel({ settings, onUpdate }: PayrollSettingsPanelProps) {
  const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";
  const labelCls = "font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block";

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <h3 className="font-display font-semibold text-lg text-white">Payroll Settings</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Your Name in Schedule</label>
          <input
            type="text"
            value={settings.schedule_name}
            onChange={(e) => onUpdate({ ...settings, schedule_name: e.target.value })}
            className={inputCls}
            placeholder="e.g. Pavan"
          />
          <p className="font-body text-xs text-white/25 mt-1">
            Must match how your name appears in the schedule spreadsheet.
          </p>
        </div>

        <div>
          <label className={labelCls}>Hourly Rate ($)</label>
          <input
            type="number"
            step="0.25"
            min="0"
            value={settings.hourly_rate || ""}
            onChange={(e) => onUpdate({ ...settings, hourly_rate: parseFloat(e.target.value) || 0 })}
            className={inputCls}
            placeholder="e.g. 15.00"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Default Employer Name</label>
        <input
          type="text"
          value={settings.default_employer}
          onChange={(e) => onUpdate({ ...settings, default_employer: e.target.value })}
          className={inputCls}
          placeholder="e.g. Stemtree"
        />
      </div>

      <div>
        <label className={labelCls}>Pay Frequency</label>
        <select
          value={settings.pay_frequency}
          onChange={(e) => onUpdate({ ...settings, pay_frequency: e.target.value as PayFrequency })}
          className={inputCls}
        >
          {frequencies.map((f) => (
            <option key={f.value} value={f.value} className="bg-charcoal-950">
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Google Sheets URL</label>
        <input
          type="url"
          value={settings.google_sheets_url}
          onChange={(e) => onUpdate({ ...settings, google_sheets_url: e.target.value })}
          className={inputCls}
          placeholder="https://docs.google.com/spreadsheets/d/..."
        />
        <p className="font-body text-xs text-white/25 mt-2">
          Publish your sheet: File → Share → Publish to web → CSV. Paste the link above.
        </p>
      </div>
    </div>
  );
}
