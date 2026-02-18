import { useState } from 'react';
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/formatting';

interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
  value?: DateRange;
  className?: string;
}

const presetRanges = [
  { label: 'Today', days: 0 },
  { label: 'Yesterday', days: 1 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'This Week', type: 'week' as const },
  { label: 'This Month', type: 'month' as const },
];

export function DateRangePicker({ onChange, value, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(value || null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    let start: Date;
    let end: Date;
    const now = new Date();

    if ('type' in preset) {
      if (preset.type === 'week') {
        start = startOfWeek(now);
        end = endOfWeek(now);
      } else {
        start = startOfMonth(now);
        end = endOfMonth(now);
      }
    } else {
      end = endOfDay(now);
      start = startOfDay(subDays(now, preset.days));
      if (preset.days === 1) {
        end = endOfDay(subDays(now, 1));
      }
    }

    const range = { start, end, label: preset.label };
    setSelectedRange(range);
    onChange(range);
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      const start = startOfDay(new Date(customStart));
      const end = endOfDay(new Date(customEnd));
      const range = { 
        start, 
        end, 
        label: `${format(start, 'MMM d')} - ${format(end, 'MMM d')}` 
      };
      setSelectedRange(range);
      onChange(range);
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    setSelectedRange(null);
    setCustomStart('');
    setCustomEnd('');
    onChange({ start: new Date(0), end: new Date(), label: 'All Time' });
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        {selectedRange ? selectedRange.label : 'Select Date Range'}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Date Range</h3>
              {selectedRange && (
                <button
                  onClick={clearSelection}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Preset Ranges */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presetRanges.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors text-left",
                    selectedRange?.label === preset.label
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Range */}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium mb-3">Custom Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleCustomRange}
                  disabled={!customStart || !customEnd}
                >
                  Apply Custom Range
                </Button>
              </div>
            </div>

            {selectedRange && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Selected: {format(selectedRange.start, 'MMM d, yyyy')} - {format(selectedRange.end, 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
