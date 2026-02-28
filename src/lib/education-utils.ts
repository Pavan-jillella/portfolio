import {
  StudySession,
  StudyGoal,
  CourseModule,
  Note,
  DashboardProject,
  RecentActivity,
} from "@/types";

/** Format a Date as YYYY-MM-DD in local timezone (not UTC) */
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Get Monday of the current week in local timezone */
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? 6 : day - 1; // days since Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getStudyStreak(sessions: StudySession[]): number {
  if (sessions.length === 0) return 0;
  const dates = Array.from(new Set(sessions.map((s) => s.date))).sort().reverse();
  if (dates.length === 0) return 0;

  const today = toLocalDateStr(new Date());
  const yesterday = toLocalDateStr(new Date(Date.now() - 86400000));

  // Streak must start from today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const curr = new Date(dates[i] + "T00:00:00");
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getDailyStudyData(
  sessions: StudySession[],
  days: number = 7
): { date: string; minutes: number }[] {
  const result: { date: string; minutes: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = toLocalDateStr(d);
    const total = sessions
      .filter((s) => s.date === dateStr)
      .reduce((sum, s) => sum + s.duration_minutes, 0);
    result.push({ date: dateStr, minutes: total });
  }
  return result;
}

export function getWeeklyStudyData(
  sessions: StudySession[],
  weeks: number = 4
): { weekLabel: string; minutes: number }[] {
  const result: { weekLabel: string; minutes: number }[] = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);
    const startStr = toLocalDateStr(weekStart);
    const endStr = toLocalDateStr(weekEnd);
    const total = sessions
      .filter((s) => s.date >= startStr && s.date <= endStr)
      .reduce((sum, s) => sum + s.duration_minutes, 0);
    result.push({
      weekLabel: `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      minutes: total,
    });
  }
  return result;
}

export function getSubjectBreakdown(
  sessions: StudySession[]
): { subject: string; minutes: number }[] {
  const map = new Map<string, number>();
  sessions.forEach((s) => {
    map.set(s.subject, (map.get(s.subject) || 0) + s.duration_minutes);
  });
  return Array.from(map.entries())
    .map(([subject, minutes]) => ({ subject, minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function getWeeklyGoalProgress(
  sessions: StudySession[],
  goals: StudyGoal[]
): { subject: string; currentHours: number; targetHours: number }[] {
  const monday = getMondayOfWeek(new Date());
  const weekStartStr = toLocalDateStr(monday);

  return goals.map((goal) => {
    const weekSessions = sessions.filter(
      (s) => s.subject === goal.subject && s.date >= weekStartStr
    );
    const totalMinutes = weekSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    return {
      subject: goal.subject,
      currentHours: totalMinutes / 60,
      targetHours: goal.target_hours_per_week,
    };
  });
}

export function calculateModuleProgress(modules: CourseModule[]): number {
  if (modules.length === 0) return 0;
  const completed = modules.filter((m) => m.completed).length;
  return Math.round((completed / modules.length) * 100);
}

export function getRecentActivity(
  sessions: StudySession[],
  notes: Note[],
  projects: DashboardProject[]
): RecentActivity[] {
  const activities: RecentActivity[] = [];

  sessions.slice(0, 10).forEach((s) => {
    activities.push({
      id: s.id,
      type: "study",
      description: `Studied ${s.subject} for ${formatDuration(s.duration_minutes)}`,
      timestamp: s.created_at,
    });
  });

  notes.slice(0, 10).forEach((n) => {
    activities.push({
      id: n.id,
      type: "note",
      description: `Updated note: ${n.title}`,
      timestamp: n.updated_at,
    });
  });

  projects.slice(0, 10).forEach((p) => {
    activities.push({
      id: p.id,
      type: "project",
      description: `Project: ${p.name} (${p.status})`,
      timestamp: p.updated_at,
    });
  });

  return activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 15);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getWeekStart(date: Date): string {
  return toLocalDateStr(getMondayOfWeek(date));
}

export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  const q = query.toLowerCase();
  return notes.filter((n) => {
    const titleMatch = n.title.toLowerCase().includes(q);
    const contentMatch = n.content_html
      .replace(/<[^>]*>/g, "")
      .toLowerCase()
      .includes(q);
    const tagMatch = n.tags.some((t) => t.toLowerCase().includes(q));
    return titleMatch || contentMatch || tagMatch;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
