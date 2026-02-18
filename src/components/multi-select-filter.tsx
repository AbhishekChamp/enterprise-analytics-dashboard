import { useState, useCallback } from 'react';
import { cn } from '@/utils/formatting';
import { Check } from 'lucide-react';

interface MultiSelectFilterProps {
  options: { value: string; label: string; color?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function MultiSelectFilter({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  label,
  className,
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = useCallback((value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }, [selected, onChange]);

  const selectAll = useCallback(() => {
    onChange(options.map((o) => o.value));
  }, [options, onChange]);

  const clearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-background hover:border-primary/50 transition-colors",
          isOpen && "border-primary"
        )}
      >
        <span className={cn("truncate", !selected.length && "text-muted-foreground")}>
          {selected.length === 0
            ? placeholder
            : selected.length === 1
            ? options.find((o) => o.value === selected[0])?.label
            : `${selected.length} selected`}
        </span>
        <svg
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs text-primary hover:underline"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-4 h-4 rounded border transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    {option.color && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="flex-1 text-left">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected count */}
            {selected.length > 0 && (
              <div className="px-3 py-2 border-t border-border text-xs text-muted-foreground">
                {selected.length} of {options.length} selected
              </div>
            )}
          </div>
        </>
      )}

      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.slice(0, 3).map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
              >
                {option?.label}
                <button
                  type="button"
                  onClick={() => toggleOption(value)}
                  className="hover:text-primary/70"
                >
                  ×
                </button>
              </span>
            );
          })}
          {selected.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
              +{selected.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
