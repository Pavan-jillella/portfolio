"use client";
import { UploadedFile } from "@/types";
import { formatFileSize } from "@/lib/education-utils";
import { FILE_TYPE_ICONS } from "@/lib/constants";

interface NoteFileAttachmentProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

export function NoteFileAttachment({ files, onRemove }: NoteFileAttachmentProps) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((f) => (
        <div
          key={f.id}
          className="inline-flex items-center gap-2 glass-card rounded-lg px-3 py-1.5 group"
        >
          <span className="font-mono text-[10px] text-white/40 uppercase">
            {FILE_TYPE_ICONS[f.file_type] || "FILE"}
          </span>
          <span className="font-body text-xs text-white/60 truncate max-w-[120px]">{f.file_name}</span>
          <span className="font-mono text-[10px] text-white/20">{formatFileSize(f.file_size)}</span>
          <button
            onClick={() => onRemove(f.id)}
            className="text-xs text-red-400/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
