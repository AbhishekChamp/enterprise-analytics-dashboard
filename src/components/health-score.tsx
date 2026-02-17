import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { Activity } from 'lucide-react';

export const HealthScoreCard = () => {
  const { pipelines, datasets, incidents, apiMetrics } = useAppStore();

  const healthScore = useMemo(() => {
    // Calculate individual health factors (0-100)
    const pipelineHealth = pipelines.length > 0
      ? (pipelines.filter(p => p.status === 'SUCCESS').length / pipelines.length) * 100
      : 100;
    
    const datasetHealth = datasets.length > 0
      ? (datasets.filter(d => d.freshnessStatus === 'FRESH').length / datasets.length) * 100
      : 100;
    
    const incidentHealth = incidents.length > 0
      ? Math.max(0, 100 - (incidents.filter(i => i.status === 'open' || i.status === 'investigating').length * 10))
      : 100;
    
    const apiHealth = apiMetrics.length > 0
      ? Math.max(0, 100 - (apiMetrics.slice(-5).reduce((acc, m) => acc + m.errorRate, 0) / 5) * 10)
      : 100;
    
    // Weighted average
    const overallScore = Math.round(
      (pipelineHealth * 0.25) +
      (datasetHealth * 0.25) +
      (incidentHealth * 0.25) +
      (apiHealth * 0.25)
    );
    
    return {
      overall: overallScore,
      pipeline: Math.round(pipelineHealth),
      dataset: Math.round(datasetHealth),
      incident: Math.round(incidentHealth),
      api: Math.round(apiHealth)
    };
  }, [pipelines, datasets, incidents, apiMetrics]);

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBg = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };



  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>System Health Score</CardTitle>
          </div>
          <div className={`text-3xl font-bold ${getHealthColor(healthScore.overall)}`}>
            {healthScore.overall}%
          </div>
        </div>
        <CardDescription>Overall system health based on all metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${getHealthBg(healthScore.overall)} rounded-full transition-all duration-500`}
              style={{ width: `${healthScore.overall}%` }}
            />
          </div>
        </div>

        {/* Individual scores */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pipelines</span>
              <span className={`font-medium ${getHealthColor(healthScore.pipeline)}`}>
                {healthScore.pipeline}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getHealthBg(healthScore.pipeline)} rounded-full`}
                style={{ width: `${healthScore.pipeline}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Datasets</span>
              <span className={`font-medium ${getHealthColor(healthScore.dataset)}`}>
                {healthScore.dataset}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getHealthBg(healthScore.dataset)} rounded-full`}
                style={{ width: `${healthScore.dataset}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Incidents</span>
              <span className={`font-medium ${getHealthColor(healthScore.incident)}`}>
                {healthScore.incident}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getHealthBg(healthScore.incident)} rounded-full`}
                style={{ width: `${healthScore.incident}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Health</span>
              <span className={`font-medium ${getHealthColor(healthScore.api)}`}>
                {healthScore.api}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getHealthBg(healthScore.api)} rounded-full`}
                style={{ width: `${healthScore.api}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
