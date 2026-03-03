"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createBrowserClient } from "@/lib/supabase/client";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const errorParam = searchParams.get("error");

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");

    const supabase = createBrowserClient();
    if (!supabase) {
      setError("Authentication not configured");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
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
            >
              <svg
                className="w-7 h-7 text-blue-400/80"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display font-bold text-4xl text-white mb-3"
          >
            Welcome
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-sm text-white/35"
          >
            Sign in to access your dashboard
          </motion.p>
        </motion.div>

        {/* Main glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[28px] p-8"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div
              className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06), transparent 70%)" }}
            />
          </div>

          {/* Error display */}
          {(error || errorParam) && (
            <div className="mb-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/15">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <p className="font-body text-sm text-red-400/90">
                {error || "Authentication failed. Please try again."}
              </p>
            </div>
          )}

          {/* Google Sign In Button */}
          <motion.button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative overflow-hidden rounded-2xl py-4 font-body text-sm font-medium text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
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

            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                {/* Google icon */}
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="relative z-10">Continue with Google</span>
              </>
            )}
          </motion.button>

          <p className="mt-6 text-center font-body text-xs text-white/20 relative z-10">
            Sign in with your Google account to access your dashboard
          </p>
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
