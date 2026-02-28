"use client";
import { useState } from "react";
import { PayStub } from "@/types";
import { parseGoogleSheetsCSV, generateId, formatCurrency } from "@/lib/finance-utils";

interface GoogleSheetsImportProps {
  existingStubs: PayStub[];
  savedUrl: string;
  onImport: (stubs: PayStub[]) => void;
}

export function GoogleSheetsImport({ existingStubs, savedUrl, onImport }: GoogleSheetsImportProps) {
  const [url, setUrl] = useState(savedUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Partial<PayStub>[]>([]);

  const inputCls = "w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:border-blue-500/50 transition-all";

  async function handleFetch() {
    if (!url) return;
    setLoading(true);
    setError("");
    setPreview([]);

    try {
      const res = await fetch("/api/finance/payroll-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch");
        return;
      }
      const parsed = parseGoogleSheetsCSV(data.csv);
      if (parsed.length === 0) {
        setError("No valid rows found in spreadsheet. Check column headers match expected format.");
        return;
      }
      setPreview(parsed);
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleConfirmImport() {
    // Deduplicate by pay_date + gross_pay combo
    const existingKeys = new Set(
      existingStubs.map((s) => `${s.pay_date}|${s.gross_pay}`)
    );

    const newStubs: PayStub[] = preview
      .filter((p) => !existingKeys.has(`${p.pay_date}|${p.gross_pay}`))
      .map((p) => ({
        id: generateId(),
        employer_name: "",
        pay_period_start: p.pay_period_start || "",
        pay_period_end: p.pay_period_end || "",
        pay_date: p.pay_date || "",
        regular_hours: p.regular_hours || 0,
        overtime_hours: p.overtime_hours || 0,
        hourly_rate: p.hourly_rate || 0,
        gross_pay: p.gross_pay || 0,
        deductions: p.deductions || {
          federal_tax: 0,
          state_tax: 0,
          social_security: 0,
          medicare: 0,
          other_deductions: 0,
          other_deductions_label: "",
        },
        net_pay: p.net_pay || 0,
        source: "google-sheets" as const,
        created_at: new Date().toISOString(),
      }));

    const skipped = preview.length - newStubs.length;
    onImport(newStubs);
    setPreview([]);
    if (skipped > 0) {
      setError(`Imported ${newStubs.length} stubs. Skipped ${skipped} duplicates.`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-semibold text-lg text-white">Import from Google Sheets</h3>
        <p className="font-body text-sm text-white/40">
          Publish your Google Sheet as CSV (File → Share → Publish to web → CSV format), then paste the URL below.
        </p>

        <div className="space-y-2">
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">Expected Columns</p>
          <p className="font-mono text-xs text-white/30">
            Pay Period Start, Pay Period End, Pay Date, Gross Pay, Federal Tax, State Tax, Social Security, Medicare, Other Deductions, Net Pay, Regular Hours, Overtime Hours, Hourly Rate
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className={`${inputCls} flex-1`}
          />
          <button
            onClick={handleFetch}
            disabled={loading || !url}
            className="glass-card px-5 py-3 rounded-2xl text-sm font-body text-blue-300 hover:border-blue-500/30 transition-all disabled:opacity-30"
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {error && (
          <p className="font-body text-sm text-yellow-400/80">{error}</p>
        )}
      </div>

      {/* Preview table */}
      {preview.length > 0 && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-white">
              Preview ({preview.length} rows)
            </h4>
            <button
              onClick={handleConfirmImport}
              className="glass-card px-5 py-2 rounded-xl text-sm font-body text-emerald-400 hover:border-emerald-500/30 transition-all"
            >
              Confirm Import
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="font-mono text-[10px] text-white/25 uppercase py-2 pr-4">Pay Date</th>
                  <th className="font-mono text-[10px] text-white/25 uppercase py-2 pr-4">Period</th>
                  <th className="font-mono text-[10px] text-white/25 uppercase py-2 pr-4 text-right">Gross</th>
                  <th className="font-mono text-[10px] text-white/25 uppercase py-2 pr-4 text-right">Taxes</th>
                  <th className="font-mono text-[10px] text-white/25 uppercase py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((p, i) => {
                  const taxes =
                    (p.deductions?.federal_tax || 0) +
                    (p.deductions?.state_tax || 0) +
                    (p.deductions?.social_security || 0) +
                    (p.deductions?.medicare || 0) +
                    (p.deductions?.other_deductions || 0);
                  return (
                    <tr key={i} className="border-b border-white/[0.03]">
                      <td className="font-mono text-xs text-white/50 py-2 pr-4">{p.pay_date}</td>
                      <td className="font-mono text-xs text-white/30 py-2 pr-4">
                        {p.pay_period_start} – {p.pay_period_end}
                      </td>
                      <td className="font-mono text-xs text-white/50 py-2 pr-4 text-right">
                        {formatCurrency(p.gross_pay || 0)}
                      </td>
                      <td className="font-mono text-xs text-red-400/60 py-2 pr-4 text-right">
                        {formatCurrency(taxes)}
                      </td>
                      <td className="font-mono text-xs text-emerald-400 py-2 text-right">
                        {formatCurrency(p.net_pay || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
