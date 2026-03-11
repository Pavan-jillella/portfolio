"use client";
import { useState, useMemo, useRef } from "react";
import { UploadedFile, Course } from "@/types";
import { formatFileSize } from "@/lib/education-utils";
import { FILE_TYPE_ICONS } from "@/lib/constants";

interface CourseLinkedFilesProps {
  courseId: string;
  courses: Course[];
  files: UploadedFile[];
  isStorageAvailable: boolean;
  onUpload: (file: File) => Promise<{ url: string; path: string } | null>;
  onAddFile: (file: Omit<UploadedFile, "id" | "created_at">) => void;
  onUpdateFile: (id: string, updates: Partial<UploadedFile>) => void;
}

export function CourseLinkedFiles({
  courseId,
  courses,
  files,
  isStorageAvailable,
  onUpload,
  onAddFile,
  onUpdateFile,
}: CourseLinkedFilesProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const linkedFiles = useMemo(
    () => files.filter((f) => f.linked_entity_type === "course" && f.linked_entity_ids?.includes(courseId)),
    [files, courseId]
  );

  const standaloneFiles = useMemo(
    () => files.filter((f) => !f.linked_entity_ids?.includes(courseId)),
    [files, courseId]
  );

  async function handleUpload(file: File) {
    if (file.size > 10 * 1024 * 1024) return;
    setIsUploading(true);
    const result = await onUpload(file);
    if (result) {
      onAddFile({
        file_name: file.name,
        file_url: result.url,
        file_type: file.type,
        file_size: file.size,
        storage_path: result.path,
        linked_entity_type: "course",
        linked_entity_ids: [courseId],
      });
    } else {
      onAddFile({
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        file_type: file.type,
        file_size: file.size,
        storage_path: "",
        linked_entity_type: "course",
        linked_entity_ids: [courseId],
      });
    }
    setIsUploading(false);
  }

  function linkExistingFile(fileId: string) {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    const newIds = [...(file.linked_entity_ids || []), courseId];
    onUpdateFile(fileId, { linked_entity_ids: newIds, linked_entity_type: "course" });
    setShowLinkPicker(false);
  }

  function unlinkFile(fileId: string) {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    const newIds = (file.linked_entity_ids || []).filter((id) => id !== courseId);
    onUpdateFile(fileId, {
      linked_entity_ids: newIds,
      linked_entity_type: newIds.length === 0 ? "standalone" : "course",
    });
  }

  function addCourseLink(fileId: string, addCourseId: string) {
    const file = files.find((f) => f.id === fileId);
    if (!file || file.linked_entity_ids?.includes(addCourseId)) return;
    onUpdateFile(fileId, { linked_entity_ids: [...(file.linked_entity_ids || []), addCourseId] });
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Documents</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLinkPicker(!showLinkPicker)}
            className="glass-card px-3 py-1.5 rounded-lg text-[10px] font-body text-white/40 hover:text-white/70 hover:border-blue-500/30 transition-all"
          >
            Link Existing
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={!isStorageAvailable || isUploading}
            className="glass-card px-3 py-1.5 rounded-lg text-[10px] font-body text-white/40 hover:text-white/70 hover:border-blue-500/30 transition-all disabled:opacity-40"
          >
            {isUploading ? "Uploading..." : "+ Upload"}
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        </div>
      </div>

      {/* Link existing file picker */}
      {showLinkPicker && standaloneFiles.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] max-h-32 overflow-y-auto">
          <p className="font-body text-[10px] text-white/30 mb-2">Select a file to link:</p>
          {standaloneFiles.map((f) => (
            <button
              key={f.id}
              onClick={() => linkExistingFile(f.id)}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="font-mono text-[9px] text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded uppercase">
                {FILE_TYPE_ICONS[f.file_type] || "FILE"}
              </span>
              <span className="font-body text-xs text-white/50 truncate">{f.file_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Linked files list */}
      {linkedFiles.length === 0 ? (
        <p className="font-body text-xs text-white/20 text-center py-4">No documents linked to this course.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {linkedFiles.map((f) => (
            <div key={f.id} className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all">
              <span className="font-mono text-[9px] text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded uppercase shrink-0">
                {FILE_TYPE_ICONS[f.file_type] || "FILE"}
              </span>
              <a
                href={f.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-white/60 hover:text-blue-400 truncate flex-1 min-w-0 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {f.file_name}
              </a>
              <span className="font-mono text-[9px] text-white/20 shrink-0">{formatFileSize(f.file_size)}</span>

              {/* Multi-course link badges */}
              {f.linked_entity_ids?.length > 1 && (
                <span className="font-mono text-[9px] text-blue-400/60 shrink-0">
                  +{f.linked_entity_ids.length - 1} course{f.linked_entity_ids.length > 2 ? "s" : ""}
                </span>
              )}

              {/* Quick-link to another course */}
              <select
                className="bg-transparent text-[9px] text-white/20 border-none focus:outline-none w-16 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                value=""
                onChange={(e) => {
                  if (e.target.value) addCourseLink(f.id, e.target.value);
                  e.target.value = "";
                }}
              >
                <option value="">+link</option>
                {courses
                  .filter((c) => !f.linked_entity_ids?.includes(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>

              <button
                onClick={() => unlinkFile(f.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400 shrink-0"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
