"use client";
import { useMemo, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createSearchIndex, SearchItem } from "@/lib/search-index";

export function useSearchIndex() {
  const [notes] = useLocalStorage<any[]>("pj-edu-notes", []);
  const [courses] = useLocalStorage<any[]>("pj-courses", []);
  const [projects] = useLocalStorage<any[]>("pj-edu-projects", []);
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

    return all;
  }, [notes, courses, projects, blogPosts]);

  const index = useMemo(() => createSearchIndex(items), [items]);

  function search(query: string): SearchItem[] {
    if (!query.trim()) return [];
    return index.search(query).map((r) => r.item);
  }

  return { search, isReady: items.length > 0 };
}
