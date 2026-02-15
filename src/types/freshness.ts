export type FreshnessStatus = 'FRESH' | 'DELAYED' | 'STALE';

export interface DatasetFreshness {
  id: string;
  datasetName: string;
  description: string;
  expectedRefreshTime: string;
  actualRefreshTime?: string;
  freshnessStatus: FreshnessStatus;
  slaBreach: boolean;
  delayMinutes: number;
  owner: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export interface SlaMetrics {
  totalDatasets: number;
  freshDatasets: number;
  delayedDatasets: number;
  staleDatasets: number;
  slaComplianceRate: number;
  avgDelayMinutes: number;
}
