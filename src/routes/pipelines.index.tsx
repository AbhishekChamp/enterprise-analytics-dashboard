import { createFileRoute } from '@tanstack/react-router';
import { PipelinesList } from '@/features/pipelines/pipelines-list';

interface PipelinesSearch {
  q?: string;
}

export const Route = createFileRoute('/pipelines/')({
  component: PipelinesList,
  validateSearch: (search: Record<string, unknown>): PipelinesSearch => ({
    q: search.q as string | undefined,
  }),
});
