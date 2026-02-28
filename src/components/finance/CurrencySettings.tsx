"use client";
import { useState, useEffect } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

interface CurrencySettingsProps {
  displayCurrency: string;
  onCurrencyChange: (code: string) => void;
}

export function CurrencySettings({ displayCurrency, onCurrencyChange }: CurrencySettingsProps) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  async function fetchRates() {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/currency");
      if (!res.ok) return;
      const data = await res.json();
      setRates(data.rates || {});
      setLastUpdated(data.updated || "");
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-3">Display Currency</h4>
        <p className="font-body text-xs text-white/30 mb-4">
          Select your preferred currency for display. All amounts will be shown in this currency.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => onCurrencyChange(c.code)}
              className={`px-3 py-2 rounded-xl text-xs font-body transition-all ${
                displayCurrency === c.code
                  ? "glass-card text-blue-400 border-blue-500/30"
                  : "text-white/30 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              <span className="block font-mono text-sm">{c.symbol}</span>
              <span className="block mt-0.5">{c.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-semibold text-sm text-white">Live Exchange Rates (vs USD)</h4>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="text-xs font-body text-white/30 hover:text-white transition-colors"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        {lastUpdated && (
          <p className="font-body text-xs text-white/20 mb-3">Last updated: {lastUpdated}</p>
        )}
        {Object.keys(rates).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SUPPORTED_CURRENCIES.filter((c) => c.code !== "USD").map((c) => (
              <div key={c.code} className="glass-card rounded-xl p-3 text-center">
                <p className="font-body text-xs text-white/40">{c.code}</p>
                <p className="font-mono text-sm text-white">
                  {rates[c.code] ? rates[c.code].toFixed(4) : "—"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-xs text-white/20">
            {loading ? "Loading exchange rates..." : "Unable to load exchange rates"}
          </p>
        )}
      </div>
    </div>
  );
}
