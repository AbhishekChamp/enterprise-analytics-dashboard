import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { Table } from '@/components/tables';
import { 
  BarChartComponent, 
  PieChartComponent,
  LineChartComponent 
} from '@/components/charts';
import { segmentMetrics, regionalData, planDistribution, retentionData } from '@/mock-data/segmentation';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import { 
  Users, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const SegmentationAnalytics = () => {
  const totalUsers = segmentMetrics.reduce((acc, s) => acc + s.userCount, 0);
  const totalRevenue = segmentMetrics.reduce((acc, s) => acc + s.revenue, 0);
  const avgGrowth = segmentMetrics.reduce((acc, s) => acc + s.growthRate, 0) / segmentMetrics.length;
  const avgRetention = segmentMetrics.reduce((acc, s) => acc + s.retentionRate, 0) / segmentMetrics.length;

  const segmentColumns = [
    {
      key: 'segment' as const,
      header: 'Segment',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'userCount' as const,
      header: 'Users',
      render: (value: number) => formatNumber(value)
    },
    {
      key: 'revenue' as const,
      header: 'Revenue',
      render: (value: number) => formatCurrency(value)
    },
    {
      key: 'growthRate' as const,
      header: 'Growth',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          {value > 0 ? (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span className={value > 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(value)}%
          </span>
        </div>
      )
    },
    {
      key: 'retentionRate' as const,
      header: 'Retention',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm">{value}%</span>
        </div>
      )
    },
    {
      key: 'churnRate' as const,
      header: 'Churn',
      render: (value: number) => (
        <span className="text-red-500">{value}%</span>
      )
    },
    {
      key: 'avgRevenuePerUser' as const,
      header: 'ARPU',
      render: (value: number) => `$${value}`
    }
  ];

  const mockTrendData = Array.from({ length: 12 }, (_, i) => ({
    timestamp: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString(),
    value: 180000 + Math.random() * 20000 + i * 5000
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Segmentation</h1>
        <p className="text-muted-foreground">
          Analyze user segments, retention, and revenue metrics
        </p>
      </div>

      <KpiGrid>
        <KpiCard
          title="Total Users"
          value={formatNumber(totalUsers)}
          trend={{ value: 15.3, isPositive: true }}
          description="Active users across all segments"
          icon={<Users className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          trend={{ value: 12.8, isPositive: true }}
          description="Monthly recurring revenue"
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
        />
        <KpiCard
          title="Avg Growth Rate"
          value={`${avgGrowth.toFixed(1)}%`}
          trend={{ value: 2.4, isPositive: true }}
          description="Month over month"
          icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Avg Retention"
          value={`${avgRetention.toFixed(1)}%`}
          description="User retention rate"
          icon={<Users className="h-4 w-4 text-green-500" />}
        />
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Total users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartComponent data={mockTrendData} showArea color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Users by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent 
              data={planDistribution.map(p => ({ name: p.plan, value: p.userCount }))} 
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Segment Performance</CardTitle>
            <CardDescription>Detailed metrics by user segment</CardDescription>
          </CardHeader>
          <CardContent>
            <Table data={segmentMetrics} columns={segmentColumns} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Users by geography</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent 
              data={regionalData.map(r => ({ name: r.region, value: r.userCount }))}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Analysis</CardTitle>
          <CardDescription>User retention by acquisition cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cohort</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Month 0</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Month 1</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Month 2</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Month 3</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Month 6</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Month 12</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {retentionData.map((cohort) => (
                  <tr key={cohort.cohort} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{cohort.cohort}</td>
                    {['month0', 'month1', 'month2', 'month3', 'month6', 'month12'].map((month, i) => {
                      const value = cohort[month as keyof typeof cohort] as number;
                      const intensity = value / 100;
                      return (
                        <td key={i} className="px-4 py-3 text-center">
                          <div 
                            className="inline-flex items-center justify-center w-12 h-8 rounded text-sm font-medium dark:text-foreground"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${intensity * 0.3})`,
                            }}
                          >
                            {value}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
