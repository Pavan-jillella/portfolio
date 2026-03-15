"use client";
import { useRef } from "react";
import { CourseFile } from "@/types";
import { FILE_TYPE_ICONS } from "@/lib/constants";
import { formatFileSize } from "@/lib/education-utils";

interface CourseFileUploadProps {
  courseId: string;
  files: CourseFile[];
  onAdd: (file: Omit<CourseFile, "id" | "created_at">) => void;
  onDelete: (id: string) => void;
}

export function CourseFileUpload({ courseId, files, onAdd, onDelete }: CourseFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onAdd({
      course_id: courseId,
      file_name: file.name,
      file_url: url,
      file_type: file.type,
      file_size: file.size,
      storage_path: "",
    });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-white">Course Files</h3>
        <button
          onClick={() => inputRef.current?.click()}
          className="glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          + Upload File
        </button>
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={handleFileSelect} />

      {files.length === 0 ? (
        <p className="font-body text-sm text-white/20 text-center py-4">No files uploaded yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <span className="font-mono text-[10px] text-white/40 bg-white/[0.06] px-2 py-1 rounded uppercase shrink-0">
                {FILE_TYPE_ICONS[f.file_type] || "FILE"}
              </span>
              <a
                href={f.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-white/70 hover:text-blue-400 truncate flex-1 transition-colors"
              >
                {f.file_name}
              </a>
              <span className="font-mono text-xs text-white/30 shrink-0">{formatFileSize(f.file_size)}</span>
              <button
                onClick={() => onDelete(f.id)}
                className="sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400 shrink-0"
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
