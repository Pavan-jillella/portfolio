"use client";
import { useState, useEffect } from "react";

interface TableStatus {
  tables: Record<string, boolean>;
  allExist: boolean;
  missingTables: string[];
  migrationSql: string | null;
  supabaseDashboardUrl: string;
}

export default function SetupPage() {
  const [status, setStatus] = useState<TableStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup-db")
      .then((r) => r.json())
      .then(setStatus)
      .finally(() => setLoading(false));
  }, []);

  function handleCopy() {
    if (status?.migrationSql) {
      navigator.clipboard.writeText(status.migrationSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleRefresh() {
    setLoading(true);
    fetch("/api/admin/setup-db")
      .then((r) => r.json())
      .then(setStatus)
      .finally(() => setLoading(false));
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed — check console.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="font-display text-2xl font-bold text-white mb-2">Database Setup</h1>
      <p className="font-body text-sm text-white/40 mb-8">
        Supabase cloud storage for persistent data sync.
      </p>

      {loading ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/40 animate-pulse">Checking tables...</p>
        </div>
      ) : status?.allExist ? (
        <div className="glass-card rounded-2xl p-8 text-center border-emerald-500/20">
          <p className="font-body text-lg text-emerald-400 mb-2">All tables are set up</p>
          <p className="font-body text-sm text-white/30">
            Your data is syncing to Supabase cloud storage.
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {status &&
              Object.entries(status.tables).map(([name, exists]) => (
                <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
                  <span className={`w-2 h-2 rounded-full ${exists ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="font-mono text-xs text-white/50">{name}</span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Table status */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-display font-semibold text-sm text-white mb-4">Table Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {status &&
                Object.entries(status.tables).map(([name, exists]) => (
                  <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03]">
                    <span className={`w-2 h-2 rounded-full ${exists ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className="font-mono text-xs text-white/50">{name}</span>
                  </div>
                ))}
            </div>
            {status && status.missingTables.length > 0 && (
              <p className="font-body text-xs text-yellow-400/60 mt-3">
                {status.missingTables.length} table(s) need to be created.
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-sm text-white">Setup Instructions</h2>
            <ol className="font-body text-sm text-white/50 space-y-2 list-decimal list-inside">
              <li>Copy the migration SQL below</li>
              <li>Open the Supabase SQL Editor</li>
              <li>Paste and run the SQL</li>
              <li>Come back here and click &quot;Refresh&quot; to verify</li>
            </ol>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
              >
                {copied ? "Copied!" : "Copy SQL"}
              </button>
              <a
                href={status?.supabaseDashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-blue-400/60 hover:text-blue-400 transition-all hover:border-blue-500/30 inline-flex items-center gap-2"
              >
                Open SQL Editor
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button
                onClick={handleRefresh}
                className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* SQL Preview */}
          {status?.migrationSql && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display font-semibold text-sm text-white mb-3">Migration SQL</h2>
              <pre className="bg-black/30 rounded-xl p-4 overflow-x-auto max-h-96 overflow-y-auto">
                <code className="font-mono text-xs text-white/50 whitespace-pre">
                  {status.migrationSql}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Data Backup */}
      {!loading && (
        <div className="glass-card rounded-2xl p-6 mt-8">
          <h2 className="font-display font-semibold text-sm text-white mb-2">Data Backup</h2>
          <p className="font-body text-xs text-white/40 mb-4">
            Download a full JSON snapshot of all database tables.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-emerald-400/60 hover:text-emerald-400 transition-all hover:border-emerald-500/30 disabled:opacity-40 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {exporting ? "Exporting..." : "Download Backup"}
          </button>
        </div>
      )}
    </div>
  );
}
