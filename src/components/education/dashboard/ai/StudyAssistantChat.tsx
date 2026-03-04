"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StudySession, Course, Note, DashboardProject } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StudyAssistantChatProps {
  sessions: StudySession[];
  courses: Course[];
  notes: Note[];
  projects: DashboardProject[];
  activeTab: string;
}

const SUGGESTED_PROMPTS = [
  "What should I study next?",
  "Summarize my progress",
  "Quiz me on Python",
  "Study plan for this week",
];

export function StudyAssistantChat({
  sessions,
  courses,
  notes,
  projects,
  activeTab,
}: StudyAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  function buildContext(): string {
    const totalMinutes = sessions.reduce((s, x) => s + x.duration_minutes, 0);
    const subjects = Array.from(new Set(sessions.map((s) => s.subject)));
    const courseList = courses.map((c) => `${c.name} (${c.status}, ${c.progress}%)`);
    const projectList = projects.map((p) => `${p.name} (${p.status})`);

    return [
      `Study sessions: ${sessions.length} total, ${Math.round(totalMinutes / 60)} hours total`,
      `Subjects studied: ${subjects.join(", ") || "None"}`,
      `Courses: ${courseList.join("; ") || "None"}`,
      `Projects: ${projectList.join("; ") || "None"}`,
      `Notes: ${notes.length} notes`,
      `Currently viewing: ${activeTab} tab`,
    ].join("\n");
  }

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const context = buildContext();
      const conversationHistory = [...messages, userMessage]
        .slice(-10)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

      const res = await fetch("/api/education/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mentor",
          data: JSON.stringify({
            context,
            conversation: conversationHistory,
            question: content.trim(),
          }),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");
      const json = await res.json();
      const response = typeof json.result === "string" ? json.result : JSON.stringify(json.result);

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I could not process your request. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-6 bottom-6 z-50 glass-card w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all hover:border-purple-500/30 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close study assistant" : "Open study assistant"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-6 bottom-20 z-50 w-[380px] max-h-[520px] glass-card rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h4 className="font-display font-semibold text-sm text-white">
                  Study Assistant
                </h4>
              </div>
              <p className="font-body text-[10px] text-white/30 mt-0.5">
                AI-powered study companion
              </p>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[340px]">
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="font-body text-xs text-white/20 text-center">
                    Ask me anything about your studies
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="glass-card px-3 py-1.5 rounded-lg text-[11px] font-body text-white/40 hover:text-white/70 transition-all hover:border-purple-500/20"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.role}-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-500/20 border border-blue-500/20 text-blue-100"
                        : "bg-white/[0.04] border border-white/[0.06] text-white/70"
                    }`}
                  >
                    <p className="font-body text-xs leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-purple-400/60"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts (when conversation is active) */}
            {messages.length > 0 && !loading && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="shrink-0 glass-card px-2.5 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-white/60 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={loading}
                  className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs font-body text-white placeholder-white/20 outline-none focus:border-purple-500/30 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="glass-card w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-purple-400 transition-all hover:border-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
