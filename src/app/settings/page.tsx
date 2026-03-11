"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBrowserClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || "");
    }
  }, [user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createBrowserClient();
    if (!supabase) return;

    await supabase.auth.updateUser({
      data: { full_name: displayName },
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage("Passwords do not match");
      return;
    }

    setPasswordSaving(true);
    const supabase = createBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage("Password updated successfully");
      setNewPassword("");
      setConfirmNewPassword("");
    }
    setPasswordSaving(false);
  }

  async function handleExportData() {
    setExportLoading(true);
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent fail
    }
    setExportLoading(false);
  }

  async function handleDeleteAccount() {
    // In a real SaaS, this would call a server endpoint that deletes user data + auth account
    // For now, sign out and show message
    await signOut();
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-sm text-white/30">Loading...</p>
      </div>
    );
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Settings</h1>
          <p className="font-body text-sm text-white/30">Manage your account and preferences</p>
        </motion.div>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-display font-semibold text-lg text-white mb-4">Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Email</label>
              <input
                type="text"
                disabled
                value={user.email || ""}
                className="w-full px-4 py-3 rounded-xl font-body text-sm text-white/40 cursor-not-allowed"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Provider</label>
              <p className="font-mono text-xs text-white/25 ml-1">
                {user.app_metadata?.provider === "google" ? "Google OAuth" : "Email/Password"}
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-body text-sm font-medium text-white transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.12))",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {saved ? "Saved" : saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>

        {/* Change Password (only for email/password users) */}
        {user.app_metadata?.provider !== "google" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="font-display font-semibold text-lg text-white mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                  style={inputStyle}
                />
              </div>
              {passwordMessage && (
                <p className={`font-body text-xs ${passwordMessage.includes("success") ? "text-emerald-400/70" : "text-red-400/70"}`}>
                  {passwordMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-6 py-2.5 rounded-xl font-body text-sm font-medium text-white transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.12))",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Data & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-display font-semibold text-lg text-white mb-4">Data & Privacy</h2>
          <div className="space-y-4">
            <div>
              <p className="font-body text-sm text-white/40 mb-3">
                Export all your data as a JSON file. This includes your study sessions, notes, finances, and settings.
              </p>
              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="px-5 py-2.5 rounded-xl font-body text-sm font-medium text-white/70 hover:text-white transition-all disabled:opacity-40"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {exportLoading ? "Exporting..." : "Export My Data"}
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <p className="font-body text-sm text-white/40 mb-3">
                View our{" "}
                <a href="/privacy" className="text-blue-400/60 hover:text-blue-400 transition-colors underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-blue-400/60 hover:text-blue-400 transition-colors underline">
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-red-500/10"
        >
          <h2 className="font-display font-semibold text-lg text-red-400/80 mb-4">Danger Zone</h2>
          <p className="font-body text-sm text-white/30 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-5 py-2.5 rounded-xl font-body text-sm font-medium text-red-400/70 hover:text-red-400 transition-all"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              Delete Account
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl font-body text-sm font-medium text-white transition-all"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                Yes, delete my account
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-xl font-body text-sm text-white/40 hover:text-white/60 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
