/**
 * Custom hook for auto-saving form data to localStorage
 * Prevents data loss on accidental browser close or refresh
 */

import { useEffect, useRef, useState } from 'react';

interface AutoSaveOptions {
  key: string;
  interval?: number; // in milliseconds
  enabled?: boolean;
}

interface AutoSaveData {
  timestamp: string;
  data: any;
}

export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions
) {
  const {
    key,
    interval = 30000, // 30 seconds default
    enabled = true,
  } = options;

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialDataRef = useRef<string>(JSON.stringify(data));
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Save to localStorage
  const save = () => {
    if (!enabled) return;

    try {
      const saveData: AutoSaveData = {
        timestamp: new Date().toISOString(),
        data,
      };
      localStorage.setItem(key, JSON.stringify(saveData));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load from localStorage
  const load = (): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;

      const parsed: AutoSaveData = JSON.parse(saved);
      return parsed.data as T;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  // Clear saved data
  const clear = () => {
    try {
      localStorage.removeItem(key);
      setLastSaved(null);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // Get saved timestamp
  const getSavedTimestamp = (): Date | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;

      const parsed: AutoSaveData = JSON.parse(saved);
      return new Date(parsed.timestamp);
    } catch (error) {
      return null;
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    // Check if data has changed
    const currentData = JSON.stringify(data);
    if (currentData !== initialDataRef.current) {
      setHasUnsavedChanges(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto-save
      timeoutRef.current = setTimeout(() => {
        save();
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, interval]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, enabled]);

  return {
    save,
    load,
    clear,
    lastSaved,
    hasUnsavedChanges,
    getSavedTimestamp,
  };
}

/**
 * Hook specifically for article form auto-save
 */
export function useArticleAutoSave(
  articleId: string | undefined,
  formData: any,
  enabled: boolean = true
) {
  const key = articleId 
    ? `vijaya-article-edit-${articleId}` 
    : 'vijaya-article-new';

  const autoSave = useAutoSave(formData, {
    key,
    interval: 30000, // 30 seconds
    enabled,
  });

  // Check for recovered data on mount
  const checkForRecovery = (): { hasRecovery: boolean; timestamp: Date | null } => {
    const timestamp = autoSave.getSavedTimestamp();
    return {
      hasRecovery: timestamp !== null,
      timestamp,
    };
  };

  // Recover saved data
  const recover = () => {
    return autoSave.load();
  };

  return {
    ...autoSave,
    checkForRecovery,
    recover,
  };
}