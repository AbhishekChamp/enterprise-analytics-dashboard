import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/utils/formatting';
import { BarChartComponent, PieChartComponent, ChartExportWrapper } from '@/components/charts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Database,
  Cpu,
  Network,
  Receipt,
  CheckCircle
} from 'lucide-react';
import type { CostCategory } from '@/types/cost-analytics';

const categoryIcons: Record<CostCategory, typeof DollarSign> = {
  compute: Cpu,
  storage: Database,
  network: Network,
  licensing: Receipt,
};

const categoryColors: Record<CostCategory, string> = {
  compute: '#3b82f6',
  storage: '#10b981',
  network: '#f59e0b',
  licensing: '#8b5cf6',
};

export const CostAnalytics = () => {
  const { costSummary, costBudgets, costAttribution, costMetrics } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<CostCategory | 'all'>('all');

  const categoryData = useMemo(() => [
    { name: 'Compute', value: costSummary.byCategory.compute, color: categoryColors.compute },
    { name: 'Storage', value: costSummary.byCategory.storage, color: categoryColors.storage },
    { name: 'Network', value: costSummary.byCategory.network, color: categoryColors.network },
    { name: 'Licensing', value: costSummary.byCategory.licensing, color: categoryColors.licensing },
  ], [costSummary]);

  const teamData = useMemo(() => {
    const sortedTeams = Object.entries(costSummary.byTeam)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return sortedTeams.map(([name, value]) => ({ name, value }));
  }, [costSummary]);

  const filteredMetrics = useMemo(() => {
    if (selectedCategory === 'all') return costMetrics.slice(0, 10);
    return costMetrics.filter(m => m.category === selectedCategory).slice(0, 10);
  }, [costMetrics, selectedCategory]);

  const isOverBudget = (budget: typeof costBudgets[0]) => {
    const percentage = (budget.currentSpend / budget.limit) * 100;
    return percentage >= budget.alertThreshold;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cost Analytics</h1>
        <p className="text-muted-foreground">
          Monitor infrastructure costs and optimize resource utilization
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cost (MTD)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-3xl font-bold">{formatCurrency(costSummary.total)}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {costSummary.trend.change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className={costSummary.trend.change >= 0 ? 'text-red-500' : 'text-green-500'}>
                {costSummary.trend.change >= 0 ? '+' : ''}{costSummary.trend.change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground text-sm">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compute Costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{formatCurrency(costSummary.byCategory.compute)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {((costSummary.byCategory.compute / costSummary.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Storage Costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">{formatCurrency(costSummary.byCategory.storage)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {((costSummary.byCategory.storage / costSummary.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-purple-500" />
              <span className="text-3xl font-bold">{costBudgets.length}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {costBudgets.filter(b => isOverBudget(b)).length} approaching limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost by Category</CardTitle>
            <CardDescription>Distribution of costs across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartExportWrapper filename="cost-by-category">
              <PieChartComponent data={categoryData} />
            </ChartExportWrapper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Teams by Cost</CardTitle>
            <CardDescription>Cost attribution by team</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartExportWrapper filename="top-teams-by-cost">
              <BarChartComponent data={teamData} />
            </ChartExportWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Budgets */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Tracking</CardTitle>
          <CardDescription>Monthly budget utilization by team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costBudgets.map(budget => {
              const percentage = (budget.currentSpend / budget.limit) * 100;
              const isAlert = isOverBudget(budget);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{budget.name}</span>
                      {isAlert && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(budget.currentSpend)} / {formatCurrency(budget.limit)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={percentage} className="flex-1" />
                    <span className={`text-sm font-medium w-16 text-right ${
                      percentage >= 100 ? 'text-red-500' : percentage >= budget.alertThreshold ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cost Attribution */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Attribution</CardTitle>
          <CardDescription>Most expensive resources and their efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costAttribution.slice(0, 5).map(item => (
              <div key={item.resourceId} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.resourceType === 'pipeline' ? (
                      <Cpu className="h-5 w-5 text-primary" />
                    ) : item.resourceType === 'dataset' ? (
                      <Database className="h-5 w-5 text-primary" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.resourceName}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.resourceType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(item.cost)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {item.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      ${item.efficiency.toFixed(2)}/unit
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Cost Entries</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Button 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {(Object.keys(categoryIcons) as CostCategory[]).map(cat => {
              const Icon = categoryIcons[cat];
              return (
                <Button 
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {cat}
                </Button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMetrics.map(metric => {
              const Icon = categoryIcons[metric.category];
              return (
                <div key={metric.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">{metric.resourceType}: {metric.resource}</p>
                      <p className="text-xs text-muted-foreground">
                        {metric.team} • {metric.environment}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(metric.amount)}</p>
                    {metric.metadata?.dataProcessedGB && (
                      <p className="text-xs text-muted-foreground">
                        {metric.metadata.dataProcessedGB} GB processed
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
