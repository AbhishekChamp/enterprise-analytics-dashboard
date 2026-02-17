export interface Activity {
  id: string;
  type: 'pipeline_retry' | 'pipeline_run' | 'incident_resolved' | 'incident_created' | 'dataset_updated' | 'alert_triggered';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  metadata?: Record<string, unknown>;
}

export const createActivity = (
  type: Activity['type'],
  title: string,
  description: string,
  severity: Activity['severity'] = 'info',
  metadata?: Record<string, unknown>
): Activity => ({
  id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type,
  title,
  description,
  timestamp: new Date().toISOString(),
  severity,
  metadata
});
