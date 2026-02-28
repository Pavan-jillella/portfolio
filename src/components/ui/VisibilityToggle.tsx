"use client";
import { useState } from "react";
import { useVisibility } from "@/hooks/useVisibility";
import { SectionKey, SECTION_LABELS } from "@/lib/visibility";

export function VisibilityToggle() {
  const [open, setOpen] = useState(false);
  const { visibility, toggleSection } = useVisibility();

  const keys = Object.keys(SECTION_LABELS) as SectionKey[];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-white/30 bg-white/4 border border-white/5 hover:border-white/10 hover:text-white/50 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Visibility
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 glass-card rounded-xl p-3 space-y-1">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-wider px-2 mb-2">Section Visibility</p>
            {keys.map((key) => (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/4 transition-colors"
              >
                <span className="font-body text-xs text-white/60">{SECTION_LABELS[key]}</span>
                <div
                  className={`w-8 h-4 rounded-full transition-colors ${
                    visibility[key] ? "bg-blue-500" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white mt-0.5 transition-transform ${
                      visibility[key] ? "translate-x-4.5 ml-4" : "translate-x-0.5 ml-0.5"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
