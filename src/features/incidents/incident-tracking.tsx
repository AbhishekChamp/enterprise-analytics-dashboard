import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { EnhancedTable as Table } from '@/components/tables/enhanced-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAppStore } from '@/store/app-store';
import { formatDate } from '@/utils/formatting';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  Server,
  XCircle,
  Trash2
} from 'lucide-react';
import { PieChartComponent } from '@/components/charts';
import type { Incident } from '@/types/incidents';

export const IncidentTracking = () => {
  const { incidents, errorLogs, serviceHealth, currentUser, updateIncidentStatus, resolveMultipleIncidents } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const activeIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved' || i.status === 'closed');
  
  const avgMttr = resolvedIncidents.length > 0
    ? Math.round(resolvedIncidents.reduce((acc, i) => acc + (i.mttr || 0), 0) / resolvedIncidents.length)
    : 0;

  const degradedServices = serviceHealth.filter(s => s.status === 'degraded');

  // Filter incidents based on selected filter
  const filteredIncidents = useMemo(() => {
    switch (filter) {
      case 'active':
        return activeIncidents;
      case 'resolved':
        return resolvedIncidents;
      default:
        return incidents;
    }
  }, [incidents, activeIncidents, resolvedIncidents, filter]);

  const errorDistribution = [
    { name: 'Runtime', value: 28 },
    { name: 'Timeout', value: 32 },
    { name: 'Database', value: 45 },
    { name: 'Network', value: 12 },
    { name: 'Auth', value: 8 },
    { name: 'Validation', value: 3 }
  ];

  const incidentColumns = [
    {
      key: 'id' as const,
      header: 'ID',
      render: (value: string) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'title' as const,
      header: 'Title',
      render: (_: string, item: Incident) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.service}</p>
        </div>
      )
    },
    {
      key: 'severity' as const,
      header: 'Severity',
      render: (value: string) => <StatusBadge status={value as Incident['severity']} />
    },
    {
      key: 'status' as const,
      header: 'Status',
      render: (value: string) => <StatusBadge status={value as Incident['status']} />
    },
    {
      key: 'startedAt' as const,
      header: 'Started',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'impactedUsers' as const,
      header: 'Impacted',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'assignee' as const,
      header: 'Assignee',
      render: (value: string | undefined) => value || 'Unassigned'
    },
    {
      key: 'actions' as const,
      header: '',
      render: (_: unknown, item: Incident) => (
        currentUser.role === 'ADMIN' && (item.status === 'open' || item.status === 'investigating') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateIncidentStatus(item.id, 'resolved')}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolve
          </Button>
        )
      )
    }
  ];

  const errorColumns = [
    {
      key: 'timestamp' as const,
      header: 'Time',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'errorType' as const,
      header: 'Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'service' as const,
      header: 'Service',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'message' as const,
      header: 'Message',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground truncate max-w-md">{value}</span>
      )
    },
    {
      key: 'resolved' as const,
      header: 'Status',
      render: (value: boolean) => (
        value ? (
          <Badge variant="success">Resolved</Badge>
        ) : (
          <Badge variant="destructive">Active</Badge>
        )
      )
    }
  ];

  const handleBulkResolve = () => {
    const activeSelectedIds = selectedIds.filter(id => {
      const incident = incidents.find(i => i.id === id);
      return incident && (incident.status === 'open' || incident.status === 'investigating');
    });
    
    if (activeSelectedIds.length > 0) {
      resolveMultipleIncidents(activeSelectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incident & Error Tracking</h1>
        <p className="text-muted-foreground">
          Monitor production incidents, errors, and service health
        </p>
      </div>

      {activeIncidents.length > 0 && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Active Incidents ({activeIncidents.length})</span>
          </div>
          <div className="mt-3 space-y-2">
            {activeIncidents.slice(0, 3).map(incident => (
              <div key={incident.id} className="flex items-center justify-between p-3 rounded-md bg-background">
                <div>
                  <p className="font-medium">{incident.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {incident.service} • Started {formatDate(incident.startedAt)}
                  </p>
                </div>
                <StatusBadge status={incident.severity} />
              </div>
            ))}
          </div>
        </div>
      )}

      <KpiGrid>
        <KpiCard
          title="Active Incidents"
          value={activeIncidents.length}
          trend={{ value: activeIncidents.length, isPositive: activeIncidents.length === 0 }}
          description="Require attention"
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
        />
        <KpiCard
          title="Avg MTTR"
          value={`${avgMttr}m`}
          description="Mean time to resolve"
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
        <KpiCard
          title="Degraded Services"
          value={degradedServices.length}
          description="Below SLA threshold"
          icon={<Activity className="h-4 w-4 text-yellow-500" />}
        />
        <KpiCard
          title="Error Rate"
          value="0.8%"
          trend={{ value: 0.2, isPositive: false }}
          description="Last hour average"
          icon={<XCircle className="h-4 w-4 text-red-500" />}
        />
      </KpiGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Incidents</CardTitle>
                <CardDescription>Current production incidents</CardDescription>
              </div>
              <div className="flex gap-2">
                {(['all', 'active', 'resolved'] as const).map((f) => (
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
            
            {/* Bulk actions */}
            {selectedIds.length > 0 && currentUser.role === 'ADMIN' && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkResolve}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Resolve Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Table 
              data={filteredIncidents} 
              columns={incidentColumns} 
              getRowId={(item) => item.id}
              enableSelection={currentUser.role === 'ADMIN'}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              enableExport={true}
              exportFileName="incidents"
              enablePagination={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Errors by type</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <PieChartComponent data={errorDistribution} height={350} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Error rates by service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceHealth.map(service => (
                <div key={service.service} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{service.service}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${service.errorRate > 2 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {service.errorRate}% errors
                    </span>
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
            <CardDescription>Latest error logs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table 
              data={errorLogs.slice(0, 10)} 
              columns={errorColumns}
              getRowId={(item) => item.id}
              enableExport={true}
              exportFileName="errors"
              enablePagination={true}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>

      {currentUser.role === 'ADMIN' && (
        <Card>
          <CardHeader>
            <CardTitle>All Error Logs</CardTitle>
            <CardDescription>Detailed error information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table 
              data={errorLogs} 
              columns={errorColumns}
              getRowId={(item) => item.id}
              enableExport={true}
              exportFileName="all-errors"
              enablePagination={true}
              pageSize={15}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
