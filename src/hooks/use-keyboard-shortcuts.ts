import { useEffect, useCallback, useRef } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const sequenceRef = useRef<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.isContentEditable
      ) {
        // Allow Escape key even in inputs
        if (event.key !== 'Escape') {
          return;
        }
      }

      const key = event.key.toLowerCase();

      // Check for single-key shortcuts first
      const singleKeyShortcut = shortcuts.find((shortcut) => {
        // Skip sequence shortcuts (those containing +)
        if (shortcut.key.includes('+')) return false;
        
        const keyMatch = key === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
        const shiftMatch = !!shortcut.shift === event.shiftKey;
        const altMatch = !!shortcut.alt === event.altKey;
        const metaMatch = !!shortcut.meta === event.metaKey;

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
      });

      if (singleKeyShortcut) {
        event.preventDefault();
        singleKeyShortcut.action();
        sequenceRef.current = []; // Reset sequence
        return;
      }

      // Handle sequence shortcuts (e.g., "g+d")
      const sequenceShortcuts = shortcuts.filter((s) => s.key.includes('+'));
      
      if (sequenceShortcuts.length > 0) {
        // Add current key to sequence
        sequenceRef.current.push(key);
        
        // Clear sequence after 1 second of inactivity
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          sequenceRef.current = [];
        }, 1000);

        // Check if any sequence shortcut matches
        const currentSequence = sequenceRef.current.join('+');
        const matchedSequence = sequenceShortcuts.find((shortcut) => {
          const shortcutSequence = shortcut.key.toLowerCase();
          return currentSequence === shortcutSequence;
        });

        if (matchedSequence) {
          event.preventDefault();
          matchedSequence.action();
          sequenceRef.current = []; // Reset sequence
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);
};

// Global shortcuts registry for displaying help
const globalShortcuts: ShortcutConfig[] = [];

export const registerGlobalShortcuts = (shortcuts: ShortcutConfig[]) => {
  globalShortcuts.push(...shortcuts);
};

export const getGlobalShortcuts = () => [...globalShortcuts];
