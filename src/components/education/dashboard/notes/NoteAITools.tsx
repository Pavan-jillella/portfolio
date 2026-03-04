"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Note, NoteAIResult, Flashcard } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface NoteAIToolsProps {
  note: Note | null;
}

type AIAction = "summarize" | "flashcards" | "key_concepts";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getCacheKey(noteId: string): string {
  return `pj-note-ai-${noteId}`;
}

function loadCachedResult(noteId: string): NoteAIResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getCacheKey(noteId));
    return raw ? (JSON.parse(raw) as NoteAIResult) : null;
  } catch {
    return null;
  }
}

function saveCachedResult(noteId: string, result: NoteAIResult): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getCacheKey(noteId), JSON.stringify(result));
  } catch {
    // Silently fail on storage errors
  }
}

export function NoteAITools({ note }: NoteAIToolsProps) {
  const [result, setResult] = useState<NoteAIResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<AIAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const prevNoteIdRef = useRef<string | null>(null);

  // Reload cached result when note changes
  useEffect(() => {
    if (note && note.id !== prevNoteIdRef.current) {
      prevNoteIdRef.current = note.id;
      const cached = loadCachedResult(note.id);
      setResult(cached);
      setShowPanel(!!cached);
      setFlippedCards(new Set());
      setError(null);
    } else if (!note) {
      prevNoteIdRef.current = null;
      setResult(null);
      setShowPanel(false);
    }
  }, [note]);

  const callAI = useCallback(
    async (action: AIAction) => {
      if (!note) return;
      setLoadingAction(action);
      setError(null);

      const plainText = stripHtml(note.content_html);
      if (!plainText) {
        setError("Note has no text content to analyze.");
        setLoadingAction(null);
        return;
      }

      try {
        const res = await fetch("/api/education/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "summarize",
            data: plainText,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "AI request failed");
        }

        const data = await res.json();
        const aiResponse = data.result;

        // Merge with existing cached data so we accumulate results
        const existing = loadCachedResult(note.id) || { generated_at: "" };
        const merged: NoteAIResult = {
          ...existing,
          generated_at: new Date().toISOString(),
        };

        // The summarize endpoint returns summary, flashcards, and key_concepts together
        // Capture all returned fields regardless of which action was requested
        if (aiResponse?.summary) merged.summary = aiResponse.summary;
        if (aiResponse?.flashcards) merged.flashcards = aiResponse.flashcards;
        if (aiResponse?.key_concepts) merged.key_concepts = aiResponse.key_concepts;

        saveCachedResult(note.id, merged);
        setResult(merged);
        setShowPanel(true);
        setFlippedCards(new Set());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoadingAction(null);
      }
    },
    [note]
  );

  function toggleFlashcard(idx: number) {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  if (!note) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="glass-card rounded-xl p-3 flex flex-wrap items-center gap-2">
        <span className="font-body text-[10px] text-white/30 mr-1">AI Tools</span>

        <button
          onClick={() => callAI("summarize")}
          disabled={loadingAction !== null}
          className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
            loadingAction === "summarize"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          } disabled:opacity-40`}
        >
          {loadingAction === "summarize" ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Summarizing...
            </span>
          ) : (
            "Summarize"
          )}
        </button>

        <button
          onClick={() => callAI("flashcards")}
          disabled={loadingAction !== null}
          className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
            loadingAction === "flashcards"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          } disabled:opacity-40`}
        >
          {loadingAction === "flashcards" ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            "Flashcards"
          )}
        </button>

        <button
          onClick={() => callAI("key_concepts")}
          disabled={loadingAction !== null}
          className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
            loadingAction === "key_concepts"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          } disabled:opacity-40`}
        >
          {loadingAction === "key_concepts" ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Extracting...
            </span>
          ) : (
            "Key Concepts"
          )}
        </button>

        {/* Toggle panel visibility if results exist */}
        {result && (
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="ml-auto px-2 py-1 rounded-lg font-body text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            {showPanel ? "Hide" : "Show"} Results
          </button>
        )}
      </div>

      {error && (
        <p className="font-body text-xs text-red-400 px-1">{error}</p>
      )}

      {/* Results panel */}
      <AnimatePresence>
        {showPanel && result && (
          <motion.div
            className="glass-card rounded-xl overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="p-5 flex flex-col gap-5">
              {/* Summary */}
              {result.summary && (
                <div>
                  <h4 className="font-display font-medium text-xs text-white/50 mb-2">
                    Summary
                  </h4>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              )}

              {/* Flashcards */}
              {result.flashcards && result.flashcards.length > 0 && (
                <div>
                  <h4 className="font-display font-medium text-xs text-white/50 mb-3">
                    Flashcards
                    <span className="font-mono text-[10px] text-white/20 ml-2">
                      (click to flip)
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.flashcards.map((card: Flashcard, idx: number) => {
                      const isFlipped = flippedCards.has(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleFlashcard(idx)}
                          className={`glass-card rounded-lg p-4 text-left transition-all min-h-[80px] ${
                            isFlipped
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : "hover:border-white/15"
                          }`}
                        >
                          <span className="font-mono text-[9px] text-white/20 block mb-1.5">
                            {isFlipped ? "ANSWER" : "QUESTION"}
                          </span>
                          <p className="font-body text-xs text-white/80 leading-relaxed">
                            {isFlipped ? card.answer : card.question}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Concepts */}
              {result.key_concepts && result.key_concepts.length > 0 && (
                <div>
                  <h4 className="font-display font-medium text-xs text-white/50 mb-3">
                    Key Concepts
                  </h4>
                  <div className="flex flex-col gap-2">
                    {result.key_concepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-mono text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-display font-medium text-xs text-white">
                            {concept.term}
                          </p>
                          <p className="font-body text-[11px] text-white/50 mt-0.5 leading-relaxed">
                            {concept.definition}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              {result.generated_at && (
                <p className="font-mono text-[9px] text-white/15 text-right">
                  Generated{" "}
                  {new Date(result.generated_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
