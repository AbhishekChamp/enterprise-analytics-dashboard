import { createFileRoute } from '@tanstack/react-router';
import { StreamingMetrics } from '@/features/streaming/streaming-metrics';

export const Route = createFileRoute('/streaming')({
  component: StreamingMetrics,
});
