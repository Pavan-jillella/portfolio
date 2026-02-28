import {
  Employer,
  EnhancedWorkSchedule,
  EnhancedShift,
  PayStub,
  ShiftConflict,
  PayrollDashboardStats,
  EmployerIncome,
  WeeklyTrendEntry,
  MonthlyTrendEntry,
} from "@/types";
import { parseTimeToMinutes } from "@/lib/finance-utils";

export function calculateGrossForEmployer(
  employer: Employer,
  regularHours: number,
  overtimeHours: number = 0,
  isHoliday: boolean = false
): number {
  let gross = 0;

  switch (employer.pay_type) {
    case "hourly": {
      const baseRate = employer.hourly_rate;
      const effectiveRate = isHoliday ? baseRate * employer.holiday_multiplier : baseRate;
      gross = regularHours * effectiveRate;
      if (employer.overtime_enabled && overtimeHours > 0) {
        gross += overtimeHours * effectiveRate * employer.overtime_multiplier;
      }
      break;
    }
    case "salary":
      // Fixed amount per pay period regardless of hours
      gross = employer.fixed_amount;
      break;
    case "commission":
      gross = regularHours * employer.hourly_rate + employer.commission_rate;
      break;
    case "fixed_weekly":
      gross = employer.fixed_amount;
      break;
    case "per_shift":
      // fixed_amount per shift (each non-zero day = 1 shift)
      gross = employer.fixed_amount;
      break;
  }

  return Math.round(gross * 100) / 100;
}

export function calculateOvertimeHours(
  weeklyHours: number,
  threshold: number = 40
): { regular: number; overtime: number } {
  if (weeklyHours <= threshold) {
    return { regular: weeklyHours, overtime: 0 };
  }
  return { regular: threshold, overtime: weeklyHours - threshold };
}

export function detectShiftConflicts(
  schedules: EnhancedWorkSchedule[],
  employers: Employer[]
): ShiftConflict[] {
  const conflicts: ShiftConflict[] = [];
  const employerMap = new Map(employers.map((e) => [e.id, e]));

  // Group shifts by date across all schedules
  const shiftsByDate = new Map<string, { shift: EnhancedShift; employer_id: string }[]>();

  for (const schedule of schedules) {
    for (const shift of schedule.shifts) {
      if (shift.hours <= 0 || !shift.date) continue;
      const key = shift.date;
      if (!shiftsByDate.has(key)) shiftsByDate.set(key, []);
      shiftsByDate.get(key)!.push({ shift, employer_id: schedule.employer_id });
    }
  }

  // Check for overlaps within each date
  for (const [, shifts] of Array.from(shiftsByDate)) {
    for (let i = 0; i < shifts.length; i++) {
      for (let j = i + 1; j < shifts.length; j++) {
        const a = shifts[i];
        const b = shifts[j];
        if (a.employer_id === b.employer_id) continue;

        const aStart = parseTimeToMinutes(a.shift.start_time);
        const aEnd = parseTimeToMinutes(a.shift.end_time);
        const bStart = parseTimeToMinutes(b.shift.start_time);
        const bEnd = parseTimeToMinutes(b.shift.end_time);

        if (aStart < 0 || aEnd < 0 || bStart < 0 || bEnd < 0) continue;

        const overlapStart = Math.max(aStart, bStart);
        const overlapEnd = Math.min(aEnd, bEnd);
        const overlap = overlapEnd - overlapStart;

        if (overlap > 0) {
          conflicts.push({
            shift_a: a.shift,
            shift_b: b.shift,
            employer_a: employerMap.get(a.employer_id)?.name || "Unknown",
            employer_b: employerMap.get(b.employer_id)?.name || "Unknown",
            overlap_minutes: overlap,
          });
        }
      }
    }
  }

  return conflicts;
}

export function forecastIncome(
  avgWeeklyHours: number,
  employer: Employer,
  weeksRemaining: number
): number {
  const weeklyGross = calculateGrossForEmployer(employer, avgWeeklyHours);
  return Math.round(weeklyGross * weeksRemaining * 100) / 100;
}

export function getPayrollDashboardStats(
  schedules: EnhancedWorkSchedule[],
  paystubs: PayStub[],
  employers: Employer[],
  month: string
): PayrollDashboardStats {
  const employerMap = new Map(employers.map((e) => [e.id, e]));

  // Filter stubs for selected month
  const monthStubs = paystubs.filter(
    (s) => s.pay_date.startsWith(month) || s.pay_period_start.startsWith(month)
  );
  const monthSchedules = schedules.filter((s) => s.start_date.startsWith(month) || s.created_at.startsWith(month));

  // Totals for month
  const gross_month = monthStubs.reduce((s, p) => s + p.gross_pay, 0);
  const net_month = monthStubs.reduce((s, p) => s + p.net_pay, 0);
  const taxes_month = gross_month - net_month;
  const total_hours_month = monthSchedules.reduce((s, sch) => s + sch.total_hours, 0);
  const effective_hourly_rate = total_hours_month > 0 ? gross_month / total_hours_month : 0;

  // Income by employer
  const incomeMap = new Map<string, EmployerIncome>();
  for (const stub of monthStubs) {
    const eid = stub.employer_id || "unknown";
    const emp = employerMap.get(eid);
    if (!incomeMap.has(eid)) {
      incomeMap.set(eid, {
        employer_id: eid,
        employer_name: emp?.name || stub.employer_name || "Unknown",
        color: emp?.color || "#6b7280",
        gross: 0,
        hours: 0,
      });
    }
    const entry = incomeMap.get(eid)!;
    entry.gross += stub.gross_pay;
    entry.hours += stub.regular_hours + stub.overtime_hours;
  }
  const income_by_employer = Array.from(incomeMap.values());

  // Weekly trend (last 8 weeks)
  const weekly_trend: WeeklyTrendEntry[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    const ws = weekStart.toISOString().slice(0, 10);
    const we = weekEnd.toISOString().slice(0, 10);

    const weekStubs = paystubs.filter(
      (s) => s.pay_date >= ws && s.pay_date <= we
    );
    const weekSchedules = schedules.filter(
      (s) => s.start_date >= ws && s.start_date <= we
    );

    weekly_trend.push({
      week_label: weekLabel,
      gross: weekStubs.reduce((s, p) => s + p.gross_pay, 0),
      net: weekStubs.reduce((s, p) => s + p.net_pay, 0),
      hours: weekSchedules.reduce((s, sch) => s + sch.total_hours, 0),
    });
  }

  // Monthly trend (last 6 months)
  const monthly_trend: MonthlyTrendEntry[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.toISOString().slice(0, 7);
    const mStubs = paystubs.filter(
      (s) => s.pay_date.startsWith(m) || s.pay_period_start.startsWith(m)
    );
    const mSchedules = schedules.filter(
      (s) => s.start_date.startsWith(m) || s.created_at.startsWith(m)
    );
    monthly_trend.push({
      month: m,
      gross: mStubs.reduce((s, p) => s + p.gross_pay, 0),
      net: mStubs.reduce((s, p) => s + p.net_pay, 0),
      hours: mSchedules.reduce((s, sch) => s + sch.total_hours, 0),
    });
  }

  return {
    total_hours_month,
    gross_month,
    net_month,
    taxes_month,
    effective_hourly_rate,
    income_by_employer,
    weekly_trend,
    monthly_trend,
  };
}

export function buildScheduleTree(
  schedules: EnhancedWorkSchedule[]
): Map<string, Map<string, EnhancedWorkSchedule[]>> {
  const tree = new Map<string, Map<string, EnhancedWorkSchedule[]>>();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (const schedule of schedules) {
    const date = schedule.start_date
      ? new Date(schedule.start_date)
      : new Date(schedule.created_at);
    const year = date.getFullYear().toString();
    const month = months[date.getMonth()];

    if (!tree.has(year)) tree.set(year, new Map());
    const yearMap = tree.get(year)!;
    if (!yearMap.has(month)) yearMap.set(month, []);
    yearMap.get(month)!.push(schedule);
  }

  return tree;
}
