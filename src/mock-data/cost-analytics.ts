import type { CostMetric, CostBudget, CostAttribution, CostSummary } from '@/types/cost-analytics';

export const mockCostMetrics: CostMetric[] = [
  // Compute costs
  { id: 'cost-001', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 45.20, currency: 'USD', category: 'compute', resource: 'pipe-001', resourceType: 'pipeline', team: 'data-platform', environment: 'production', metadata: { dataProcessedGB: 15.2, executionTimeMinutes: 4 } },
  { id: 'cost-002', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), amount: 32.50, currency: 'USD', category: 'compute', resource: 'pipe-002', resourceType: 'pipeline', team: 'finance-data', environment: 'production', metadata: { dataProcessedGB: 8.5, executionTimeMinutes: 3 } },
  { id: 'cost-003', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), amount: 128.75, currency: 'USD', category: 'compute', resource: 'pipe-003', resourceType: 'pipeline', team: 'ml-platform', environment: 'production', metadata: { dataProcessedGB: 45.0, executionTimeMinutes: 25 } },
  { id: 'cost-004', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), amount: 18.30, currency: 'USD', category: 'compute', resource: 'pipe-004', resourceType: 'pipeline', team: 'ops-data', environment: 'production', metadata: { dataProcessedGB: 5.2, executionTimeMinutes: 1 } },
  { id: 'cost-005', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), amount: 22.10, currency: 'USD', category: 'compute', resource: 'pipe-005', resourceType: 'pipeline', team: 'product-data', environment: 'staging', metadata: { dataProcessedGB: 12.0, executionTimeMinutes: 8 } },
  
  // Storage costs
  { id: 'cost-006', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 85.50, currency: 'USD', category: 'storage', resource: 'ds-001', resourceType: 'storage', team: 'data-platform', environment: 'production', metadata: { storageGB: 450 } },
  { id: 'cost-007', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 42.25, currency: 'USD', category: 'storage', resource: 'ds-002', resourceType: 'storage', team: 'data-platform', environment: 'production', metadata: { storageGB: 220 } },
  { id: 'cost-008', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 28.60, currency: 'USD', category: 'storage', resource: 'ds-003', resourceType: 'storage', team: 'finance-data', environment: 'production', metadata: { storageGB: 150 } },
  { id: 'cost-009', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 15.80, currency: 'USD', category: 'storage', resource: 'ds-004', resourceType: 'storage', team: 'ml-platform', environment: 'production', metadata: { storageGB: 85 } },
  { id: 'cost-010', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 35.40, currency: 'USD', category: 'storage', resource: 'ds-005', resourceType: 'storage', team: 'ops-data', environment: 'production', metadata: { storageGB: 180 } },
  
  // Query costs
  { id: 'cost-011', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), amount: 12.50, currency: 'USD', category: 'compute', resource: 'query-001', resourceType: 'query', team: 'analytics', environment: 'production', metadata: { dataProcessedGB: 45, executionTimeMinutes: 2 } },
  { id: 'cost-012', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), amount: 8.75, currency: 'USD', category: 'compute', resource: 'query-002', resourceType: 'query', team: 'finance', environment: 'production', metadata: { dataProcessedGB: 32, executionTimeMinutes: 1 } },
  { id: 'cost-013', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), amount: 45.20, currency: 'USD', category: 'compute', resource: 'query-003', resourceType: 'query', team: 'ml-platform', environment: 'production', metadata: { dataProcessedGB: 180, executionTimeMinutes: 8 } },
  { id: 'cost-014', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), amount: 6.30, currency: 'USD', category: 'compute', resource: 'query-004', resourceType: 'query', team: 'product', environment: 'production', metadata: { dataProcessedGB: 22, executionTimeMinutes: 1 } },
  { id: 'cost-015', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), amount: 22.10, currency: 'USD', category: 'compute', resource: 'query-005', resourceType: 'query', team: 'data-platform', environment: 'production', metadata: { dataProcessedGB: 88, executionTimeMinutes: 3 } },
  
  // Network costs
  { id: 'cost-016', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 35.80, currency: 'USD', category: 'network', resource: 'cross-region-transfer', resourceType: 'compute', team: 'data-platform', environment: 'production', metadata: { dataProcessedGB: 120 } },
  { id: 'cost-017', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), amount: 18.50, currency: 'USD', category: 'network', resource: 'api-transfer', resourceType: 'compute', team: 'platform', environment: 'production', metadata: { dataProcessedGB: 65 } },
  
  // Licensing costs
  { id: 'cost-018', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), amount: 2500.00, currency: 'USD', category: 'licensing', resource: 'snowflake-enterprise', resourceType: 'compute', team: 'data-platform', environment: 'production' },
  { id: 'cost-019', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), amount: 800.00, currency: 'USD', category: 'licensing', resource: 'dbt-cloud', resourceType: 'compute', team: 'data-platform', environment: 'production' },
  { id: 'cost-020', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), amount: 1200.00, currency: 'USD', category: 'licensing', resource: 'fivetran', resourceType: 'compute', team: 'data-platform', environment: 'production' },
];

export const mockCostBudgets: CostBudget[] = [
  { id: 'budget-001', name: 'Data Platform', limit: 15000, currentSpend: 12450, alertThreshold: 80, team: 'data-platform', period: 'monthly' },
  { id: 'budget-002', name: 'Finance Data', limit: 5000, currentSpend: 3850, alertThreshold: 85, team: 'finance-data', period: 'monthly' },
  { id: 'budget-003', name: 'ML Platform', limit: 10000, currentSpend: 8750, alertThreshold: 85, team: 'ml-platform', period: 'monthly' },
  { id: 'budget-004', name: 'Operations', limit: 3000, currentSpend: 2100, alertThreshold: 75, team: 'ops-data', period: 'monthly' },
  { id: 'budget-005', name: 'Product Data', limit: 4000, currentSpend: 2950, alertThreshold: 80, team: 'product-data', period: 'monthly' },
];

export const mockCostAttribution: CostAttribution[] = [
  { resourceId: 'pipe-001', resourceName: 'user-events-etl', resourceType: 'pipeline', cost: 1365.00, efficiency: 0.45, trend: 'stable' },
  { resourceId: 'pipe-002', resourceName: 'revenue-aggregation', resourceType: 'pipeline', cost: 975.00, efficiency: 0.52, trend: 'down' },
  { resourceId: 'pipe-003', resourceName: 'customer-segmentation-ml', resourceType: 'pipeline', cost: 3862.50, efficiency: 1.25, trend: 'up' },
  { resourceId: 'pipe-004', resourceName: 'inventory-sync', resourceType: 'pipeline', cost: 549.00, efficiency: 0.32, trend: 'stable' },
  { resourceId: 'pipe-005', resourceName: 'product-catalog-etl', resourceType: 'pipeline', cost: 663.00, efficiency: 0.48, trend: 'down' },
  { resourceId: 'ds-001', resourceName: 'raw.user_events', resourceType: 'dataset', cost: 2565.00, efficiency: 0.15, trend: 'up' },
  { resourceId: 'ds-002', resourceName: 'analytics.user_activity', resourceType: 'dataset', cost: 1267.50, efficiency: 0.18, trend: 'up' },
  { resourceId: 'query-003', resourceName: 'ML Training Query', resourceType: 'query', cost: 1356.00, efficiency: 2.85, trend: 'up' },
];

export const mockCostSummary: CostSummary = {
  total: 42380.00,
  byCategory: {
    compute: 12450.00,
    storage: 8955.00,
    network: 1635.00,
    licensing: 19340.00,
  },
  byTeam: {
    'data-platform': 15500.00,
    'finance-data': 4825.00,
    'ml-platform': 12612.50,
    'ops-data': 2649.00,
    'product-data': 2950.00,
    'platform': 2843.50,
    'analytics': 375.00,
    'finance': 262.50,
    'product': 189.00,
  },
  byEnvironment: {
    production: 39500.00,
    staging: 2880.00,
  },
  trend: {
    current: 42380.00,
    previous: 38950.00,
    change: 8.8,
  },
};
