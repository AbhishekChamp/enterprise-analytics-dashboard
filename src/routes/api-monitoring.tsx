import { createFileRoute } from '@tanstack/react-router';
import { ApiMonitoring } from '@/features/api-monitoring/api-monitoring';

export const Route = createFileRoute('/api-monitoring')({
  component: ApiMonitoring,
});
