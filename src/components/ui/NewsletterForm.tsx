"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-body text-sm text-emerald-400">
        You're subscribed! Thanks for joining.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 bg-white/5 border border-white/10 text-white rounded-full px-5 py-2.5 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="glass-card px-5 py-2.5 rounded-full font-body text-sm text-white/80 hover:text-white transition-all duration-200 hover:border-blue-500/30 disabled:opacity-50 shrink-0"
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
