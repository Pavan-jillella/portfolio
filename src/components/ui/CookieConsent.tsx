"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "pj-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    // Disable analytics when declined
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__ph_opt_out = true;
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-50 rounded-2xl p-5"
          style={{
            background: "linear-gradient(145deg, rgba(15,17,25,0.95), rgba(10,12,18,0.98))",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <p className="font-body text-sm text-white/50 mb-4 leading-relaxed">
            We use cookies for authentication and analytics.{" "}
            <a href="/privacy" className="text-blue-400/60 hover:text-blue-400 underline transition-colors">
              Learn more
            </a>
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={accept}
              className="flex-1 py-2.5 rounded-xl font-body text-sm font-medium text-white transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.12))",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              Accept
            </button>
            <button
              onClick={decline}
              className="flex-1 py-2.5 rounded-xl font-body text-sm text-white/40 hover:text-white/60 transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
