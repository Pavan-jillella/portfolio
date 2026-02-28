"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-charcoal-950 text-white font-body">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Something went wrong</h2>
            <p className="text-white/40 mb-6">{error.message}</p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
