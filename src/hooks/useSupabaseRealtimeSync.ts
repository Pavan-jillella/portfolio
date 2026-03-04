"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBrowserClient } from "@/lib/supabase/client";

/**
 * Sync writes through the server-side /api/sync endpoint.
 * The endpoint uses the service role key (bypasses RLS) and validates session.
 * It also injects user_id into all records automatically.
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
  const { user } = useAuth();
  const [data, setLocalData] = useLocalStorage<T[]>(storageKey, defaultValue);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  // Use the SSR-aware browser client (carries auth session for RLS)
  useEffect(() => {
    supabaseRef.current = createBrowserClient();
  }, []);
  const initialSyncDone = useRef(false);
  const latestDataRef = useRef<T[]>(data);
  const previousUserRef = useRef<string | null>(null);
  latestDataRef.current = data;

  // Reset when user changes (login/logout/switch account)
  useEffect(() => {
    const newUserId = user?.id ?? null;
    const prevUserId = previousUserRef.current;

    if (prevUserId !== newUserId) {
      previousUserRef.current = newUserId;
      initialSyncDone.current = false;

      // Only clear data when switching between actual users or logging out.
      // On initial page load (null → userId), preserve localStorage so that
      // data survives refresh even when Supabase tables don't exist yet.
      if (prevUserId !== null) {
        setLocalData(defaultValue);
      }
    }
  }, [user, defaultValue, setLocalData]);

  // ── Initial sync: read from Supabase (RLS filters by user_id) ──
  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase || initialSyncDone.current || !user) return;
    initialSyncDone.current = true;

    (async () => {
      try {
        const { data: rows, error } = await supabase.from(tableName).select("*");
        if (error) return; // table may not exist yet

        if (rows && rows.length > 0) {
          setLocalData(rows as T[]);
        }
        // If Supabase is empty, start fresh — do NOT push stale localStorage
        // data that may belong to a different user
      } catch {
        // Network error — continue with localStorage only
      }
    })();
  }, [tableName, storageKey, setLocalData, user]);

  // ── Realtime subscription (filtered by user_id) ──
  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase || !user) return;

    try {
      const channel = supabase
        .channel(`realtime-${tableName}-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: tableName,
            filter: `user_id=eq.${user.id}`,
          },
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
  }, [tableName, setLocalData, user]);

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
