"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { useLocalStorage } from "./useLocalStorage";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function useSupabaseRealtimeSync<T extends { id: string }>(
  storageKey: string,
  tableName: string,
  defaultValue: T[]
): [T[], (updater: T[] | ((prev: T[]) => T[])) => void, boolean] {
  const [data, setData] = useLocalStorage<T[]>(storageKey, defaultValue);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const channel = supabase
        .channel(`realtime-${tableName}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setData((prev) => [payload.new as T, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setData((prev) =>
                prev.map((item) =>
                  item.id === (payload.new as T).id ? (payload.new as T) : item
                )
              );
            } else if (payload.eventType === "DELETE") {
              setData((prev) =>
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
  }, [tableName, setData]);

  return [data, setData, isConnected];
}
