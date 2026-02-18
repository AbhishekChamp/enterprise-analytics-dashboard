import { createFileRoute } from '@tanstack/react-router';
import { QueryPerformance } from '@/features/query-performance/query-performance';

export const Route = createFileRoute('/query-performance')({
  component: QueryPerformance,
});
