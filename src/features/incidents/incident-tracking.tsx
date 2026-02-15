import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard, KpiGrid } from '@/components/ui/kpi-card';
import { Table } from '@/components/tables';
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
  XCircle
} from 'lucide-react';
import { PieChartComponent } from '@/components/charts';
import type { Incident } from '@/types/incidents';

export const IncidentTracking = () => {
  const { incidents, errorLogs, serviceHealth, currentUser, updateIncidentStatus } = useAppStore();

  const activeIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved' || i.status === 'closed');
  
  const avgMttr = resolvedIncidents.length > 0
    ? Math.round(resolvedIncidents.reduce((acc, i) => acc + (i.mttr || 0), 0) / resolvedIncidents.length)
    : 0;

  const degradedServices = serviceHealth.filter(s => s.status === 'degraded');

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
            {activeIncidents.map(incident => (
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
            <CardTitle>Active Incidents</CardTitle>
            <CardDescription>Current production incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <Table data={activeIncidents} columns={incidentColumns} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Errors by type</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <PieChartComponent data={errorDistribution} height={280} />
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
              data={errorLogs.slice(0, 5)} 
              columns={errorColumns.slice(0, 4)} 
            />
          </CardContent>
        </Card>
      </div>

      {currentUser.role === 'ADMIN' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Error Logs</CardTitle>
            <CardDescription>Detailed error information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table data={errorLogs} columns={errorColumns} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
