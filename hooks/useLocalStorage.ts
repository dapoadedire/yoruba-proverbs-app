import { useState, useEffect, useCallback } from "react";

/**
 * A custom hook for persisting state in localStorage
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value (or a function that returns the initial value)
 * @returns A tuple of [storedValue, setValue, refreshValue] to manage localStorage data
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get initial value helper function
  const getInitialValue = useCallback(
    () => (initialValue instanceof Function ? initialValue() : initialValue),
    [initialValue]
  );

  // Get from localStorage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === "undefined") {
      return getInitialValue();
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : getInitialValue();
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return getInitialValue();
    }
  }, [key, getInitialValue]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Force refresh the value from localStorage
  const refreshValue = useCallback(() => {
    const newValue = readValue();
    setStoredValue(newValue);
    return newValue;
  }, [readValue]);

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        refreshValue();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshValue();
      }
    };

    // Set up listeners for storage event (triggers when localStorage changes in other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Also refresh when document becomes visible (return from another tab)
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Also refresh on window focus (return from another window)
    window.addEventListener("focus", refreshValue);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", refreshValue);
    };
  }, [key, refreshValue]);

  return [storedValue, setValue, refreshValue];
}
