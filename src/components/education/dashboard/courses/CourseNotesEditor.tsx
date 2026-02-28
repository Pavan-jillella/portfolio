"use client";
import { useState, useEffect } from "react";
import { CourseNote } from "@/types";

interface CourseNotesEditorProps {
  courseId: string;
  courseNotes: CourseNote[];
  onSave: (note: Omit<CourseNote, "id" | "created_at">) => void;
}

export function CourseNotesEditor({ courseId, courseNotes, onSave }: CourseNotesEditorProps) {
  const existingNote = courseNotes.find((n) => n.course_id === courseId);
  const [content, setContent] = useState(existingNote?.content_html || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const note = courseNotes.find((n) => n.course_id === courseId);
    setContent(note?.content_html || "");
    setIsDirty(false);
  }, [courseId, courseNotes]);

  function handleSave() {
    onSave({ course_id: courseId, content_html: content, updated_at: new Date().toISOString() });
    setLastSaved(new Date());
    setIsDirty(false);
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-white">Course Notes</h3>
        <span className="font-mono text-[10px] text-white/30">
          {isDirty ? "Unsaved changes" : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ""}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsDirty(true);
        }}
        placeholder="Write your course notes here..."
        className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 font-mono text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all w-full resize-y min-h-[200px]"
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}
