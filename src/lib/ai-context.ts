interface AIContextData {
  studySessions?: { subject: string; duration_minutes: number; date?: string; created_at?: string; notes?: string }[];
  notes?: { title: string; tags?: string[]; updated_at?: string }[];
  courses?: { name: string; platform?: string; status?: string; progress?: number }[];
  projects?: { name: string; description?: string; status?: string; tech_stack?: string[] }[];
  transactions?: { type: string; category: string; amount: number }[];
  savingsGoals?: { name: string; target_amount: number; current_amount: number }[];
}

export function buildAIContext(data: AIContextData): string {
  const sections: string[] = [];

  if (data.studySessions?.length) {
    const totalMinutes = data.studySessions.reduce((s, ss) => s + (ss.duration_minutes || 0), 0);
    const subjects = new Map<string, number>();
    data.studySessions.forEach((ss) => {
      subjects.set(ss.subject, (subjects.get(ss.subject) || 0) + (ss.duration_minutes || 0));
    });
    const topSubjects = Array.from(subjects.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([s, m]) => `${s} (${Math.round(m / 60)}h)`)
      .join(", ");

    const recent = data.studySessions.slice(0, 5).map((s) => `${s.subject}: ${s.duration_minutes}min`).join("; ");

    sections.push(`[Study] Total: ${Math.round(totalMinutes / 60)}h across ${data.studySessions.length} sessions. Top subjects: ${topSubjects}. Recent: ${recent}`);
  }

  if (data.notes?.length) {
    const titles = data.notes.slice(0, 20).map((n) => n.title).join(", ");
    const allTags = Array.from(new Set(data.notes.flatMap((n) => n.tags || []))).slice(0, 15).join(", ");
    sections.push(`[Notes] ${data.notes.length} notes. Titles: ${titles}. Tags: ${allTags}`);
  }

  if (data.courses?.length) {
    const courseList = data.courses.slice(0, 10).map((c) => {
      const progress = c.progress ? ` (${c.progress}%)` : "";
      return `${c.name}${progress}`;
    }).join(", ");
    sections.push(`[Courses] ${data.courses.length} courses: ${courseList}`);
  }

  if (data.projects?.length) {
    const projectList = data.projects.slice(0, 10).map((p) => {
      const tech = p.tech_stack?.join(", ") || "";
      return `${p.name}${tech ? ` [${tech}]` : ""}`;
    }).join("; ");
    sections.push(`[Projects] ${data.projects.length} projects: ${projectList}`);
  }

  if (data.transactions?.length) {
    const income = data.transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = data.transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const topCats = new Map<string, number>();
    data.transactions.filter((t) => t.type === "expense").forEach((t) => {
      topCats.set(t.category, (topCats.get(t.category) || 0) + t.amount);
    });
    const topExpenses = Array.from(topCats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c, a]) => `${c}: $${Math.round(a)}`)
      .join(", ");
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    sections.push(`[Finance] ${data.transactions.length} transactions. Savings rate: ${savingsRate}%. Top expenses: ${topExpenses}`);
  }

  if (data.savingsGoals?.length) {
    const goalList = data.savingsGoals.map((g) => `${g.name}: $${g.current_amount}/$${g.target_amount}`).join(", ");
    sections.push(`[Savings Goals] ${goalList}`);
  }

  return sections.join("\n");
}
