"use client";
import { useState, useMemo } from "react";
import { Note, NoteVersion, Course, DashboardProject } from "@/types";
import { searchNotes } from "@/lib/education-utils";
import { NoteSearch } from "./NoteSearch";
import { NoteCard } from "./NoteCard";
import { NoteEditor } from "./NoteEditor";
import { NoteAITools } from "./NoteAITools";

interface NotesTabProps {
  notes: Note[];
  versions: NoteVersion[];
  courses: Course[];
  projects: DashboardProject[];
  onAddNote: (note: Omit<Note, "id" | "created_at" | "updated_at">) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onSaveVersion: (version: Omit<NoteVersion, "id">) => void;
  onRestoreVersion: (noteId: string, contentHtml: string) => void;
}

export function NotesTab({
  notes,
  versions,
  courses,
  projects,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onSaveVersion,
  onRestoreVersion,
}: NotesTabProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => searchNotes(notes, searchQuery), [notes, searchQuery]);
  const sortedNotes = useMemo(
    () => [...filteredNotes].sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [filteredNotes]
  );
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  function handleNewNote() {
    onAddNote({ title: "Untitled Note", content_html: "", linked_course_id: null, linked_project_id: null, tags: [] });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">Notes</h2>
        <button
          onClick={handleNewNote}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          + New Note
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left panel - note list */}
        <div className="flex flex-col gap-4">
          <NoteSearch value={searchQuery} onChange={setSearchQuery} />
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
            {sortedNotes.length === 0 ? (
              <p className="font-body text-sm text-white/20 text-center py-8">
                {searchQuery ? "No notes match your search." : "No notes yet. Create your first note."}
              </p>
            ) : (
              sortedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={selectedNoteId === note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  onDelete={onDeleteNote}
                />
              ))
            )}
          </div>
        </div>

        {/* Right panel - editor */}
        <div className="flex flex-col gap-4">
          {selectedNote && <NoteAITools note={selectedNote} />}
          <div className="glass-card rounded-2xl p-6">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                versions={versions}
                courses={courses}
                projects={projects}
                onUpdate={onUpdateNote}
                onSaveVersion={onSaveVersion}
                onRestoreVersion={onRestoreVersion}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p className="font-body text-sm text-white/20">Select a note to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
