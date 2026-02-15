import type { ApiMetrics, ApiEndpoint, Region } from '@/types/api-monitoring';

const regions: Region[] = ['us-east', 'us-west', 'eu-west', 'eu-central', 'ap-south', 'ap-northeast'];

const endpoints = [
  '/api/v1/users',
  '/api/v1/orders',
  '/api/v1/products',
  '/api/v1/analytics',
  '/api/v1/payments',
  '/api/v1/search',
  '/api/v1/recommendations',
  '/api/v1/inventory',
  '/api/v1/shipping',
  '/api/v1/notifications'
];

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

export const generateApiMetrics = (hours: number = 24): ApiMetrics[] => {
  const metrics: ApiMetrics[] = [];
  const now = Date.now();
  
  // Generate data points every 5 minutes for the specified hours
  const dataPoints = hours * 12; // 12 points per hour (every 5 minutes)
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(now - i * 5 * 60 * 1000).toISOString();
    
    regions.forEach(region => {
      // Simulate different latency profiles based on time (older data = more variation)
      const timeFactor = i / dataPoints; // 0 = now, 1 = oldest
      const baseLatency = region === 'us-east' ? 45 : region === 'us-west' ? 52 : region === 'eu-west' ? 78 : region === 'eu-central' ? 85 : region === 'ap-south' ? 120 : 95;
      const latencyVariation = Math.random() * 30 + (timeFactor * 20); // More variation in older data
      
      const baseErrorRate = Math.random() * 0.5 + (timeFactor * 0.3); // Higher error rates in older data
      const errorSpike = Math.random() > 0.95 ? 2 : 0;
      
      const throughput = Math.floor(800 + Math.random() * 400 - (timeFactor * 200)); // Lower throughput in older data
      const successCount = Math.floor(throughput * (1 - (baseErrorRate + errorSpike) / 100));
      const errorCount = throughput - successCount;
      
      metrics.push({
        timestamp,
        latencyP50: Math.floor(baseLatency + latencyVariation * 0.3),
        latencyP95: Math.floor(baseLatency + latencyVariation * 1.5),
        latencyP99: Math.floor(baseLatency + latencyVariation * 2.2),
        errorRate: parseFloat(((baseErrorRate + errorSpike)).toFixed(2)),
        throughput,
        successCount,
        errorCount,
        region,
        environment: 'production'
      });
    });
  }
  
  return metrics.reverse();
};

export const generateApiEndpoints = (): ApiEndpoint[] => {
  return endpoints.flatMap((path, index) => {
    return regions.map(region => {
      const baseLatency = 40 + Math.random() * 60;
      const baseErrorRate = Math.random() * 1.5;
      const requestCount = Math.floor(10000 + Math.random() * 50000);
      
      return {
        id: `endpoint-${index}-${region}`,
        path,
        method: methods[Math.floor(Math.random() * methods.length)],
        avgLatency: Math.floor(baseLatency),
        p95Latency: Math.floor(baseLatency * 1.8),
        p99Latency: Math.floor(baseLatency * 2.5),
        errorRate: parseFloat(baseErrorRate.toFixed(2)),
        requestCount,
        region,
        environment: 'production'
      };
    });
  });
};

// Generate 30 days worth of data for time range filtering
export const initialApiMetrics = generateApiMetrics(24 * 30);
export const initialApiEndpoints = generateApiEndpoints();
