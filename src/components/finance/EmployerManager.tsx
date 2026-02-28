"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employer, PayType } from "@/types";
import { EMPLOYER_COLORS, PAY_TYPE_LABELS } from "@/lib/constants";
import { employerSchema, EmployerFormData } from "@/lib/payroll-schemas";
import { generateId } from "@/lib/finance-utils";

interface EmployerManagerProps {
  employers: Employer[];
  onAdd: (employer: Employer) => void;
  onUpdate: (id: string, updates: Partial<Employer>) => void;
  onDelete: (id: string) => void;
}

const inputCls =
  "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";
const labelCls =
  "font-mono text-xs text-white/40 uppercase tracking-widest mb-2 block";

function getDefaultFormValues(): EmployerFormData {
  return {
    name: "",
    pay_type: "hourly",
    hourly_rate: 0,
    fixed_amount: 0,
    commission_rate: 0,
    color: EMPLOYER_COLORS[0],
    overtime_enabled: false,
    overtime_multiplier: 1.5,
    overtime_threshold: 40,
    holiday_multiplier: 1.5,
    active: true,
  };
}

function getRateDisplay(employer: Employer): string {
  switch (employer.pay_type) {
    case "hourly":
      return `$${employer.hourly_rate}/hr`;
    case "salary":
    case "fixed_weekly":
      return `$${employer.fixed_amount.toLocaleString()}`;
    case "commission":
      return `$${employer.hourly_rate}/hr + ${employer.commission_rate}%`;
    case "per_shift":
      return `$${employer.fixed_amount}/shift`;
    default:
      return "";
  }
}

export function EmployerManager({
  employers,
  onAdd,
  onUpdate,
  onDelete,
}: EmployerManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployerFormData>({
    resolver: zodResolver(employerSchema),
    defaultValues: getDefaultFormValues(),
  });

  const watchPayType = watch("pay_type");
  const watchOvertimeEnabled = watch("overtime_enabled");
  const watchColor = watch("color");

  const openAddForm = useCallback(() => {
    setEditingId(null);
    reset({
      ...getDefaultFormValues(),
      color: EMPLOYER_COLORS[employers.length % EMPLOYER_COLORS.length],
    });
    setShowForm(true);
  }, [employers.length, reset]);

  const openEditForm = useCallback(
    (employer: Employer) => {
      setEditingId(employer.id);
      reset({
        name: employer.name,
        pay_type: employer.pay_type,
        hourly_rate: employer.hourly_rate,
        fixed_amount: employer.fixed_amount,
        commission_rate: employer.commission_rate,
        color: employer.color,
        overtime_enabled: employer.overtime_enabled,
        overtime_multiplier: employer.overtime_multiplier,
        overtime_threshold: employer.overtime_threshold,
        holiday_multiplier: employer.holiday_multiplier,
        active: employer.active,
      });
      setShowForm(true);
    },
    [reset]
  );

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    reset(getDefaultFormValues());
  }, [reset]);

  const onSubmit = useCallback(
    (data: EmployerFormData) => {
      if (editingId) {
        onUpdate(editingId, data);
      } else {
        const newEmployer: Employer = {
          ...data,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        onAdd(newEmployer);
      }
      closeForm();
    },
    [editingId, onAdd, onUpdate, closeForm]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (confirmDeleteId === id) {
        onDelete(id);
        setConfirmDeleteId(null);
      } else {
        setConfirmDeleteId(id);
        // Auto-clear confirm state after 3 seconds
        setTimeout(() => setConfirmDeleteId((prev) => (prev === id ? null : prev)), 3000);
      }
    },
    [confirmDeleteId, onDelete]
  );

  const handleToggleActive = useCallback(
    (employer: Employer) => {
      onUpdate(employer.id, { active: !employer.active });
    },
    [onUpdate]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-white">
          Employers
        </h3>
        <button
          onClick={openAddForm}
          className="glass-card px-5 py-3 rounded-2xl text-sm font-body text-blue-300 hover:border-blue-500/30 transition-all"
        >
          + Add Employer
        </button>
      </div>

      {/* Employer Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {employers.map((employer) => (
            <motion.div
              key={employer.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              layout
              className={`glass-card rounded-2xl p-5 transition-opacity ${
                !employer.active ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left: color dot + name + badge + rate */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-white/10"
                    style={{ backgroundColor: employer.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-sm text-white font-medium truncate">
                        {employer.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-wider flex-shrink-0">
                        {PAY_TYPE_LABELS[employer.pay_type]}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-white/30 mt-0.5">
                      {getRateDisplay(employer)}
                    </p>
                  </div>
                </div>

                {/* Right: active toggle + edit + delete */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <button
                    onClick={() => handleToggleActive(employer)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                      employer.active
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-white/5 text-white/30 hover:text-white/50"
                    }`}
                  >
                    {employer.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => openEditForm(employer)}
                    className="text-white/20 hover:text-blue-400 transition-colors p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(employer.id)}
                    className={`transition-colors p-1 ${
                      confirmDeleteId === employer.id
                        ? "text-red-400"
                        : "text-white/20 hover:text-red-400"
                    }`}
                  >
                    {confirmDeleteId === employer.id ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider">
                        Confirm?
                      </span>
                    ) : (
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
                    )}
                  </button>
                </div>
              </div>

              {/* Overtime / Holiday badges */}
              {(employer.overtime_enabled || employer.holiday_multiplier > 1) && (
                <div className="flex items-center gap-2 mt-3">
                  {employer.overtime_enabled && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 font-mono text-[10px] text-amber-400/70">
                      OT {employer.overtime_multiplier}x after {employer.overtime_threshold}h
                    </span>
                  )}
                  {employer.holiday_multiplier > 1 && (
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 font-mono text-[10px] text-purple-400/70">
                      Holiday {employer.holiday_multiplier}x
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {employers.length === 0 && !showForm && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/30">
            No employers yet. Add one to start tracking payroll.
          </p>
        </div>
      )}

      {/* Inline Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card rounded-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-display font-semibold text-base text-white">
                  {editingId ? "Edit Employer" : "New Employer"}
                </h4>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-white/20 hover:text-white/50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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

              {/* Name */}
              <div>
                <label className={labelCls}>Employer Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className={inputCls}
                  placeholder="e.g. Acme Corp"
                />
                {errors.name && (
                  <p className="font-body text-xs text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Pay Type */}
              <div>
                <label className={labelCls}>Pay Type</label>
                <select {...register("pay_type")} className={inputCls}>
                  {(
                    Object.entries(PAY_TYPE_LABELS) as [PayType, string][]
                  ).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                      className="bg-charcoal-950"
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Rate Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(watchPayType === "hourly" || watchPayType === "commission") && (
                  <div>
                    <label className={labelCls}>Hourly Rate ($)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      {...register("hourly_rate", { valueAsNumber: true })}
                      className={inputCls}
                      placeholder="0.00"
                    />
                    {errors.hourly_rate && (
                      <p className="font-body text-xs text-red-400 mt-1">
                        {errors.hourly_rate.message}
                      </p>
                    )}
                  </div>
                )}

                {(watchPayType === "salary" ||
                  watchPayType === "fixed_weekly" ||
                  watchPayType === "per_shift") && (
                  <div>
                    <label className={labelCls}>
                      {watchPayType === "salary"
                        ? "Annual Salary ($)"
                        : watchPayType === "fixed_weekly"
                        ? "Weekly Amount ($)"
                        : "Per Shift Amount ($)"}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("fixed_amount", { valueAsNumber: true })}
                      className={inputCls}
                      placeholder="0.00"
                    />
                    {errors.fixed_amount && (
                      <p className="font-body text-xs text-red-400 mt-1">
                        {errors.fixed_amount.message}
                      </p>
                    )}
                  </div>
                )}

                {watchPayType === "commission" && (
                  <div>
                    <label className={labelCls}>Commission Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      {...register("commission_rate", { valueAsNumber: true })}
                      className={inputCls}
                      placeholder="0"
                    />
                    {errors.commission_rate && (
                      <p className="font-body text-xs text-red-400 mt-1">
                        {errors.commission_rate.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Color Picker */}
              <div>
                <label className={labelCls}>Color</label>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {EMPLOYER_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => field.onChange(c)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            field.value === c
                              ? "ring-2 ring-white/60 ring-offset-2 ring-offset-transparent scale-110"
                              : "ring-1 ring-white/10 hover:ring-white/30"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  )}
                />
                {errors.color && (
                  <p className="font-body text-xs text-red-400 mt-1">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* Overtime Toggle */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Controller
                    name="overtime_enabled"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          field.value ? "bg-blue-500/50" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            field.value ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}
                  />
                  <span className="font-body text-sm text-white/60">
                    Overtime Pay
                  </span>
                </div>

                <AnimatePresence>
                  {watchOvertimeEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className={labelCls}>OT Multiplier</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="3"
                            {...register("overtime_multiplier", {
                              valueAsNumber: true,
                            })}
                            className={inputCls}
                            placeholder="1.5"
                          />
                          {errors.overtime_multiplier && (
                            <p className="font-body text-xs text-red-400 mt-1">
                              {errors.overtime_multiplier.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelCls}>
                            OT Threshold (hrs/wk)
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            max="168"
                            {...register("overtime_threshold", {
                              valueAsNumber: true,
                            })}
                            className={inputCls}
                            placeholder="40"
                          />
                          {errors.overtime_threshold && (
                            <p className="font-body text-xs text-red-400 mt-1">
                              {errors.overtime_threshold.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Holiday Pay Multiplier */}
              <div>
                <label className={labelCls}>Holiday Pay Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="3"
                  {...register("holiday_multiplier", { valueAsNumber: true })}
                  className={inputCls}
                  placeholder="1.5"
                />
                <p className="font-body text-xs text-white/25 mt-1">
                  Multiplier applied to shifts marked as holidays.
                </p>
                {errors.holiday_multiplier && (
                  <p className="font-body text-xs text-red-400 mt-1">
                    {errors.holiday_multiplier.message}
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        field.value ? "bg-emerald-500/50" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          field.value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                />
                <span className="font-body text-sm text-white/60">
                  Active Employer
                </span>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="glass-card px-5 py-3 rounded-2xl text-sm font-body text-blue-300 hover:border-blue-500/30 transition-all"
                >
                  {editingId ? "Save Changes" : "Add Employer"} →
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 rounded-2xl text-sm font-body text-white/30 hover:text-white/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
