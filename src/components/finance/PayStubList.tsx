"use client";
import { useState } from "react";
import { PayStub } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface PayStubListProps {
  stubs: PayStub[];
  onEdit: (stub: PayStub) => void;
  onDelete: (id: string) => void;
}

export function PayStubList({ stubs, onEdit, onDelete }: PayStubListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...stubs].sort((a, b) => b.pay_date.localeCompare(a.pay_date));

  if (sorted.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-body text-white/30">No pay stubs yet. Add one manually or import from Google Sheets.</p>
      </div>
    );
  }

  function formatDateRange(start: string, end: string) {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(s)} – ${fmt(e)}`;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-lg text-white">Pay Stubs</h3>
      {sorted.map((stub) => {
        const isExpanded = expandedId === stub.id;
        const totalDed =
          stub.deductions.federal_tax +
          stub.deductions.state_tax +
          stub.deductions.social_security +
          stub.deductions.medicare +
          stub.deductions.other_deductions;

        return (
          <div key={stub.id} className="glass-card rounded-2xl overflow-hidden">
            {/* Row */}
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
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                  className={`text-white/20 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Expanded detail */}
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
                    {/* Hours & Rate */}
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

                    {/* Deductions breakdown */}
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

                    {/* Summary bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/25 uppercase">Source</span>
                        <span className="font-mono text-xs text-white/40">{stub.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
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
    </div>
  );
}
