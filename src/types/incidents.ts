export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ErrorType = 'runtime' | 'timeout' | 'database' | 'network' | 'auth' | 'validation';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  service: string;
  startedAt: string;
  resolvedAt?: string;
  mttr?: number;
  assignee?: string;
  impactedUsers: number;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  message: string;
  author: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  errorType: ErrorType;
  message: string;
  stackTrace?: string;
  service: string;
  endpoint?: string;
  userId?: string;
  resolved: boolean;
}

export interface ErrorDistribution {
  type: ErrorType;
  count: number;
  percentage: number;
}

export interface ServiceHealth {
  service: string;
  errorRate: number;
  errorCount: number;
  status: 'healthy' | 'degraded' | 'critical';
}
