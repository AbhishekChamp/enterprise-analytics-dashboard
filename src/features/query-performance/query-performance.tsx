import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { formatDuration, formatNumber, formatBytes } from '@/utils/formatting';
import { BarChartComponent, ChartExportWrapper } from '@/components/charts';
import { 
  Clock, 
  Database, 
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  XCircle,
  Loader2,
  Search,
  Lightbulb
} from 'lucide-react';
import type { QueryStatus, QueryComplexity } from '@/types/query-performance';

const statusIcons: Record<QueryStatus, typeof CheckCircle> = {
  running: Loader2,
  completed: CheckCircle,
  failed: XCircle,
  queued: Clock,
  cancelled: XCircle,
};

const statusColors: Record<QueryStatus, string> = {
  running: 'text-blue-500',
  completed: 'text-green-500',
  failed: 'text-red-500',
  queued: 'text-yellow-500',
  cancelled: 'text-gray-500',
};

const complexityColors: Record<QueryComplexity, string> = {
  simple: 'bg-green-500',
  moderate: 'bg-blue-500',
  complex: 'bg-orange-500',
  very_complex: 'bg-red-500',
};

const severityIcons = {
  low: CheckCircle,
  medium: AlertTriangle,
  high: AlertCircle,
  critical: XCircle,
};

const severityColors = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-orange-500',
  critical: 'text-red-500',
};

export const QueryPerformance = () => {
  const { queryMetrics, queryOptimizations, tableStatistics, queryPerformanceSummary } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<QueryStatus | 'all'>('all');
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

  const filteredQueries = useMemo(() => {
    if (selectedStatus === 'all') return queryMetrics;
    return queryMetrics.filter(q => q.status === selectedStatus);
  }, [queryMetrics, selectedStatus]);

  const chartData = useMemo(() => {
    const statusCounts = {
      completed: queryMetrics.filter(q => q.status === 'completed').length,
      running: queryMetrics.filter(q => q.status === 'running').length,
      failed: queryMetrics.filter(q => q.status === 'failed').length,
      queued: queryMetrics.filter(q => q.status === 'queued').length,
    };
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [queryMetrics]);

  const selectedQueryData = useMemo(() => 
    selectedQuery ? queryMetrics.find(q => q.id === selectedQuery) : null,
  [selectedQuery, queryMetrics]);

  const optimizationsForQuery = useMemo(() =>
    selectedQuery ? queryOptimizations.filter(o => o.queryId === selectedQuery) : [],
  [selectedQuery, queryOptimizations]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Query Performance</h1>
        <p className="text-muted-foreground">
          Monitor query execution and identify optimization opportunities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Queries (24h)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <span className="text-3xl font-bold">{formatNumber(queryPerformanceSummary.totalQueries)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {queryPerformanceSummary.cacheHitRate}% cache hit rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{formatDuration(queryPerformanceSummary.avgDuration)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              P95: {formatDuration(queryPerformanceSummary.p95Duration)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Slow Queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-3xl font-bold">{queryPerformanceSummary.slowQueries}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Queries &gt; 30s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">${queryPerformanceSummary.totalCost.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Query List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Queries</CardTitle>
                <CardDescription>Click on a query to view details</CardDescription>
              </div>
              <div className="flex gap-2">
                {(['all', 'running', 'completed', 'failed', 'queued'] as const).map(status => (
                  <Button 
                    key={status}
                    variant={selectedStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredQueries.map(query => {
                const Icon = statusIcons[query.status];
                return (
                  <div 
                    key={query.id}
                    onClick={() => setSelectedQuery(selectedQuery === query.id ? null : query.id)}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedQuery === query.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${complexityColors[query.complexity]}`} />
                      <div>
                        <p className="font-medium text-sm truncate max-w-md">{query.normalizedQuery.substring(0, 60)}...</p>
                        <p className="text-xs text-muted-foreground">
                          {query.user} • {query.warehouse} • {query.tables.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Icon className={`h-4 w-4 ${statusColors[query.status]}`} />
                        <span className="font-medium">{formatDuration(query.duration)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">${query.cost.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Query Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Query Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartExportWrapper filename="query-status">
              <BarChartComponent data={chartData} />
            </ChartExportWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Query Details */}
      {selectedQueryData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Query Details</CardTitle>
                <CardDescription>Performance metrics and optimization suggestions</CardDescription>
              </div>
              <Badge variant={selectedQueryData.cachingUsed ? 'default' : 'outline'}>
                {selectedQueryData.cachingUsed ? 'Cached' : 'No Cache'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Query</p>
                  <code className="block p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {selectedQueryData.queryText}
                  </code>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Performance Metrics</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded-lg border">
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">{formatDuration(selectedQueryData.duration)}</p>
                    </div>
                    <div className="p-2 rounded-lg border">
                      <p className="text-muted-foreground">Cost</p>
                      <p className="font-medium">${selectedQueryData.cost.toFixed(2)}</p>
                    </div>
                    <div className="p-2 rounded-lg border">
                      <p className="text-muted-foreground">Bytes Scanned</p>
                      <p className="font-medium">{formatBytes(selectedQueryData.bytesScanned)}</p>
                    </div>
                    <div className="p-2 rounded-lg border">
                      <p className="text-muted-foreground">Rows Returned</p>
                      <p className="font-medium">{formatNumber(selectedQueryData.rowsReturned)}</p>
                    </div>
                    <div className="p-2 rounded-lg border">
                      <p className="text-muted-foreground">Partitions</p>
                      <p className="font-medium">{selectedQueryData.partitionsScanned}/{selectedQueryData.partitionsTotal}</p>
                    </div>
                    <div className="p-2 rounded-lg border">
                      <p className="text-muted-foreground">Complexity</p>
                      <p className="font-medium capitalize">{selectedQueryData.complexity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {optimizationsForQuery.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Optimization Suggestions</p>
                    <div className="space-y-3">
                      {optimizationsForQuery.map((opt, idx) => {
                        const Icon = severityIcons[opt.severity];
                        return (
                          <div key={idx} className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`h-4 w-4 ${severityColors[opt.severity]}`} />
                              <span className="font-medium text-sm capitalize">{opt.category}</span>
                              <Badge variant="outline" className="text-xs capitalize">{opt.severity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{opt.issue}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <Lightbulb className="h-3 w-3" />
                              <span>{opt.suggestion}</span>
                            </div>
                            <p className="text-xs text-green-600 mt-2">
                              Potential savings: ${opt.estimatedCostSavings.toFixed(2)}/query
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedQueryData.errorMessage && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-sm">Error</span>
                    </div>
                    <p className="text-sm text-red-600">{selectedQueryData.errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
          <CardDescription>Storage and usage statistics for frequently queried tables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tableStatistics.map(table => (
              <div key={table.tableName} className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{table.tableName}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rows:</span>
                    <span>{formatNumber(table.rowCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{table.sizeGB} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Partitions:</span>
                    <span>{table.partitions}</span>
                  </div>
                  {table.clusteringKey && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clustered by:</span>
                      <span>{table.clusteringKey}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
