"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [pin, setPin] = useState(["", "", "", "", "", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError("");

    if (value && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 9 && newPin.every((d) => d !== "")) {
      submitPin(newPin.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const full = pin.join("");
      if (full.length === 10) submitPin(full);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10);
    if (!pasted) return;
    const newPin = [...pin];
    for (let i = 0; i < pasted.length; i++) {
      newPin[i] = pasted[i];
    }
    setPin(newPin);
    if (pasted.length === 10) {
      submitPin(newPin.join(""));
    } else {
      inputRefs.current[Math.min(pasted.length, 9)]?.focus();
    }
  }

  async function submitPin(code: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Invalid PIN");
        setPin(["", "", "", "", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/[0.06] blur-[100px] blob-1" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.04] blur-[80px] blob-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[120px] blob-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-card mb-6">
            <span className="font-display font-bold text-2xl text-white">
              PJ<span className="text-blue-400">.</span>
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            Enter PIN
          </h1>
          <p className="font-body text-sm text-white/40">
            Enter your 10-digit PIN to continue
          </p>
        </motion.div>

        {/* PIN card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 space-y-6"
        >
          {/* PIN inputs */}
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                className="w-10 h-12 text-center bg-white/[0.04] border border-white/[0.08] rounded-xl font-mono text-lg text-white placeholder-white/10 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="font-body text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="button"
            disabled={loading || pin.some((d) => d === "")}
            onClick={() => submitPin(pin.join(""))}
            className="w-full relative overflow-hidden rounded-2xl py-3.5 font-body text-sm font-medium text-white transition-all duration-300 disabled:opacity-50 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-500" />
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Unlock"
              )}
            </span>
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 font-mono text-[10px] text-white/15 uppercase tracking-widest"
        >
          Pavan Jillella &mdash; Portfolio
        </motion.p>
      </motion.div>
    </div>
  );
}
