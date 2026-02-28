"use client";
import { useState, useEffect, useMemo } from "react";
import { PayStub, PayStubDeductions, Employer, TaxConfig } from "@/types";
import { generateId } from "@/lib/finance-utils";
import { calculateTaxBreakdown } from "@/lib/payroll-tax";

interface PayStubFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (stub: PayStub) => void;
  editStub?: PayStub;
  defaultEmployer?: string;
  employers?: Employer[];
  taxConfig?: TaxConfig;
}

const emptyDeductions: PayStubDeductions = {
  federal_tax: 0,
  state_tax: 0,
  social_security: 0,
  medicare: 0,
  other_deductions: 0,
  other_deductions_label: "",
};

export function PayStubForm({ open, onClose, onSubmit, editStub, defaultEmployer, employers, taxConfig }: PayStubFormProps) {
  const [employer, setEmployer] = useState(defaultEmployer || "");
  const [selectedEmployerId, setSelectedEmployerId] = useState<string>("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [payDate, setPayDate] = useState("");
  const [regularHours, setRegularHours] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [grossPay, setGrossPay] = useState(0);
  const [grossOverride, setGrossOverride] = useState(false);
  const [netOverride, setNetOverride] = useState(false);
  const [deductions, setDeductions] = useState<PayStubDeductions>({ ...emptyDeductions });
  const [netPay, setNetPay] = useState(0);
  const [autoTax, setAutoTax] = useState(true);

  useEffect(() => {
    if (editStub) {
      setEmployer(editStub.employer_name);
      setSelectedEmployerId(editStub.employer_id || "");
      setPeriodStart(editStub.pay_period_start);
      setPeriodEnd(editStub.pay_period_end);
      setPayDate(editStub.pay_date);
      setRegularHours(editStub.regular_hours);
      setOvertimeHours(editStub.overtime_hours);
      setHourlyRate(editStub.hourly_rate);
      setGrossPay(editStub.gross_pay);
      setDeductions({ ...editStub.deductions });
      setNetPay(editStub.net_pay);
      setGrossOverride(true);
      setNetOverride(true);
    } else {
      resetForm();
    }
  }, [editStub, open]);

  // When employer selected from dropdown, populate rate
  function handleEmployerSelect(empId: string) {
    setSelectedEmployerId(empId);
    if (!employers) return;
    const emp = employers.find((e) => e.id === empId);
    if (emp) {
      setEmployer(emp.name);
      if (emp.pay_type === "hourly" && emp.hourly_rate > 0) {
        setHourlyRate(emp.hourly_rate);
      }
    }
  }

  // Auto-calc gross from hours * rate
  const calculatedGross = useMemo(() => {
    return regularHours * hourlyRate + overtimeHours * hourlyRate * 1.5;
  }, [regularHours, overtimeHours, hourlyRate]);

  useEffect(() => {
    if (!grossOverride && hourlyRate > 0) {
      setGrossPay(parseFloat(calculatedGross.toFixed(2)));
    }
  }, [calculatedGross, grossOverride, hourlyRate]);

  // Auto-calculate taxes when gross changes and autoTax is on
  useEffect(() => {
    if (!autoTax || !taxConfig || grossPay <= 0) return;
    const annualEstimate = grossPay * 26; // biweekly assumption
    const breakdown = calculateTaxBreakdown(grossPay, annualEstimate, taxConfig);
    setDeductions({
      federal_tax: breakdown.federal_tax,
      state_tax: breakdown.state_tax,
      social_security: breakdown.fica,
      medicare: breakdown.medicare,
      other_deductions: 0,
      other_deductions_label: "",
    });
  }, [grossPay, autoTax, taxConfig]);

  // Auto-calc net from gross - deductions
  const totalDeductions = useMemo(() => {
    return (
      deductions.federal_tax +
      deductions.state_tax +
      deductions.social_security +
      deductions.medicare +
      deductions.other_deductions
    );
  }, [deductions]);

  useEffect(() => {
    if (!netOverride) {
      setNetPay(parseFloat((grossPay - totalDeductions).toFixed(2)));
    }
  }, [grossPay, totalDeductions, netOverride]);

  function resetForm() {
    setEmployer(defaultEmployer || "");
    setSelectedEmployerId("");
    setPeriodStart("");
    setPeriodEnd("");
    setPayDate("");
    setRegularHours(0);
    setOvertimeHours(0);
    setHourlyRate(0);
    setGrossPay(0);
    setDeductions({ ...emptyDeductions });
    setNetPay(0);
    setGrossOverride(false);
    setNetOverride(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const stub: PayStub = {
      id: editStub?.id || generateId(),
      employer_name: employer,
      employer_id: selectedEmployerId || undefined,
      pay_period_start: periodStart,
      pay_period_end: periodEnd,
      pay_date: payDate,
      regular_hours: regularHours,
      overtime_hours: overtimeHours,
      hourly_rate: hourlyRate,
      gross_pay: grossPay,
      deductions,
      net_pay: netPay,
      source: autoTax && taxConfig ? "auto-calculated" : (editStub?.source || "manual"),
      created_at: editStub?.created_at || new Date().toISOString(),
    };
    onSubmit(stub);
    resetForm();
    onClose();
  }

  function updateDeduction(key: keyof PayStubDeductions, value: string) {
    if (key === "other_deductions_label") {
      setDeductions((prev) => ({ ...prev, [key]: value }));
    } else {
      setDeductions((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
    }
  }

  if (!open) return null;

  const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";
  const labelCls = "font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block";
  const activeEmployers = employers?.filter((e) => e.active) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card rounded-3xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <h3 className="font-display font-semibold text-lg text-white mb-6">
          {editStub ? "Edit Pay Stub" : "Add Pay Stub"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employer */}
          <div>
            <label className={labelCls}>Employer</label>
            {activeEmployers.length > 0 ? (
              <select
                value={selectedEmployerId}
                onChange={(e) => handleEmployerSelect(e.target.value)}
                className={inputCls}
              >
                <option value="" className="bg-charcoal-950">Select employer...</option>
                {activeEmployers.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-charcoal-950">{emp.name}</option>
                ))}
              </select>
            ) : (
              <input type="text" value={employer} onChange={(e) => setEmployer(e.target.value)} className={inputCls} required />
            )}
          </div>

          {/* Period dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Period Start</label>
              <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Period End</label>
              <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className={inputCls} required />
            </div>
          </div>

          <div>
            <label className={labelCls}>Pay Date</label>
            <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} className={inputCls} required />
          </div>

          {/* Hours & Rate */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Regular Hrs</label>
              <input type="number" step="0.25" min="0" value={regularHours || ""} onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>OT Hrs</label>
              <input type="number" step="0.25" min="0" value={overtimeHours || ""} onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Hourly Rate</label>
              <input type="number" step="0.01" min="0" value={hourlyRate || ""} onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} className={inputCls} />
            </div>
          </div>

          {/* Gross Pay */}
          <div>
            <label className={labelCls}>Gross Pay</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={grossPay || ""}
              onChange={(e) => {
                setGrossOverride(true);
                setGrossPay(parseFloat(e.target.value) || 0);
              }}
              className={`${inputCls} font-mono text-lg`}
              required
            />
            {hourlyRate > 0 && grossOverride && (
              <button type="button" onClick={() => { setGrossOverride(false); setGrossPay(parseFloat(calculatedGross.toFixed(2))); }} className="text-xs text-blue-400/60 hover:text-blue-400 mt-1 font-mono">
                Reset to calculated (${calculatedGross.toFixed(2)})
              </button>
            )}
          </div>

          {/* Auto-Tax Toggle */}
          {taxConfig && (
            <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
              <div>
                <p className="font-body text-sm text-white">Auto-Calculate Taxes</p>
                <p className="font-body text-xs text-white/30">Uses Virginia + Federal tax brackets</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoTax(!autoTax)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  autoTax ? "bg-blue-500/40" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                    autoTax ? "left-5 bg-blue-400" : "left-0.5 bg-white/30"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Deductions */}
          <div className="space-y-3">
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Deductions</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Federal Tax</label>
                <input type="number" step="0.01" min="0" value={deductions.federal_tax || ""} onChange={(e) => updateDeduction("federal_tax", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>State Tax</label>
                <input type="number" step="0.01" min="0" value={deductions.state_tax || ""} onChange={(e) => updateDeduction("state_tax", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Social Security</label>
                <input type="number" step="0.01" min="0" value={deductions.social_security || ""} onChange={(e) => updateDeduction("social_security", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Medicare</label>
                <input type="number" step="0.01" min="0" value={deductions.medicare || ""} onChange={(e) => updateDeduction("medicare", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Other Deductions</label>
                <input type="number" step="0.01" min="0" value={deductions.other_deductions || ""} onChange={(e) => updateDeduction("other_deductions", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Other Label</label>
                <input type="text" value={deductions.other_deductions_label} onChange={(e) => updateDeduction("other_deductions_label", e.target.value)} className={inputCls} placeholder="e.g. 401k, Insurance" />
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div>
            <label className={labelCls}>Net Pay (In-Hand)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={netPay || ""}
              onChange={(e) => {
                setNetOverride(true);
                setNetPay(parseFloat(e.target.value) || 0);
              }}
              className={`${inputCls} font-mono text-lg text-emerald-400`}
              required
            />
            {netOverride && (
              <button type="button" onClick={() => { setNetOverride(false); }} className="text-xs text-blue-400/60 hover:text-blue-400 mt-1 font-mono">
                Reset to calculated (${(grossPay - totalDeductions).toFixed(2)})
              </button>
            )}
          </div>

          <button type="submit" className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-blue-300 hover:border-blue-500/30 transition-all">
            {editStub ? "Update Pay Stub" : "Add Pay Stub"} →
          </button>
        </form>
      </div>
    </div>
  );
}
