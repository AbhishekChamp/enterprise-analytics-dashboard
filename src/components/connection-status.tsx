import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/formatting';
import { useAppStore } from '@/store/app-store';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showOffline, setShowOffline] = useState(false);
  const isSimulationActive = useAppStore((state) => state.isSimulationActive);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => setShowOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update last update time every minute
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Show offline indicator after a delay when offline
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (!isOnline) {
      timeout = setTimeout(() => setShowOffline(true), 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOnline]);

  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (!showOffline && isOnline) {
    return (
      <div 
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium"
        title={`Last synced: ${getTimeSinceUpdate()}`}
      >
        <Wifi className="h-3 w-3" />
        <span className="hidden sm:inline">Live</span>
        {isSimulationActive && (
          <RefreshCw className="h-3 w-3 animate-spin ml-1" />
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
        isOnline 
          ? "bg-green-500/10 text-green-600" 
          : "bg-red-500/10 text-red-600 animate-pulse"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Reconnected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
