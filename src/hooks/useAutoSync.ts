"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { AppsScriptData, AppsScriptWeek } from "@/types";
import { detectCSVType, parseScheduleHistoryCSV } from "@/lib/payroll-utils";

interface AutoSyncConfig {
  enabled: boolean;
  url: string;
  intervalMinutes: number;
  lastSyncedAt: string | null;
}

interface AutoSyncCallbacks {
  onScheduleData: (data: AppsScriptData) => void;
  onScheduleHistory: (history: AppsScriptWeek[]) => void;
  onPayStubData: (csv: string) => void;
  onSyncComplete: (timestamp: string) => void;
}

interface AutoSyncResult {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  triggerSync: () => Promise<void>;
}

export function useAutoSync(
  config: AutoSyncConfig,
  callbacks: AutoSyncCallbacks
): AutoSyncResult {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(config.lastSyncedAt);
  const [syncError, setSyncError] = useState<string | null>(null);

  const hasSyncedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const doSync = useCallback(async () => {
    if (!config.url || isSyncing) return;

    // Skip if synced less than 60 seconds ago
    if (lastSyncedAt) {
      const elapsed = Date.now() - new Date(lastSyncedAt).getTime();
      if (elapsed < 60000) return;
    }

    setIsSyncing(true);
    setSyncError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/finance/payroll-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: config.url }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setSyncError("Rate limited. Will retry later.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSyncError(data.error || "Sync failed");
        return;
      }

      const result = await res.json();
      const timestamp = new Date().toISOString();

      if (result.type === "apps-script" && result.data) {
        callbacksRef.current.onScheduleData(result.data as AppsScriptData);
      } else if (result.type === "csv" && result.csv) {
        const csvType = detectCSVType(result.csv);
        if (csvType === "schedule-history") {
          const history = parseScheduleHistoryCSV(result.csv);
          if (history.length > 0) {
            callbacksRef.current.onScheduleHistory(history);
          }
        } else {
          callbacksRef.current.onPayStubData(result.csv);
        }
      }

      setLastSyncedAt(timestamp);
      callbacksRef.current.onSyncComplete(timestamp);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setSyncError("Network error");
    } finally {
      setIsSyncing(false);
      abortRef.current = null;
    }
  }, [config.url, isSyncing, lastSyncedAt]);

  // Auto-sync on mount
  useEffect(() => {
    if (!config.enabled || !config.url || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    // Small delay to let the UI settle
    const timer = setTimeout(() => {
      doSync();
    }, 1500);

    return () => clearTimeout(timer);
  }, [config.enabled, config.url, doSync]);

  // Periodic polling
  useEffect(() => {
    if (!config.enabled || !config.url || config.intervalMinutes < 1) return;

    const intervalMs = config.intervalMinutes * 60 * 1000;

    const interval = setInterval(() => {
      // Only sync when tab is visible
      if (document.visibilityState === "visible") {
        doSync();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [config.enabled, config.url, config.intervalMinutes, doSync]);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    isSyncing,
    lastSyncedAt,
    syncError,
    triggerSync: doSync,
  };
}
