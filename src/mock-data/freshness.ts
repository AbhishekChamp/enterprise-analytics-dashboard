import type { DatasetFreshness } from '@/types/freshness';

export const initialDatasets: DatasetFreshness[] = [
  {
    id: 'ds-001',
    datasetName: 'customer_profiles',
    description: 'Master customer profile data with demographics',
    expectedRefreshTime: '00:00',
    actualRefreshTime: '00:05',
    freshnessStatus: 'FRESH',
    slaBreach: false,
    delayMinutes: 5,
    owner: 'customer-data-team',
    priority: 'critical',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'ds-002',
    datasetName: 'transaction_history',
    description: 'Complete transaction history with payment details',
    expectedRefreshTime: '00:00',
    actualRefreshTime: '01:15',
    freshnessStatus: 'DELAYED',
    slaBreach: true,
    delayMinutes: 75,
    owner: 'finance-data-team',
    priority: 'critical',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'ds-003',
    datasetName: 'product_catalog',
    description: 'Product catalog with pricing and inventory',
    expectedRefreshTime: '00:00',
    actualRefreshTime: '00:02',
    freshnessStatus: 'FRESH',
    slaBreach: false,
    delayMinutes: 2,
    owner: 'product-data-team',
    priority: 'high',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: 'ds-004',
    datasetName: 'user_behavior_events',
    description: 'User interaction events from web and mobile',
    expectedRefreshTime: '00:00',
    actualRefreshTime: '00:00',
    freshnessStatus: 'FRESH',
    slaBreach: false,
    delayMinutes: 0,
    owner: 'analytics-team',
    priority: 'high',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  },
  {
    id: 'ds-005',
    datasetName: 'marketing_campaigns',
    description: 'Marketing campaign performance data',
    expectedRefreshTime: '02:00',
    actualRefreshTime: undefined,
    freshnessStatus: 'STALE',
    slaBreach: true,
    delayMinutes: 240,
    owner: 'marketing-data-team',
    priority: 'medium',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 'ds-006',
    datasetName: 'inventory_levels',
    description: 'Real-time inventory levels across warehouses',
    expectedRefreshTime: '00:00',
    actualRefreshTime: '00:00',
    freshnessStatus: 'FRESH',
    slaBreach: false,
    delayMinutes: 0,
    owner: 'ops-data-team',
    priority: 'critical',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'ds-007',
    datasetName: 'support_tickets',
    description: 'Customer support ticket data',
    expectedRefreshTime: '00:00',
    actualRefreshTime: '00:30',
    freshnessStatus: 'DELAYED',
    slaBreach: false,
    delayMinutes: 30,
    owner: 'support-data-team',
    priority: 'medium',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'ds-008',
    datasetName: 'supplier_data',
    description: 'Supplier information and contracts',
    expectedRefreshTime: '06:00',
    actualRefreshTime: '06:00',
    freshnessStatus: 'FRESH',
    slaBreach: false,
    delayMinutes: 0,
    owner: 'procurement-team',
    priority: 'low',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];
