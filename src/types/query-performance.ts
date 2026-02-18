// Query Performance Types

export type QueryStatus = 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
export type QueryComplexity = 'simple' | 'moderate' | 'complex' | 'very_complex';

export interface QueryMetrics {
  id: string;
  queryText: string;
  normalizedQuery: string;
  status: QueryStatus;
  startedAt: string;
  completedAt?: string;
  duration: number; // milliseconds
  user: string;
  team: string;
  warehouse: string;
  database: string;
  schema: string;
  tables: string[];
  bytesScanned: number;
  rowsReturned: number;
  partitionsScanned: number;
  partitionsTotal: number;
  cachingUsed: boolean;
  complexity: QueryComplexity;
  cost: number;
  errorMessage?: string;
}

export interface QueryPerformanceSummary {
  totalQueries: number;
  avgDuration: number;
  p95Duration: number;
  p99Duration: number;
  totalCost: number;
  cacheHitRate: number;
  slowQueries: number; // > 30s
}

export interface QueryOptimization {
  queryId: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'index' | 'partition' | 'join' | 'filter' | 'aggregation' | 'cache';
  suggestion: string;
  potentialImprovement: string;
  estimatedCostSavings: number;
}

export interface TableStatistics {
  tableName: string;
  schema: string;
  database: string;
  rowCount: number;
  sizeGB: number;
  lastUpdated: string;
  partitions: number;
  clusteringKey?: string;
  columns: ColumnStatistics[];
}

export interface ColumnStatistics {
  name: string;
  type: string;
  mode: 'required' | 'nullable';
  nullPercentage: number;
  cardinality: number;
  distinctValues: number;
  avgSizeBytes: number;
}
