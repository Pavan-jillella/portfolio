"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PageHeader } from "@/components/ui/PageHeader";

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
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [location, setLocation] = useLocalStorage<string>("pj-location", "New York, NY");
  const [locationSaved, setLocationSaved] = useState(false);

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
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }
      await signOut();
    } catch {
      setDeleteError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-sm text-white/30">Loading...</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all";

  return (
    <>
      <PageHeader
        label="Account"
        title="Settings"
        description="Manage your account and preferences."
      />

      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto space-y-8">
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
                  className={`${inputClass} text-white/40 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Provider</label>
                <p className="font-mono text-xs text-white/25 ml-1">
                  {user.app_metadata?.provider === "google" ? "Google OAuth" : "Email/Password"}
                </p>
              </div>
              <div>
                <label className="block font-body text-xs text-white/30 mb-1.5 ml-1">Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, NY"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => { setLocationSaved(true); setTimeout(() => setLocationSaved(false), 2000); }}
                    className="shrink-0 px-4 py-2.5 rounded-xl font-body text-xs font-medium text-emerald-400/70 bg-emerald-500/[0.06] border border-emerald-500/15 hover:border-emerald-500/25 transition-all"
                  >
                    {locationSaved ? "Saved" : "Update"}
                  </button>
                </div>
                <p className="font-body text-[11px] text-white/20 mt-1.5 ml-1">Shown on your public Status card</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl font-body text-sm font-medium text-white bg-gradient-to-br from-blue-500/25 to-blue-500/12 border border-blue-500/20 hover:border-blue-500/30 transition-all disabled:opacity-40"
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
                    className={inputClass}
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
                    className={inputClass}
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
                  className="px-6 py-2.5 rounded-xl font-body text-sm font-medium text-white bg-gradient-to-br from-blue-500/25 to-blue-500/12 border border-blue-500/20 hover:border-blue-500/30 transition-all disabled:opacity-40"
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
                  className="px-5 py-2.5 rounded-xl font-body text-sm font-medium text-white/70 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/15 transition-all disabled:opacity-40"
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
                className="px-5 py-2.5 rounded-xl font-body text-sm font-medium text-red-400/70 hover:text-red-400 bg-red-500/[0.06] border border-red-500/15 hover:border-red-500/25 transition-all"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                {deleteError && (
                  <p className="font-body text-xs text-red-400/70">{deleteError}</p>
                )}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="px-5 py-2.5 rounded-xl font-body text-sm font-medium text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all disabled:opacity-40"
                  >
                    {deleting ? "Deleting..." : "Yes, delete my account"}
                  </button>
                  <button
                    onClick={() => { setDeleteConfirm(false); setDeleteError(""); }}
                    className="px-5 py-2.5 rounded-xl font-body text-sm text-white/40 hover:text-white/60 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
