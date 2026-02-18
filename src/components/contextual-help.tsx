import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/utils/formatting';

interface HelpTooltipProps {
  content: string;
  title?: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function HelpTooltip({
  content,
  title,
  children,
  position = 'top',
  className,
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children || (
        <button
          type="button"
          className="p-1 hover:bg-muted rounded-full transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      {isVisible && (
        <div
          className={cn(
            "absolute z-50 w-64 p-3 bg-card border border-border rounded-lg shadow-lg",
            positionClasses[position]
          )}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-2 h-2 bg-card border border-border rotate-45",
              arrowClasses[position]
            )}
          />
          
          {/* Content */}
          <div className="relative">
            {title && (
              <h4 className="font-medium text-sm mb-1">{title}</h4>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline help component for forms and settings
interface InlineHelpProps {
  title: string;
  description: string;
  learnMoreUrl?: string;
  className?: string;
}

export function InlineHelp({ title, description, learnMoreUrl, className }: InlineHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1 hover:bg-muted rounded-full transition-colors"
        aria-label={`Learn more about ${title}`}
      >
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
      </button>

      {isExpanded && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute z-50 right-0 mt-2 w-72 p-4 bg-card border border-border rounded-lg shadow-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{title}</h4>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {description}
            </p>
            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Learn more →
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Contextual help for specific features
interface FeatureHelpProps {
  featureId: string;
  children: React.ReactNode;
}

const featureHelpContent: Record<string, { title: string; content: string }> = {
  'pipeline-status': {
    title: 'Pipeline Status',
    content: 'Shows the current execution state. Green indicates successful completion, red indicates failures, and blue shows actively running pipelines.',
  },
  'data-freshness': {
    title: 'Data Freshness',
    content: 'Measures how recent your data is. SLA indicates the maximum acceptable age before data is considered stale.',
  },
  'api-latency': {
    title: 'API Latency',
    content: 'Response time in milliseconds. P50 represents median latency, P95 shows the 95th percentile (slowest 5% of requests).',
  },
  'error-rate': {
    title: 'Error Rate',
    content: 'Percentage of failed requests. Values above 1% typically indicate issues requiring investigation.',
  },
};

export function FeatureHelp({ featureId, children }: FeatureHelpProps) {
  const help = featureHelpContent[featureId];
  
  if (!help) return <>{children}</>;

  return (
    <HelpTooltip title={help.title} content={help.content}>
      {children}
    </HelpTooltip>
  );
}
