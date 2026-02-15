export type TimeRange = '1h' | '24h' | '7d' | '30d';
export type Region = 'us-east' | 'us-west' | 'eu-west' | 'eu-central' | 'ap-south' | 'ap-northeast';

export interface ApiMetrics {
  timestamp: string;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  errorRate: number;
  throughput: number;
  successCount: number;
  errorCount: number;
  region: Region;
  environment: string;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  errorRate: number;
  requestCount: number;
  region: Region;
  environment: string;
}

export interface ApiHealth {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  totalRequests: number;
  avgLatency: number;
  errorRate: number;
  availability: number;
}
