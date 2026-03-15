export interface SectionVisibility {
  github: boolean;
  leetcode: boolean;
  study: boolean;
  activity: boolean;
  analytics: boolean;
  financeTracker: boolean;
  notes: boolean;
  files: boolean;
}

export const DEFAULT_VISIBILITY: SectionVisibility = {
  github: true,
  leetcode: true,
  study: true,
  activity: true,
  analytics: true,
  financeTracker: true,
  notes: true,
  files: true,
};

export type SectionKey = keyof SectionVisibility;

export const SECTION_LABELS: Record<SectionKey, string> = {
  github: "GitHub",
  leetcode: "LeetCode",
  study: "Study Sessions",
  activity: "Activity Feed",
  analytics: "Analytics",
  financeTracker: "Finance Tracker",
  notes: "Notes",
  files: "Files",
};
