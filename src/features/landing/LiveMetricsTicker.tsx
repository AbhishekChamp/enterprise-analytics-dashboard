import { useEffect, useState } from 'react';
import { Activity, Database, Globe, Server, Zap } from 'lucide-react';

interface Metric {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  color: string;
}

export function LiveMetricsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const metrics: Metric[] = [
    {
      id: 'events',
      icon: <Activity className="h-4 w-4" />,
      label: 'Events Processed Today',
      value: '2.4',
      suffix: 'M',
      color: 'text-blue-500',
    },
    {
      id: 'uptime',
      icon: <Zap className="h-4 w-4" />,
      label: 'Platform Uptime',
      value: '99.99',
      suffix: '%',
      color: 'text-green-500',
    },
    {
      id: 'pipelines',
      icon: <Server className="h-4 w-4" />,
      label: 'Active Pipelines',
      value: '24',
      color: 'text-purple-500',
    },
    {
      id: 'datasets',
      icon: <Database className="h-4 w-4" />,
      label: 'Datasets Monitored',
      value: '156',
      color: 'text-orange-500',
    },
    {
      id: 'regions',
      icon: <Globe className="h-4 w-4" />,
      label: 'Global Regions',
      value: '6',
      color: 'text-pink-500',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % metrics.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [metrics.length]);

  const currentMetric = metrics[currentIndex];

  return (
    <div className="w-full bg-muted/50 border-y border-border py-4 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center">
          {/* Animated Metrics Display */}
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className={`p-2 rounded-lg bg-background border border-border ${currentMetric.color}`}>
              {currentMetric.icon}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">{currentMetric.label}</span>
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {currentMetric.value}
                {currentMetric.suffix && (
                  <span className="text-lg text-muted-foreground">{currentMetric.suffix}</span>
                )}
              </span>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="hidden sm:flex items-center gap-1.5 ml-8">
            {metrics.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Marquee on mobile */}
        <div className="sm:hidden mt-3 flex justify-center">
          <div className="flex gap-1">
            {metrics.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-4' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
