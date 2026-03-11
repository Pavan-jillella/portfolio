"use client";
import { useState, useRef, useEffect } from "react";
import { Course } from "@/types";

interface MultiCourseSelectProps {
  courses: Course[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function MultiCourseSelect({ courses, selectedIds, onChange }: MultiCourseSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  const selectedCourses = courses.filter((c) => selectedIds.includes(c.id));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 font-body text-xs focus:outline-none focus:border-blue-500/50 transition-all flex items-center justify-between gap-2"
      >
        <span className="truncate text-white/60">
          {selectedIds.length === 0
            ? "None"
            : `${selectedIds.length} course${selectedIds.length > 1 ? "s" : ""} linked`}
        </span>
        <svg
          className={`w-3 h-3 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-[#111] border border-white/10 rounded-lg shadow-xl">
          {courses.length === 0 ? (
            <p className="px-3 py-2 font-body text-xs text-white/20">No courses available</p>
          ) : (
            courses.map((c) => {
              const checked = selectedIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(c.id)}
                    className="w-3 h-3 rounded border-white/20 bg-white/5 accent-blue-500"
                  />
                  <span className="font-body text-xs text-white/60 truncate">{c.name}</span>
                  <span className="font-mono text-[9px] text-white/20 ml-auto shrink-0">{c.platform}</span>
                </label>
              );
            })
          )}
        </div>
      )}

      {selectedCourses.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {selectedCourses.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px]"
            >
              {c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name}
              <button
                onClick={() => toggle(c.id)}
                className="text-blue-400/50 hover:text-blue-400"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
