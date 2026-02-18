import { cn } from '@/utils/formatting';
import { 
  Package, 
  Search, 
  FileX, 
  Inbox,
  AlertCircle,
  Bell,
  BarChart3,
  Database
} from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'package' | 'search' | 'file' | 'inbox' | 'alert' | 'notification' | 'chart' | 'database';
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const icons = {
  package: Package,
  search: Search,
  file: FileX,
  inbox: Inbox,
  alert: AlertCircle,
  notification: Bell,
  chart: BarChart3,
  database: Database,
};

export function EmptyState({
  title,
  description,
  icon = 'inbox',
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      {/* Icon with gradient background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
          <Icon className="h-10 w-10 text-primary" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} size="sm">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} size="sm">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Specialized empty states for common scenarios

export function NoSearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms.`}
      action={{ label: 'Clear Search', onClick: onClear }}
    />
  );
}

export function NoData({ 
  message = "No data available", 
  onRefresh 
}: { 
  message?: string; 
  onRefresh?: () => void;
}) {
  return (
    <EmptyState
      icon="database"
      title={message}
      description="There's no data to display at the moment."
      action={onRefresh ? { label: 'Refresh', onClick: onRefresh } : undefined}
    />
  );
}

export function NoNotifications({ onViewSettings }: { onViewSettings?: () => void }) {
  return (
    <EmptyState
      icon="notification"
      title="No notifications"
      description="You're all caught up! Check back later for updates."
      action={onViewSettings ? { label: 'Notification Settings', onClick: onViewSettings } : undefined}
    />
  );
}

export function ErrorState({ 
  message = "Something went wrong", 
  onRetry 
}: { 
  message?: string; 
  onRetry: () => void;
}) {
  return (
    <EmptyState
      icon="alert"
      title="Error"
      description={message}
      action={{ label: 'Try Again', onClick: onRetry }}
    />
  );
}

export function EmptyChart({ title = "No data to visualize" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-lg">
      <div className="p-3 bg-muted rounded-lg mb-3">
        <BarChart3 className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
