import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/app-store';
import { formatNumber, formatBytes } from '@/utils/formatting';
import { BarChartComponent, MultiLineChartComponent, ChartExportWrapper } from '@/components/charts';
import { 
  Zap, 
  Activity,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Server,
  Database,
  Pause,
  Play
} from 'lucide-react';
import type { ConsumerGroup } from '@/types/streaming';

const typeIcons = {
  kafka: Database,
  kinesis: Server,
  pubsub: Activity,
  eventhub: Server,
  pulsar: Zap,
};

const statusIcons = {
  active: Play,
  paused: Pause,
  failed: AlertCircle,
  scaling: Activity,
};

const statusColors = {
  active: 'text-green-500',
  paused: 'text-yellow-500',
  failed: 'text-red-500',
  scaling: 'text-blue-500',
};

const lagStatusColors = {
  healthy: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
};

export const StreamingMetrics = () => {
  const { streamMetrics, streamingSummary } = useAppStore();
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  const selectedStreamData = useMemo(() =>
    selectedStream ? streamMetrics.find(s => s.id === selectedStream) : null,
  [selectedStream, streamMetrics]);

  const [throughputData, setThroughputData] = useState<Array<{ timestamp: string; messages: number; mbps: number }>>([]);

  useEffect(() => {
    if (!selectedStreamData) {
      // Defer state update to avoid synchronous setState in effect body
      const timer = setTimeout(() => setThroughputData([]), 0);
      return () => clearTimeout(timer);
    }
    // Mock time series data based on current throughput
    const baseMessages = selectedStreamData.throughput.messagesInPerSec;
    const baseBytes = selectedStreamData.throughput.bytesInPerSec / 1024 / 1024; // Convert to MB
    const now = Date.now();

    // Defer state update to avoid synchronous setState in effect body
    const timer = setTimeout(() => {
      setThroughputData(
        Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
          messages: Math.floor(baseMessages + (Math.random() - 0.5) * baseMessages * 0.2),
          mbps: Number((baseBytes + (Math.random() - 0.5) * baseBytes * 0.2).toFixed(2)),
        }))
      );
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedStreamData]);

  const consumerStatusData = useMemo(() => {
    const statusCounts = {
      stable: streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.status === 'stable').length, 0),
      rebalancing: streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.status === 'rebalancing').length, 0),
      empty: streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.status === 'empty').length, 0),
      dead: streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.status === 'dead').length, 0),
    };
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [streamMetrics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Streaming Metrics</h1>
        <p className="text-muted-foreground">
          Monitor real-time data streams, consumer lag, and throughput
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{streamingSummary.totalTopics}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Partitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{streamingSummary.totalPartitions}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Lag</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-3xl font-bold">{formatNumber(streamingSummary.averageLag)}</span>
            </div>
            {streamingSummary.criticalLags > 0 && (
              <p className="text-xs text-red-500 mt-2">
                {streamingSummary.criticalLags} critical
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Throughput</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">{streamingSummary.totalThroughputMBps.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">MB/s</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stream List */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Streams</CardTitle>
            <CardDescription>Click to view details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {streamMetrics.map(stream => {
                const Icon = typeIcons[stream.type];
                const StatusIcon = statusIcons[stream.status];
                
                return (
                  <div
                    key={stream.id}
                    onClick={() => setSelectedStream(stream.id)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedStream === stream.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{stream.name}</span>
                      </div>
                      <StatusIcon className={`h-4 w-4 ${statusColors[stream.status]}`} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{stream.topic}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {stream.partitionCount} partitions
                      </span>
                      <span className="text-muted-foreground">
                        {formatNumber(stream.throughput.messagesInPerSec)}/s
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stream Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            {selectedStreamData ? (
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedStreamData.name}</CardTitle>
                  <CardDescription>{selectedStreamData.topic}</CardDescription>
                </div>
                <Badge className={`${statusColors[selectedStreamData.status]}`}>
                  {selectedStreamData.status}
                </Badge>
              </div>
            ) : (
              <>
                <CardTitle>Stream Details</CardTitle>
                <CardDescription>Select a stream to view details</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {selectedStreamData ? (
              <div className="space-y-6">
                {/* Throughput Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Messages In</p>
                    <p className="text-2xl font-bold">{formatNumber(selectedStreamData.throughput.messagesInPerSec)}/s</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Messages Out</p>
                    <p className="text-2xl font-bold">{formatNumber(selectedStreamData.throughput.messagesOutPerSec)}/s</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Bytes In</p>
                    <p className="text-2xl font-bold">{formatBytes(selectedStreamData.throughput.bytesInPerSec)}/s</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Bytes Out</p>
                    <p className="text-2xl font-bold">{formatBytes(selectedStreamData.throughput.bytesOutPerSec)}/s</p>
                  </div>
                </div>

                {/* Throughput Chart */}
                <div>
                  <p className="text-sm font-medium mb-2">Throughput History (24h)</p>
                  <ChartExportWrapper filename="streaming-throughput">
                    <MultiLineChartComponent
                      data={throughputData}
                      lines={[
                        { key: 'messages', name: 'Messages/sec', color: '#3b82f6' },
                        { key: 'mbps', name: 'MB/sec', color: '#10b981' },
                      ]}
                    />
                  </ChartExportWrapper>
                </div>

                {/* Consumer Groups */}
                <div>
                  <p className="text-sm font-medium mb-2">Consumer Groups ({selectedStreamData.consumerGroups.length})</p>
                  <div className="space-y-3">
                    {selectedStreamData.consumerGroups.map(cg => (
                      <ConsumerGroupCard key={cg.id} consumerGroup={cg} />
                    ))}
                  </div>
                </div>

                {/* Health Metrics */}
                <div>
                  <p className="text-sm font-medium mb-2">Partition Health</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Under Replicated</p>
                      <p className="text-2xl font-bold text-red-500">
                        {selectedStreamData.health.underReplicatedPartitions}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Offline</p>
                      <p className="text-2xl font-bold text-red-500">
                        {selectedStreamData.health.offlinePartitions}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">In-Sync Replicas</p>
                      <p className="text-2xl font-bold text-green-500">
                        {selectedStreamData.health.inSyncReplicas}/{selectedStreamData.health.totalReplicas}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Replication Factor</p>
                      <p className="text-2xl font-bold">{selectedStreamData.replicationFactor}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a stream from the list to view its metrics
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Consumer Group Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Consumer Group Status</CardTitle>
          <CardDescription>Distribution across all streams</CardDescription>
        </CardHeader>
          <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <ChartExportWrapper filename="consumer-group-status">
              <BarChartComponent data={consumerStatusData} />
            </ChartExportWrapper>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Healthy</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.lagStatus === 'healthy').length, 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Warning</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.lagStatus === 'warning').length, 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Critical</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {streamMetrics.reduce((acc, s) => acc + s.consumerGroups.filter(cg => cg.lagStatus === 'critical').length, 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Total Groups</span>
                </div>
                <p className="text-2xl font-bold">{streamingSummary.totalConsumerGroups}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Consumer Group Card Component
const ConsumerGroupCard = ({ consumerGroup }: { consumerGroup: ConsumerGroup }) => {
  return (
    <div className="p-3 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{consumerGroup.name}</span>
          <Badge variant="outline" className="text-xs capitalize">{consumerGroup.status}</Badge>
        </div>
        <div className={`h-2 w-2 rounded-full ${lagStatusColors[consumerGroup.lagStatus]}`} />
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-xs mb-2">
        <div>
          <span className="text-muted-foreground">Consumers:</span>
          <span className="ml-1 font-medium">{consumerGroup.consumers}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Lag:</span>
          <span className="ml-1 font-medium">{formatNumber(consumerGroup.lag)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Throughput:</span>
          <span className="ml-1 font-medium">{formatNumber(consumerGroup.throughput)}/s</span>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Process:</span>
          <span className="ml-1 font-medium">{consumerGroup.averageProcessingTime}ms</span>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Lag Status</span>
          <span className={`font-medium capitalize ${
            consumerGroup.lagStatus === 'healthy' ? 'text-green-500' :
            consumerGroup.lagStatus === 'warning' ? 'text-yellow-500' :
            'text-red-500'
          }`}>
            {consumerGroup.lagStatus}
          </span>
        </div>
        <Progress 
          value={Math.min(consumerGroup.lag / 1000 * 100, 100)} 
          className="h-1"
        />
      </div>
    </div>
  );
};
