// Data Lineage Types

export interface LineageNode {
  id: string;
  name: string;
  type: 'pipeline' | 'dataset' | 'dashboard' | 'api' | 'stream';
  status: 'healthy' | 'warning' | 'error' | 'deprecated';
  owner: string;
  domain: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface LineageEdge {
  id: string;
  source: string;
  target: string;
  type: 'produces' | 'consumes' | 'transforms' | 'triggers';
  metadata?: {
    frequency?: string;
    volume?: string;
    latency?: string;
  };
}

export interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

export interface ImpactAnalysis {
  nodeId: string;
  upstream: LineageNode[];
  downstream: LineageNode[];
  blastRadius: {
    pipelines: number;
    datasets: number;
    dashboards: number;
    apis: number;
  };
}

// Node position for visualization
export interface NodePosition {
  nodeId: string;
  x: number;
  y: number;
}
