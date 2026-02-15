import { cn } from '@/utils/formatting';
import type { PipelineStatus } from '@/types/pipeline';
import type { FreshnessStatus } from '@/types/freshness';
import type { IncidentSeverity, IncidentStatus } from '@/types/incidents';

interface StatusBadgeProps {
  status: PipelineStatus | FreshnessStatus | IncidentSeverity | IncidentStatus | 'healthy' | 'degraded' | 'critical';
  className?: string;
}

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; label: string }> = {
  // Pipeline statuses
  SUCCESS: { variant: 'success', label: 'Success' },
  RUNNING: { variant: 'default', label: 'Running' },
  FAILED: { variant: 'destructive', label: 'Failed' },
  PENDING: { variant: 'secondary', label: 'Pending' },
  // Freshness statuses
  FRESH: { variant: 'success', label: 'Fresh' },
  DELAYED: { variant: 'warning', label: 'Delayed' },
  STALE: { variant: 'destructive', label: 'Stale' },
  // Incident severities
  critical: { variant: 'destructive', label: 'Critical' },
  high: { variant: 'warning', label: 'High' },
  medium: { variant: 'default', label: 'Medium' },
  low: { variant: 'secondary', label: 'Low' },
  // Incident statuses
  open: { variant: 'destructive', label: 'Open' },
  investigating: { variant: 'warning', label: 'Investigating' },
  resolved: { variant: 'success', label: 'Resolved' },
  closed: { variant: 'secondary', label: 'Closed' },
  // Health statuses
  healthy: { variant: 'success', label: 'Healthy' },
  degraded: { variant: 'warning', label: 'Degraded' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || { variant: 'secondary', label: status };
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-green-500/10 text-green-600 border border-green-500/20": config.variant === 'success',
          "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20": config.variant === 'warning',
          "bg-red-500/10 text-red-600 border border-red-500/20": config.variant === 'destructive',
          "bg-blue-500/10 text-blue-600 border border-blue-500/20": config.variant === 'default',
          "bg-gray-500/10 text-gray-600 border border-gray-500/20": config.variant === 'secondary',
        },
        className
      )}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", {
        "bg-green-500": config.variant === 'success',
        "bg-yellow-500": config.variant === 'warning',
        "bg-red-500": config.variant === 'destructive',
        "bg-blue-500": config.variant === 'default',
        "bg-gray-500": config.variant === 'secondary',
      })} />
      {config.label}
    </span>
  );
};
