"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_DIGITS = 10;
const emptyPin = () => Array(TOTAL_DIGITS).fill("");

export default function LoginPage() {
  const [pin, setPin] = useState(emptyPin());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const filledCount = pin.filter((d) => d !== "").length;
  const progress = filledCount / TOTAL_DIGITS;

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError("");

    if (value && index < TOTAL_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === TOTAL_DIGITS - 1 && newPin.every((d) => d !== "")) {
      submitPin(newPin.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const full = pin.join("");
      if (full.length === TOTAL_DIGITS) submitPin(full);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, TOTAL_DIGITS);
    if (!pasted) return;
    const newPin = [...pin];
    for (let i = 0; i < pasted.length; i++) {
      newPin[i] = pasted[i];
    }
    setPin(newPin);
    if (pasted.length === TOTAL_DIGITS) {
      submitPin(newPin.join(""));
    } else {
      inputRefs.current[Math.min(pasted.length, TOTAL_DIGITS - 1)]?.focus();
    }
  }

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }, []);

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
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        setError("Invalid PIN");
        triggerShake();
        setPin(emptyPin());
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch {
      setError("Something went wrong");
      triggerShake();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-blue-600/[0.07] blur-[120px] blob-1" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.05] blur-[100px] blob-2" />
        <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] rounded-full bg-cyan-400/[0.04] blur-[80px] blob-3" />
        <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full bg-indigo-500/[0.06] blur-[90px] blob-4" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      {/* Progress glow ring at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(59,130,246,${progress * 0.8}), rgba(6,182,212,${progress * 0.6}), transparent)`,
        }}
        animate={{ opacity: progress > 0 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Lock icon with pulse ring */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Outer pulse rings */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border border-blue-500/10"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-20 h-20 rounded-full border border-blue-400/15"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Glass icon container */}
            <motion.div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
              animate={success ? { scale: [1, 1.1, 1], borderColor: "rgba(34,197,94,0.4)" } : {}}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.svg
                    key="check"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-7 h-7 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="lock"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="w-7 h-7 text-blue-400/80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display font-bold text-4xl text-white mb-3"
          >
            {success ? "Welcome" : "Enter PIN"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-sm text-white/35"
          >
            {success ? "Redirecting to dashboard..." : "Enter your 10-digit access code"}
          </motion.p>
        </motion.div>

        {/* Main glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={shake ? { duration: 0.5 } : { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[28px] p-8 pb-7"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Inner glow on card */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div
              className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06), transparent 70%)" }}
            />
          </div>

          {/* PIN label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em]">Access Code</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </motion.div>

          {/* PIN input grid — two rows of 5 */}
          <div className="space-y-3 mb-6" onPaste={handlePaste}>
            {[0, 5].map((rowStart) => (
              <div key={rowStart} className="flex gap-2.5 justify-center">
                {pin.slice(rowStart, rowStart + 5).map((digit, i) => {
                  const index = rowStart + i;
                  const isFilled = digit !== "";
                  const isFocusTarget = index === filledCount;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.04 }}
                      className="relative"
                    >
                      <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={loading || success}
                        className="relative z-10 w-12 h-14 text-center rounded-xl font-mono text-xl text-white focus:outline-none transition-all duration-300 disabled:opacity-40 bg-transparent border"
                        style={{
                          borderColor: isFilled
                            ? "rgba(59,130,246,0.35)"
                            : isFocusTarget
                              ? "rgba(59,130,246,0.2)"
                              : "rgba(255,255,255,0.06)",
                          background: isFilled
                            ? "rgba(59,130,246,0.08)"
                            : "rgba(255,255,255,0.03)",
                          boxShadow: isFilled
                            ? "0 0 20px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.03)"
                            : "inset 0 1px 0 rgba(255,255,255,0.02)",
                        }}
                      />
                      {/* Dot indicator below each input */}
                      <motion.div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        animate={{
                          backgroundColor: isFilled ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.1)",
                          scale: isFilled ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="relative h-0.5 rounded-full bg-white/[0.04] mb-6 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: success
                  ? "linear-gradient(90deg, rgba(34,197,94,0.6), rgba(34,197,94,0.8))"
                  : "linear-gradient(90deg, rgba(59,130,246,0.4), rgba(6,182,212,0.6))",
              }}
              animate={{ width: success ? "100%" : `${progress * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/15">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <p className="font-body text-sm text-red-400/90">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="button"
            disabled={loading || pin.some((d) => d === "") || success}
            onClick={() => submitPin(pin.join(""))}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden rounded-2xl py-4 font-body text-sm font-medium text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(6,182,212,0.6))",
              boxShadow: progress === 1 && !success
                ? "0 8px 32px rgba(59,130,246,0.25), 0 0 0 1px rgba(59,130,246,0.2)"
                : "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Verifying...
                </span>
              ) : success ? (
                "Authenticated"
              ) : (
                "Unlock"
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <p className="font-mono text-[10px] text-white/12 uppercase tracking-[0.25em]">
            Pavan Jillella &mdash; Portfolio
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
