import { createFileRoute } from '@tanstack/react-router';
import { FreshnessMonitoring } from '@/features/freshness/freshness-monitoring';

export const Route = createFileRoute('/freshness')({
  component: FreshnessMonitoring,
});
