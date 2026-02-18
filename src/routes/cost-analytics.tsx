import { createFileRoute } from '@tanstack/react-router';
import { CostAnalytics } from '@/features/cost-analytics/cost-analytics';

export const Route = createFileRoute('/cost-analytics')({
  component: CostAnalytics,
});
