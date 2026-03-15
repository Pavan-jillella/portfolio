"use client";
import { useState } from "react";

interface ConfirmDeleteProps {
  onConfirm: () => void;
  label?: string;
  className?: string;
}

export function ConfirmDelete({ onConfirm, label = "Delete", className = "" }: ConfirmDeleteProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span className="text-xs text-white/40 font-body">Sure?</span>
        <button
          onClick={() => { onConfirm(); setConfirming(false); }}
          className="text-xs text-red-400 hover:text-red-300 font-body transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-white/30 hover:text-white/50 font-body transition-colors"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`text-xs text-red-400/50 hover:text-red-400 transition-colors font-body ${className}`}
    >
      {label}
    </button>
  );
}
