"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Theme Preview Page
 * Shows side-by-side comparison of current vs new elegant editorial theme
 */

export default function ThemePreviewPage() {
  const [activeTheme, setActiveTheme] = useState<"current" | "new">("new");

  return (
    <div className="min-h-screen">
      {/* Theme Selector */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1 rounded-full bg-black/80 backdrop-blur-xl border border-white/10">
        <button
          onClick={() => setActiveTheme("current")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTheme === "current"
              ? "bg-white text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          Current Theme
        </button>
        <button
          onClick={() => setActiveTheme("new")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTheme === "new"
              ? "bg-[#c9a96e] text-[#1a1a18]"
              : "text-white/70 hover:text-white"
          }`}
        >
          New Editorial Theme
        </button>
      </div>

      {/* Current Theme Preview */}
      {activeTheme === "current" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-[#080a0f] text-white pt-32 px-6"
        >
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-4">
              <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
                Current Theme
              </p>
              <h1 className="text-5xl md:text-7xl font-bold font-display">
                Pavan Jillella
              </h1>
              <p className="text-xl text-white/60">
                Data Analyst at Morgan Stanley
              </p>
            </div>

            {/* Sample Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Glass Card Style
                </h3>
                <p className="text-white/60">
                  Current theme uses glassmorphism with blue accents and dark background.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Statistics
                </h3>
                <div className="flex gap-8 mt-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-400">150+</div>
                    <div className="text-white/50 text-sm">Problems</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-400">7</div>
                    <div className="text-white/50 text-sm">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
                Primary Button
              </button>
              <button className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
                Secondary Button
              </button>
            </div>

            {/* Typography */}
            <div className="space-y-4 pb-20">
              <h2 className="text-3xl font-bold font-display">Typography</h2>
              <p className="text-white/70 leading-relaxed">
                The current theme uses <strong>Syne</strong> for headings (bold, modern) 
                and <strong>DM Sans</strong> for body text. The color palette is primarily 
                dark charcoal (#080a0f) with neon blue (#3b82f6) accents.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* New Editorial Theme Preview */}
      {activeTheme === "new" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen pt-32 px-6"
          style={{
            backgroundColor: "#f8f5f0",
            color: "#1a1a18",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Import elegant fonts */}
          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
          `}</style>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* Header */}
            <div className="space-y-6 text-center">
              <p
                className="text-sm tracking-[0.3em] uppercase"
                style={{ color: "#8b7355", fontFamily: "'Outfit', sans-serif" }}
              >
                New Editorial Theme
              </p>
              <h1
                className="text-6xl md:text-8xl font-light"
                style={{ 
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#1a1a18",
                  letterSpacing: "-0.02em"
                }}
              >
                Pavan Jillella
              </h1>
              <p
                className="text-xl"
                style={{ 
                  color: "#6b6b68",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 300
                }}
              >
                Data Analyst at Morgan Stanley
              </p>
              <div
                className="w-16 h-px mx-auto"
                style={{ backgroundColor: "#c9a96e" }}
              />
            </div>

            {/* Sample Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <div
                className="p-8 rounded-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e4df",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                }}
              >
                <h3
                  className="text-2xl mb-3"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    color: "#1a1a18"
                  }}
                >
                  Elegant Card Style
                </h3>
                <p style={{ color: "#6b6b68", lineHeight: 1.8 }}>
                  New theme uses warm cream tones, serif typography, and refined gold accents.
                </p>
              </div>
              <div
                className="p-8 rounded-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e4df",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                }}
              >
                <h3
                  className="text-2xl mb-3"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    color: "#1a1a18"
                  }}
                >
                  Statistics
                </h3>
                <div className="flex gap-12 mt-6">
                  <div>
                    <div
                      className="text-4xl font-light"
                      style={{ 
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#c9a96e"
                      }}
                    >
                      150+
                    </div>
                    <div
                      className="text-sm uppercase tracking-wider mt-1"
                      style={{ color: "#8b7355" }}
                    >
                      Problems
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-4xl font-light"
                      style={{ 
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#7a9e7a"
                      }}
                    >
                      7
                    </div>
                    <div
                      className="text-sm uppercase tracking-wider mt-1"
                      style={{ color: "#8b7355" }}
                    >
                      Day Streak
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-6 justify-center">
              <button
                className="px-8 py-4 text-sm uppercase tracking-widest font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "#c9a96e",
                  color: "#1a1a18",
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Primary Button
              </button>
              <button
                className="px-8 py-4 text-sm uppercase tracking-widest font-medium transition-all hover:bg-[#1a1a18] hover:text-[#f8f5f0]"
                style={{
                  border: "1px solid #1a1a18",
                  color: "#1a1a18",
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Secondary Button
              </button>
            </div>

            {/* Color Palette */}
            <div className="space-y-6">
              <h2
                className="text-3xl text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                Color Palette
              </h2>
              <div className="flex justify-center gap-4 flex-wrap">
                {[
                  { name: "Cream", color: "#f8f5f0" },
                  { name: "Warm White", color: "#ffffff" },
                  { name: "Gold", color: "#c9a96e" },
                  { name: "Taupe", color: "#8b7355" },
                  { name: "Charcoal", color: "#1a1a18" },
                  { name: "Sage", color: "#7a9e7a" },
                ].map((c) => (
                  <div key={c.name} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full mb-2 mx-auto"
                      style={{ 
                        backgroundColor: c.color,
                        border: c.color === "#ffffff" ? "1px solid #e8e4df" : "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                      }}
                    />
                    <div className="text-xs uppercase tracking-wider" style={{ color: "#8b7355" }}>
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Showcase */}
            <div className="space-y-8 pb-32">
              <h2
                className="text-3xl text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                Typography
              </h2>
              
              <div
                className="p-8"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e8e4df" }}
              >
                <p style={{ color: "#8b7355", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
                  Label / Monospace Alternative
                </p>
                <h1
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "3rem",
                    fontWeight: 300,
                    color: "#1a1a18",
                    marginBottom: "1rem"
                  }}
                >
                  Heading One
                </h1>
                <h2
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "#1a1a18",
                    marginBottom: "1rem"
                  }}
                >
                  Heading Two
                </h2>
                <p
                  style={{ 
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 300,
                    color: "#6b6b68",
                    lineHeight: 1.9
                  }}
                >
                  Body text uses <strong style={{ fontWeight: 500 }}>Outfit</strong> — a clean, 
                  geometric sans-serif that pairs beautifully with Cormorant Garamond. 
                  The overall feel is elegant, editorial, and sophisticated — perfect for 
                  a professional portfolio with a premium touch.
                </p>
              </div>
            </div>

            {/* Apply Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
              <div
                className="flex items-center gap-4 p-4 rounded-lg shadow-lg"
                style={{ backgroundColor: "#1a1a18" }}
              >
                <span className="text-white/80 text-sm">Like this theme?</span>
                <Link
                  href="/roadmap"
                  className="px-6 py-2 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: "#c9a96e",
                    color: "#1a1a18",
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
