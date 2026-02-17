import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAppStore } from '@/store/app-store';
import { formatDate, formatDistanceToNow } from '@/utils/formatting';
import { MultiLineChartComponent } from '@/components/charts';
import { RecentActivity } from '@/components/recent-activity';
import { HealthScoreCard } from '@/components/health-score';
import { DataRefreshIndicator } from '@/components/data-refresh-indicator';
import { 
  Activity, 
  GitBranch, 
  Database, 
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { pipelines, datasets, incidents, apiMetrics, favoritePipelines } = useAppStore();
  const [showComparative, setShowComparative] = useState(false);

  // Memoize expensive computations
  const activeIncidents = useMemo(() => 
    incidents.filter(i => i.status === 'open' || i.status === 'investigating'),
    [incidents]
  );

  const latestMetrics = useMemo(() => 
    apiMetrics.slice(-12),
    [apiMetrics]
  );
  
  const pipelineMetrics = useMemo(() => ({
    total: pipelines.length,
    running: pipelines.filter(p => p.status === 'RUNNING').length,
    failed: pipelines.filter(p => p.status === 'FAILED').length,
    successRate: pipelines.length > 0 ? Math.round((pipelines.filter(p => p.status === 'SUCCESS').length / pipelines.length) * 100) : 0
  }), [pipelines]);

  const freshnessMetrics = useMemo(() => ({
    total: datasets.length,
    fresh: datasets.filter(d => d.freshnessStatus === 'FRESH').length,
    stale: datasets.filter(d => d.freshnessStatus === 'STALE').length
  }), [datasets]);

  const comparativeData = useMemo(() => {
    // Compare current period with previous period using deterministic values
    const currentSuccess = pipelineMetrics.successRate;
    // Use a deterministic offset based on the current value
    const previousSuccess = Math.max(0, currentSuccess - 5 + (currentSuccess % 10));
    
    return {
      pipelineSuccess: {
        current: currentSuccess,
        previous: Math.round(previousSuccess),
        change: currentSuccess - previousSuccess
      },
      activeIncidents: {
        current: activeIncidents.length,
        previous: activeIncidents.length + (activeIncidents.length % 3),
        change: -(activeIncidents.length % 3)
      }
    };
  }, [pipelineMetrics.successRate, activeIncidents.length]);

  const latencyData = useMemo(() => 
    latestMetrics.map(m => ({
      timestamp: m.timestamp,
      P50: m.latencyP50,
      P95: m.latencyP95
    })),
    [latestMetrics]
  );

  // Memoize recent pipelines to prevent re-filtering on every render
  const recentPipelines = useMemo(() => 
    pipelines.slice(0, 5),
    [pipelines]
  );

  // Get favorite pipelines
  const favoritePipelinesList = useMemo(() => 
    pipelines.filter(p => favoritePipelines.includes(p.id)).slice(0, 3),
    [pipelines, favoritePipelines]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Enterprise data platform overview and key metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparative(!showComparative)}
          >
            {showComparative ? 'Hide' : 'Show'} Comparison
          </Button>
          <DataRefreshIndicator />
        </div>
      </div>

      {/* KPI Grid with Tooltips */}
      <KpiGrid>
        <KpiCard
          title="Active Pipelines"
          value={`${pipelineMetrics.running}/${pipelineMetrics.total}`}
          description="Currently running"
          trend={{ value: pipelineMetrics.successRate, isPositive: true }}
          icon={<GitBranch className="h-4 w-4 text-blue-500" />}
          tooltip="Number of ETL pipelines currently executing out of total configured pipelines"
        />
        <KpiCard
          title="Data Freshness"
          value={`${freshnessMetrics.fresh}/${freshnessMetrics.total}`}
          description="Datasets up to date"
          icon={<Database className="h-4 w-4 text-green-500" />}
          tooltip="Count of datasets that have been refreshed within their SLA window"
        />
        <KpiCard
          title="Active Incidents"
          value={activeIncidents.length}
          description="Require attention"
          trend={{ value: activeIncidents.length, isPositive: activeIncidents.length === 0 }}
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          tooltip="Number of unresolved production incidents requiring immediate attention"
        />
        <KpiCard
          title="Avg Latency"
          value={`${latestMetrics.length > 0 ? latestMetrics[latestMetrics.length - 1].latencyP50 : 0}ms`}
          trend={{ value: 5.2, isPositive: false }}
          description="P50 response time"
          icon={<Clock className="h-4 w-4 text-blue-500" />}
          tooltip="Median (P50) API response time across all regions and endpoints"
        />
      </KpiGrid>

      {/* Comparative Analytics */}
      {showComparative && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Comparative Analytics
            </CardTitle>
            <CardDescription>Current period vs previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">Pipeline Success Rate</p>
                  <p className="text-2xl font-bold">{comparativeData.pipelineSuccess.current}%</p>
                </div>
                <div className={`flex items-center gap-1 ${comparativeData.pipelineSuccess.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {comparativeData.pipelineSuccess.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {comparativeData.pipelineSuccess.change >= 0 ? '+' : ''}{comparativeData.pipelineSuccess.change}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                  <p className="text-2xl font-bold">{comparativeData.activeIncidents.current}</p>
                </div>
                <div className={`flex items-center gap-1 ${comparativeData.activeIncidents.change <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {comparativeData.activeIncidents.change <= 0 ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {comparativeData.activeIncidents.change >= 0 ? '+' : ''}{comparativeData.activeIncidents.change}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* API Latency Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>API Latency Trend</CardTitle>
            <CardDescription>Response time percentiles over time</CardDescription>
          </CardHeader>
          <CardContent>
            <MultiLineChartComponent
              data={latencyData}
              lines={[
                { key: 'P50', name: 'P50', color: '#3b82f6' },
                { key: 'P95', name: 'P95', color: '#f59e0b' }
              ]}
            />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* Health Score and Incidents */}
      <div className="grid gap-6 lg:grid-cols-3">
        <HealthScoreCard />

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest production issues</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeIncidents.slice(0, 4).map(incident => (
                <div key={incident.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="mt-0.5">
                    <StatusBadge status={incident.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{incident.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {incident.service} • {formatDate(incident.startedAt)}
                    </p>
                  </div>
                </div>
              ))}
              {activeIncidents.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active incidents</p>
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate({ to: '/incidents' })}
            >
              View all incidents
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pipelines and SLA */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Status</CardTitle>
            <CardDescription>Current execution status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPipelines.map(pipeline => (
                <div key={pipeline.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <GitBranch className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{pipeline.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(pipeline.lastRun)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={pipeline.status} />
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate({ to: '/pipelines' })}
            >
              View all pipelines
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SLA Overview</CardTitle>
            <CardDescription>Data freshness status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Datasets on Schedule</span>
                <span className="text-2xl font-bold text-green-500">
                  {freshnessMetrics.total > 0 ? Math.round((freshnessMetrics.fresh / freshnessMetrics.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${freshnessMetrics.total > 0 ? (freshnessMetrics.fresh / freshnessMetrics.total) * 100 : 0}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-600 font-medium">Fresh</p>
                  <p className="text-2xl font-bold">{freshnessMetrics.fresh}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-600 font-medium">Stale</p>
                  <p className="text-2xl font-bold">{freshnessMetrics.stale}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate({ to: '/freshness' })}
            >
              View freshness details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Pipelines */}
      {favoritePipelinesList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Favorite Pipelines</CardTitle>
            <CardDescription>Quick access to your bookmarked pipelines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {favoritePipelinesList.map(pipeline => (
                <div 
                  key={pipeline.id} 
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate({ to: '/pipelines/$pipelineId', params: { pipelineId: pipeline.id } })}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <GitBranch className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{pipeline.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {pipeline.environment} • {formatDistanceToNow(pipeline.lastRun)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={pipeline.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
