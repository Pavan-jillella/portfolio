"use client";
import { useMemo, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createSearchIndex, SearchItem } from "@/lib/search-index";
import { formatCurrency } from "@/lib/finance-utils";

export function useSearchIndex() {
  const [notes] = useLocalStorage<any[]>("pj-edu-notes", []);
  const [courses] = useLocalStorage<any[]>("pj-courses", []);
  const [projects] = useLocalStorage<any[]>("pj-edu-projects", []);
  const [transactions] = useLocalStorage<any[]>("pj-transactions", []);
  const [studySessions] = useLocalStorage<any[]>("pj-study-sessions", []);
  const [subscriptions] = useLocalStorage<any[]>("pj-subscriptions", []);
  const [payStubs] = useLocalStorage<any[]>("pj-pay-stubs", []);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/search-data")
      .then((r) => r.json())
      .then((data) => setBlogPosts(data.posts || []))
      .catch(() => {});
  }, []);

  const items = useMemo<SearchItem[]>(() => {
    const all: SearchItem[] = [];

    notes.forEach((n: any) => {
      all.push({
        id: `note-${n.id}`,
        type: "note",
        title: n.title || "Untitled Note",
        description: (n.content_html || "").replace(/<[^>]*>/g, "").slice(0, 200),
        tags: n.tags || [],
        url: "/education/dashboard",
      });
    });

    courses.forEach((c: any) => {
      all.push({
        id: `course-${c.id}`,
        type: "course",
        title: c.name || "Untitled Course",
        description: `${c.platform || ""} — ${c.progress || 0}% complete`,
        tags: [c.category, c.platform].filter(Boolean),
        url: "/education/dashboard",
      });
    });

    projects.forEach((p: any) => {
      all.push({
        id: `project-${p.id}`,
        type: "project",
        title: p.name || "Untitled Project",
        description: p.description || "",
        tags: [],
        url: "/education/dashboard",
      });
    });

    blogPosts.forEach((b: any) => {
      all.push({
        id: `blog-${b.slug}`,
        type: "blog",
        title: b.title,
        description: b.description || "",
        tags: b.tags || [],
        url: `/blog/${b.slug}`,
      });
    });

    transactions.forEach((t: any) => {
      all.push({
        id: `tx-${t.id}`,
        type: "transaction",
        title: t.description || t.category || "Transaction",
        description: `${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)} · ${t.category} · ${t.date}`,
        tags: [t.category, t.type].filter(Boolean),
        url: "/finance/tracker",
      });
    });

    studySessions.forEach((s: any) => {
      all.push({
        id: `session-${s.id}`,
        type: "session",
        title: s.subject || "Study Session",
        description: `${s.duration_minutes}min · ${s.date}${s.notes ? " · " + s.notes.slice(0, 100) : ""}`,
        tags: [s.subject].filter(Boolean),
        url: "/education/dashboard",
      });
    });

    subscriptions.forEach((sub: any) => {
      all.push({
        id: `sub-${sub.id}`,
        type: "subscription",
        title: sub.name || "Subscription",
        description: `${formatCurrency(sub.amount)}/${sub.frequency} · ${sub.category || ""}`,
        tags: [sub.category].filter(Boolean),
        url: "/finance/tracker",
      });
    });

    payStubs.forEach((ps: any) => {
      all.push({
        id: `paystub-${ps.id}`,
        type: "paystub",
        title: `${ps.employer_name || "Pay Stub"} — ${ps.pay_date}`,
        description: `Gross ${formatCurrency(ps.gross_pay)} · Net ${formatCurrency(ps.net_pay)}`,
        tags: [ps.employer_name].filter(Boolean),
        url: "/finance/tracker",
      });
    });

    return all;
  }, [notes, courses, projects, blogPosts, transactions, studySessions, subscriptions, payStubs]);

  const index = useMemo(() => createSearchIndex(items), [items]);

  function search(query: string): SearchItem[] {
    if (!query.trim()) return [];
    return index.search(query).map((r) => r.item);
  }

  return { search, isReady: items.length > 0 };
}
