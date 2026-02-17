import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Keyboard, X } from 'lucide-react';

interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'g + d', description: 'Go to Dashboard' },
  { key: 'g + p', description: 'Go to Pipelines' },
  { key: 'g + a', description: 'Go to API Monitoring' },
  { key: 'g + f', description: 'Go to Data Freshness' },
  { key: 'g + s', description: 'Go to Segmentation' },
  { key: 'g + i', description: 'Go to Incidents' },
  { key: '/', description: 'Focus search' },
  { key: 't', description: 'Toggle theme' },
  { key: 'r', description: 'Refresh data' },
  { key: 'Escape', description: 'Close modal / Go back' },
];

export const KeyboardShortcutsHelp = ({ isOpen, onClose }: ShortcutHelpProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        // Toggle would be handled by parent
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            <CardTitle>Keyboard Shortcuts</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
