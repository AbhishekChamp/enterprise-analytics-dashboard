import type { Pipeline } from '@/types/pipeline';

export const initialPipelines: Pipeline[] = [
  {
    id: 'pipe-001',
    name: 'user-events-etl',
    description: 'ETL pipeline for user activity events from Kafka',
    status: 'SUCCESS',
    lastRun: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    nextRun: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    duration: 245000,
    recordsProcessed: 1543200,
    retryCount: 0,
    owner: 'data-platform-team',
    environment: 'production',
    steps: [
      {
        id: 'step-001-1',
        name: 'Extract from Kafka',
        status: 'SUCCESS',
        duration: 45000,
        startedAt: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        logs: ['Connected to kafka-broker-1', 'Consumed 1543200 messages', 'Offset committed successfully']
      },
      {
        id: 'step-001-2',
        name: 'Transform & Clean',
        status: 'SUCCESS',
        duration: 120000,
        startedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
        logs: ['Applied schema validation', 'Cleaned 23 malformed records', 'Deduplicated 156 records']
      },
      {
        id: 'step-001-3',
        name: 'Load to Data Warehouse',
        status: 'SUCCESS',
        duration: 80000,
        startedAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        logs: ['Connected to Snowflake', 'Loaded to raw.user_events', 'Partition stats updated']
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'pipe-002',
    name: 'revenue-aggregation',
    description: 'Daily revenue aggregation and reporting pipeline',
    status: 'RUNNING',
    lastRun: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    duration: 180000,
    recordsProcessed: 45200,
    retryCount: 0,
    owner: 'finance-data-team',
    environment: 'production',
    steps: [
      {
        id: 'step-002-1',
        name: 'Extract Revenue Data',
        status: 'SUCCESS',
        duration: 30000,
        startedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        logs: ['Fetched from Stripe API', 'Fetched from PayPal API', 'Total transactions: 45200']
      },
      {
        id: 'step-002-2',
        name: 'Currency Conversion',
        status: 'RUNNING',
        duration: 120000,
        startedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        logs: ['Converting 12 currencies', 'Using latest exchange rates', 'Processing batch 3/5']
      },
      {
        id: 'step-002-3',
        name: 'Aggregate & Report',
        status: 'PENDING',
        duration: 0,
        startedAt: new Date(Date.now()).toISOString(),
        logs: []
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'pipe-003',
    name: 'customer-segmentation-ml',
    description: 'ML pipeline for customer segmentation model',
    status: 'FAILED',
    lastRun: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    duration: 450000,
    recordsProcessed: 0,
    retryCount: 2,
    owner: 'ml-platform-team',
    environment: 'production',
    steps: [
      {
        id: 'step-003-1',
        name: 'Data Preprocessing',
        status: 'SUCCESS',
        duration: 120000,
        startedAt: new Date(Date.now() - 1000 * 60 * 37).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        logs: ['Loaded customer features', 'Normalized numerical columns', 'Encoded categorical variables']
      },
      {
        id: 'step-003-2',
        name: 'Model Training',
        status: 'FAILED',
        duration: 300000,
        startedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        logs: [
          'Initializing cluster training',
          'ERROR: Out of memory error in worker node-5',
          'ERROR: Failed to allocate 8GB GPU memory',
          'Training aborted after 3 retries'
        ]
      },
      {
        id: 'step-003-3',
        name: 'Model Deployment',
        status: 'PENDING',
        duration: 0,
        startedAt: new Date(Date.now()).toISOString(),
        logs: []
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'pipe-004',
    name: 'inventory-sync',
    description: 'Real-time inventory synchronization across warehouses',
    status: 'SUCCESS',
    lastRun: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    nextRun: new Date(Date.now() + 1000 * 60 * 2).toISOString(),
    duration: 45000,
    recordsProcessed: 89200,
    retryCount: 0,
    owner: 'ops-data-team',
    environment: 'production',
    steps: [
      {
        id: 'step-004-1',
        name: 'Fetch Inventory Updates',
        status: 'SUCCESS',
        duration: 15000,
        startedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        logs: ['Connected to 5 warehouse systems', 'Fetched 89200 SKU updates']
      },
      {
        id: 'step-004-2',
        name: 'Sync to Central DB',
        status: 'SUCCESS',
        duration: 30000,
        startedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        logs: ['Batch upsert completed', 'Indexes updated']
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    id: 'pipe-005',
    name: 'product-catalog-etl',
    description: 'Product catalog ETL from external vendors',
    status: 'PENDING',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    nextRun: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    duration: 0,
    recordsProcessed: 0,
    retryCount: 0,
    owner: 'product-data-team',
    environment: 'staging',
    steps: [
      {
        id: 'step-005-1',
        name: 'Fetch Vendor Data',
        status: 'PENDING',
        duration: 0,
        startedAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
        logs: []
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  }
];
