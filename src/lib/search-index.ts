import Fuse from "fuse.js";

export interface SearchItem {
  id: string;
  type: "blog" | "note" | "course" | "project" | "transaction" | "session" | "subscription" | "paystub";
  title: string;
  description: string;
  content?: string;
  tags?: string[];
  url?: string;
}

export function createSearchIndex(items: SearchItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "content", weight: 1 },
      { name: "tags", weight: 2 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
}
