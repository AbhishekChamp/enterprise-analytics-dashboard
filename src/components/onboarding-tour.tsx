import { useState, useEffect, useCallback } from 'react';

import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Target,
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation Menu',
    content: 'Access all major sections of the dashboard from here. Use keyboard shortcuts shown next to each item for quick navigation.',
    position: 'right',
  },
  {
    target: '[data-tour="search"]',
    title: 'Global Search',
    content: 'Quickly find pipelines, datasets, or incidents. Press "/" from anywhere to focus the search bar instantly.',
    position: 'bottom',
  },
  {
    target: '[data-tour="kpi-cards"]',
    title: 'Key Metrics',
    content: 'Monitor critical KPIs at a glance. Click on any card to see detailed breakdowns and trends.',
    position: 'bottom',
  },
  {
    target: '[data-tour="charts"]',
    title: 'Visual Analytics',
    content: 'Interactive charts showing real-time data. Hover over data points for detailed tooltips, use the time range selector to change the view.',
    position: 'top',
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Notifications',
    content: 'Stay updated with alerts and system events. Red dots indicate unread critical notifications.',
    position: 'left',
  },
  {
    target: '[data-tour="settings"]',
    title: 'Settings & Profile',
    content: 'Customize your experience, manage notifications, and access keyboard shortcuts help.',
    position: 'left',
  },
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTour');
    if (!seen) {
      setHasSeenTour(false);
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const updateTargetRect = useCallback(() => {
    if (!isVisible) return;
    
    const step = tourSteps[currentStep];
    const target = document.querySelector(step.target);
    
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll target into view
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isVisible]);

  useEffect(() => {
    updateTargetRect();
    
    const handleResize = () => updateTargetRect();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updateTargetRect]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setIsVisible(false);
    setHasSeenTour(true);
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsVisible(true);
  };

  const getTooltipPosition = () => {
    if (!targetRect) return {};
    
    const step = tourSteps[currentStep];
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const offset = 16;
    
    switch (step.position) {
      case 'top':
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.top - tooltipHeight - offset,
        };
      case 'bottom':
        return {
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
          top: targetRect.bottom + offset,
        };
      case 'left':
        return {
          left: targetRect.left - tooltipWidth - offset,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
        };
      case 'right':
        return {
          left: targetRect.right + offset,
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
        };
      default:
        return {};
    }
  };

  if (!isVisible || hasSeenTour) {
    return (
      <button
        onClick={restartTour}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        title="Restart Tour"
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">Tour</span>
      </button>
    );
  }

  const step = tourSteps[currentStep];
  const position = getTooltipPosition();

  return (
    <>
      {/* Backdrop with highlight */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={completeTour}>
        {targetRect && (
          <div
            className="absolute bg-transparent border-2 border-primary rounded-lg transition-all duration-300"
            style={{
              left: targetRect.left - 4,
              top: targetRect.top - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-50 w-80 bg-card border border-border rounded-xl shadow-2xl p-6 transition-all duration-300"
        style={{
          left: Math.max(16, Math.min(window.innerWidth - 336, position.left || 0)),
          top: Math.max(16, Math.min(window.innerHeight - 250, position.top || 0)),
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-xl overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button
            onClick={completeTour}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {step.content}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1"
          >
            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick tip cards */}
      {currentStep === 0 && (
        <div className="fixed bottom-4 left-4 z-50 space-y-2">
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Keyboard className="h-4 w-4" />
              <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">?</kbd> anytime for shortcuts</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
