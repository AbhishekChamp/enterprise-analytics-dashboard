import { useEffect, useRef, useCallback, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  domNodes: number;
  lastUpdate: string;
}

export const usePerformanceMonitoring = (enabled: boolean = true) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    domNodes: 0,
    lastUpdate: new Date().toISOString()
  });
  
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const animationFrame = useRef<number | undefined>(undefined);

  const updateMetrics = useCallback(() => {
    const now = performance.now();
    const elapsed = now - lastTime.current;
    
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      
      // Get memory info if available
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
      const memoryMB = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
      
      // Count DOM nodes
      const domNodes = document.getElementsByTagName('*').length;
      
      setMetrics({
        fps,
        memory: memoryMB,
        domNodes,
        lastUpdate: new Date().toISOString()
      });
      
      frameCount.current = 0;
      lastTime.current = now;
    }
    
    frameCount.current++;
    animationFrame.current = requestAnimationFrame(updateMetrics);
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    lastTime.current = performance.now();
    animationFrame.current = requestAnimationFrame(updateMetrics);
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [enabled, updateMetrics]);

  return metrics;
};

export const PerformanceMonitor = ({ enabled = false }: { enabled?: boolean }) => {
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
