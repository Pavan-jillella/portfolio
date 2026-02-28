"use client";
import { CourseStatus } from "@/types";
import { COURSE_STATUS_CONFIG } from "@/lib/constants";

interface CourseFiltersProps {
  current: CourseStatus | "all";
  onChange: (status: CourseStatus | "all") => void;
}

const filters: { id: CourseStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "planned", label: "Planned" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export function CourseFilters({ current, onChange }: CourseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
            current === f.id
              ? "glass-card text-blue-400"
              : "text-white/40 hover:text-white"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
