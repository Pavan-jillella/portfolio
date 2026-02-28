"use client";
import { useState } from "react";
import { TurnstileWidget } from "./TurnstileWidget";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.honeypot) return;
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "", honeypot: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <h3 className="font-display font-semibold text-xl text-white mb-3">Message sent!</h3>
        <p className="font-body text-sm text-white/40">Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 glass-card px-6 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-6">
      <div className="hidden">
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          maxLength={100}
          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          maxLength={5000}
          rows={5}
          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-red-400">
          Something went wrong. Please try again or email me directly.
        </p>
      )}

      <TurnstileWidget onSuccess={setTurnstileToken} />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send message →"}
      </button>
    </form>
  );
}
