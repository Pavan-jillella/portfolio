"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { FadeIn } from "@/components/ui/FadeIn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError("Authentication is not configured. Add Supabase credentials to proceed.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <FadeIn>
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-3xl text-white mb-2">Admin Login</h1>
            <p className="font-body text-sm text-white/40">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-5">
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3 font-body text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3 font-body text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="font-body text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>
      </FadeIn>
    </section>
  );
}
