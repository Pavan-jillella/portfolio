"use client";

export function SupabaseStorageFallback() {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <svg className="w-12 h-12 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      <h3 className="font-display font-semibold text-white mb-2">Storage Not Configured</h3>
      <p className="font-body text-sm text-white/40 max-w-md mx-auto">
        File uploads require Supabase Storage. Configure your Supabase credentials to enable file management.
      </p>
    </div>
  );
}
