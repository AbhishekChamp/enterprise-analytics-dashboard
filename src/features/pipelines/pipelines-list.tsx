import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { Table } from '@/components/tables';
import { useAppStore } from '@/store/app-store';
import { formatDuration, formatNumber, formatDate } from '@/utils/formatting';
import { 
  GitBranch, 
  Play, 
  AlertCircle, 
  CheckCircle, 
  Database,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import type { Pipeline } from '@/types/pipeline';

export const PipelinesList = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/pipelines' });
  const { pipelines, currentUser, retryPipeline } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'running' | 'failed' | 'success'>('all');

  // Handle search query from URL
  const searchQuery = (search as { q?: string }).q?.toLowerCase() || '';

  // Memoize filtered pipelines
  const filteredPipelines = useMemo(() => 
    pipelines.filter(p => {
      // First apply status filter
      if (filter !== 'all' && p.status.toLowerCase() !== filter) return false;
      // Then apply search filter
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery) && 
          !p.description.toLowerCase().includes(searchQuery)) return false;
      return true;
    }),
    [pipelines, filter, searchQuery]
  );

  // Memoize metrics calculation
  const metrics = useMemo(() => ({
    total: pipelines.length,
    running: pipelines.filter(p => p.status === 'RUNNING').length,
    failed: pipelines.filter(p => p.status === 'FAILED').length,
    success: pipelines.filter(p => p.status === 'SUCCESS').length,
    successRate: pipelines.length > 0 ? Math.round((pipelines.filter(p => p.status === 'SUCCESS').length / pipelines.length) * 100) : 0,
    totalRecords: pipelines.reduce((acc, p) => acc + p.recordsProcessed, 0)
  }), [pipelines]);

  const handleRowClick = useCallback((item: Pipeline) => {
    navigate({ 
      to: '/pipelines/$pipelineId', 
      params: { pipelineId: item.id }
    });
  }, [navigate]);

  const handleRetry = useCallback((e: React.MouseEvent, item: Pipeline) => {
    e.stopPropagation();
    retryPipeline(item.id);
  }, [retryPipeline]);

  // Memoize columns configuration
  const columns = useMemo(() => [
    {
      key: 'name' as const,
      header: 'Pipeline',
      render: (_: unknown, item: Pipeline) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <GitBranch className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'status' as const,
      header: 'Status',
      render: (value: unknown) => <StatusBadge status={value as Pipeline['status']} />
    },
    {
      key: 'lastRun' as const,
      header: 'Last Run',
      render: (value: unknown) => formatDate(value as string)
    },
    {
      key: 'duration' as const,
      header: 'Duration',
      render: (value: unknown) => formatDuration(value as number)
    },
    {
      key: 'recordsProcessed' as const,
      header: 'Records',
      render: (value: unknown) => formatNumber(value as number)
    },
    {
      key: 'environment' as const,
      header: 'Environment',
      render: (value: unknown) => (
        <span className={`
          inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
          ${value === 'production' ? 'bg-red-500/10 text-red-600' : 
            value === 'staging' ? 'bg-yellow-500/10 text-yellow-600' : 
            'bg-blue-500/10 text-blue-600'}
        `}>
          {value as string}
        </span>
      )
    },
    {
      key: 'owner' as const,
      header: 'Owner',
      render: (value: unknown) => <span className="text-muted-foreground">{value as string}</span>
    },
    {
      key: 'actions' as const,
      header: '',
      render: (_: unknown, item: Pipeline) => (
        <div className="flex items-center gap-2">
          {currentUser.role === 'ADMIN' && item.status === 'FAILED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleRetry(e, item)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      )
    }
  ], [currentUser.role, handleRetry]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Pipelines</h1>
        <p className="text-muted-foreground">
          Monitor and manage ETL pipelines across all environments
        </p>
      </div>

      <KpiGrid>
        <KpiCard
          title="Total Pipelines"
          value={metrics.total}
          description="Across all environments"
          icon={<Database className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Running"
          value={metrics.running}
          description="Currently executing"
          icon={<Play className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Failed"
          value={metrics.failed}
          description="Require attention"
          trend={{ value: metrics.failed, isPositive: false }}
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
        />
        <KpiCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          description="Last 24 hours"
          trend={{ value: 2.5, isPositive: true }}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
      </KpiGrid>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pipeline Status</CardTitle>
              <CardDescription>
                Real-time pipeline execution status
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {(['all', 'running', 'failed', 'success'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            data={filteredPipelines}
            columns={columns}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};
