"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Note, NoteVersion, Course, DashboardProject } from "@/types";
import { NoteVersionHistory } from "./NoteVersionHistory";

const TipTapEditor = dynamic(
  () => import("./TipTapEditor").then((m) => ({ default: m.TipTapEditor })),
  { ssr: false, loading: () => <div className="h-[200px] bg-white/[0.02] rounded-xl animate-pulse" /> }
);

interface NoteEditorProps {
  note: Note;
  versions: NoteVersion[];
  courses: Course[];
  projects: DashboardProject[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onSaveVersion: (version: Omit<NoteVersion, "id">) => void;
  onRestoreVersion: (noteId: string, contentHtml: string) => void;
}

export function NoteEditor({
  note,
  versions,
  courses,
  projects,
  onUpdate,
  onSaveVersion,
  onRestoreVersion,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content_html);
  const [tagInput, setTagInput] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content_html);
  }, [note.id, note.title, note.content_html]);

  function scheduleAutoSave(updates: Partial<Note>) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(note.id, { ...updates, updated_at: new Date().toISOString() });
    }, 2000);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    scheduleAutoSave({ title: val, content_html: content });
  }

  function handleContentChange(html: string) {
    setContent(html);
    scheduleAutoSave({ title, content_html: html });
  }

  function addTag() {
    if (!tagInput.trim()) return;
    const newTags = [...note.tags, tagInput.trim()];
    onUpdate(note.id, { tags: newTags, updated_at: new Date().toISOString() });
    setTagInput("");
  }

  function removeTag(tag: string) {
    onUpdate(note.id, { tags: note.tags.filter((t) => t !== tag), updated_at: new Date().toISOString() });
  }

  function handleSaveVersion() {
    onSaveVersion({ note_id: note.id, content_html: content, saved_at: new Date().toISOString() });
  }

  function handleRestore(html: string) {
    setContent(html);
    onRestoreVersion(note.id, html);
  }

  const noteVersions = versions.filter((v) => v.note_id === note.id);

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title..."
        className="bg-transparent font-display font-bold text-xl text-white placeholder-white/20 focus:outline-none border-none w-full"
      />

      {/* TipTap editor */}
      <TipTapEditor content={content} onChange={handleContentChange} placeholder="Start writing..." />

      {/* Tags */}
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {note.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-white/40 text-xs">
              {tag}
              <button onClick={() => removeTag(tag)} className="text-red-400/50 hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
          placeholder="Add tag..."
          className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 font-body text-xs placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all w-40"
        />
      </div>

      {/* Link to course/project */}
      <div className="flex items-center gap-4">
        <div>
          <label className="font-body text-[10px] text-white/30 block mb-1">Link to Course</label>
          <select
            value={note.linked_course_id || ""}
            onChange={(e) => onUpdate(note.id, { linked_course_id: e.target.value || null, updated_at: new Date().toISOString() })}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 font-body text-xs focus:outline-none focus:border-blue-500/50 appearance-none w-48"
          >
            <option value="">None</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] text-white/30 block mb-1">Link to Project</label>
          <select
            value={note.linked_project_id || ""}
            onChange={(e) => onUpdate(note.id, { linked_project_id: e.target.value || null, updated_at: new Date().toISOString() })}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 font-body text-xs focus:outline-none focus:border-blue-500/50 appearance-none w-48"
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSaveVersion}
          className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          Save Version
        </button>
        <button
          onClick={() => setShowVersions(true)}
          className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          History ({noteVersions.length})
        </button>
      </div>

      <NoteVersionHistory
        open={showVersions}
        onClose={() => setShowVersions(false)}
        versions={noteVersions}
        onRestore={handleRestore}
      />
    </div>
  );
}
