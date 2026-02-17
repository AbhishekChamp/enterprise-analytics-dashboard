import * as React from 'react';
import { cn } from '@/utils/formatting';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary/20",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        {label && <span className="text-sm">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';
