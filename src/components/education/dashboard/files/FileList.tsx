"use client";
import { UploadedFile } from "@/types";
import { FILE_TYPE_ICONS } from "@/lib/constants";
import { formatFileSize } from "@/lib/education-utils";

interface FileListProps {
  files: UploadedFile[];
  onDelete: (id: string, storagePath: string) => void;
  onPreview: (file: UploadedFile) => void;
}

export function FileList({ files, onDelete, onPreview }: FileListProps) {
  const sorted = [...files].sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (sorted.length === 0) {
    return <p className="font-body text-sm text-white/20 text-center py-8">No files uploaded yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((f) => (
        <div
          key={f.id}
          onClick={() => onPreview(f)}
          className="group glass-card rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-white/10 transition-all"
        >
          <span className="font-mono text-[10px] text-white/40 bg-white/[0.06] px-2 py-1 rounded uppercase shrink-0">
            {FILE_TYPE_ICONS[f.file_type] || "FILE"}
          </span>
          <span className="font-body text-sm text-white/70 truncate flex-1 min-w-0">{f.file_name}</span>
          <span className="font-mono text-xs text-white/30 shrink-0">{formatFileSize(f.file_size)}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-white/20 text-[10px] shrink-0">
            {f.linked_entity_type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(f.id, f.storage_path);
            }}
            className="sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400 shrink-0"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
