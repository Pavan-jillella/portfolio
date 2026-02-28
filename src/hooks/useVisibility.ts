"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionVisibility, SectionKey, DEFAULT_VISIBILITY } from "@/lib/visibility";

export function useVisibility() {
  const [visibility, setVisibility] = useLocalStorage<SectionVisibility>("pj-visibility", DEFAULT_VISIBILITY);

  function toggleSection(key: SectionKey) {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function isVisible(key: SectionKey): boolean {
    return visibility[key];
  }

  return { visibility, toggleSection, isVisible };
}
