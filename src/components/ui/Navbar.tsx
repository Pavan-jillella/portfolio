"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVisibility } from "@/hooks/useVisibility";
import { SECTION_LABELS, SectionKey } from "@/lib/visibility";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Vlogs", href: "/vlogs" },
  { label: "Projects", href: "/projects" },
  { label: "Education", href: "/education" },
  { label: "Finance", href: "/finance" },
];

const sectionKeys = Object.keys(SECTION_LABELS) as SectionKey[];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { visibility, toggleSection } = useVisibility();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSettingsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!settingsOpen) return;
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [settingsOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "nav-glass py-3" : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display font-bold text-lg tracking-tight text-white hover:text-blue-400 transition-colors">
          PJ<span className="text-blue-400">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-sm transition-colors duration-200",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-blue-400"
                  : "text-white/50 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/60 bg-white/4 border border-white/5 hover:border-white/10 transition-all text-xs font-mono"
            aria-label="Search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline px-1 py-0.5 rounded text-[10px] bg-white/5 border border-white/10">⌘K</kbd>
          </button>

          {/* Visibility settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                settingsOpen
                  ? "text-blue-400 bg-white/5 border border-blue-500/20"
                  : "text-white/40 hover:text-white/60 bg-white/4 border border-white/5 hover:border-white/10"
              )}
              aria-label="Visibility settings"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl p-3 space-y-1"
                >
                  <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest px-2 pb-1">
                    Section Visibility
                  </p>
                  {sectionKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => toggleSection(key)}
                      className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="font-body text-xs text-white/60">{SECTION_LABELS[key]}</span>
                      <div
                        className={cn(
                          "w-7 h-4 rounded-full transition-colors relative",
                          visibility[key] ? "bg-blue-500/40" : "bg-white/10"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 w-3 h-3 rounded-full transition-all",
                            visibility[key] ? "left-3.5 bg-blue-400" : "left-0.5 bg-white/30"
                          )}
                        />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/contact"
            className={cn(
              "glass-card px-5 py-2 rounded-full text-sm font-body transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
              pathname === "/contact" ? "text-blue-400 border-blue-500/30" : "text-white/80 hover:text-white"
            )}
          >
            Say hello →
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={cn("h-px bg-current transition-all duration-300", menuOpen && "rotate-45 translate-y-2")} />
            <span className={cn("h-px bg-current transition-all duration-300", menuOpen && "opacity-0")} />
            <span className={cn("h-px bg-current transition-all duration-300", menuOpen && "-rotate-45 -translate-y-2")} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden nav-glass border-t border-white/5"
          >
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-body text-sm transition-colors py-1",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-blue-400"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="font-body text-sm text-white/60 hover:text-white transition-colors py-1"
              >
                Contact
              </Link>

              {/* Mobile visibility toggles */}
              <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Section Visibility
                </p>
                {sectionKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleSection(key)}
                    className="flex items-center justify-between w-full py-1"
                  >
                    <span className="font-body text-xs text-white/50">{SECTION_LABELS[key]}</span>
                    <div
                      className={cn(
                        "w-7 h-4 rounded-full transition-colors relative",
                        visibility[key] ? "bg-blue-500/40" : "bg-white/10"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-3 h-3 rounded-full transition-all",
                          visibility[key] ? "left-3.5 bg-blue-400" : "left-0.5 bg-white/30"
                        )}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
