import { useMemo, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { EnhancedTable as Table } from '@/components/tables/enhanced-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAppStore } from '@/store/app-store';
import { 
  Clock, 
  CheckCircle, 
  Database,
  ShieldAlert
} from 'lucide-react';
import type { DatasetFreshness } from '@/types/freshness';

export const FreshnessMonitoring = () => {
  const { datasets } = useAppStore();
  const search = useSearch({ from: '/freshness' });
  
  // URL state for filters
  const [filter, setFilter] = useState<'all' | 'fresh' | 'delayed' | 'stale'>('all');
  
  // Handle search query from URL
  const searchQuery = (search as { q?: string }).q?.toLowerCase() || '';

  // Memoize filtered datasets
  const filteredDatasets = useMemo(() => 
    datasets.filter(d => {
      if (filter !== 'all' && d.freshnessStatus.toLowerCase() !== filter) return false;
      if (searchQuery && !d.datasetName.toLowerCase().includes(searchQuery)) return false;
      return true;
    }),
    [datasets, filter, searchQuery]
  );

  // Memoize metrics calculation
  const metrics = useMemo(() => ({
    total: datasets.length,
    fresh: datasets.filter(d => d.freshnessStatus === 'FRESH').length,
    delayed: datasets.filter(d => d.freshnessStatus === 'DELAYED').length,
    stale: datasets.filter(d => d.freshnessStatus === 'STALE').length,
    slaBreaches: datasets.filter(d => d.slaBreach).length,
    complianceRate: datasets.length > 0 ? Math.round(((datasets.length - datasets.filter(d => d.slaBreach).length) / datasets.length) * 100) : 0
  }), [datasets]);

  // Memoize columns configuration
  const columns = useMemo(() => [
    {
      key: 'datasetName' as const,
      header: 'Dataset',
      render: (_: string, item: DatasetFreshness) => (
        <div>
          <p className="font-medium">{item.datasetName}</p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
      )
    },
    {
      key: 'freshnessStatus' as const,
      header: 'Status',
      render: (value: string) => <StatusBadge status={value as DatasetFreshness['freshnessStatus']} />
    },
    {
      key: 'expectedRefreshTime' as const,
      header: 'Expected',
      render: (value: string) => value
    },
    {
      key: 'actualRefreshTime' as const,
      header: 'Actual',
      render: (value: string | undefined) => value || '-'
    },
    {
      key: 'delayMinutes' as const,
      header: 'Delay',
      render: (value: number) => (
        <span className={value > 60 ? 'text-red-500' : value > 30 ? 'text-yellow-500' : 'text-green-500'}>
          {value}m
        </span>
      )
    },
    {
      key: 'slaBreach' as const,
      header: 'SLA',
      render: (value: boolean) => (
        value ? (
          <Badge variant="destructive">Breached</Badge>
        ) : (
          <Badge variant="success">Compliant</Badge>
        )
      )
    },
    {
      key: 'priority' as const,
      header: 'Priority',
      render: (value: string) => (
        <Badge variant={
          value === 'critical' ? 'destructive' : 
          value === 'high' ? 'default' : 
          value === 'medium' ? 'secondary' : 
          'outline'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'owner' as const,
      header: 'Owner',
      render: (value: string) => <span className="text-muted-foreground">{value}</span>
    }
  ], []);

  // Memoize delayed datasets
  const delayedDatasets = useMemo(() => 
    datasets
      .filter(d => d.freshnessStatus !== 'FRESH')
      .slice(0, 5),
    [datasets]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Freshness & SLA</h1>
        <p className="text-muted-foreground">
          Monitor dataset freshness and SLA compliance across all data products
        </p>
      </div>

      <KpiGrid>
        <KpiCard
          title="Total Datasets"
          value={metrics.total}
          description="Under monitoring"
          icon={<Database className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Fresh Datasets"
          value={metrics.fresh}
          trend={{ value: metrics.total > 0 ? metrics.fresh / metrics.total * 100 : 0, isPositive: true }}
          description="Up to date"
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <KpiCard
          title="SLA Breaches"
          value={metrics.slaBreaches}
          trend={{ value: metrics.slaBreaches, isPositive: false }}
          description="Require attention"
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
        />
        <KpiCard
          title="SLA Compliance"
          value={`${metrics.complianceRate}%`}
          description="Overall compliance rate"
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dataset Freshness Status</CardTitle>
                <CardDescription>
                  Real-time freshness monitoring for all datasets
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {(['all', 'fresh', 'delayed', 'stale'] as const).map((f) => (
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
              data={filteredDatasets} 
              columns={columns}
              getRowId={(item) => item.id}
              enableExport={true}
              exportFileName="datasets"
              enablePagination={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Fresh</span>
                  </div>
                  <span className="font-medium">{metrics.fresh}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Delayed</span>
                  </div>
                  <span className="font-medium">{metrics.delayed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">Stale</span>
                  </div>
                  <span className="font-medium">{metrics.stale}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delayed Datasets</CardTitle>
              <CardDescription>Datasets past expected refresh time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {delayedDatasets.map(dataset => (
                  <div key={dataset.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{dataset.datasetName}</p>
                      <p className="text-xs text-muted-foreground">
                        Delayed by {dataset.delayMinutes} minutes
                      </p>
                    </div>
                    <StatusBadge status={dataset.freshnessStatus} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
