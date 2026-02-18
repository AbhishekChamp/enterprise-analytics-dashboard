import { usePerformanceMonitoring } from '@/hooks/use-performance-monitoring';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export const PerformanceMonitor = ({ enabled = false }: PerformanceMonitorProps) => {
  const metrics = usePerformanceMonitoring(enabled);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg shadow-lg p-4 z-50 text-xs font-mono">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">FPS:</span>
          <span className={metrics.fps < 30 ? 'text-red-500' : metrics.fps < 50 ? 'text-yellow-500' : 'text-green-500'}>
            {metrics.fps}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Memory:</span>
          <span>{metrics.memory} MB</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">DOM Nodes:</span>
          <span>{metrics.domNodes}</span>
        </div>
      </div>
    </div>
  );
};
