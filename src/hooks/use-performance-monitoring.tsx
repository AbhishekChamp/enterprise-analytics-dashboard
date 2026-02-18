import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    lastTime.current = performance.now();

    const updateMetrics = () => {
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
    };

    animationFrame.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [enabled]);

  return metrics;
}
