// Cost Analytics Types

export type CostCategory = 'compute' | 'storage' | 'network' | 'licensing';
export type CostGranularity = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface CostMetric {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  category: CostCategory;
  resource: string;
  resourceType: 'pipeline' | 'dataset' | 'query' | 'storage' | 'compute';
  team: string;
  environment: 'production' | 'staging' | 'development';
  metadata?: {
    dataProcessedGB?: number;
    executionTimeMinutes?: number;
    storageGB?: number;
  };
}

export interface CostSummary {
  total: number;
  byCategory: Record<CostCategory, number>;
  byTeam: Record<string, number>;
  byEnvironment: Record<string, number>;
  trend: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface CostBudget {
  id: string;
  name: string;
  limit: number;
  currentSpend: number;
  alertThreshold: number; // percentage
  team: string;
  period: 'monthly' | 'quarterly' | 'yearly';
}

export interface CostAttribution {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  cost: number;
  efficiency: number; // cost per unit of work
  trend: 'up' | 'down' | 'stable';
}
