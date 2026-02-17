import { useSyncExternalStore } from 'react';
import { useAppStore } from '@/store/app-store';
import { RefreshCw, Clock } from 'lucide-react';
import { cn } from '@/utils/formatting';

// Custom hook to subscribe to time updates without useEffect/setState
function useTimeAgo(timestamp: string) {
  return useSyncExternalStore(
    (callback) => {
      const interval = setInterval(callback, 1000);
      return () => clearInterval(interval);
    },
    () => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      
      if (diffSecs < 60) {
        return `${diffSecs}s ago`;
      } else {
        const diffMins = Math.floor(diffSecs / 60);
        return `${diffMins}m ago`;
      }
    },
    () => 'just now'
  );
}

export const DataRefreshIndicator = () => {
  const { lastDataUpdate, isSimulationActive } = useAppStore();
  const timeAgo = useTimeAgo(lastDataUpdate);

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
      isSimulationActive 
        ? "bg-green-500/10 text-green-600 border border-green-500/20" 
        : "bg-muted text-muted-foreground border border-border"
    )}>
      <RefreshCw 
        key={lastDataUpdate}
        className={cn(
          "h-3 w-3",
          isSimulationActive && "animate-pulse"
        )} 
      />
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Updated {timeAgo}
      </span>
    </div>
  );
};
