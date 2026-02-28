"use client";
import { useState, useMemo } from "react";
import { UploadedFile } from "@/types";
import { formatFileSize } from "@/lib/education-utils";
import { SupabaseStorageFallback } from "./SupabaseStorageFallback";
import { FileUploader } from "./FileUploader";
import { FileList } from "./FileList";
import { FilePreview } from "./FilePreview";
import { motion } from "framer-motion";

interface FilesTabProps {
  files: UploadedFile[];
  isStorageAvailable: boolean;
  onUpload: (file: File) => Promise<{ url: string; path: string } | null>;
  onDelete: (id: string, storagePath: string) => void;
  onAddFile: (file: Omit<UploadedFile, "id" | "created_at">) => void;
}

const FILTER_OPTIONS = ["all", "course", "project", "note", "standalone"] as const;

export function FilesTab({ files, isStorageAvailable, onUpload, onDelete, onAddFile }: FilesTabProps) {
  const [filter, setFilter] = useState<string>("all");
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? files : files.filter((f) => f.linked_entity_type === filter)),
    [files, filter]
  );

  const totalSize = useMemo(() => files.reduce((s, f) => s + f.file_size, 0), [files]);

  if (!isStorageAvailable && files.length === 0) {
    return <SupabaseStorageFallback />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-semibold text-xl text-white">Files</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-body text-xs text-white/40 mb-1">Total Files</p>
          <p className="font-display font-bold text-2xl text-white">{files.length}</p>
        </motion.div>
        <motion.div className="glass-card rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="font-body text-xs text-white/40 mb-1">Total Size</p>
          <p className="font-display font-bold text-2xl text-white">{formatFileSize(totalSize)}</p>
        </motion.div>
      </div>

      {/* Upload */}
      <FileUploader onUpload={onUpload} onFileAdded={onAddFile} />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-all ${
              filter === opt ? "glass-card text-blue-400" : "text-white/40 hover:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* File list */}
      <FileList files={filtered} onDelete={onDelete} onPreview={setPreviewFile} />

      {/* Preview modal */}
      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}
