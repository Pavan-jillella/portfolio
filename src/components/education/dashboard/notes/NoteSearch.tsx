"use client";
import { useState, useEffect, useCallback } from "react";

interface NoteSearchProps {
  value: string;
  onChange: (query: string) => void;
}

export function NoteSearch({ value, onChange }: NoteSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (val: string) => {
      const timer = setTimeout(() => onChange(val), 300);
      return () => clearTimeout(timer);
    },
    [onChange]
  );

  useEffect(() => {
    const cleanup = debouncedOnChange(localValue);
    return cleanup;
  }, [localValue, debouncedOnChange]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search notes..."
        className="bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-8 py-2.5 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all w-full"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
        >
          &times;
        </button>
      )}
    </div>
  );
}
