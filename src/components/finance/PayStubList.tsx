"use client";
import { useState } from "react";
import { PayStub, Employer } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { downloadPayStubPDF } from "@/lib/payroll-pdf";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = "list" | "grid" | "table";

interface PayStubListProps {
  stubs: PayStub[];
  onEdit: (stub: PayStub) => void;
  onDelete: (id: string) => void;
  employers?: Employer[];
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(s)} – ${fmt(e)}`;
}

function formatShortDate(date: string) {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

const viewIcons: Record<ViewMode, JSX.Element> = {
  list: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  grid: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  table: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
};

export function PayStubList({ stubs, onEdit, onDelete, employers }: PayStubListProps) {
  const employerMap = new Map((employers || []).map((e) => [e.id, e]));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const sorted = [...stubs].sort((a, b) => b.pay_date.localeCompare(a.pay_date));

  if (sorted.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-body text-white/30">No pay stubs yet. Add one manually or import from Google Sheets.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-white">
          Pay Stubs
          <span className="ml-2 font-mono text-xs text-white/30">({sorted.length})</span>
        </h3>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
          {(["list", "grid", "table"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === mode
                  ? "bg-white/10 text-blue-400"
                  : "text-white/30 hover:text-white/60"
              }`}
              title={mode.charAt(0).toUpperCase() + mode.slice(1) + " view"}
            >
              {viewIcons[mode]}
            </button>
          ))}
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && sorted.map((stub) => {
        const isExpanded = expandedId === stub.id;
        const totalDed =
          stub.deductions.federal_tax +
          stub.deductions.state_tax +
          stub.deductions.social_security +
          stub.deductions.medicare +
          stub.deductions.other_deductions;

        return (
          <div key={stub.id} className="glass-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : stub.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-white truncate">{stub.employer_name}</p>
                <p className="font-mono text-xs text-white/30">{formatDateRange(stub.pay_period_start, stub.pay_period_end)}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-mono text-xs text-white/30">Gross</p>
                  <p className="font-mono text-sm text-white/60">{formatCurrency(stub.gross_pay)}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-white/30">Net</p>
                  <p className="font-mono text-sm text-emerald-400">{formatCurrency(stub.net_pay)}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"
                  className={`text-white/20 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                    {stub.hourly_rate > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">Regular Hrs</p>
                          <p className="font-mono text-sm text-white/60">{stub.regular_hours}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">OT Hrs</p>
                          <p className="font-mono text-sm text-white/60">{stub.overtime_hours}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">Rate</p>
                          <p className="font-mono text-sm text-white/60">${stub.hourly_rate}/hr</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-mono text-[10px] text-white/25 uppercase mb-2">Deductions Breakdown</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        <div className="flex justify-between">
                          <span className="font-body text-xs text-white/40">Federal Tax</span>
                          <span className="font-mono text-xs text-red-400/70">{formatCurrency(stub.deductions.federal_tax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-xs text-white/40">State Tax</span>
                          <span className="font-mono text-xs text-red-400/70">{formatCurrency(stub.deductions.state_tax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-xs text-white/40">Social Security</span>
                          <span className="font-mono text-xs text-red-400/70">{formatCurrency(stub.deductions.social_security)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-xs text-white/40">Medicare</span>
                          <span className="font-mono text-xs text-red-400/70">{formatCurrency(stub.deductions.medicare)}</span>
                        </div>
                        {stub.deductions.other_deductions > 0 && (
                          <div className="flex justify-between col-span-2">
                            <span className="font-body text-xs text-white/40">
                              {stub.deductions.other_deductions_label || "Other"}
                            </span>
                            <span className="font-mono text-xs text-red-400/70">{formatCurrency(stub.deductions.other_deductions)}</span>
                          </div>
                        )}
                        <div className="flex justify-between col-span-2 pt-1 border-t border-white/5">
                          <span className="font-body text-xs text-white/60 font-medium">Total Deductions</span>
                          <span className="font-mono text-xs text-red-400">{formatCurrency(totalDed)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/25 uppercase">Source</span>
                        <span className="font-mono text-xs text-white/40">{stub.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const emp = stub.employer_id ? employerMap.get(stub.employer_id) : undefined;
                            downloadPayStubPDF(stub, emp);
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-body text-white/40 hover:text-purple-400 hover:bg-white/5 transition-all"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => onEdit(stub)}
                          className="px-3 py-1 rounded-lg text-xs font-body text-white/40 hover:text-blue-400 hover:bg-white/5 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(stub.id)}
                          className="px-3 py-1 rounded-lg text-xs font-body text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((stub, i) => (
            <motion.div
              key={stub.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-body text-sm text-white font-medium">{stub.employer_name}</p>
                    <p className="font-mono text-[10px] text-white/30 mt-0.5">
                      {formatDateRange(stub.pay_period_start, stub.pay_period_end)}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-white/20 uppercase">{stub.source}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="font-mono text-[10px] text-white/25 uppercase">Gross</p>
                    <p className="font-mono text-lg text-white/70">{formatCurrency(stub.gross_pay)}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-emerald-400/50 uppercase">Net</p>
                    <p className="font-mono text-lg text-emerald-400">{formatCurrency(stub.net_pay)}</p>
                  </div>
                </div>

                {stub.hourly_rate > 0 && (
                  <div className="flex items-center gap-3 text-white/40 mb-3">
                    <span className="font-mono text-xs">{stub.regular_hours}h</span>
                    <span className="text-white/10">|</span>
                    <span className="font-mono text-xs">${stub.hourly_rate}/hr</span>
                    {stub.overtime_hours > 0 && (
                      <>
                        <span className="text-white/10">|</span>
                        <span className="font-mono text-xs text-yellow-400/60">+{stub.overtime_hours}h OT</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 pt-3 border-t border-white/5">
                <button
                  onClick={() => {
                    const emp = stub.employer_id ? employerMap.get(stub.employer_id) : undefined;
                    downloadPayStubPDF(stub, emp);
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-purple-400 hover:bg-white/5 transition-all"
                >
                  PDF
                </button>
                <button
                  onClick={() => onEdit(stub)}
                  className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-blue-400 hover:bg-white/5 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(stub.id)}
                  className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-red-400 hover:bg-white/5 transition-all ml-auto"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Employer</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Hours</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Rate</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Gross</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Net</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((stub) => (
                  <tr
                    key={stub.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <p className="font-mono text-xs text-white/50">{formatShortDate(stub.pay_date)}</p>
                      <p className="font-mono text-[10px] text-white/20">
                        {formatDateRange(stub.pay_period_start, stub.pay_period_end)}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-body text-xs text-white/70">{stub.employer_name}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/50">{stub.regular_hours}</span>
                      {stub.overtime_hours > 0 && (
                        <span className="font-mono text-[10px] text-yellow-400/50 ml-1">+{stub.overtime_hours}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/40">${stub.hourly_rate}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/60">{formatCurrency(stub.gross_pay)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-emerald-400">{formatCurrency(stub.net_pay)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            const emp = stub.employer_id ? employerMap.get(stub.employer_id) : undefined;
                            downloadPayStubPDF(stub, emp);
                          }}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-purple-400 transition-colors"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => onEdit(stub)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-blue-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(stub.id)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-red-400 transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
