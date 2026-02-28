"use client";
import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

interface UseSupabaseStorageReturn {
  isAvailable: boolean;
  upload: (file: File, path: string) => Promise<{ url: string; path: string } | null>;
  remove: (path: string) => Promise<boolean>;
}

export function useSupabaseStorage(): UseSupabaseStorageReturn {
  const [supabase] = useState(() => createBrowserClient());
  const isAvailable = !!supabase;

  async function upload(file: File, path: string): Promise<{ url: string; path: string } | null> {
    if (!supabase) return null;
    try {
      const { error } = await supabase.storage
        .from("education-files")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) return null;
      const { data } = supabase.storage.from("education-files").getPublicUrl(path);
      return { url: data.publicUrl, path };
    } catch {
      return null;
    }
  }

  async function remove(path: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.storage.from("education-files").remove([path]);
      return !error;
    } catch {
      return false;
    }
  }

  return { isAvailable, upload, remove };
}
