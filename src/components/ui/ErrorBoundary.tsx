"use client";
import React from "react";
import * as Sentry from "@sentry/nextjs";

interface ErrorBoundaryProps {
  module?: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error);
    console.error(`[ErrorBoundary${this.props.module ? `: ${this.props.module}` : ""}]`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-display font-semibold text-white mb-2">
            {this.props.module ? `${this.props.module} failed to load` : "Something went wrong"}
          </p>
          <p className="font-body text-sm text-white/40 mb-4">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="glass-card px-5 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
