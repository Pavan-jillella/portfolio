"use client";
import { useState, useEffect, useCallback, useRef } from "react";

function readStorage<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const keyRef = useRef(key);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    setStoredValue(readStorage(key, initialValue));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync if the key changes (rare but correct)
  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      setStoredValue(readStorage(key, initialValue));
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
        return newValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
