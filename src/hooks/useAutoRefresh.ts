"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoRefreshReturn {
  secondsRemaining: number;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
  intervalMinutes: number;
  setIntervalMinutes: (m: number) => void;
}

export function useAutoRefresh(
  onRefresh: () => Promise<void>,
  defaultIntervalMinutes: number = 5,
  enabled: boolean = true
): UseAutoRefreshReturn {
  const [intervalMinutes, setIntervalMinutes] = useState(defaultIntervalMinutes);
  const [secondsRemaining, setSecondsRemaining] = useState(intervalMinutes * 60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefreshRef.current();
    } finally {
      setIsRefreshing(false);
      setSecondsRemaining(intervalMinutes * 60);
    }
  }, [intervalMinutes]);

  // Initial refresh on mount
  useEffect(() => {
    if (enabled) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick every second (only when tab is visible)
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        setSecondsRemaining((s) => Math.max(s - 1, 0));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [enabled]);

  // Trigger refresh when countdown reaches 0
  useEffect(() => {
    if (enabled && secondsRemaining === 0 && !isRefreshing) {
      refresh();
    }
  }, [secondsRemaining, enabled, isRefreshing, refresh]);

  // Reset countdown when interval changes
  useEffect(() => {
    setSecondsRemaining(intervalMinutes * 60);
  }, [intervalMinutes]);

  return { secondsRemaining, isRefreshing, refresh, intervalMinutes, setIntervalMinutes };
}
