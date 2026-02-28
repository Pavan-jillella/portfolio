"use client";
import { UploadedFile } from "@/types";
import { formatFileSize } from "@/lib/education-utils";
import { motion, AnimatePresence } from "framer-motion";

interface FilePreviewProps {
  file: UploadedFile | null;
  onClose: () => void;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  return (
    <AnimatePresence>
      {file && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="glass-card rounded-2xl p-6 w-full max-w-2xl relative z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-white truncate pr-4">{file.file_name}</h3>
              <button onClick={onClose} className="text-white/30 hover:text-white transition-colors text-lg shrink-0">
                &times;
              </button>
            </div>

            {/* Preview area */}
            {file.file_type.startsWith("image/") ? (
              <div className="rounded-xl overflow-hidden bg-white/[0.02] mb-4">
                <img src={file.file_url} alt={file.file_name} className="max-h-[400px] mx-auto object-contain" />
              </div>
            ) : (
              <div className="rounded-xl bg-white/[0.02] p-8 text-center mb-4">
                <p className="font-body text-sm text-white/40">Preview not available for this file type.</p>
              </div>
            )}

            {/* File info */}
            <div className="flex items-center gap-4 text-sm">
              <span className="font-mono text-xs text-white/30">{file.file_type}</span>
              <span className="font-mono text-xs text-white/30">{formatFileSize(file.file_size)}</span>
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
              >
                Download
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
