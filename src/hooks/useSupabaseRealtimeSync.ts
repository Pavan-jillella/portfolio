"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";
import { useLocalStorage } from "./useLocalStorage";

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _supabase = createClient(url, key);
  return _supabase;
}

/**
 * Sync writes through the server-side /api/sync endpoint.
 * The endpoint uses the service role key (bypasses RLS) and validates auth cookie.
 * This means the anon key never needs write access to any table.
 */
async function syncViaApi<T extends { id: string }>(
  tableName: string,
  prev: T[],
  next: T[]
) {
  try {
    const prevIds = new Set(prev.map((i) => i.id));
    const nextIds = new Set(next.map((i) => i.id));

    const toUpsert = next.filter((item) => {
      if (!prevIds.has(item.id)) return true;
      const prevItem = prev.find((p) => p.id === item.id);
      return JSON.stringify(prevItem) !== JSON.stringify(item);
    });

    const toDelete = prev.filter((item) => !nextIds.has(item.id)).map((i) => i.id);

    if (toUpsert.length === 0 && toDelete.length === 0) return;

    await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: tableName,
        upsert: toUpsert.length > 0 ? toUpsert : undefined,
        delete: toDelete.length > 0 ? toDelete : undefined,
      }),
    });
  } catch {
    // Silently fail — localStorage remains source of truth
  }
}

export function useSupabaseRealtimeSync<T extends { id: string }>(
  storageKey: string,
  tableName: string,
  defaultValue: T[]
): [T[], (updater: T[] | ((prev: T[]) => T[])) => void, boolean] {
  const [data, setLocalData] = useLocalStorage<T[]>(storageKey, defaultValue);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(getSupabaseClient());
  const initialSyncDone = useRef(false);
  const latestDataRef = useRef<T[]>(data);
  latestDataRef.current = data;

  // ── Initial sync: read from Supabase (anon key = SELECT only) ──
  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase || initialSyncDone.current) return;
    initialSyncDone.current = true;

    (async () => {
      try {
        const { data: rows, error } = await supabase.from(tableName).select("*");
        if (error) return; // table may not exist yet

        if (rows && rows.length > 0) {
          setLocalData(rows as T[]);
        } else {
          // Supabase is empty — push existing localStorage data via authenticated API
          const localRaw =
            typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
          const localData: T[] = localRaw ? JSON.parse(localRaw) : [];
          if (localData.length > 0) {
            await fetch("/api/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ table: tableName, upsert: localData }),
            });
          }
        }
      } catch {
        // Network error — continue with localStorage only
      }
    })();
  }, [tableName, storageKey, setLocalData]);

  // ── Realtime subscription (read-only, anon key is fine) ──
  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;

    try {
      const channel = supabase
        .channel(`realtime-${tableName}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setLocalData((prev) => {
                if (prev.some((item) => item.id === (payload.new as T).id)) return prev;
                return [payload.new as T, ...prev];
              });
            } else if (payload.eventType === "UPDATE") {
              setLocalData((prev) =>
                prev.map((item) =>
                  item.id === (payload.new as T).id ? (payload.new as T) : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setLocalData((prev) =>
                prev.filter((item) => item.id !== (payload.old as { id: string }).id)
              );
            }
          }
        )
        .subscribe((status) => {
          setIsConnected(status === "SUBSCRIBED");
        });

      channelRef.current = channel;

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Realtime not available, fall back to local storage only
    }
  }, [tableName, setLocalData]);

  // ── setData wrapper: writes go through authenticated /api/sync ──
  const setData = useCallback(
    (updater: T[] | ((prev: T[]) => T[])) => {
      setLocalData((prev) => {
        const next = updater instanceof Function ? updater(prev) : updater;

        // Fire-and-forget sync through server-side API
        syncViaApi(tableName, prev, next);

        return next;
      });
    },
    [setLocalData, tableName]
  );

  return [data, setData, isConnected];
}
