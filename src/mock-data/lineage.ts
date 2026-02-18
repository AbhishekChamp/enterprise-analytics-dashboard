import type { LineageGraph, ImpactAnalysis } from '@/types/lineage';

export const mockLineageGraph: LineageGraph = {
  nodes: [
    // Pipelines
    { id: 'pipe-001', name: 'user-events-etl', type: 'pipeline', status: 'healthy', owner: 'data-platform-team', domain: 'platform', description: 'ETL pipeline for user activity events' },
    { id: 'pipe-002', name: 'revenue-aggregation', type: 'pipeline', status: 'healthy', owner: 'finance-data-team', domain: 'finance', description: 'Daily revenue aggregation pipeline' },
    { id: 'pipe-003', name: 'customer-segmentation-ml', type: 'pipeline', status: 'error', owner: 'ml-platform-team', domain: 'ml', description: 'ML pipeline for customer segmentation' },
    { id: 'pipe-004', name: 'inventory-sync', type: 'pipeline', status: 'healthy', owner: 'ops-data-team', domain: 'operations', description: 'Real-time inventory synchronization' },
    { id: 'pipe-005', name: 'product-catalog-etl', type: 'pipeline', status: 'warning', owner: 'product-data-team', domain: 'product', description: 'Product catalog ETL from vendors' },
    
    // Datasets
    { id: 'ds-001', name: 'raw.user_events', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform', description: 'Raw user events from Kafka' },
    { id: 'ds-002', name: 'analytics.user_activity', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform', description: 'Transformed user activity data' },
    { id: 'ds-003', name: 'finance.revenue_daily', type: 'dataset', status: 'healthy', owner: 'finance-data-team', domain: 'finance', description: 'Daily revenue aggregates' },
    { id: 'ds-004', name: 'ml.customer_segments', type: 'dataset', status: 'error', owner: 'ml-platform-team', domain: 'ml', description: 'Customer segmentation model output' },
    { id: 'ds-005', name: 'ops.inventory', type: 'dataset', status: 'healthy', owner: 'ops-data-team', domain: 'operations', description: 'Real-time inventory data' },
    { id: 'ds-006', name: 'product.catalog', type: 'dataset', status: 'warning', owner: 'product-data-team', domain: 'product', description: 'Product catalog master' },
    { id: 'ds-007', name: 'analytics.customer_360', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform', description: 'Unified customer profile' },
    
    // Dashboards
    { id: 'dash-001', name: 'Revenue Dashboard', type: 'dashboard', status: 'healthy', owner: 'finance-data-team', domain: 'finance', description: 'Executive revenue dashboard' },
    { id: 'dash-002', name: 'User Activity Dashboard', type: 'dashboard', status: 'healthy', owner: 'data-platform-team', domain: 'platform', description: 'User engagement metrics' },
    { id: 'dash-003', name: 'Inventory Monitor', type: 'dashboard', status: 'healthy', owner: 'ops-data-team', domain: 'operations', description: 'Real-time inventory monitoring' },
    { id: 'dash-004', name: 'ML Model Performance', type: 'dashboard', status: 'warning', owner: 'ml-platform-team', domain: 'ml', description: 'ML model metrics and drift' },
    
    // APIs
    { id: 'api-001', name: 'Customer API', type: 'api', status: 'healthy', owner: 'platform-team', domain: 'platform', description: 'Customer data API' },
    { id: 'api-002', name: 'Revenue API', type: 'api', status: 'healthy', owner: 'finance-team', domain: 'finance', description: 'Revenue data API' },
    
    // Streams
    { id: 'stream-001', name: 'user-events-topic', type: 'stream', status: 'healthy', owner: 'platform-team', domain: 'platform', description: 'Kafka topic for user events' },
    { id: 'stream-002', name: 'inventory-updates', type: 'stream', status: 'healthy', owner: 'ops-team', domain: 'operations', description: 'Real-time inventory updates' },
  ],
  edges: [
    // Pipeline to Dataset relationships
    { id: 'edge-001', source: 'stream-001', target: 'pipe-001', type: 'triggers', metadata: { frequency: 'real-time', volume: '1M/min' } },
    { id: 'edge-002', source: 'pipe-001', target: 'ds-001', type: 'produces' },
    { id: 'edge-003', source: 'ds-001', target: 'pipe-001', type: 'consumes' },
    { id: 'edge-004', source: 'pipe-001', target: 'ds-002', type: 'produces' },
    { id: 'edge-005', source: 'pipe-002', target: 'ds-003', type: 'produces' },
    { id: 'edge-006', source: 'ds-002', target: 'pipe-003', type: 'consumes' },
    { id: 'edge-007', source: 'pipe-003', target: 'ds-004', type: 'produces' },
    { id: 'edge-008', source: 'stream-002', target: 'pipe-004', type: 'triggers', metadata: { frequency: 'real-time', volume: '50K/min' } },
    { id: 'edge-009', source: 'pipe-004', target: 'ds-005', type: 'produces' },
    { id: 'edge-010', source: 'pipe-005', target: 'ds-006', type: 'produces' },
    { id: 'edge-011', source: 'ds-002', target: 'ds-007', type: 'transforms' },
    { id: 'edge-012', source: 'ds-004', target: 'ds-007', type: 'transforms' },
    
    // Dataset to Dashboard relationships
    { id: 'edge-013', source: 'ds-003', target: 'dash-001', type: 'produces' },
    { id: 'edge-014', source: 'ds-002', target: 'dash-002', type: 'produces' },
    { id: 'edge-015', source: 'ds-005', target: 'dash-003', type: 'produces' },
    { id: 'edge-016', source: 'ds-004', target: 'dash-004', type: 'produces' },
    
    // Dataset to API relationships
    { id: 'edge-017', source: 'ds-007', target: 'api-001', type: 'produces' },
    { id: 'edge-018', source: 'ds-003', target: 'api-002', type: 'produces' },
  ]
};

export const mockImpactAnalysis: ImpactAnalysis[] = [
  {
    nodeId: 'pipe-003',
    upstream: [
      { id: 'ds-002', name: 'analytics.user_activity', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
      { id: 'pipe-001', name: 'user-events-etl', type: 'pipeline', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
    ],
    downstream: [
      { id: 'ds-004', name: 'ml.customer_segments', type: 'dataset', status: 'error', owner: 'ml-platform-team', domain: 'ml' },
      { id: 'ds-007', name: 'analytics.customer_360', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
      { id: 'dash-004', name: 'ML Model Performance', type: 'dashboard', status: 'warning', owner: 'ml-platform-team', domain: 'ml' },
      { id: 'api-001', name: 'Customer API', type: 'api', status: 'healthy', owner: 'platform-team', domain: 'platform' },
    ],
    blastRadius: {
      pipelines: 0,
      datasets: 3,
      dashboards: 1,
      apis: 1,
    }
  },
  {
    nodeId: 'pipe-001',
    upstream: [
      { id: 'stream-001', name: 'user-events-topic', type: 'stream', status: 'healthy', owner: 'platform-team', domain: 'platform' },
    ],
    downstream: [
      { id: 'ds-001', name: 'raw.user_events', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
      { id: 'ds-002', name: 'analytics.user_activity', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
      { id: 'pipe-003', name: 'customer-segmentation-ml', type: 'pipeline', status: 'error', owner: 'ml-platform-team', domain: 'ml' },
      { id: 'ds-007', name: 'analytics.customer_360', type: 'dataset', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
      { id: 'dash-002', name: 'User Activity Dashboard', type: 'dashboard', status: 'healthy', owner: 'data-platform-team', domain: 'platform' },
      { id: 'api-001', name: 'Customer API', type: 'api', status: 'healthy', owner: 'platform-team', domain: 'platform' },
      { id: 'dash-004', name: 'ML Model Performance', type: 'dashboard', status: 'warning', owner: 'ml-platform-team', domain: 'ml' },
      { id: 'ds-004', name: 'ml.customer_segments', type: 'dataset', status: 'error', owner: 'ml-platform-team', domain: 'ml' },
    ],
    blastRadius: {
      pipelines: 1,
      datasets: 4,
      dashboards: 2,
      apis: 1,
    }
  },
];
