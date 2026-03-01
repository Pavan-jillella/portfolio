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
  AppsScriptShift,
  AppsScriptWeek,
  ScheduleShift,
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

  // Weekly trend (last 8 weeks relative to selected month end)
  const weekly_trend: WeeklyTrendEntry[] = [];
  const [selYear, selMon] = month.split("-").map(Number);
  const monthEnd = new Date(selYear, selMon, 0); // last day of selected month
  for (let i = 7; i >= 0; i--) {
    const weekEnd = new Date(monthEnd);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);
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

  // Monthly trend (6 months ending at selected month)
  const monthly_trend: MonthlyTrendEntry[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(selYear, selMon - 1 - i, 1);
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

export function formatShiftTime(raw: string): string {
  if (!raw) return "";
  const dateMatch = raw.match(/(\d{2}):(\d{2}):\d{2}\s+GMT/);
  if (dateMatch) {
    let h = parseInt(dateMatch[1]);
    const m = dateMatch[2];
    const suffix = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return m === "00" ? `${h}${suffix}` : `${h}:${m}${suffix}`;
  }
  return raw;
}

export function appsScriptToShifts(data: AppsScriptShift[]): ScheduleShift[] {
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const shiftMap = new Map<string, AppsScriptShift>();
  data.forEach((s) => shiftMap.set(s.day, s));

  return allDays.map((day) => {
    const s = shiftMap.get(day);
    if (s && s.hours > 0) {
      return {
        day,
        start_time: formatShiftTime(s.start),
        end_time: formatShiftTime(s.end),
        hours: s.hours,
      };
    }
    return { day, start_time: "", end_time: "", hours: 0 };
  });
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Detect whether a CSV is schedule history or pay stubs based on headers.
 * Returns "schedule-history" if headers match the schedule format,
 * "pay-stubs" otherwise.
 */
export function detectCSVType(csv: string): "schedule-history" | "pay-stubs" {
  const firstLine = csv.trim().split("\n")[0]?.toLowerCase() || "";
  if (
    firstLine.includes("week label") ||
    firstLine.includes("total hours") ||
    firstLine.includes("pretty label")
  ) {
    return "schedule-history";
  }
  return "pay-stubs";
}

/**
 * Parse schedule history CSV (from Google Sheets) into AppsScriptWeek[].
 * Expected columns: Week Label, Total Hours, Change, Trend, Status, Total Pay, Pretty Label
 */
export function parseScheduleHistoryCSV(csv: string): AppsScriptWeek[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const results: AppsScriptWeek[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length < 2) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });

    const totalHours = parseFloat(row["total_hours"]) || 0;
    if (totalHours === 0 && !row["week_label"]) continue; // skip empty rows

    results.push({
      weekLabel: row["week_label"] || "",
      totalHours,
      change: parseFloat(row["change"]) || 0,
      trend: row["trend"] || "",
      status: row["status"] || "",
      totalPay: parseFloat(row["total_pay"]) || 0,
      prettyLabel: row["pretty_label"] || row["week_label"] || "",
    });
  }

  return results;
}
