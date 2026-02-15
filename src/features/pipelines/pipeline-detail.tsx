import { useParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { formatDuration, formatDate } from '@/utils/formatting';
import { 
  GitBranch, 
  RefreshCw, 
  Clock, 
  Database, 
  User, 
  Server,
  ChevronLeft,
  Terminal
} from 'lucide-react';
import { LineChartComponent } from '@/components/charts';

export const PipelineDetail = () => {
  const { pipelineId } = useParams({ from: '/pipelines/$pipelineId' });
  const navigate = useNavigate();
  const { pipelines, currentUser, retryPipeline } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the pipeline - this will update when pipelineId changes
  const pipeline = pipelines.find(p => p.id === pipelineId);
  
  // Simulate loading state when pipelineId changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [pipelineId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-medium">Pipeline not found</h2>
          <p className="text-muted-foreground">The requested pipeline does not exist</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate({ to: '/pipelines' })}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Pipelines
          </Button>
        </div>
      </div>
    );
  }

  // Generate deterministic mock data based on pipeline ID
  const generateMockData = () => {
    const baseValue = pipeline.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      value: Math.floor(100000 + (baseValue * 1000) + Math.random() * 50000 + i * 2000)
    }));
  };

  const mockHistoryData = generateMockData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate({ to: '/pipelines' })}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pipeline.name}</h1>
            <p className="text-muted-foreground">{pipeline.description}</p>
          </div>
        </div>
        {currentUser.role === 'ADMIN' && pipeline.status === 'FAILED' && (
          <Button onClick={() => retryPipeline(pipeline.id)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Pipeline
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusBadge status={pipeline.status} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Run</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(pipeline.lastRun)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(pipeline.duration)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Records Processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>{pipeline.recordsProcessed.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Steps</CardTitle>
            <CardDescription>Execution breakdown by step</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{step.name}</h4>
                      <StatusBadge status={step.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Duration: {formatDuration(step.duration)}</span>
                      {step.startedAt && (
                        <span>Started: {formatDate(step.startedAt)}</span>
                      )}
                    </div>
                    
                    {currentUser.role === 'ADMIN' && step.logs.length > 0 && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                          <Terminal className="h-3 w-3" />
                          Logs
                        </div>
                        <div className="space-y-1 text-xs font-mono text-muted-foreground max-h-32 overflow-y-auto">
                          {step.logs.map((log, i) => (
                            <div key={i} className="text-green-600">{log}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Volume Trend</CardTitle>
            <CardDescription>Records processed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartComponent
              data={mockHistoryData}
              showArea
              color="#3b82f6"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">{pipeline.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Server className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Environment</p>
                <Badge variant={pipeline.environment === 'production' ? 'destructive' : 'secondary'}>
                  {pipeline.environment}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Retry Count</p>
                <p className="text-sm text-muted-foreground">{pipeline.retryCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
