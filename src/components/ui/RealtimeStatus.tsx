"use client";
import { useState } from "react";

type SyncState = "idle" | "syncing" | "success" | "error";

interface RealtimeStatusProps {
  isConnected: boolean;
  onSync?: () => Promise<{ synced: number; failed: string[] }>;
}

export function RealtimeStatus({ isConnected, onSync }: RealtimeStatusProps) {
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [syncMessage, setSyncMessage] = useState("");

  async function handleSync() {
    if (!onSync || syncState === "syncing") return;
    setSyncState("syncing");
    setSyncMessage("");
    try {
      const result = await onSync();
      if (result.failed.length > 0) {
        setSyncState("error");
        setSyncMessage(`${result.failed.join(", ")}`);
        console.error("[Sync] Failed tables:", result.failed);
        setTimeout(() => { setSyncState("idle"); setSyncMessage(""); }, 5000);
      } else {
        setSyncState("success");
        setSyncMessage(`${result.synced} table${result.synced !== 1 ? "s" : ""}`);
        setTimeout(() => { setSyncState("idle"); setSyncMessage(""); }, 2500);
      }
    } catch (err) {
      setSyncState("error");
      setSyncMessage(err instanceof Error ? err.message : "Unknown error");
      console.error("[Sync] Error:", err);
      setTimeout(() => { setSyncState("idle"); setSyncMessage(""); }, 5000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5" title={isConnected ? "Real-time sync active" : "Local only"}>
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
          }`}
        />
        <span className="font-mono text-[10px] text-white/20">
          {isConnected ? "Live" : "Local"}
        </span>
      </div>
      {onSync && (
        <button
          onClick={handleSync}
          disabled={syncState === "syncing"}
          title={syncMessage || undefined}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] transition-all ${
            syncState === "syncing"
              ? "border-blue-500/20 bg-blue-500/10 text-blue-400 cursor-wait"
              : syncState === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : syncState === "error"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-white/8 bg-white/4 text-white/30 hover:text-white/60 hover:border-white/15"
          }`}
        >
          {syncState === "syncing" && (
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {syncState === "success" && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {syncState === "error" && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
          {syncState === "idle" && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.3" />
            </svg>
          )}
          {syncState === "syncing"
            ? "Syncing..."
            : syncState === "success"
              ? `Synced ${syncMessage}`
              : syncState === "error"
                ? `Failed: ${syncMessage}`
                : "Sync Now"}
        </button>
      )}
    </div>
  );
}
