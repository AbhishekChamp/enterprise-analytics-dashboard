import { createFileRoute } from '@tanstack/react-router';
import { DataLineageView } from '@/features/lineage/data-lineage';

export const Route = createFileRoute('/lineage')({
  component: DataLineageView,
});
