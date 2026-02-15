import { createFileRoute } from '@tanstack/react-router';
import { PipelineDetail } from '@/features/pipelines/pipeline-detail';

export const Route = createFileRoute('/pipelines/$pipelineId')({
  component: PipelineDetail,
});
