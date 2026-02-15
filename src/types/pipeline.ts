export type PipelineStatus = 'SUCCESS' | 'RUNNING' | 'FAILED' | 'PENDING';
export type Environment = 'production' | 'staging' | 'development';

export interface PipelineStep {
  id: string;
  name: string;
  status: PipelineStatus;
  duration: number;
  startedAt: string;
  completedAt?: string;
  logs: string[];
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: PipelineStatus;
  lastRun: string;
  nextRun?: string;
  duration: number;
  recordsProcessed: number;
  retryCount: number;
  owner: string;
  environment: Environment;
  steps: PipelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineMetrics {
  totalPipelines: number;
  runningPipelines: number;
  failedPipelines: number;
  successRate: number;
  avgDuration: number;
  totalRecordsProcessed: number;
}
