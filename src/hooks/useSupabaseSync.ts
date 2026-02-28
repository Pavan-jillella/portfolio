"use client";
import { useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { createBrowserClient } from "@/lib/supabase/client";

export function useSupabaseSync<T extends { id: string }>(
  localStorageKey: string,
  supabaseTable: string,
  initialValue: T[]
): [T[], (value: T[] | ((prev: T[]) => T[])) => void] {
  const [data, setData] = useLocalStorage<T[]>(localStorageKey, initialValue);

  useEffect(() => {
    const supabase = createBrowserClient();
    if (!supabase) return;

    async function fetchRemote() {
      const sb = createBrowserClient();
      if (!sb) return;
      const { data: remote, error } = await sb
        .from(supabaseTable)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && remote && remote.length > 0) {
        setData(remote as T[]);
      }
    }
    fetchRemote();
  }, [supabaseTable]); // eslint-disable-line react-hooks/exhaustive-deps

  const setDataWithSync = useCallback(
    (value: T[] | ((prev: T[]) => T[])) => {
      setData(value);
    },
    [setData]
  );

  return [data, setDataWithSync];
}
