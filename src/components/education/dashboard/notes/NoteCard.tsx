"use client";
import { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, isSelected, onClick, onDelete }: NoteCardProps) {
  const excerpt = note.content_html.replace(/<[^>]*>/g, "").slice(0, 80);
  const date = new Date(note.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      onClick={onClick}
      className={`group glass-card rounded-xl p-4 cursor-pointer transition-all relative ${
        isSelected ? "border-blue-500/30" : "hover:border-white/10"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400"
      >
        &times;
      </button>

      <h4 className="font-body font-medium text-sm text-white truncate pr-4">{note.title || "Untitled"}</h4>
      {excerpt && <p className="font-body text-xs text-white/30 mt-1 line-clamp-2">{excerpt}</p>}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="font-mono text-[10px] text-white/20">{date}</span>
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 text-[10px]">
            {tag}
          </span>
        ))}
        {note.linked_course_id && (
          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px]">Course</span>
        )}
        {note.linked_project_id && (
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">Project</span>
        )}
      </div>
    </div>
  );
}
