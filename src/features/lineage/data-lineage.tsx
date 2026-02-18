import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { 
  GitBranch, 
  Database, 
  LayoutDashboard, 
  Server, 
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import type { LineageNode, LineageEdge } from '@/types/lineage';

const nodeIcons = {
  pipeline: GitBranch,
  dataset: Database,
  dashboard: LayoutDashboard,
  api: Server,
  stream: Zap,
};

const nodeColors = {
  pipeline: 'bg-blue-500',
  dataset: 'bg-green-500',
  dashboard: 'bg-purple-500',
  api: 'bg-orange-500',
  stream: 'bg-yellow-500',
};

const statusIcons = {
  healthy: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  deprecated: Info,
};

const statusColors = {
  healthy: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  deprecated: 'text-gray-500',
};

export const DataLineageView = () => {
  const { lineageGraph, getImpactAnalysis } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const impactAnalysis = useMemo(() => {
    if (!selectedNode) return null;
    return getImpactAnalysis(selectedNode);
  }, [selectedNode, getImpactAnalysis]);

  const filteredNodes = useMemo(() => {
    if (filter === 'all') return lineageGraph.nodes;
    return lineageGraph.nodes.filter(n => n.type === filter);
  }, [lineageGraph.nodes, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Lineage</h1>
        <p className="text-muted-foreground">
          Visualize data flow and dependencies across your data platform
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'pipeline' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pipeline')}
        >
          <GitBranch className="h-3 w-3 mr-1" />
          Pipelines
        </Button>
        <Button 
          variant={filter === 'dataset' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('dataset')}
        >
          <Database className="h-3 w-3 mr-1" />
          Datasets
        </Button>
        <Button 
          variant={filter === 'dashboard' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('dashboard')}
        >
          <LayoutDashboard className="h-3 w-3 mr-1" />
          Dashboards
        </Button>
        <Button 
          variant={filter === 'api' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('api')}
        >
          <Server className="h-3 w-3 mr-1" />
          APIs
        </Button>
        <Button 
          variant={filter === 'stream' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('stream')}
        >
          <Zap className="h-3 w-3 mr-1" />
          Streams
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lineage Graph */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data Flow Graph</CardTitle>
            <CardDescription>Click on nodes to see impact analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Streams Layer */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Data Sources (Streams)</p>
                <div className="flex flex-wrap gap-2">
                  {filteredNodes
                    .filter(n => n.type === 'stream')
                    .map(node => (
                      <NodeBadge 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedNode === node.id}
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      />
                    ))}
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
              </div>

              {/* Pipelines Layer */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Processing (Pipelines)</p>
                <div className="flex flex-wrap gap-2">
                  {filteredNodes
                    .filter(n => n.type === 'pipeline')
                    .map(node => (
                      <NodeBadge 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedNode === node.id}
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      />
                    ))}
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
              </div>

              {/* Datasets Layer */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Storage (Datasets)</p>
                <div className="flex flex-wrap gap-2">
                  {filteredNodes
                    .filter(n => n.type === 'dataset')
                    .map(node => (
                      <NodeBadge 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedNode === node.id}
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      />
                    ))}
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
              </div>

              {/* Consumers Layer */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Consumers (Dashboards & APIs)</p>
                <div className="flex flex-wrap gap-2">
                  {filteredNodes
                    .filter(n => n.type === 'dashboard' || n.type === 'api')
                    .map(node => (
                      <NodeBadge 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedNode === node.id}
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      />
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Analysis Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Analysis</CardTitle>
            <CardDescription>
              {selectedNode 
                ? 'Downstream and upstream dependencies'
                : 'Select a node to view impact analysis'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedNode && impactAnalysis ? (
              <div className="space-y-6">
                {/* Blast Radius */}
                <div>
                  <p className="text-sm font-medium mb-3">Blast Radius</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg border">
                      <p className="text-2xl font-bold">{impactAnalysis.blastRadius.pipelines}</p>
                      <p className="text-xs text-muted-foreground">Pipelines</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-2xl font-bold">{impactAnalysis.blastRadius.datasets}</p>
                      <p className="text-xs text-muted-foreground">Datasets</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-2xl font-bold">{impactAnalysis.blastRadius.dashboards}</p>
                      <p className="text-xs text-muted-foreground">Dashboards</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-2xl font-bold">{impactAnalysis.blastRadius.apis}</p>
                      <p className="text-xs text-muted-foreground">APIs</p>
                    </div>
                  </div>
                </div>

                {/* Upstream */}
                {impactAnalysis.upstream.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Upstream Dependencies</p>
                    <div className="space-y-2">
                      {impactAnalysis.upstream.map(node => (
                        <div key={node.id} className="flex items-center gap-2 p-2 rounded-lg border">
                          {(() => {
                            const Icon = nodeIcons[node.type];
                            return <Icon className="h-4 w-4 text-muted-foreground" />;
                          })()}
                          <span className="text-sm truncate">{node.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downstream */}
                {impactAnalysis.downstream.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Downstream Impact</p>
                    <div className="space-y-2">
                      {impactAnalysis.downstream.map(node => (
                        <div key={node.id} className="flex items-center gap-2 p-2 rounded-lg border">
                          {(() => {
                            const Icon = nodeIcons[node.type];
                            return <Icon className="h-4 w-4 text-muted-foreground" />;
                          })()}
                          <span className="text-sm truncate">{node.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a node from the graph to see its impact analysis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <NodeDetails 
          node={lineageGraph.nodes.find(n => n.id === selectedNode)!} 
          edges={lineageGraph.edges}
          allNodes={lineageGraph.nodes}
        />
      )}
    </div>
  );
};

// Node Badge Component
const NodeBadge = ({ 
  node, 
  isSelected, 
  onClick 
}: { 
  node: LineageNode; 
  isSelected: boolean;
  onClick: () => void;
}) => {
  const Icon = nodeIcons[node.type];
  const StatusIcon = statusIcons[node.status];

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all
        ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted'}
      `}
    >
      <div className={`h-2 w-2 rounded-full ${nodeColors[node.type]}`} />
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">{node.name}</span>
      <StatusIcon className={`h-3 w-3 ${statusColors[node.status]}`} />
    </div>
  );
};

// Node Details Component
const NodeDetails = ({ 
  node, 
  edges, 
  allNodes 
}: { 
  node: LineageNode; 
  edges: LineageEdge[];
  allNodes: LineageNode[];
}) => {
  const Icon = nodeIcons[node.type];
  const incomingEdges = edges.filter(e => e.target === node.id);
  const outgoingEdges = edges.filter(e => e.source === node.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${nodeColors[node.type]} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>{node.name}</CardTitle>
            <CardDescription>{node.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Properties</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 capitalize">{node.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 capitalize">{node.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="ml-2">{node.owner}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="ml-2 capitalize">{node.domain}</span>
                </div>
              </div>
            </div>

            {node.metadata && Object.keys(node.metadata).length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Metadata</p>
                <div className="space-y-1 text-sm">
                  {Object.entries(node.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="ml-2">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Connections</p>
              <div className="space-y-3">
                {incomingEdges.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Incoming ({incomingEdges.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {incomingEdges.map(edge => {
                        const source = allNodes.find(n => n.id === edge.source);
                        return source ? (
                          <Badge key={edge.id} variant="outline" className="text-xs">
                            ← {source.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {outgoingEdges.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Outgoing ({outgoingEdges.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {outgoingEdges.map(edge => {
                        const target = allNodes.find(n => n.id === edge.target);
                        return target ? (
                          <Badge key={edge.id} variant="outline" className="text-xs">
                            {target.name} →
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
