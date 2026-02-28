"use client";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  "What am I studying?",
  "Summarize my projects",
  "How many LeetCode problems?",
  "Top expense categories?",
  "What courses am I taking?",
  "Give me study tips",
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="px-3 py-1.5 rounded-full text-[11px] font-body text-white/30 bg-white/3 hover:bg-white/5 hover:text-white/50 transition-all"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
