import type { Incident, ErrorLog, ErrorDistribution, ServiceHealth } from '@/types/incidents';

export const activeIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'High latency on payment processing API',
    description: 'Investigating elevated response times on payment API affecting checkout flow',
    status: 'investigating',
    severity: 'high',
    service: 'payment-service',
    startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    assignee: 'sarah.chen',
    impactedUsers: 1250,
    updates: [
      {
        id: 'upd-001-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        message: 'Alert triggered: P95 latency exceeded 2s threshold',
        author: 'monitoring-system'
      },
      {
        id: 'upd-001-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        message: 'Investigation started - checking database connection pool',
        author: 'sarah.chen'
      },
      {
        id: 'upd-001-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        message: 'Found connection pool exhaustion - scaling up instances',
        author: 'sarah.chen'
      }
    ]
  },
  {
    id: 'INC-2024-002',
    title: 'Database replication lag',
    description: 'Read replicas showing increased replication lag',
    status: 'open',
    severity: 'medium',
    service: 'database-primary',
    startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    assignee: 'mike.rodriguez',
    impactedUsers: 450,
    updates: [
      {
        id: 'upd-002-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        message: 'Replication lag detected - 5 minutes behind primary',
        author: 'monitoring-system'
      }
    ]
  }
];

export const recentIncidents: Incident[] = [
  {
    id: 'INC-2024-003',
    title: 'Memory leak in recommendation service',
    description: 'Service memory usage growing steadily requiring restart',
    status: 'resolved',
    severity: 'critical',
    service: 'recommendation-engine',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    mttr: 120,
    assignee: 'alex.kumar',
    impactedUsers: 5000,
    updates: [
      {
        id: 'upd-003-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        message: 'Critical alert: Memory usage at 95%',
        author: 'monitoring-system'
      },
      {
        id: 'upd-003-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
        message: 'Identified memory leak in caching layer',
        author: 'alex.kumar'
      },
      {
        id: 'upd-003-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        message: 'Deployed hotfix - memory usage normalized',
        author: 'alex.kumar'
      }
    ]
  },
  {
    id: 'INC-2024-004',
    title: 'CDN cache invalidation failure',
    description: 'Stale assets being served to users',
    status: 'closed',
    severity: 'low',
    service: 'cdn-service',
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    mttr: 45,
    assignee: 'emma.wilson',
    impactedUsers: 1200,
    updates: [
      {
        id: 'upd-004-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        message: 'Cache invalidation queue backed up',
        author: 'monitoring-system'
      },
      {
        id: 'upd-004-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
        message: 'Queue cleared - cache updated successfully',
        author: 'emma.wilson'
      }
    ]
  }
];

export const errorLogs: ErrorLog[] = [
  {
    id: 'err-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    errorType: 'database',
    message: 'Connection timeout after 30000ms',
    service: 'payment-service',
    endpoint: '/api/v1/payments/process',
    resolved: false
  },
  {
    id: 'err-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    errorType: 'timeout',
    message: 'Request timeout: GET /api/v1/users/profile',
    service: 'user-service',
    endpoint: '/api/v1/users/profile',
    resolved: false
  },
  {
    id: 'err-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    errorType: 'runtime',
    message: 'TypeError: Cannot read property of undefined',
    service: 'recommendation-engine',
    endpoint: '/api/v1/recommendations',
    stackTrace: 'at transformUserData (/app/src/utils.js:45:12)',
    resolved: true
  },
  {
    id: 'err-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    errorType: 'network',
    message: 'ECONNREFUSED: Connection refused to inventory-service',
    service: 'inventory-service',
    resolved: true
  },
  {
    id: 'err-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    errorType: 'auth',
    message: 'JWT token expired',
    service: 'auth-service',
    endpoint: '/api/v1/auth/validate',
    resolved: false
  },
  {
    id: 'err-006',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    errorType: 'validation',
    message: 'Schema validation failed: invalid email format',
    service: 'user-service',
    endpoint: '/api/v1/users/register',
    resolved: true
  }
];

export const errorDistribution: ErrorDistribution[] = [
  { type: 'database', count: 45, percentage: 35.2 },
  { type: 'timeout', count: 32, percentage: 25.0 },
  { type: 'runtime', count: 28, percentage: 21.9 },
  { type: 'network', count: 12, percentage: 9.4 },
  { type: 'auth', count: 8, percentage: 6.2 },
  { type: 'validation', count: 3, percentage: 2.3 }
];

export const serviceHealth: ServiceHealth[] = [
  { service: 'payment-service', errorRate: 2.3, errorCount: 45, status: 'degraded' },
  { service: 'user-service', errorRate: 0.8, errorCount: 28, status: 'healthy' },
  { service: 'recommendation-engine', errorRate: 1.2, errorCount: 32, status: 'healthy' },
  { service: 'inventory-service', errorRate: 3.1, errorCount: 12, status: 'degraded' },
  { service: 'auth-service', errorRate: 0.5, errorCount: 8, status: 'healthy' },
  { service: 'notification-service', errorRate: 5.2, errorCount: 52, status: 'critical' },
  { service: 'search-service', errorRate: 1.5, errorCount: 15, status: 'healthy' },
  { service: 'analytics-service', errorRate: 0.3, errorCount: 3, status: 'healthy' }
];
