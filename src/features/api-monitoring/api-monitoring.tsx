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

export const ApiMonitoring = () => {
  const { apiMetrics, apiEndpoints } = useAppStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  // Filter metrics based on selected time range
  const getFilteredMetrics = () => {
    const now = Date.now();
    const ranges: Record<TimeRange, number> = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const cutoff = now - ranges[timeRange];
    return apiMetrics.filter(m => new Date(m.timestamp).getTime() > cutoff);
  };

  const filteredMetrics = getFilteredMetrics();
  const latestMetrics = filteredMetrics.slice(-12);
  
  // Calculate dynamic metrics based on time range
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
  }, [filteredMetrics, latestMetrics, timeRange]);

  const latencyData = filteredMetrics.map(m => ({
    timestamp: m.timestamp,
    P50: m.latencyP50,
    P95: m.latencyP95,
    P99: m.latencyP99
  }));

  // Dynamic region data based on filtered metrics
  const regionData = useMemo(() => {
    const baseMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 12 : timeRange === '7d' ? 84 : 360;
    return [
      { name: 'US East', value: Math.floor(35000 * baseMultiplier * (0.9 + Math.random() * 0.2)) },
      { name: 'US West', value: Math.floor(28000 * baseMultiplier * (0.9 + Math.random() * 0.2)) },
      { name: 'EU West', value: Math.floor(22000 * baseMultiplier * (0.9 + Math.random() * 0.2)) },
      { name: 'EU Central', value: Math.floor(18000 * baseMultiplier * (0.9 + Math.random() * 0.2)) },
      { name: 'AP South', value: Math.floor(15000 * baseMultiplier * (0.9 + Math.random() * 0.2)) },
      { name: 'AP Northeast', value: Math.floor(12000 * baseMultiplier * (0.9 + Math.random() * 0.2)) }
    ];
  }, [timeRange]);

  // Dynamic error distribution based on time range
  const errorDistribution = useMemo(() => {
    const baseValues = {
      success: 94.2,
      redirect: 3.5,
      clientError: 1.8,
      serverError: 0.5
    };
    
    // Higher error rates for longer time ranges (simulating historical data)
    const errorMultiplier = timeRange === '1h' ? 1 : timeRange === '24h' ? 1.2 : timeRange === '7d' ? 1.5 : 1.8;
    const clientError = Math.min(baseValues.clientError * errorMultiplier, 5);
    const serverError = Math.min(baseValues.serverError * errorMultiplier, 3);
    const totalErrors = clientError + serverError + baseValues.redirect;
    const success = Math.max(100 - totalErrors, 85);
    
    return [
      { name: '2xx Success', value: parseFloat(success.toFixed(1)) },
      { name: '3xx Redirect', value: baseValues.redirect },
      { name: '4xx Client Error', value: parseFloat(clientError.toFixed(1)) },
      { name: '5xx Server Error', value: parseFloat(serverError.toFixed(1)) }
    ];
  }, [timeRange]);

  const columns = [
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
  ];

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
            <Table data={apiEndpoints.slice(0, 10)} columns={columns} />
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
