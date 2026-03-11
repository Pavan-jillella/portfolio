"use client";
import { useState, useRef } from "react";
import { UploadedFile } from "@/types";

interface FileUploaderProps {
  onUpload: (file: File) => Promise<{ url: string; path: string } | null>;
  onFileAdded: (file: Omit<UploadedFile, "id" | "created_at">) => void;
}

export function FileUploader({ onUpload, onFileAdded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }
    setError("");
    setIsUploading(true);

    const result = await onUpload(file);
    if (result) {
      onFileAdded({
        file_name: file.name,
        file_url: result.url,
        file_type: file.type,
        file_size: file.size,
        storage_path: result.path,
        linked_entity_type: "standalone",
        linked_entity_ids: [],
      });
    } else {
      // Fallback: use local URL
      onFileAdded({
        file_name: file.name,
        file_url: URL.createObjectURL(file),
        file_type: file.type,
        file_size: file.size,
        storage_path: "",
        linked_entity_type: "standalone",
        linked_entity_ids: [],
      });
    }
    setIsUploading(false);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragging ? "border-blue-500/30 bg-blue-500/5" : "border-white/10 hover:border-white/20"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      {isUploading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <span className="font-body text-sm text-white/40">Uploading...</span>
        </div>
      ) : (
        <>
          <svg className="w-8 h-8 text-white/20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="font-body text-sm text-white/40">Drop files here or click to browse</p>
          <p className="font-mono text-[10px] text-white/20 mt-1">Max 10MB</p>
        </>
      )}
      {error && <p className="font-body text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
