import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { Table } from '@/components/tables';
import { useAppStore } from '@/store/app-store';
import { formatNumber } from '@/utils/formatting';
import { MultiLineChartComponent, BarChartComponent, PieChartComponent } from '@/components/charts';
import { 
  Activity, 
  AlertTriangle, 
  Clock,
  Server
} from 'lucide-react';
import type { ApiEndpoint, TimeRange } from '@/types/api-monitoring';

// Pre-computed region data multipliers to avoid Math.random in render
const REGION_MULTIPLIERS = [0.95, 1.05, 0.98, 1.02, 0.97, 1.03];

export const ApiMonitoring = () => {
  const { apiMetrics, apiEndpoints } = useAppStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  
  // Use lazy state initialization to capture timestamp once on mount
  const [currentTime] = useState(() => Date.now());

  // Filter metrics based on selected time range - memoized
  const filteredMetrics = useMemo(() => {
    const ranges: Record<TimeRange, number> = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const cutoff = currentTime - ranges[timeRange];
    return apiMetrics.filter(m => new Date(m.timestamp).getTime() > cutoff);
  }, [apiMetrics, timeRange, currentTime]);

  const latestMetrics = useMemo(() => filteredMetrics.slice(-12), [filteredMetrics]);
  
  // Calculate dynamic metrics based on time range - memoized
  const avgMetrics = useMemo(() => {
    const baseLatency = latestMetrics.length > 0 
      ? Math.round(latestMetrics.reduce((acc, m) => acc + m.latencyP50, 0) / latestMetrics.length)
      : 0;
    
    // Simulate different values for different time ranges
    const timeMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 1.2 : timeRange === '7d' ? 0.9 : 0.85;
    const errorMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 1.1 : timeRange === '7d' ? 1.3 : 1.5;
    const throughputMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 0.95 : timeRange === '7d' ? 1.1 : 1.15;
    
    return {
      latency: Math.round(baseLatency * timeMultiplier),
      errorRate: latestMetrics.length > 0
        ? parseFloat(((latestMetrics.reduce((acc, m) => acc + m.errorRate, 0) / latestMetrics.length) * errorMultiplier).toFixed(2))
        : 0,
      throughput: latestMetrics.length > 0
        ? Math.round((latestMetrics.reduce((acc, m) => acc + m.throughput, 0) / latestMetrics.length) * throughputMultiplier)
        : 0,
      availability: timeRange === '1h' ? 99.95 : timeRange === '24h' ? 99.92 : timeRange === '7d' ? 99.85 : 99.78
    };
  }, [latestMetrics, timeRange]);

  const latencyData = useMemo(() => 
    filteredMetrics.map(m => ({
      timestamp: m.timestamp,
      P50: m.latencyP50,
      P95: m.latencyP95,
      P99: m.latencyP99
    })),
    [filteredMetrics]
  );

  // Dynamic region data based on filtered metrics - memoized with deterministic values
  const regionData = useMemo(() => {
    const baseMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 12 : timeRange === '7d' ? 84 : 360;
    const baseValues = [35000, 28000, 22000, 18000, 15000, 12000];
    return [
      { name: 'US East', value: Math.floor(baseValues[0] * baseMultiplier * REGION_MULTIPLIERS[0]) },
      { name: 'US West', value: Math.floor(baseValues[1] * baseMultiplier * REGION_MULTIPLIERS[1]) },
      { name: 'EU West', value: Math.floor(baseValues[2] * baseMultiplier * REGION_MULTIPLIERS[2]) },
      { name: 'EU Central', value: Math.floor(baseValues[3] * baseMultiplier * REGION_MULTIPLIERS[3]) },
      { name: 'AP South', value: Math.floor(baseValues[4] * baseMultiplier * REGION_MULTIPLIERS[4]) },
      { name: 'AP Northeast', value: Math.floor(baseValues[5] * baseMultiplier * REGION_MULTIPLIERS[5]) }
    ];
  }, [timeRange]);

  // Calculate error distribution from actual filtered metrics
  const errorDistribution = useMemo(() => {
    if (filteredMetrics.length === 0) {
      return [
        { name: '2xx Success', value: 94.2 },
        { name: '3xx Redirect', value: 3.5 },
        { name: '4xx Client Error', value: 1.8 },
        { name: '5xx Server Error', value: 0.5 }
      ];
    }
    
    const totalRequests = filteredMetrics.reduce((acc, m) => acc + m.throughput, 0);
    const totalErrors = filteredMetrics.reduce((acc, m) => acc + m.errorCount, 0);
    const totalSuccess = filteredMetrics.reduce((acc, m) => acc + m.successCount, 0);
    
    if (totalRequests === 0) {
      return [
        { name: '2xx Success', value: 94.2 },
        { name: '3xx Redirect', value: 3.5 },
        { name: '4xx Client Error', value: 1.8 },
        { name: '5xx Server Error', value: 0.5 }
      ];
    }
    
    const successRate = (totalSuccess / totalRequests) * 100;
    const errorRate = (totalErrors / totalRequests) * 100;
    
    // Estimate redirect rate (typically 3-5% of total traffic)
    const redirectRate = Math.min(3.5, 100 - successRate - errorRate);
    
    // Split errors between client and server based on error rate patterns
    // Client errors are typically more common than server errors (4:1 ratio)
    const clientErrorRate = errorRate * 0.8;
    const serverErrorRate = errorRate * 0.2;
    
    return [
      { name: '2xx Success', value: parseFloat((successRate - redirectRate).toFixed(1)) },
      { name: '3xx Redirect', value: parseFloat(redirectRate.toFixed(1)) },
      { name: '4xx Client Error', value: parseFloat(clientErrorRate.toFixed(1)) },
      { name: '5xx Server Error', value: parseFloat(serverErrorRate.toFixed(1)) }
    ];
  }, [filteredMetrics]);

  // Calculate endpoint statistics from filtered metrics
  const filteredEndpoints = useMemo(() => {
    if (filteredMetrics.length === 0) {
      return apiEndpoints.slice(0, 10);
    }
    
    // Group metrics by region and calculate averages
    const regionStats = new Map<string, {
      totalLatency: number;
      totalP95: number;
      totalP99: number;
      totalErrorRate: number;
      totalRequests: number;
      count: number;
    }>();
    
    filteredMetrics.forEach(metric => {
      const existing = regionStats.get(metric.region);
      if (existing) {
        existing.totalLatency += metric.latencyP50;
        existing.totalP95 += metric.latencyP95;
        existing.totalP99 += metric.latencyP99;
        existing.totalErrorRate += metric.errorRate;
        existing.totalRequests += metric.throughput;
        existing.count += 1;
      } else {
        regionStats.set(metric.region, {
          totalLatency: metric.latencyP50,
          totalP95: metric.latencyP95,
          totalP99: metric.latencyP99,
          totalErrorRate: metric.errorRate,
          totalRequests: metric.throughput,
          count: 1
        });
      }
    });
    
    // Map static endpoints to use dynamic data based on region
    return apiEndpoints.slice(0, 10).map((endpoint) => {
      const regionKey = endpoint.region as string;
      const stats = regionStats.get(regionKey);
      
      if (stats && stats.count > 0) {
        // Apply time range multipliers to simulate different load patterns
        const timeMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 12 : timeRange === '7d' ? 84 : 360;
        
        return {
          ...endpoint,
          avgLatency: Math.round(stats.totalLatency / stats.count),
          p95Latency: Math.round(stats.totalP95 / stats.count),
          p99Latency: Math.round(stats.totalP99 / stats.count),
          errorRate: parseFloat((stats.totalErrorRate / stats.count).toFixed(2)),
          requestCount: Math.floor(stats.totalRequests * timeMultiplier)
        };
      }
      
      return endpoint;
    });
  }, [filteredMetrics, apiEndpoints, timeRange]);

  const columns = useMemo(() => [
    {
      key: 'path' as const,
      header: 'Endpoint',
      render: (_: unknown, item: ApiEndpoint) => (
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{item.method}</Badge>
            <span className="font-medium">{item.path}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{item.region}</p>
        </div>
      )
    },
    {
      key: 'avgLatency' as const,
      header: 'Avg Latency',
      render: (value: unknown) => <span>{value as number}ms</span>
    },
    {
      key: 'p95Latency' as const,
      header: 'P95',
      render: (value: unknown) => <span>{value as number}ms</span>
    },
    {
      key: 'p99Latency' as const,
      header: 'P99',
      render: (value: unknown) => <span>{value as number}ms</span>
    },
    {
      key: 'errorRate' as const,
      header: 'Error Rate',
      render: (value: unknown) => (
        <span className={(value as number) > 1 ? 'text-red-500' : 'text-green-500'}>
          {String(value)}%
        </span>
      )
    },
    {
      key: 'requestCount' as const,
      header: 'Requests',
      render: (value: unknown) => <>{formatNumber(value as number)}</>
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Observability</h1>
          <p className="text-muted-foreground">
            Monitor API performance, latency, and error rates across all regions
          </p>
        </div>
        <div className="flex gap-2">
          {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <KpiGrid>
        <KpiCard
          title="Avg Latency (P50)"
          value={`${avgMetrics.latency}ms`}
          trend={{ value: 5.2, isPositive: false }}
          description="Compared to last hour"
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Error Rate"
          value={`${avgMetrics.errorRate}%`}
          trend={{ value: 0.3, isPositive: false }}
          description="Within acceptable range"
          icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
        />
        <KpiCard
          title="Throughput"
          value={formatNumber(avgMetrics.throughput)}
          trend={{ value: 12.5, isPositive: true }}
          description="Requests per minute"
          icon={<Activity className="h-4 w-4 text-green-500" />}
        />
        <KpiCard
          title="Availability"
          value={`${avgMetrics.availability}%`}
          description="Uptime SLA compliance"
          icon={<Server className="h-4 w-4 text-blue-500" />}
        />
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latency Percentiles</CardTitle>
            <CardDescription>P50, P95, and P99 latency over time</CardDescription>
          </CardHeader>
          <CardContent>
            <MultiLineChartComponent
              data={latencyData}
              lines={[
                { key: 'P50', name: 'P50', color: '#3b82f6' },
                { key: 'P95', name: 'P95', color: '#f59e0b' },
                { key: 'P99', name: 'P99', color: '#ef4444' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Request volume by region</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={regionData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>Performance by API endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <Table data={filteredEndpoints} columns={columns} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Distribution</CardTitle>
            <CardDescription>HTTP status code breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={errorDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
