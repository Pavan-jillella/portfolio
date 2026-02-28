"use client";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface EmbeddableItem {
  id: string;
  content: string;
  tags?: string[];
}

export function useEmbeddingSync(
  entityType: string,
  items: EmbeddableItem[]
) {
  const [embeddedIds, setEmbeddedIds] = useLocalStorage<string[]>(`pj-embedded-ids-${entityType}`, []);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current || items.length === 0) return;
    syncedRef.current = true;

    const newItems = items.filter((item) => !embeddedIds.includes(item.id));
    if (newItems.length === 0) return;

    // Debounce: wait 2s then batch generate
    const timer = setTimeout(async () => {
      const successIds: string[] = [];

      for (const item of newItems.slice(0, 20)) {
        try {
          const res = await fetch("/api/embeddings/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              entityType,
              entityId: item.id,
              content: item.content,
              tags: item.tags || [],
            }),
          });

          if (res.ok) {
            successIds.push(item.id);
          }
        } catch {
          // Skip failed items silently
        }
      }

      if (successIds.length > 0) {
        setEmbeddedIds((prev) => [...prev, ...successIds]);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [items, embeddedIds, entityType, setEmbeddedIds]);
}
