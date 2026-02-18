import { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/utils/formatting';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  pullDistance?: number;
}

export function PullToRefresh({
  onRefresh,
  children,
  className,
  pullDistance = 80,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling) return;

    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY.current;

    // Only pull down
    if (diff > 0 && window.scrollY === 0) {
      // Calculate progress with resistance
      const progress = Math.min(diff / pullDistance, 1);
      setPullProgress(progress);
    }
  }, [isPulling, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullProgress >= 1 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullProgress(0);
      }
    } else {
      setPullProgress(0);
    }
  }, [isPulling, pullProgress, isRefreshing, onRefresh]);

  // Don't show on desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center transition-transform duration-200"
        style={{
          top: `${-pullDistance + pullProgress * pullDistance}px`,
          opacity: pullProgress,
        }}
      >
        <div className="flex flex-col items-center gap-2 p-4">
          <div
            className={cn(
              "p-3 rounded-full bg-primary/10 transition-transform duration-300",
              pullProgress >= 1 && "scale-110"
            )}
          >
            <RefreshCw
              className={cn(
                "h-6 w-6 text-primary transition-transform duration-500",
                isRefreshing && "animate-spin",
                pullProgress >= 1 && !isRefreshing && "rotate-180"
              )}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {isRefreshing
              ? 'Refreshing...'
              : pullProgress >= 1
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content with transform */}
      <div
        style={{
          transform: `translateY(${isPulling ? pullProgress * pullDistance * 0.5 : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
